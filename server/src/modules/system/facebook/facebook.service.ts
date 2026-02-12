import axios from 'axios';
import { IMarketingLeadRepository } from './interfaces/marketing-lead.repository.interface';
import { SettingService } from '../settings/settings.service';
import { MarketingLead, Order, User } from '@prisma/client';
import prisma from '../../../config/prisma';

export class FacebookService {
    private readonly API_VERSION = 'v18.0';
    private readonly BASE_URL = 'https://graph.facebook.com';

    constructor(
        private readonly marketingLeadRepository: IMarketingLeadRepository,
        private readonly settingService: SettingService
    ) {
        this.startBackgroundSync();
    }

    private startBackgroundSync() {
        // Sync insights every 12 hours
        setInterval(async () => {
            try {
                console.log('[FacebookService] Starting scheduled insights sync...');
                await this.syncDailyInsights('yesterday');
            } catch (err) {
                console.error('[FacebookService] Scheduled sync failed:', err);
            }
        }, 12 * 60 * 60 * 1000);
    }

    /**
     * Sends a conversion event to Facebook via the Conversions API (CAPI).
     */
    async sendConversionEvent(order: Order & { user: User, items: any[] }, eventName: 'Purchase' | 'Lead' | 'InitiateCheckout', userData?: any) {
        try {
            const settings = await this.settingService.getSettings(['FB_PIXEL_ID', 'FB_CAPI_ACCESS_TOKEN']);
            const pixelId = settings['FB_PIXEL_ID'];
            const accessToken = settings['FB_CAPI_ACCESS_TOKEN'];

            if (!pixelId || !accessToken) {
                console.warn('[FacebookService] CAPI disabled: Pixel ID or Access Token missing');
                return;
            }

            const lead = await this.marketingLeadRepository.findByOrderId(order.id) as any;

            const eventData = {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: userData?.sourceUrl || '',
                user_data: {
                    em: [this.hashData(order.user.email)],
                    ph: order.user.id ? [this.hashData(userData?.phone)] : [], // If phone available
                    client_ip_address: userData?.ip,
                    client_user_agent: userData?.userAgent,
                    fbc: lead?.fbc || userData?.fbc,
                    fbp: lead?.fbp || userData?.fbp,
                },
                custom_data: {
                    value: Number(order.amount),
                    currency: 'VND',
                    order_id: order.code,
                    content_ids: order.items.map(item => item.courseId || item.productId).filter(Boolean),
                    content_type: 'product',
                }
            };

            await axios.post(`${this.BASE_URL}/${this.API_VERSION}/${pixelId}/events`, {
                data: [eventData],
                access_token: accessToken
            });

            console.log(`[FacebookService] Sent CAPI event: ${eventName} for order ${order.code}`);
        } catch (error: any) {
            console.error('[FacebookService] CAPI Error:', error.response?.data || error.message);
        }
    }

    /**
     * Fetches ad performance data from the Facebook Marketing API.
     */
    async getAdAccountInsights(params: { date_preset?: string, time_range?: { since: string, until: string } }) {
        try {
            const settings = await this.settingService.getSettings(['FB_AD_ACCOUNT_ID', 'FB_CAPI_ACCESS_TOKEN']);
            const accountId = settings['FB_AD_ACCOUNT_ID'];
            const accessToken = settings['FB_CAPI_ACCESS_TOKEN'];

            if (!accountId || !accessToken) {
                throw new Error('Ad Account ID or Access Token missing');
            }

            const response = await axios.get(`${this.BASE_URL}/${this.API_VERSION}/act_${accountId}/insights`, {
                params: {
                    ...params,
                    fields: 'campaign_name,campaign_id,adset_name,adset_id,spend,impressions,clicks,actions,cost_per_action_type',
                    access_token: accessToken
                }
            });

            return response.data.data;
        } catch (error: any) {
            console.error('[FacebookService] Marketing API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Fetches ad performance data from the Facebook Marketing API and stores it in the database.
     */
    async syncDailyInsights(datePreset: string = 'yesterday') {
        try {
            const settings = await this.settingService.getSettings(['FB_AD_ACCOUNT_ID', 'FB_CAPI_ACCESS_TOKEN']);
            const accountId = settings['FB_AD_ACCOUNT_ID'];
            const accessToken = settings['FB_CAPI_ACCESS_TOKEN'];

            if (!accountId || !accessToken) {
                console.warn('[FacebookService] Marketing API disabled: Account ID or Access Token missing');
                return;
            }

            const response = await axios.get(`${this.BASE_URL}/${this.API_VERSION}/act_${accountId}/insights`, {
                params: {
                    date_preset: datePreset,
                    fields: 'campaign_name,campaign_id,adset_name,adset_id,spend,impressions,clicks,actions,cost_per_action_type',
                    access_token: accessToken
                }
            });

            const insights = response.data.data;

            for (const item of insights) {
                await prisma.adInsights.upsert({
                    where: {
                        campaignId_date: {
                            campaignId: item.campaign_id,
                            date: new Date(item.date_start)
                        }
                    },
                    update: {
                        campaignName: item.campaign_name,
                        adsetId: item.adset_id,
                        adsetName: item.adset_name,
                        spend: parseFloat(item.spend),
                        impressions: parseInt(item.impressions),
                        clicks: parseInt(item.clicks),
                        actions: item.actions || {}
                    },
                    create: {
                        campaignId: item.campaign_id,
                        campaignName: item.campaign_name,
                        adsetId: item.adset_id,
                        adsetName: item.adset_name,
                        date: new Date(item.date_start),
                        spend: parseFloat(item.spend),
                        impressions: parseInt(item.impressions),
                        clicks: parseInt(item.clicks),
                        actions: item.actions || {}
                    }
                });
            }

            console.log(`[FacebookService] Synced ${insights.length} campaign insights for ${datePreset}`);
            return insights;
        } catch (error: any) {
            console.error('[FacebookService] Sync Insights Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Calculates ROI and other marketing metrics by joining AdInsights and MarketingLead data.
     */
    async getMarketingROI(startDate: Date, endDate: Date) {
        // Fetch all PAID orders within the date range that have marketing leads
        const leads = await prisma.marketingLead.findMany({
            where: {
                order: {
                    status: 'PAID',
                    createdAt: { gte: startDate, lte: endDate }
                }
            },
            include: {
                order: true
            }
        });

        // Group revenue by campaign (using campaign name/id from UTMs)
        const revenueByCampaign: Record<string, number> = {};
        leads.forEach((lead: any) => {
            const campaign = lead.campaign || 'Unknown';
            revenueByCampaign[campaign] = (revenueByCampaign[campaign] || 0) + Number(lead.order.amount);
        });

        // Fetch ad spend for the same period
        const spendData = await prisma.adInsights.findMany({
            where: {
                date: { gte: startDate, lte: endDate }
            }
        });

        // Group spend by campaign
        const spendByCampaign: Record<string, number> = {};
        spendData.forEach((item: any) => {
            spendByCampaign[item.campaignName] = (spendByCampaign[item.campaignName] || 0) + item.spend;
        });

        // Merge and calculate metrics
        const allCampaigns = Array.from(new Set([...Object.keys(revenueByCampaign), ...Object.keys(spendByCampaign)]));

        return allCampaigns.map(name => {
            const revenue = revenueByCampaign[name] || 0;
            const spend = spendByCampaign[name] || 0;
            return {
                campaign: name,
                revenue,
                spend,
                roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0,
                roas: spend > 0 ? revenue / spend : 0
            };
        });
    }

    /**
     * Pushes a list of user emails to a Facebook Custom Audience.
     */
    async syncUsersToCustomAudience(audienceId: string, userEmails: string[]) {
        try {
            const settings = await this.settingService.getSettings(['FB_CAPI_ACCESS_TOKEN']);
            const accessToken = settings['FB_CAPI_ACCESS_TOKEN'];

            if (!accessToken) throw new Error('Facebook Access Token missing');

            const payload = {
                payload: {
                    schema: 'EMAIL',
                    data: userEmails.map(email => this.hashData(email))
                },
                access_token: accessToken
            };

            await axios.post(`${this.BASE_URL}/${this.API_VERSION}/${audienceId}/users`, payload);
            console.log(`[FacebookService] Synced ${userEmails.length} users to audience ${audienceId}`);
        } catch (error: any) {
            console.error('[FacebookService] Sync Audience Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Classifies leads based on their purchase behavior and UTM parameters.
     */
    async classifyLeads() {
        try {
            // Logic: High value ($ > 2M), Course Type, Campaign category
            const leads = await prisma.marketingLead.findMany({
                include: { order: true }
            });

            for (const lead of leads) {
                const tags: string[] = [...(lead as any).tags || []];

                // 1. High Value Tag
                if (Number(lead.order.amount) >= 2000000 && !tags.includes('high_value')) {
                    tags.push('high_value');
                }

                // 2. Campaign Tag
                if (lead.campaign && !tags.includes(`campaign_${lead.campaign}`)) {
                    tags.push(`campaign_${lead.campaign}`);
                }

                // Update tags if changed
                if (tags.length !== ((lead as any).tags || []).length) {
                    await prisma.marketingLead.update({
                        where: { id: lead.id },
                        data: { tags }
                    });
                }
            }
            console.log(`[FacebookService] Classified ${leads.length} leads.`);
        } catch (error: any) {
            console.error('[FacebookService] Classify Leads Error:', error.message);
        }
    }

    private hashData(data: string | undefined): string {
        if (!data) return '';
        // Facebook requires SHA256 hashing for PII data
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
    }
}

import { Order, OrderStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { EventBus } from '../../../core/event-bus';
import { IUserRepository } from '../../system/users/interfaces/user.repository.interface';
import { ICourseRepository } from '../../lms/courses/interfaces/course.repository.interface';
import { IProductRepository } from '../products/interfaces/product.repository.interface';
import { IActivationCodeRepository } from '../activation-codes/interfaces/activation-code.repository.interface';
import prisma from '../../../config/prisma';
import axios from 'axios';
import { env } from '../../../config/env';

import { ISettingRepository } from '../../system/settings/interfaces/setting.repository.interface';
import { SettingService } from '../../system/settings/settings.service';
import { container } from '../../../core/container';

export class PaymentService {
    constructor(
        private orderRepository: IOrderRepository,
        private userRepository: IUserRepository,
        private courseRepository: ICourseRepository,
        private productRepository: IProductRepository,
        private activationCodeRepository: IActivationCodeRepository,
        private eventBus: EventBus
    ) { }

    // ... createOrder ...

    async syncTransactions(accountNumber?: string) {
        let apiKey = env.SEPAY_API_KEY;

        if (!apiKey) {
            try {
                // Fallback to Settings Service
                const settingService = container.resolve<SettingService>('SettingService');
                apiKey = await settingService.getApiKey();
            } catch (err) {
                console.warn('Could not resolve SettingService for API Key:', err);
            }
        }

        if (!apiKey) throw new Error('Payment gateway API key is not configured (ENV or Settings)');

        let url = `https://api.sepay.vn/user/transactions/list`;
        if (accountNumber) {
            url += `?account_number=${accountNumber}`;
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (response.data && response.data.transactions) {
                const transactions = response.data.transactions;
                console.log(`Syncing ${transactions.length} transactions from SePay`);

                const results = {
                    total: transactions.length,
                    processed: 0,
                    errors: 0
                };

                for (const tx of transactions) {
                    try {
                        // Map SePay API response to our processWebhook format
                        const webhookData: any = {
                            code: tx.content, // content usually contains the order code
                            amount: Number(tx.amount_in || 0),
                            transactionId: String(tx.id),
                            accumulated: tx.accumulated ? Number(tx.accumulated) : undefined
                        };

                        if (tx.bank_name || tx.gateway) webhookData.gateway = tx.bank_name || tx.gateway;
                        if (tx.transaction_date) webhookData.transactionDate = tx.transaction_date;
                        if (tx.account_number) webhookData.accountNumber = tx.account_number;
                        if (tx.sub_account) webhookData.subAccount = tx.sub_account;
                        if (tx.content) webhookData.content = tx.content;
                        if (tx.reference_number) webhookData.referenceCode = tx.reference_number;
                        if (tx.description) webhookData.description = tx.description;

                        await this.processWebhook(webhookData);
                        results.processed++;
                    } catch (err) {
                        console.error(`Failed to process transaction ${tx.id}:`, err);
                        results.errors++;
                    }
                }

                return results;
            }

            return { total: 0, processed: 0, errors: 0 };
        } catch (error: any) {
            console.error('Payment Sync Error:', error.response?.data || error.message);
            throw new Error(`Payment Sync Failed: ${error.message}`);
        }
    }
}

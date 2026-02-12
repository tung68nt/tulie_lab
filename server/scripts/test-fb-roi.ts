/**
 * Mock test for Facebook ROI Logic
 * This script demonstrates how the ROI calculation joins AdInsights and MarketingLead data.
 */

async function mockTestROI() {
    console.log('--- Starting Mock ROI Test ---');

    // 1. Mock Data Setup (Conceptual for walkthrough)
    const mockRevenueByCampaign = {
        'spring_campaign': 5000000, // 5M VND
        'summer_sale': 2000000,     // 2M VND
    };

    const mockSpendByCampaign = {
        'spring_campaign': 1000000, // 1M VND
        'summer_sale': 1500000,     // 1.5M VND
    };

    const allCampaigns = ['spring_campaign', 'summer_sale'];

    const results = allCampaigns.map(name => {
        const revenue = mockRevenueByCampaign[name] || 0;
        const spend = mockSpendByCampaign[name] || 0;
        const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
        const roas = spend > 0 ? revenue / spend : 0;

        return {
            campaign: name,
            revenue: revenue.toLocaleString() + ' VND',
            spend: spend.toLocaleString() + ' VND',
            roi: roi.toFixed(2) + '%',
            roas: roas.toFixed(2)
        };
    });

    console.table(results);
    console.log('--- Mock ROI Test Complete ---');
}

mockTestROI();

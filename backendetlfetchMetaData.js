// backend/etl/fetchMetaData.js
const metaClient = require('../metaClient');
const funnelMapper = require('../funnelMapper');
const countryAccountMapper = require('../countryAccountMapper');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

class MetaDataETL {
    constructor() {
        this.accounts = countryAccountMapper.accounts;
    }

    async runFullSync(dateFrom, dateTo) {
        console.log('🚀 Starting Meta Data ETL...');
        console.log(`📅 Date Range: ${dateFrom} to ${dateTo}`);
        
        for (const account of this.accounts) {
            try {
                console.log(`\n📊 Processing account: ${account.label} (${account.country})`);
                
                // Fetch campaign insights
                await this.fetchAndStoreCampaignInsights(account, dateFrom, dateTo);
                
                // Fetch audience insights
                await this.fetchAndStoreAudienceInsights(account, dateFrom, dateTo);
                
                console.log(`✅ Completed: ${account.label}`);
            } catch (error) {
                console.error(`❌ Error processing ${account.label}:`, error.message);
            }
        }
        
        console.log('\n✅ ETL Complete!');
    }

    async fetchAndStoreCampaignInsights(account, dateFrom, dateTo) {
        try {
            const response = await metaClient.fetchInsights(account.account_id, {
                date_from: dateFrom,
                date_to: dateTo,
                level: 'campaign',
                time_increment: 1
            });

            const insights = response.data || [];
            console.log(`  📈 Fetched ${insights.length} campaign insights`);

            for (const insight of insights) {
                await this.storeCampaignInsight(account, insight);
            }
        } catch (error) {
            console.error(`  ❌ Error fetching campaign insights:`, error.message);
        }
    }

    async storeCampaignInsight(account, insight) {
        const campaignGoal = funnelMapper.getCampaignGoal(insight.objective);
        const funnelStage = funnelMapper.getFunnelStage(insight.objective, insight.actions || []);

        // Extract metrics from actions array
        const metrics = this.extractMetrics(insight);

        const query = `
            INSERT INTO campaign_insights (
                date, country, account_id, account_label,
                campaign_id, campaign_name, objective, campaign_goal, funnel_stage,
                spend, impressions, reach, frequency, cpm,
                clicks, unique_clicks, ctr, unique_ctr, cpc,
                landing_page_views, cost_per_landing_page_view,
                video_views, thruplays, cost_per_thruplay,
                add_to_cart, cost_per_add_to_cart,
                leads, cost_per_lead,
                conversions, cost_per_conversion,
                purchases, revenue, roas, cpa, aov,
                initiate_checkout
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14,
                $15, $16, $17, $18, $19,
                $20, $21,
                $22, $23, $24,
                $25, $26,
                $27, $28,
                $29, $30,
                $31, $32, $33, $34, $35,
                $36
            )
            ON CONFLICT (campaign_id, date, account_id)
            DO UPDATE SET
                spend = EXCLUDED.spend,
                impressions = EXCLUDED.impressions,
                reach = EXCLUDED.reach,
                clicks = EXCLUDED.clicks,
                conversions = EXCLUDED.conversions,
                revenue = EXCLUDED.revenue,
                roas = EXCLUDED.roas,
                updated_at = CURRENT_TIMESTAMP
        `;

        const spend = parseFloat(insight.spend) || 0;
        const revenue = metrics.revenue || 0;
        const conversions = metrics.conversions || 0;
        const purchases = metrics.purchases || 0;

        const values = [
            insight.date_start,
            account.country,
            account.account_id,
            account.label,
            insight.campaign_id,
            insight.campaign_name,
            insight.objective,
            campaignGoal,
            funnelStage,
            spend,
            parseInt(insight.impressions) || 0,
            parseInt(insight.reach) || 0,
            parseFloat(insight.frequency) || 0,
            parseFloat(insight.cpm) || 0,
            parseInt(insight.clicks) || 0,
            parseInt(insight.unique_clicks) || 0,
            parseFloat(insight.ctr) || 0,
            parseFloat(insight.unique_ctr) || 0,
            parseFloat(insight.cpc) || 0,
            metrics.landing_page_views || 0,
            metrics.cost_per_landing_page_view || 0,
            metrics.video_views || 0,
            metrics.thruplays || 0,
            metrics.cost_per_thruplay || 0,
            metrics.add_to_cart || 0,
            metrics.cost_per_add_to_cart || 0,
            metrics.leads || 0,
            metrics.cost_per_lead || 0,
            conversions,
            conversions > 0 ? spend / conversions : 0,
            purchases,
            revenue,
            spend > 0 ? revenue / spend : 0,
            conversions > 0 ? spend / conversions : 0,
            purchases > 0 ? revenue / purchases : 0,
            metrics.initiate_checkout || 0
        ];

        await pool.query(query, values);
    }

    async fetchAndStoreAudienceInsights(account, dateFrom, dateTo) {
        const breakdownTypes = ['demographics', 'location', 'device', 'platform'];

        for (const breakdownType of breakdownTypes) {
            try {
                const response = await metaClient.fetchAudienceInsights(
                    account.account_id,
                    breakdownType,
                    { date_from: dateFrom, date_to: dateTo }
                );

                const insights = response.data || [];
                console.log(`  👥 Fetched ${insights.length} ${breakdownType} insights`);

                for (const insight of insights) {
                    await this.storeAudienceInsight(account, breakdownType, insight);
                }
            } catch (error) {
                console.error(`  ❌ Error fetching ${breakdownType} insights:`, error.message);
            }
        }
    }

    async storeAudienceInsight(account, breakdownType, insight) {
        const metrics = this.extractMetrics(insight);
        const spend = parseFloat(insight.spend) || 0;
        const revenue = metrics.revenue || 0;
        const conversions = metrics.conversions || 0;

        const query = `
            INSERT INTO audience_insights (
                date, country, account_id, breakdown_type,
                age, gender, city, region, dma,
                device_platform, impression_device,
                publisher_platform, platform_position,
                spend, impressions, reach, frequency,
                clicks, ctr, cpc, cpm,
                landing_page_views, add_to_cart, leads,
                conversions, cpa, revenue, roas
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13,
                $14, $15, $16, $17, $18, $19, $20, $21,
                $22, $23, $24, $25, $26, $27, $28
            )
            ON CONFLICT (date, breakdown_type, account_id, age, gender, city, device_platform, publisher_platform, platform_position)
            DO UPDATE SET
                spend = EXCLUDED.spend,
                impressions = EXCLUDED.impressions,
                conversions = EXCLUDED.conversions,
                revenue = EXCLUDED.revenue,
                roas = EXCLUDED.roas,
                updated_at = CURRENT_TIMESTAMP
        `;

        const values = [
            insight.date_start,
            account.country,
            account.account_id,
            breakdownType,
            insight.age || null,
            insight.gender || null,
            insight.city || null,
            insight.region || null,
            insight.dma || null,
            insight.device_platform || null,
            insight.impression_device || null,
            insight.publisher_platform || null,
            insight.platform_position || null,
            spend,
            parseInt(insight.impressions) || 0,
            parseInt(insight.reach) || 0,
            parseFloat(insight.frequency) || 0,
            parseInt(insight.clicks) || 0,
            parseFloat(insight.ctr) || 0,
            parseFloat(insight.cpc) || 0,
            parseFloat(insight.cpm) || 0,
            metrics.landing_page_views || 0,
            metrics.add_to_cart || 0,
            metrics.leads || 0,
            conversions,
            conversions > 0 ? spend / conversions : 0,
            revenue,
            spend > 0 ? revenue / spend : 0
        ];

        await pool.query(query, values);
    }

    extractMetrics(insight) {
        const metrics = {
            conversions: 0,
            purchases: 0,
            revenue: 0,
            leads: 0,
            add_to_cart: 0,
            landing_page_views: 0,
            video_views: 0,
            thruplays: 0,
            initiate_checkout: 0
        };

        if (insight.actions) {
            insight.actions.forEach(action => {
                switch(action.action_type) {
                    case 'omni_purchase':
                    case 'purchase':
                        metrics.purchases += parseInt(action.value) || 0;
                        metrics.conversions += parseInt(action.value) || 0;
                        break;
                    case 'lead':
                        metrics.leads += parseInt(action.value) || 0;
                        metrics.conversions += parseInt(action.value) || 0;
                        break;
                    case 'add_to_cart':
                        metrics.add_to_cart += parseInt(action.value) || 0;
                        break;
                    case 'landing_page_view':
                        metrics.landing_page_views += parseInt(action.value) || 0;
                        break;
                    case 'video_view':
                        metrics.video_views += parseInt(action.value) || 0;
                        break;
                    case 'video_thruplay':
                        metrics.thruplays += parseInt(action.value) || 0;
                        break;
                    case 'initiate_checkout':
                        metrics.initiate_checkout += parseInt(action.value) || 0;
                        break;
                }
            });
        }

        if (insight.action_values) {
            insight.action_values.forEach(action => {
                if (action.action_type === 'omni_purchase' || action.action_type === 'purchase') {
                    metrics.revenue += parseFloat(action.value) || 0;
                }
            });
        }

        // Calculate cost per metrics
        const spend = parseFloat(insight.spend) || 0;
        if (metrics.landing_page_views > 0) {
            metrics.cost_per_landing_page_view = spend / metrics.landing_page_views;
        }
        if (metrics.thruplays > 0) {
            metrics.cost_per_thruplay = spend / metrics.thruplays;
        }
        if (metrics.add_to_cart > 0) {
            metrics.cost_per_add_to_cart = spend / metrics.add_to_cart;
        }
        if (metrics.leads > 0) {
            metrics.cost_per_lead = spend / metrics.leads;
        }

        return metrics;
    }
}

// Run if called directly
if (require.main === module) {
    const etl = new MetaDataETL();
    const dateFrom = process.argv[2] || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateTo = process.argv[3] || new Date().toISOString().split('T')[0];
    
    etl.runFullSync(dateFrom, dateTo)
        .then(() => {
            console.log('✅ ETL job completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ ETL job failed:', error);
            process.exit(1);
        });
}

module.exports = MetaDataETL;
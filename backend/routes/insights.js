// routes/insights.js
const express = require('express');
const router = express.Router();
const metaClient = require('../metaClient');
const funnelMapper = require('../funnelMapper');
const countryAccountMapper = require('../countryAccountMapper');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/meta_funnel_db'
});

// GET /api/insights/overview
router.get('/overview', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal, funnel_stage } = req.query;
    
    // Get relevant accounts
    const accounts = getAccountsForQuery(country, account_id);
    
    // Fetch from database (aggregated data)
    const query = `
      SELECT 
        SUM(spend) as total_spend,
        SUM(impressions) as total_impressions,
        SUM(reach) as total_reach,
        SUM(clicks) as total_clicks,
        SUM(conversions) as total_conversions,
        SUM(revenue) as total_revenue,
        AVG(ctr) as avg_ctr,
        AVG(cpm) as avg_cpm,
        AVG(frequency) as avg_frequency
      FROM campaign_insights
      WHERE date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        ${funnel_stage && funnel_stage !== 'All' ? 'AND funnel_stage = $4' : ''}
        AND account_id = ANY($5)
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    if (funnel_stage && funnel_stage !== 'All') params.push(funnel_stage);
    params.push(accounts.map(a => a.account_id));
    
    const result = await pool.query(query, params);
    const data = result.rows[0];
    
    // Calculate derived metrics
    const roas = data.total_revenue / data.total_spend || 0;
    const cpa = data.total_spend / data.total_conversions || 0;
    
    // Funnel summary
    const funnelSummary = await getFunnelSummary(accounts, date_from, date_to, campaign_goal);
    
    // Country comparison
    const countryComparison = await getCountryComparison(country, date_from, date_to, campaign_goal);
    
    res.json({
      kpis: {
        total_spend: parseFloat(data.total_spend) || 0,
        total_revenue: parseFloat(data.total_revenue) || 0,
        total_conversions: parseInt(data.total_conversions) || 0,
        roas: roas,
        cpa: cpa,
        ctr: parseFloat(data.avg_ctr) || 0,
        cpm: parseFloat(data.avg_cpm) || 0,
        total_impressions: parseInt(data.total_impressions) || 0,
        total_reach: parseInt(data.total_reach) || 0,
        frequency: parseFloat(data.avg_frequency) || 0
      },
      funnelSummary,
      countryComparison
    });
    
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// GET /api/insights/tof
router.get('/tof', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal } = req.query;
    const accounts = getAccountsForQuery(country, account_id);
    
    const query = `
      SELECT 
        campaign_name,
        SUM(spend) as spend,
        SUM(impressions) as impressions,
        SUM(reach) as reach,
        AVG(frequency) as frequency,
        AVG(cpm) as cpm,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr,
        AVG(cpc) as cpc,
        SUM(landing_page_views) as landing_page_views,
        AVG(cost_per_landing_page_view) as cost_per_lpv,
        SUM(video_views) as video_views,
        SUM(thruplays) as thruplays,
        AVG(cost_per_thruplay) as cost_per_thruplay
      FROM campaign_insights
      WHERE funnel_stage = 'TOF'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        AND account_id = ANY($4)
      GROUP BY campaign_name
      ORDER BY spend DESC
      LIMIT 50
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    params.push(accounts.map(a => a.account_id));
    
    const result = await pool.query(query, params);
    
    res.json({
      campaigns: result.rows.map(row => ({
        campaign_name: row.campaign_name,
        spend: parseFloat(row.spend) || 0,
        impressions: parseInt(row.impressions) || 0,
        reach: parseInt(row.reach) || 0,
        frequency: parseFloat(row.frequency) || 0,
        cpm: parseFloat(row.cpm) || 0,
        clicks: parseInt(row.clicks) || 0,
        ctr: parseFloat(row.ctr) || 0,
        cpc: parseFloat(row.cpc) || 0,
        landing_page_views: parseInt(row.landing_page_views) || 0,
        cost_per_lpv: parseFloat(row.cost_per_lpv) || 0,
        video_views: parseInt(row.video_views) || 0,
        thruplays: parseInt(row.thruplays) || 0,
        cost_per_thruplay: parseFloat(row.cost_per_thruplay) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching TOF data:', error);
    res.status(500).json({ error: 'Failed to fetch TOF data' });
  }
});

// GET /api/insights/mof
router.get('/mof', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal } = req.query;
    const accounts = getAccountsForQuery(country, account_id);
    
    const query = `
      SELECT 
        campaign_name,
        SUM(spend) as spend,
        SUM(landing_page_views) as landing_page_views,
        AVG(cost_per_landing_page_view) as cost_per_lpv,
        SUM(add_to_cart) as add_to_cart,
        AVG(cost_per_add_to_cart) as cost_per_atc,
        SUM(view_content) as view_content,
        AVG(cost_per_view_content) as cost_per_vc,
        SUM(leads) as leads,
        AVG(cost_per_lead) as cpl,
        SUM(initiate_checkout) as initiate_checkout
      FROM campaign_insights
      WHERE funnel_stage = 'MOF'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        AND account_id = ANY($4)
      GROUP BY campaign_name
      ORDER BY spend DESC
      LIMIT 50
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    params.push(accounts.map(a => a.account_id));
    
    const result = await pool.query(query, params);
    
    res.json({
      campaigns: result.rows.map(row => ({
        campaign_name: row.campaign_name,
        spend: parseFloat(row.spend) || 0,
        landing_page_views: parseInt(row.landing_page_views) || 0,
        cost_per_lpv: parseFloat(row.cost_per_lpv) || 0,
        add_to_cart: parseInt(row.add_to_cart) || 0,
        cost_per_atc: parseFloat(row.cost_per_atc) || 0,
        view_content: parseInt(row.view_content) || 0,
        cost_per_vc: parseFloat(row.cost_per_vc) || 0,
        leads: parseInt(row.leads) || 0,
        cpl: parseFloat(row.cpl) || 0,
        initiate_checkout: parseInt(row.initiate_checkout) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching MOF data:', error);
    res.status(500).json({ error: 'Failed to fetch MOF data' });
  }
});

// GET /api/insights/bof
router.get('/bof', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal } = req.query;
    const accounts = getAccountsForQuery(country, account_id);
    
    const query = `
      SELECT 
        campaign_name,
        SUM(spend) as spend,
        SUM(conversions) as conversions,
        AVG(cost_per_conversion) as cpa,
        SUM(revenue) as revenue,
        AVG(roas) as roas,
        AVG(aov) as aov,
        SUM(purchases) as purchases,
        SUM(initiate_checkout) as initiate_checkout,
        SUM(add_payment_info) as add_payment_info
      FROM campaign_insights
      WHERE funnel_stage = 'BOF'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        AND account_id = ANY($4)
      GROUP BY campaign_name
      ORDER BY roas DESC
      LIMIT 50
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    params.push(accounts.map(a => a.account_id));
    
    const result = await pool.query(query, params);
    
    res.json({
      campaigns: result.rows.map(row => ({
        campaign_name: row.campaign_name,
        spend: parseFloat(row.spend) || 0,
        conversions: parseInt(row.conversions) || 0,
        cpa: parseFloat(row.cpa) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roas: parseFloat(row.roas) || 0,
        aov: parseFloat(row.aov) || 0,
        purchases: parseInt(row.purchases) || 0,
        initiate_checkout: parseInt(row.initiate_checkout) || 0,
        add_payment_info: parseInt(row.add_payment_info) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching BOF data:', error);
    res.status(500).json({ error: 'Failed to fetch BOF data' });
  }
});

// Helper functions
function getAccountsForQuery(country, account_id) {
  if (account_id && account_id !== 'All') {
    return [countryAccountMapper.getAccountById(account_id)];
  }
  return countryAccountMapper.getAccountsByCountry(country || 'All');
}

async function getFunnelSummary(accounts, date_from, date_to, campaign_goal) {
  const query = `
    SELECT 
      funnel_stage,
      SUM(spend) as spend,
      SUM(conversions) as conversions,
      SUM(revenue) as revenue
    FROM campaign_insights
    WHERE date BETWEEN $1 AND $2
      ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
      AND account_id = ANY($4)
    GROUP BY funnel_stage
  `;
  
  const params = [date_from, date_to];
  if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
  params.push(accounts.map(a => a.account_id));
  
  const result = await pool.query(query, params);
  return result.rows;
}

async function getCountryComparison(country, date_from, date_to, campaign_goal) {
  if (country !== 'All') return [];
  
  const query = `
    SELECT 
      country,
      SUM(spend) as spend,
      SUM(conversions) as conversions,
      SUM(revenue) as revenue,
      AVG(roas) as roas,
      AVG(cpa) as cpa
    FROM campaign_insights
    WHERE date BETWEEN $1 AND $2
      ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
    GROUP BY country
    ORDER BY spend DESC
  `;
  
  const params = [date_from, date_to];
  if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
  
  const result = await pool.query(query, params);
  return result.rows;
}

module.exports = router;
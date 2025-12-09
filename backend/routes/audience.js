// routes/audience.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/audience/demographics
router.get('/demographics', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal, funnel_stage } = req.query;
    
    const query = `
      SELECT 
        age,
        gender,
        SUM(spend) as spend,
        SUM(impressions) as impressions,
        SUM(reach) as reach,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr,
        AVG(cpc) as cpc,
        SUM(conversions) as conversions,
        AVG(cpa) as cpa,
        SUM(revenue) as revenue,
        AVG(roas) as roas
      FROM audience_insights
      WHERE breakdown_type = 'demographics'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        ${funnel_stage && funnel_stage !== 'All' ? 'AND funnel_stage = $4' : ''}
      GROUP BY age, gender
      ORDER BY spend DESC
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    if (funnel_stage && funnel_stage !== 'All') params.push(funnel_stage);
    
    const result = await pool.query(query, params);
    
    res.json({
      data: result.rows.map(row => ({
        age: row.age,
        gender: row.gender,
        spend: parseFloat(row.spend) || 0,
        impressions: parseInt(row.impressions) || 0,
        reach: parseInt(row.reach) || 0,
        clicks: parseInt(row.clicks) || 0,
        ctr: parseFloat(row.ctr) || 0,
        cpc: parseFloat(row.cpc) || 0,
        conversions: parseInt(row.conversions) || 0,
        cpa: parseFloat(row.cpa) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roas: parseFloat(row.roas) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching demographics:', error);
    res.status(500).json({ error: 'Failed to fetch demographics data' });
  }
});

// GET /api/audience/location
router.get('/location', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal, funnel_stage } = req.query;
    
    const query = `
      SELECT 
        country as location,
        city,
        SUM(spend) as spend,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr,
        AVG(cpc) as cpc,
        SUM(conversions) as conversions,
        AVG(cpa) as cpa,
        SUM(revenue) as revenue,
        AVG(roas) as roas
      FROM audience_insights
      WHERE breakdown_type = 'location'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        ${funnel_stage && funnel_stage !== 'All' ? 'AND funnel_stage = $4' : ''}
      GROUP BY country, city
      ORDER BY spend DESC
      LIMIT 100
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    if (funnel_stage && funnel_stage !== 'All') params.push(funnel_stage);
    
    const result = await pool.query(query, params);
    
    res.json({
      data: result.rows.map(row => ({
        location: row.location,
        city: row.city,
        spend: parseFloat(row.spend) || 0,
        impressions: parseInt(row.impressions) || 0,
        clicks: parseInt(row.clicks) || 0,
        ctr: parseFloat(row.ctr) || 0,
        cpc: parseFloat(row.cpc) || 0,
        conversions: parseInt(row.conversions) || 0,
        cpa: parseFloat(row.cpa) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roas: parseFloat(row.roas) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching location data:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

// GET /api/audience/device
router.get('/device', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal, funnel_stage } = req.query;
    
    const query = `
      SELECT 
        device_platform,
        impression_device,
        SUM(spend) as spend,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr,
        AVG(cpc) as cpc,
        SUM(conversions) as conversions,
        AVG(cpa) as cpa,
        SUM(revenue) as revenue,
        AVG(roas) as roas
      FROM audience_insights
      WHERE breakdown_type = 'device'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        ${funnel_stage && funnel_stage !== 'All' ? 'AND funnel_stage = $4' : ''}
      GROUP BY device_platform, impression_device
      ORDER BY spend DESC
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    if (funnel_stage && funnel_stage !== 'All') params.push(funnel_stage);
    
    const result = await pool.query(query, params);
    
    res.json({
      data: result.rows.map(row => ({
        device_platform: row.device_platform,
        impression_device: row.impression_device,
        spend: parseFloat(row.spend) || 0,
        impressions: parseInt(row.impressions) || 0,
        clicks: parseInt(row.clicks) || 0,
        ctr: parseFloat(row.ctr) || 0,
        cpc: parseFloat(row.cpc) || 0,
        conversions: parseInt(row.conversions) || 0,
        cpa: parseFloat(row.cpa) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roas: parseFloat(row.roas) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({ error: 'Failed to fetch device data' });
  }
});

// GET /api/audience/platform
router.get('/platform', async (req, res) => {
  try {
    const { country, account_id, date_from, date_to, campaign_goal, funnel_stage } = req.query;
    
    const query = `
      SELECT 
        publisher_platform,
        platform_position,
        SUM(spend) as spend,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr,
        AVG(cpc) as cpc,
        SUM(conversions) as conversions,
        AVG(cpa) as cpa,
        SUM(revenue) as revenue,
        AVG(roas) as roas
      FROM audience_insights
      WHERE breakdown_type = 'platform'
        AND date BETWEEN $1 AND $2
        ${campaign_goal && campaign_goal !== 'All' ? 'AND campaign_goal = $3' : ''}
        ${funnel_stage && funnel_stage !== 'All' ? 'AND funnel_stage = $4' : ''}
      GROUP BY publisher_platform, platform_position
      ORDER BY spend DESC
    `;
    
    const params = [date_from, date_to];
    if (campaign_goal && campaign_goal !== 'All') params.push(campaign_goal);
    if (funnel_stage && funnel_stage !== 'All') params.push(funnel_stage);
    
    const result = await pool.query(query, params);
    
    res.json({
      data: result.rows.map(row => ({
        publisher_platform: row.publisher_platform,
        platform_position: row.platform_position,
        spend: parseFloat(row.spend) || 0,
        impressions: parseInt(row.impressions) || 0,
        clicks: parseInt(row.clicks) || 0,
        ctr: parseFloat(row.ctr) || 0,
        cpc: parseFloat(row.cpc) || 0,
        conversions: parseInt(row.conversions) || 0,
        cpa: parseFloat(row.cpa) || 0,
        revenue: parseFloat(row.revenue) || 0,
        roas: parseFloat(row.roas) || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching platform data:', error);
    res.status(500).json({ error: 'Failed to fetch platform data' });
  }
});

module.exports = router;
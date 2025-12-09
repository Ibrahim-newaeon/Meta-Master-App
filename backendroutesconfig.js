// routes/config.js
const express = require('express');
const router = express.Router();
const countryAccountMapper = require('../countryAccountMapper');
const funnelMapper = require('../funnelMapper');

// GET /api/config/accounts
router.get('/accounts', (req, res) => {
  try {
    const config = countryAccountMapper.getConfigForFrontend();
    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch account configuration' });
  }
});

// GET /api/config/filters
router.get('/filters', (req, res) => {
  try {
    const config = {
      countries: countryAccountMapper.getAllCountries(),
      campaignGoals: funnelMapper.getCampaignGoals(),
      funnelStages: ['All', 'TOF', 'MOF', 'BOF'],
      datePresets: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'This Month', value: 'this_month' },
        { label: 'Last Month', value: 'last_month' },
        { label: 'Custom', value: 'custom' }
      ]
    };
    res.json(config);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filter configuration' });
  }
});

module.exports = router;
// mock-server.js - Simple mock server for demonstrating API connectivity
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000'],
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock data generators
const generateMockOverview = () => ({
  kpis: {
    total_spend: 125000,
    total_revenue: 350000,
    total_conversions: 850,
    roas: 2.8,
    cpa: 147.06,
    ctr: 1.85,
    cpm: 12.50,
    total_impressions: 10000000,
    total_reach: 7500000,
    frequency: 1.33
  },
  funnelSummary: [
    { funnel_stage: 'TOF', spend: 50000, revenue: 120000, conversions: 300, roas: 2.4 },
    { funnel_stage: 'MOF', spend: 40000, revenue: 115000, conversions: 280, roas: 2.88 },
    { funnel_stage: 'BOF', spend: 35000, revenue: 115000, conversions: 270, roas: 3.29 }
  ],
  countryComparison: [
    { country: 'KSA', spend: 60000, revenue: 175000, roas: 2.92, cpa: 141.18, conversions: 425 },
    { country: 'Kuwait', spend: 40000, revenue: 110000, roas: 2.75, cpa: 153.85, conversions: 260 },
    { country: 'Qatar', spend: 25000, revenue: 65000, roas: 2.6, cpa: 151.52, conversions: 165 }
  ]
});

const generateMockCampaigns = (stage) => ({
  campaigns: [
    {
      campaign_name: `${stage} Campaign - Brand Awareness`,
      spend: 15000,
      impressions: 3000000,
      reach: 2200000,
      frequency: 1.36,
      cpm: 10.00,
      ctr: 1.8,
      cpc: 0.55,
      clicks: 54000,
      landing_page_views: 42000,
      cost_per_landing_page_view: 0.36,
      video_views: 180000,
      thruplays: 120000,
      conversions: 250,
      cpa: 60.00,
      revenue: 42000,
      roas: 2.8
    },
    {
      campaign_name: `${stage} Campaign - Traffic`,
      spend: 12000,
      impressions: 2500000,
      reach: 1800000,
      frequency: 1.39,
      cpm: 9.60,
      ctr: 2.1,
      cpc: 0.48,
      clicks: 52500,
      landing_page_views: 38000,
      cost_per_landing_page_view: 0.32,
      video_views: 150000,
      thruplays: 95000,
      conversions: 220,
      cpa: 54.55,
      revenue: 38000,
      roas: 3.17
    },
    {
      campaign_name: `${stage} Campaign - Conversions`,
      spend: 18000,
      impressions: 3500000,
      reach: 2500000,
      frequency: 1.4,
      cpm: 10.29,
      ctr: 1.6,
      cpc: 0.64,
      clicks: 56000,
      landing_page_views: 45000,
      cost_per_landing_page_view: 0.40,
      video_views: 175000,
      thruplays: 115000,
      conversions: 300,
      cpa: 60.00,
      revenue: 52000,
      roas: 2.89
    }
  ]
});

const generateMockDemographics = () => ({
  data: [
    { age: '18-24', gender: 'Male', spend: 12000, impressions: 2400000, reach: 1800000, clicks: 42000, ctr: 1.75, cpc: 0.29, conversions: 180, cpa: 66.67, revenue: 32000, roas: 2.67 },
    { age: '18-24', gender: 'Female', spend: 15000, impressions: 2800000, reach: 2100000, clicks: 50000, ctr: 1.79, cpc: 0.30, conversions: 220, cpa: 68.18, revenue: 42000, roas: 2.8 },
    { age: '25-34', gender: 'Male', spend: 18000, impressions: 3200000, reach: 2400000, clicks: 60000, ctr: 1.88, cpc: 0.30, conversions: 280, cpa: 64.29, revenue: 55000, roas: 3.06 },
    { age: '25-34', gender: 'Female', spend: 20000, impressions: 3500000, reach: 2600000, clicks: 68000, ctr: 1.94, cpc: 0.29, conversions: 310, cpa: 64.52, revenue: 62000, roas: 3.1 },
    { age: '35-44', gender: 'Male', spend: 16000, impressions: 2900000, reach: 2200000, clicks: 55000, ctr: 1.90, cpc: 0.29, conversions: 260, cpa: 61.54, revenue: 48000, roas: 3.0 },
    { age: '35-44', gender: 'Female', spend: 14000, impressions: 2600000, reach: 2000000, clicks: 48000, ctr: 1.85, cpc: 0.29, conversions: 230, cpa: 60.87, revenue: 42000, roas: 3.0 }
  ]
});

const generateMockLocation = () => ({
  data: [
    { location: 'Riyadh', city: 'Riyadh', spend: 35000, impressions: 6500000, clicks: 120000, ctr: 1.85, cpc: 0.29, conversions: 480, cpa: 72.92, revenue: 105000, roas: 3.0 },
    { location: 'Kuwait City', city: 'Kuwait City', spend: 28000, impressions: 5200000, clicks: 98000, ctr: 1.88, cpc: 0.29, conversions: 390, cpa: 71.79, revenue: 85000, roas: 3.04 },
    { location: 'Doha', city: 'Doha', spend: 22000, impressions: 4100000, clicks: 78000, ctr: 1.90, cpc: 0.28, conversions: 310, cpa: 70.97, revenue: 68000, roas: 3.09 }
  ]
});

const generateMockDevice = () => ({
  data: [
    { device_platform: 'Mobile', spend: 72000, impressions: 13500000, clicks: 252000, ctr: 1.87, cpc: 0.29, conversions: 1020, cpa: 70.59, revenue: 210000, roas: 2.92 },
    { device_platform: 'Desktop', spend: 38000, impressions: 6800000, clicks: 126000, ctr: 1.85, cpc: 0.30, conversions: 510, cpa: 74.51, revenue: 105000, roas: 2.76 },
    { device_platform: 'Tablet', spend: 15000, impressions: 2700000, clicks: 48000, ctr: 1.78, cpc: 0.31, conversions: 195, cpa: 76.92, revenue: 43000, roas: 2.87 }
  ]
});

const generateMockPlatform = () => ({
  data: [
    { platform: 'Instagram', spend: 55000, impressions: 10200000, clicks: 192000, ctr: 1.88, cpc: 0.29, conversions: 780, cpa: 70.51, revenue: 162000, roas: 2.95 },
    { platform: 'Facebook', spend: 50000, impressions: 9300000, clicks: 171000, ctr: 1.84, cpc: 0.29, conversions: 690, cpa: 72.46, revenue: 145000, roas: 2.9 },
    { platform: 'Messenger', spend: 20000, impressions: 3500000, clicks: 63000, ctr: 1.80, cpc: 0.32, conversions: 255, cpa: 78.43, revenue: 51000, roas: 2.55 }
  ]
});

// API Routes
app.get('/api/insights/overview', (req, res) => {
  console.log('📊 Overview request received');
  res.json(generateMockOverview());
});

app.get('/api/insights/tof', (req, res) => {
  console.log('🎯 TOF request received');
  res.json(generateMockCampaigns('TOF'));
});

app.get('/api/insights/mof', (req, res) => {
  console.log('🔄 MOF request received');
  res.json(generateMockCampaigns('MOF'));
});

app.get('/api/insights/bof', (req, res) => {
  console.log('💰 BOF request received');
  res.json(generateMockCampaigns('BOF'));
});

app.get('/api/audience/demographics', (req, res) => {
  console.log('👥 Demographics request received');
  res.json(generateMockDemographics());
});

app.get('/api/audience/location', (req, res) => {
  console.log('🌍 Location request received');
  res.json(generateMockLocation());
});

app.get('/api/audience/device', (req, res) => {
  console.log('📱 Device request received');
  res.json(generateMockDevice());
});

app.get('/api/audience/platform', (req, res) => {
  console.log('💻 Platform request received');
  res.json(generateMockPlatform());
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Meta Master Backend Mock Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api/*`);
  console.log(`\n✨ Mock data enabled - No database required!`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

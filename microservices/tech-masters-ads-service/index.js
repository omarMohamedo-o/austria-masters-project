const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock database for ad inventory and analytics
const adInventory = [
  { id: 'ad_1', type: 'banner', client: 'Google Ads', cpc: 0.15 },
  { id: 'ad_2', type: 'sidebar', client: 'Direct Sponsor', cpc: 0.50 }
];

let analytics = { impressions: 0, clicks: 0, revenue: 0 };

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ads-microservice' });
});

app.get(['/api/ads', '/api/ads/serve'], (req, res) => {
  // Simulate ad bidding/selection algorithm
  const selectedAd = adInventory[Math.floor(Math.random() * adInventory.length)];
  analytics.impressions += 1;
  res.json({ status: 'success', ad: selectedAd });
});

app.post('/api/ads/click', (req, res) => {
  const { adId } = req.body;
  const ad = adInventory.find(a => a.id === adId);
  if (ad) {
    analytics.clicks += 1;
    analytics.revenue += ad.cpc;
    return res.json({ status: 'success', message: 'Click tracked' });
  }
  res.status(404).json({ error: 'Ad not found' });
});

app.get('/api/ads/analytics', (req, res) => {
  res.json(analytics);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Ads Microservice running on port ${PORT}`);
});

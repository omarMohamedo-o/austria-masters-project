const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rich inventory of relevant educational and technology sponsors
const adInventory = [
  {
    id: 'ad_scholarship_oead',
    type: 'banner',
    slot: 'top_banner',
    client: 'ÖAD Austrian Agency for Education',
    title: 'Austrian Government Tech Scholarships 2026/27',
    tagline: 'Fully Funded Master\'s Grants for International & EU Students',
    description: 'Receive up to €1,200/month living stipend + tuition waiver for accredited Austrian technical universities. Fall 2026 intake is currently open.',
    cta: 'Apply for Scholarship',
    url: 'https://grants.at/en/',
    cpc: 0.85,
    badge: 'Official Grant'
  },
  {
    id: 'ad_cloud_credits',
    type: 'card',
    slot: 'in_feed',
    client: 'Google Cloud for Students',
    title: 'Google Cloud Computing Student Fellowship',
    tagline: 'Free $300 Credits + Professional Machine Learning Certifications',
    description: 'Accelerate your Master\'s thesis in AI or Big Data with high-performance TPU/GPU clusters, certified mentoring, and internship tracks across Europe.',
    cta: 'Claim $300 Student Credits',
    url: 'https://cloud.google.com/edu/students',
    cpc: 1.20,
    badge: 'Sponsored Partner'
  },
  {
    id: 'ad_german_b2',
    type: 'card',
    slot: 'in_feed',
    client: 'Goethe-Institut & ÖSD Prep',
    title: 'Fast-Track German B2 Admission Certificate',
    tagline: '100% Online Intensive Courses for Austrian University Entry',
    description: 'Get your required German B2 language certificate in 8 weeks with certified native tutors before Austrian winter semester application deadlines close.',
    cta: 'Explore Prep Courses',
    url: 'https://www.osd.at/en/',
    cpc: 0.65,
    badge: 'Language Partner'
  },
  {
    id: 'ad_jetbrains_pack',
    type: 'card',
    slot: 'in_feed',
    client: 'JetBrains Academic Program',
    title: 'Free JetBrains All Products Pack for Tech Students',
    tagline: 'CLion, IntelliJ IDEA Ultimate, PyCharm & DataSpell',
    description: 'Free professional developer licenses for all enrolled computer science, software engineering, and data science master\'s students worldwide.',
    cta: 'Get Free Academic License',
    url: 'https://www.jetbrains.com/community/education/#students',
    cpc: 0.45,
    badge: 'Developer Tools'
  }
];

let analytics = { impressions: 0, clicks: 0, revenue: 0.0 };

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ads-microservice', inventoryCount: adInventory.length });
});

// Endpoint serving all ads or slot-specific ads
app.get(['/api/ads', '/api/ads/serve'], (req, res) => {
  const { slot } = req.query;
  analytics.impressions += 1;

  if (slot) {
    const matching = adInventory.filter(a => a.slot === slot);
    if (matching.length > 0) {
      const selected = matching[Math.floor(Math.random() * matching.length)];
      return res.json({ status: 'success', ad: selected, analytics });
    }
  }

  const topBanner = adInventory.find(a => a.slot === 'top_banner') || adInventory[0];
  const inFeedAds = adInventory.filter(a => a.slot === 'in_feed');

  res.json({
    status: 'success',
    topBanner,
    inFeedAds,
    allAds: adInventory,
    analytics
  });
});

// Track ad clicks and increment simulated ad revenue
app.post('/api/ads/click', (req, res) => {
  const { adId } = req.body;
  const ad = adInventory.find(a => a.id === adId);
  if (ad) {
    analytics.clicks += 1;
    analytics.revenue = parseFloat((analytics.revenue + ad.cpc).toFixed(2));
    console.log(`[Ad Click Tracked] Ad: ${ad.title} (${ad.id}) | Earned: $${ad.cpc} | Total: $${analytics.revenue}`);
    return res.json({ status: 'success', message: 'Click tracked', earnings: ad.cpc, totalRevenue: analytics.revenue });
  }
  res.status(404).json({ error: 'Ad not found' });
});

// Analytics dashboard endpoint
app.get('/api/ads/analytics', (req, res) => {
  const ctr = analytics.impressions > 0 ? ((analytics.clicks / analytics.impressions) * 100).toFixed(2) + '%' : '0.00%';
  res.json({
    ...analytics,
    ctr,
    activeCampaigns: adInventory.length
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Ads Microservice running on port ${PORT}`);
});

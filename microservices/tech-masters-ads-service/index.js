const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rich inventory of relevant educational and technology sponsors
let adInventory = [
  {
    id: 'ad_expatrio_blocked_account',
    type: 'banner',
    slot: 'top_banner',
    client: 'Expatrio Global Services GmbH · Berlin',
    title: 'Official Student Blocked Account (€11,904) & Free Health Insurance',
    tagline: '100% Digital Approval in 24 Hours · Accepted by Austrian & German Embassies Worldwide',
    description: 'Federal Foreign Office & Austrian immigration approved blocked account for international Master\'s students. Get your official visa confirmation document in 24 hours with €0 setup fee bundle.',
    cta: 'Open Blocked Account',
    url: 'https://www.expatrio.com/blocked-account',
    cpc: 1.85,
    badge: 'AdChoices ⓘ · Verified Partner'
  },
  {
    id: 'ad_fintiba_sperrkonto',
    type: 'card',
    slot: 'in_feed',
    client: 'Fintiba GmbH · Frankfurt am Main',
    title: 'Fintiba Plus: Blocked Account + Barmer Public Health Insurance',
    tagline: 'Fast-Track Student Visa Package with Online Identity Verification',
    description: 'The premier blocked account solution for Austrian and German university admissions. Instant Sperrkonto blocking confirmation accepted by MA35 and visa consulates.',
    cta: 'Get Fintiba Sperrkonto',
    url: 'https://www.fintiba.com/',
    cpc: 1.65,
    badge: 'AdChoices ⓘ · Official Sponsor'
  },
  {
    id: 'ad_ielts_british_council',
    type: 'card',
    slot: 'in_feed',
    client: 'British Council & IDP Education',
    title: 'Book Your Official IELTS Academic Test for University Entry',
    tagline: 'Accepted by TU Wien, TUM, Uni Vienna, and 100% of Austrian & German Universities',
    description: 'Fulfill your Master\'s English proficiency requirement (C1/B2) with test slots available this week online or in-person. Free preparation materials included.',
    cta: 'Book Official IELTS Test',
    url: 'https://takeielts.britishcouncil.org/',
    cpc: 1.40,
    badge: 'AdChoices ⓘ · Certified Exam'
  },
  {
    id: 'ad_cloud_credits',
    type: 'card',
    slot: 'in_feed',
    client: 'Google Cloud for Higher Education',
    title: 'Google Cloud Computing Student Fellowship ($300 Credits)',
    tagline: 'Free TPU/GPU Clusters, Vertex AI & Professional Cloud Certifications',
    description: 'Accelerate your Master\'s thesis in AI or Big Data with high-performance TPU/GPU clusters, certified mentoring, and internship tracks across Europe.',
    cta: 'Claim $300 Student Credits',
    url: 'https://cloud.google.com/edu/students',
    cpc: 2.10,
    badge: 'AdChoices ⓘ · Google Partner'
  },
  {
    id: 'ad_coursera_prereq',
    type: 'card',
    slot: 'in_feed',
    client: 'DeepLearning.AI & Coursera',
    title: 'Complete Master\'s Prerequisites Online: Math, Algorithms & ML',
    tagline: 'Bridge Missing Undergraduate ECTS with University-Recognized Certificates',
    description: 'Satisfy Austrian UG 2002 § 64 equivalency requirements with accredited courses in Linear Algebra, Multivariable Calculus, Discrete Mathematics, and Computer Architecture.',
    cta: 'Explore Prep Courses',
    url: 'https://www.coursera.org/specializations/deep-learning',
    cpc: 1.25,
    badge: 'AdChoices ⓘ · Academic Partner'
  },
  {
    id: 'ad_scholarship_oead',
    type: 'banner',
    slot: 'top_banner',
    client: 'ÖAD Austrian Agency for Education & Housing',
    title: 'Austrian Government Tech Scholarships & Student Housing 2026/27',
    tagline: 'Fully Funded Master\'s Grants up to €1,200/mo + OeAD Student Dorms',
    description: 'Official Austrian government grants and certified student housing across Vienna, Graz, Linz, and Salzburg. Fall 2026 application cycle is currently accepting candidates.',
    cta: 'Apply for Scholarship',
    url: 'https://grants.at/en/',
    cpc: 1.10,
    badge: 'AdChoices ⓘ · Official Grant'
  }
];

let analytics = {
  impressions: 485,
  clicks: 42,
  viewSeconds: 318,
  activeViews: 390,
  cpcRevenue: 44.50,
  cpmRevenue: 2.42,
  viewDurationRevenue: 3.18,
  revenue: 50.10
};

// Payout configuration (supports Google AdSense, direct SEPA bank wire, Visa card)
let payoutConfig = {
  adsense_publisher_id: "ca-pub-9842104820194821",
  auto_payout_enabled: true,
  payout_method: "visa_bank_wire",
  account_holder: "Omar Mohamed",
  iban_or_card: "AT89 3700 4821 9912",
  bic_swift: "BKAUATWW",
  bank_name: "Erste Bank Vienna / Visa Debit Direct Deposit",
  auto_payout_threshold: 100.00,
  payout_schedule: "Monthly on the 21st (Automated Wire)",
  currency: "USD / EUR"
};

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ads-microservice', inventoryCount: adInventory.length });
});

// Endpoint serving all ads or slot-specific ads
app.get(['/api/ads', '/api/ads/serve'], (req, res) => {
  const { slot } = req.query;
  analytics.impressions += 1;
  const cpmEarning = 0.005; // $5.00 CPM = $0.005 per view
  analytics.cpmRevenue = parseFloat((analytics.cpmRevenue + cpmEarning).toFixed(3));
  analytics.revenue = parseFloat((analytics.cpcRevenue + analytics.cpmRevenue + analytics.viewDurationRevenue).toFixed(2));

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
    analytics,
    payoutConfig
  });
});

// Track ad view impression (CPM monetization)
app.post('/api/ads/impression', (req, res) => {
  const { adId } = req.body;
  analytics.impressions += 1;
  const cpmRate = 0.005; // $5.00 per 1000 views
  analytics.cpmRevenue = parseFloat((analytics.cpmRevenue + cpmRate).toFixed(3));
  analytics.revenue = parseFloat((analytics.cpcRevenue + analytics.cpmRevenue + analytics.viewDurationRevenue).toFixed(2));
  
  return res.json({
    status: 'success',
    message: 'Impression tracked',
    totalImpressions: analytics.impressions,
    cpmRevenue: analytics.cpmRevenue,
    totalRevenue: analytics.revenue
  });
});

// Track ad view duration in seconds (Active View / viewability time monetization)
app.post('/api/ads/view-duration', (req, res) => {
  const { adId, seconds } = req.body;
  const duration = Math.max(1, parseInt(seconds, 10) || 1);
  analytics.viewSeconds += duration;
  analytics.activeViews += 1;
  
  // Active View reward: $0.003 per second of focused countdown view
  const durationBonus = parseFloat((duration * 0.003).toFixed(3));
  analytics.viewDurationRevenue = parseFloat((analytics.viewDurationRevenue + durationBonus).toFixed(3));
  analytics.revenue = parseFloat((analytics.cpcRevenue + analytics.cpmRevenue + analytics.viewDurationRevenue).toFixed(2));

  console.log(`[Ad View Duration] Ad: ${adId} | Duration: ${duration}s | Bonus: +$${durationBonus} | Total Rev: $${analytics.revenue}`);

  return res.json({
    status: 'success',
    durationTracked: duration,
    totalViewSeconds: analytics.viewSeconds,
    viewDurationRevenue: analytics.viewDurationRevenue,
    totalRevenue: analytics.revenue
  });
});

// Track ad clicks and increment CPC ad revenue
app.post('/api/ads/click', (req, res) => {
  const { adId } = req.body;
  const ad = adInventory.find(a => a.id === adId);
  const cpcEarned = ad ? ad.cpc : 0.85;

  analytics.clicks += 1;
  analytics.cpcRevenue = parseFloat((analytics.cpcRevenue + cpcEarned).toFixed(2));
  analytics.revenue = parseFloat((analytics.cpcRevenue + analytics.cpmRevenue + analytics.viewDurationRevenue).toFixed(2));

  console.log(`[Ad Click Tracked] Ad: ${ad ? ad.title : adId} | Earned CPC: $${cpcEarned} | Total Rev: $${analytics.revenue}`);
  return res.json({
    status: 'success',
    message: 'Click tracked',
    earnings: cpcEarned,
    cpcRevenue: analytics.cpcRevenue,
    totalRevenue: analytics.revenue
  });
});

// Analytics dashboard endpoint
app.get('/api/ads/analytics', (req, res) => {
  const ctr = analytics.impressions > 0 ? ((analytics.clicks / analytics.impressions) * 100).toFixed(2) + '%' : '0.00%';
  const viewability = analytics.impressions > 0 ? ((analytics.activeViews / analytics.impressions) * 100).toFixed(1) + '%' : '92.5%';
  const avgViewTime = analytics.impressions > 0 ? (analytics.viewSeconds / analytics.impressions).toFixed(1) + 's' : '4.8s';

  res.json({
    ...analytics,
    ctr,
    viewability,
    avgViewTime,
    activeCampaigns: adInventory.length,
    payoutConfig
  });
});

// Payout configuration endpoints (get & update bank / AdSense info)
app.get('/api/ads/payout-config', (req, res) => {
  res.json({ status: 'success', payoutConfig });
});

app.post('/api/ads/payout-config', (req, res) => {
  payoutConfig = { ...payoutConfig, ...req.body };
  res.json({ status: 'success', message: 'Payout configuration saved', payoutConfig });
});

// Admin: Create new ad campaign
app.post('/api/ads', (req, res) => {
  const newAd = {
    id: req.body.id || `ad_${Date.now()}`,
    type: req.body.type || (req.body.slot === 'top_banner' ? 'banner' : 'card'),
    slot: req.body.slot || 'in_feed',
    client: req.body.client || 'Partner Sponsor',
    title: req.body.title || 'Sponsored Tech Program',
    tagline: req.body.tagline || 'Special Offer for Tech Students',
    description: req.body.description || 'Exclusive opportunities and fellowships.',
    cta: req.body.cta || 'Learn More',
    url: req.body.url || 'https://grants.at/en/',
    cpc: parseFloat(req.body.cpc) || 0.75,
    badge: req.body.badge || 'Sponsored',
    active: req.body.active !== undefined ? req.body.active : true
  };
  adInventory.push(newAd);
  res.status(201).json({ status: 'created', ad: newAd });
});

// Admin: Update ad campaign
app.put('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  const index = adInventory.findIndex(a => a.id === id);
  if (index !== -1) {
    adInventory[index] = { ...adInventory[index], ...req.body };
    return res.json({ status: 'updated', ad: adInventory[index] });
  }
  res.status(404).json({ error: 'Ad campaign not found' });
});

// Admin: Delete ad campaign
app.delete('/api/ads/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = adInventory.length;
  adInventory = adInventory.filter(a => a.id !== id);
  if (adInventory.length === initialLen) {
    return res.status(404).json({ error: 'Ad campaign not found' });
  }
  res.json({ status: 'deleted', id });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Ads Microservice running on port ${PORT}`);
});

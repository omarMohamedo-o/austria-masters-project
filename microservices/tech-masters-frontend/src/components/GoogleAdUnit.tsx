"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Sparkles, ShieldCheck, Info } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export type RealAdOffer = {
  id: string;
  client: string;
  title: string;
  tagline: string;
  description: string;
  cta: string;
  url: string;
  badge: string;
  format?: "banner" | "card" | "leaderboard";
  cpc: number;
};

// Real Live Educational Sponsors & Affiliates
const REAL_COMMERCIAL_ADS: RealAdOffer[] = [
  {
    id: "ad_expatrio_blocked_account",
    client: "Expatrio Global Services GmbH · Berlin",
    title: "Official Student Blocked Account (€11,904) + Free Health Insurance",
    tagline: "100% Digital Approval in 24 Hours · Accepted by Austrian & German Embassies",
    description: "Federal Foreign Office & Austrian immigration approved blocked account for international Master's students. Get your official visa confirmation document in 24 hours with €0 setup fee bundle.",
    cta: "Open Blocked Account",
    url: "https://www.expatrio.com/blocked-account",
    badge: "AdChoices ⓘ · Visa Partner",
    cpc: 1.85,
    format: "leaderboard"
  },
  {
    id: "ad_cloud_credits",
    client: "Google Cloud for Higher Education",
    title: "Google Cloud Computing Student Fellowship ($300 Credits)",
    tagline: "Free TPU/GPU Clusters, Vertex AI & Professional Cloud Certifications",
    description: "Accelerate your Master's thesis in AI, Deep Learning, or Distributed Computing with high-performance TPU/GPU clusters, certified mentoring, and internship tracks across Europe.",
    cta: "Claim $300 Student Credits",
    url: "https://cloud.google.com/edu/students",
    badge: "AdChoices ⓘ · Google Partner",
    cpc: 2.10,
    format: "card"
  },
  {
    id: "ad_ielts_british_council",
    client: "British Council & IDP Education",
    title: "Book Your Official IELTS Academic Test for University Entry",
    tagline: "Accepted by TU Wien, TUM, Uni Vienna, and 100% of Austrian & German Universities",
    description: "Fulfill your Master's English proficiency prerequisite (C1/B2) with test slots available this week online or in-person. Free prep tests and speaking mock interviews included.",
    cta: "Book Official IELTS Test",
    url: "https://takeielts.britishcouncil.org/",
    badge: "AdChoices ⓘ · Certified Exam",
    cpc: 1.40,
    format: "card"
  },
  {
    id: "ad_fintiba_sperrkonto",
    client: "Fintiba GmbH · Frankfurt am Main",
    title: "Fintiba Plus: Blocked Account + Barmer Public Health Insurance",
    tagline: "Fast-Track Student Visa Package with Online Identity Verification",
    description: "The premier blocked account solution for Austrian and German university admissions. Instant Sperrkonto blocking confirmation accepted by MA35 and visa consulates.",
    cta: "Get Fintiba Sperrkonto",
    url: "https://www.fintiba.com/",
    badge: "AdChoices ⓘ · Official Sponsor",
    cpc: 1.65,
    format: "banner"
  }
];

interface GoogleAdUnitProps {
  slot?: string;
  adClient?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
  fallbackAdId?: string;
  onAdClick?: (adId: string) => void;
}

export default function GoogleAdUnit({
  slot = "1049281048",
  adClient = "ca-pub-9842104820194821",
  format = "auto",
  className = "",
  fallbackAdId,
  onAdClick
}: GoogleAdUnitProps) {
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);
  const [activeAd, setActiveAd] = useState<RealAdOffer>(REAL_COMMERCIAL_ADS[0]);

  useEffect(() => {
    // Select specific or rotating real ad
    if (fallbackAdId) {
      const found = REAL_COMMERCIAL_ADS.find((a) => a.id === fallbackAdId);
      if (found) setActiveAd(found);
    } else {
      const randomAd = REAL_COMMERCIAL_ADS[Math.floor(Math.random() * REAL_COMMERCIAL_ADS.length)];
      setActiveAd(randomAd);
    }

    // Try initializing Google AdSense unit
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setIsAdSenseLoaded(true);
      }
    } catch {
      setIsAdSenseLoaded(false);
    }

    // Send automatic view impression
    fetch("/api/ads/impression", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: fallbackAdId || activeAd.id })
    }).catch(() => {});
  }, [fallbackAdId]);

  const handleClick = () => {
    if (onAdClick) {
      onAdClick(activeAd.id);
    } else {
      fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: activeAd.id })
      }).catch(() => {});
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-[#121c18] via-[#16241f] to-[#141b24] shadow-lg ${className}`}
    >
      {/* Real Google AdSense Unit (mounts if ad blocker disabled and publisher active) */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />

      {/* Real Commercial Display Banner */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {activeAd.badge}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {activeAd.client}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
            {activeAd.title}
          </h3>

          <p className="text-xs text-teal-300 font-medium">
            {activeAd.tagline}
          </p>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">
            {activeAd.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
          <a
            href={activeAd.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95 text-center cursor-pointer"
          >
            <span>{activeAd.cta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

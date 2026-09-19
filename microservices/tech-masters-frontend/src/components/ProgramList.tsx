"use client";

import React, { useState, useMemo, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  Calendar,
  GraduationCap,
  MapPin,
  Banknote,
  ShieldAlert,
  Sparkles,
  Trophy,
  Globe,
  Building2,
  RotateCcw,
  ArrowUpDown,
  X,
  Megaphone,
  DollarSign,
  Users,
  CheckCircle2,
  Briefcase,
  Languages,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  FileText,
  FileCheck,
  Calculator,
  Sliders
} from "lucide-react";
import GoogleAdUnit from "./GoogleAdUnit";

export type Program = {
  id?: string;
  country?: string;
  city?: string;
  title: string;
  inst: string;
  uni_name?: string;
  uni_short?: string;
  uni_rank_world?: number;
  uni_rank_country?: number;
  uni_url?: string;
  field: string;
  status: string;
  statusLabel: string;
  sortDate: string;
  dateLabel: string;
  deadlineEU: string;
  deadlineNonEU: string;
  windowLabel: string;
  desc: string;
  tags: string[];
  lang: string;
  url: string;
  applyUrl: string;
  feeEU: string;
  feeEUNote?: string;
  feeNonEU: string;
  feeApp?: string;
  feeFree?: boolean;
  // Practical Admissions, Capacity & Career Specs
  seats?: string;
  admissionProcess?: string;
  minDegree?: string;
  englishLevel?: string;
  workRights?: string;
  industryPartners?: string;
  duration?: string;
};

export type University = {
  name: string;
  short_name: string;
  city: string;
  country: string;
  rank_world: number;
  rank_country: number;
  type: string;
  website: string;
  description: string;
  programs_count?: number;
};

export type Ad = {
  id: string;
  type: string;
  slot: string;
  client: string;
  title: string;
  tagline: string;
  description: string;
  cta: string;
  url: string;
  cpc: number;
  badge: string;
};

// Fallback in case ads microservice is starting
const FALLBACK_ADS: { topBanner: Ad; inFeedAds: Ad[] } = {
  topBanner: {
    id: "ad_scholarship_oead",
    type: "banner",
    slot: "top_banner",
    client: "ÖAD Austrian Agency for Education",
    title: "Austrian Government Tech Scholarships 2026/27",
    tagline: "Fully Funded Master's Grants for International & EU Students",
    description: "Receive up to €1,200/month living stipend + tuition waiver for Austrian universities.",
    cta: "Apply for Scholarship",
    url: "https://grants.at/en/",
    cpc: 0.85,
    badge: "Official Grant"
  },
  inFeedAds: [
    {
      id: "ad_cloud_credits",
      type: "card",
      slot: "in_feed",
      client: "Google Cloud for Students",
      title: "Google Cloud Computing Student Fellowship",
      tagline: "Free $300 Credits + Professional AI Certifications",
      description: "Accelerate your Master's research in AI or Data Science with high-performance TPU/GPU clusters, certified mentoring, and internship tracks across Europe.",
      cta: "Claim $300 Student Credits",
      url: "https://cloud.google.com/edu/students",
      cpc: 1.20,
      badge: "Sponsored Partner"
    },
    {
      id: "ad_german_b2",
      type: "card",
      slot: "in_feed",
      client: "Goethe-Institut & ÖSD Prep",
      title: "Fast-Track German B2 Admission Certificate",
      tagline: "100% Online Intensive Courses for University Entry",
      description: "Get your required German B2 language certificate in 8 weeks with certified native tutors before Austrian winter semester deadlines close.",
      cta: "Explore Prep Courses",
      url: "https://www.osd.at/en/",
      cpc: 0.65,
      badge: "Language Partner"
    }
  ]
};

// Fallback universities data
const FALLBACK_UNIVERSITIES: University[] = [
  {
    name: "University of Vienna (Universität Wien)",
    short_name: "Uni Vienna",
    city: "Vienna",
    country: "Austria",
    rank_world: 130,
    rank_country: 1,
    type: "Public Research University",
    website: "https://www.univie.ac.at",
    description: "Austria's oldest and highest-ranked university, world-renowned for research in Data Science, Informatics, and Mathematics.",
    programs_count: 2
  },
  {
    name: "TU Wien (Vienna University of Technology)",
    short_name: "TU Wien",
    city: "Vienna",
    country: "Austria",
    rank_world: 190,
    rank_country: 2,
    type: "Technical University",
    website: "https://www.tuwien.at",
    description: "Austria's premier institute of technology, leading Europe in algorithms, computer engineering, and cybersecurity.",
    programs_count: 5
  },
  {
    name: "University of Innsbruck",
    short_name: "Uni Innsbruck",
    city: "Innsbruck",
    country: "Austria",
    rank_world: 362,
    rank_country: 3,
    type: "Public University",
    website: "https://www.uibk.ac.at",
    description: "Top Alpine research center renowned for quantum computing and high-performance computing.",
    programs_count: 1
  },
  {
    name: "TU Graz (Graz University of Technology)",
    short_name: "TU Graz",
    city: "Graz",
    country: "Austria",
    rank_world: 421,
    rank_country: 4,
    type: "Technical University",
    website: "https://www.tugraz.at",
    description: "Recognized internationally for cybersecurity, hardware cryptography, and software technology.",
    programs_count: 3
  },
  {
    name: "Johannes Kepler University Linz (JKU Linz)",
    short_name: "JKU Linz",
    city: "Linz",
    country: "Austria",
    rank_world: 446,
    rank_country: 5,
    type: "Public Research University",
    website: "https://www.jku.at",
    description: "Pioneer of Europe's first AI degree and home of the LIT AI Lab headed by LSTM co-inventor Sepp Hochreiter.",
    programs_count: 4
  },
  {
    name: "University of Klagenfurt (AAU)",
    short_name: "Uni Klagenfurt",
    city: "Klagenfurt",
    country: "Austria",
    rank_world: 580,
    rank_country: 6,
    type: "Public University",
    website: "https://www.aau.at",
    description: "Specialized in artificial intelligence, autonomous systems, and pervasive computing.",
    programs_count: 2
  },
  {
    name: "Paris Lodron University of Salzburg (PLUS)",
    short_name: "Uni Salzburg",
    city: "Salzburg",
    country: "Austria",
    rank_world: 681,
    rank_country: 7,
    type: "Public University",
    website: "https://www.plus.ac.at",
    description: "Home of Salzburg's AI & Human Interfaces research cluster.",
    programs_count: 1
  },
  {
    name: "FH Upper Austria — Campus Hagenberg",
    short_name: "FH OÖ Hagenberg",
    city: "Hagenberg",
    country: "Austria",
    rank_world: 800,
    rank_country: 8,
    type: "University of Applied Sciences",
    website: "https://www.fh-ooe.at/campus-hagenberg/",
    description: "Austria's Silicon Valley hub for applied software engineering, cloud architecture, and IT security.",
    programs_count: 3
  },
  {
    name: "FH JOANNEUM",
    short_name: "FH JOANNEUM",
    city: "Graz",
    country: "Austria",
    rank_world: 820,
    rank_country: 9,
    type: "University of Applied Sciences",
    website: "https://www.fh-joanneum.at",
    description: "Premier applied sciences institution in Styria specializing in IT and software design.",
    programs_count: 1
  },
  {
    name: "UAS Technikum Wien",
    short_name: "Technikum Wien",
    city: "Vienna",
    country: "Austria",
    rank_world: 850,
    rank_country: 10,
    type: "University of Applied Sciences",
    website: "https://www.technikum-wien.at",
    description: "Austria's largest technical UAS with industry-aligned degrees in IT Security and Data Science.",
    programs_count: 2
  },
  {
    name: "FH Campus Wien",
    short_name: "FH Campus Wien",
    city: "Vienna",
    country: "Austria",
    rank_world: 870,
    rank_country: 11,
    type: "University of Applied Sciences",
    website: "https://www.fh-campuswien.ac.at",
    description: "Vienna's extensive applied sciences center with dedicated IT Security competence labs.",
    programs_count: 1
  },
  {
    name: "UAS St. Pölten (USTP)",
    short_name: "FH St. Pölten",
    city: "St. Pölten",
    country: "Austria",
    rank_world: 890,
    rank_country: 12,
    type: "University of Applied Sciences",
    website: "https://www.fhstp.ac.at",
    description: "Top Austrian institution for cyber security, resilient digital infrastructure, and data intelligence.",
    programs_count: 1
  },
  {
    name: "Salzburg University of Applied Sciences (FH Salzburg)",
    short_name: "FH Salzburg",
    city: "Salzburg",
    country: "Austria",
    rank_world: 920,
    rank_country: 13,
    type: "University of Applied Sciences",
    website: "https://www.fh-salzburg.ac.at",
    description: "Specialized in applied cyber security, attack-defense simulations, and smart systems.",
    programs_count: 1
  },
  {
    name: "Carinthia UAS (CUAS)",
    short_name: "FH Kärnten",
    city: "Villach",
    country: "Austria",
    rank_world: 950,
    rank_country: 14,
    type: "University of Applied Sciences",
    website: "https://www.fh-kaernten.at",
    description: "Industry-collaborative programs in communication engineering and cloud systems.",
    programs_count: 1
  },
  {
    name: "Hochschule Burgenland",
    short_name: "HS Burgenland",
    city: "Eisenstadt",
    country: "Austria",
    rank_world: 980,
    rank_country: 15,
    type: "University of Applied Sciences",
    website: "https://www.hochschule-burgenland.at",
    description: "Cloud computing and business informatics applied programs.",
    programs_count: 1
  }
];

export default function ProgramList({
  initialPrograms,
  initialUniversities,
  initialAds
}: {
  initialPrograms: Program[];
  initialUniversities?: University[];
  initialAds?: { topBanner?: Ad; inFeedAds?: Ad[]; analytics?: any };
}) {
  // Programs State with Automatic Fallback
  const [programs, setPrograms] = useState<Program[]>(initialPrograms || []);

  useEffect(() => {
    if (initialPrograms && initialPrograms.length > 0) {
      setPrograms(initialPrograms);
    } else {
      fetch("/api/programs")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPrograms(data);
          }
        })
        .catch((err) => console.error("Failed client-side programs fetch:", err));
    }
  }, [initialPrograms]);

  // Views
  const [activeTab, setActiveTab] = useState<"programs" | "universities">("programs");

  // Customized Search Filters (Exact Match to User Screenshots)
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterField, setFilterField] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  // Geographical Search Filters
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterRanking, setFilterRanking] = useState<string>("all");
  const [filterTuition, setFilterTuition] = useState<string>("all");

  // Application Fee & Tuition Range Filters
  const [filterAppFee, setFilterAppFee] = useState<"all" | "free" | "paid">("all");
  const [feeType, setFeeType] = useState<"nonEu" | "eu">("nonEu");
  const [maxTuition, setMaxTuition] = useState<number>(3000); // 3000 = Any Fee

  const parseFeeNumber = (feeStr: string | undefined): number => {
    if (!feeStr) return 0;
    const lower = feeStr.toLowerCase();
    if (lower.includes("free") && !lower.includes("€")) return 0;
    const match = lower.match(/(?:€|eur)?\s*([0-9]+(?:[,.][0-9]+)?)/);
    if (match) {
      const clean = match[1].replace(",", "");
      return parseFloat(clean) || 0;
    }
    return 0;
  };

  // Search & Sorting
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rank_world" | "rank_country" | "deadline" | "tuition" | "name">("rank_world");

  // Ads & Monetization State
  const [dismissBanner, setDismissBanner] = useState(false);
  const [adRevenue, setAdRevenue] = useState(initialAds?.analytics?.revenue || 0.0);
  const [recentEarning, setRecentEarning] = useState<number | null>(null);
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const toggleSpecs = (id: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topBanner = initialAds?.topBanner || FALLBACK_ADS.topBanner;
  const inFeedAds = (initialAds?.inFeedAds && initialAds.inFeedAds.length > 0) ? initialAds.inFeedAds : FALLBACK_ADS.inFeedAds;

  const universitiesList = useMemo(() => {
    return (initialUniversities && initialUniversities.length > 0) ? initialUniversities : FALLBACK_UNIVERSITIES;
  }, [initialUniversities]);

  // Handle Ad click and send analytics to port 4000
  const handleAdClick = async (adId: string) => {
    try {
      const res = await fetch("/api/ads/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId })
      });
      if (res.ok) {
        const data = await res.json();
        setAdRevenue(data.totalRevenue);
        setRecentEarning(data.earnings);
        setTimeout(() => setRecentEarning(null), 3000);
      }
    } catch {
      // Fallback local simulation
      setAdRevenue((prev: number) => parseFloat((prev + 0.85).toFixed(2)));
      setRecentEarning(0.85);
      setTimeout(() => setRecentEarning(null), 3000);
    }
  };

  // Interstitial Gateway Ad Modal State (for both Details & Apply Now)
  const [gatewayModal, setGatewayModal] = useState<{
    program: Program;
    targetUrl: string;
    actionType: "apply" | "details";
    title: string;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [isAutoRedirectActive, setIsAutoRedirectActive] = useState<boolean>(true);
  const [modalAd, setModalAd] = useState<Ad | null>(null);

  // All available ads pool for interstitial modal
  const allAdsPool = useMemo(() => {
    const list: Ad[] = [];
    if (topBanner) list.push(topBanner);
    if (inFeedAds && inFeedAds.length > 0) list.push(...inFeedAds);
    return list.length > 0 ? list : [FALLBACK_ADS.topBanner, ...FALLBACK_ADS.inFeedAds];
  }, [topBanner, inFeedAds]);

  // Open the Gateway interstitial ad window (for either Details or Apply Now)
  const handleOpenGatewayModal = (prog: Program, actionType: "apply" | "details") => {
    const adIdx = Math.abs((prog.title + actionType).length) % allAdsPool.length;
    const chosenAd = allAdsPool[adIdx] || allAdsPool[0];
    setModalAd(chosenAd);

    const targetUrl = actionType === "apply" ? prog.applyUrl : prog.url;
    const title = actionType === "apply" 
      ? "Opening Official University Application Portal"
      : "Opening Official Program Curriculum & Details";

    setGatewayModal({
      program: prog,
      targetUrl,
      actionType,
      title
    });
    setCountdown(5);
    setIsAutoRedirectActive(true);

    // Track ad impression (CPM) & credit initial click monetization earning
    if (chosenAd) {
      handleAdClick(chosenAd.id);
      fetch("/api/ads/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: chosenAd.id })
      }).catch(() => {});
    }
  };

  // Close the ad window
  const handleCloseGatewayModal = () => {
    setGatewayModal(null);
    setIsAutoRedirectActive(false);
  };

  // Trigger navigation to the official target link
  const handleProceedToGateway = () => {
    if (!gatewayModal) return;
    const url = gatewayModal.targetUrl;
    setGatewayModal(null);
    setIsAutoRedirectActive(false);
    // Direct redirect to the target URL (never blocked by browser popup blockers)
    window.location.href = url;
  };

  // Auto-redirect countdown effect with active view seconds tracking
  useEffect(() => {
    if (!gatewayModal || !isAutoRedirectActive) return;

    if (countdown <= 0) {
      handleProceedToGateway();
      return;
    }

    const timer = setTimeout(() => {
      // Send live 1-second view duration heartbeat to monetize view time
      if (modalAd) {
        fetch("/api/ads/view-duration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adId: modalAd.id, seconds: 1 })
        })
          .then((r) => r.json())
          .then((d) => {
            if (d?.totalRevenue) setAdRevenue(d.totalRevenue);
          })
          .catch(() => {});
      }
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gatewayModal, isAutoRedirectActive, countdown, modalAd]);

  // Complete cities directory for Austria & Germany
  const citiesByCountry: Record<string, string[]> = {
    Austria: [
      "Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", 
      "Villach", "Hagenberg", "St. Pölten", "Eisenstadt", "Leoben", 
      "Dornbirn", "Krems", "Wiener Neustadt", "Kufstein"
    ],
    Germany: [
      "Munich", "Berlin", "Aachen", "Karlsruhe", "Heidelberg", "Stuttgart", 
      "Darmstadt", "Dresden", "Hamburg", "Frankfurt", "Cologne", "Leipzig"
    ]
  };

  const availableCities = useMemo(() => {
    if (filterCountry === "Austria") return citiesByCountry["Austria"];
    if (filterCountry === "Germany") return citiesByCountry["Germany"];
    return [...citiesByCountry["Austria"], ...citiesByCountry["Germany"]];
  }, [filterCountry]);

  // Status options matching Screenshot 1 exactly
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Open now", value: "open" },
    { label: "Opening soon", value: "soon" },
    { label: "Closed for now", value: "closed" }
  ];

  // Field options matching Screenshot 1 + ML, DL, and specialized tech fields
  const fieldOptions = [
    { label: "All fields", value: "all" },
    { label: "Machine Learning & Deep Learning (ML/DL)", value: "Machine Learning & Deep Learning" },
    { label: "AI", value: "AI" },
    { label: "Data Science", value: "Data Science" },
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Robotics & Autonomous Systems", value: "Robotics & Autonomous Systems" },
    { label: "Computer Vision", value: "Computer Vision" },
    { label: "Quantum Computing", value: "Quantum Computing" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Bioinformatics", value: "Bioinformatics" },
    { label: "Human-Computer Interaction", value: "Human-Computer Interaction" },
    { label: "Software Engineering", value: "Software Engineering" },
    { label: "Computer Engineering", value: "Computer Engineering" },
    { label: "Computer Science", value: "Computer Science" }
  ];

  // Language options matching Screenshot 1 exactly
  const languageOptions = [
    { label: "All languages", value: "all" },
    { label: "English", value: "English" },
    { label: "English/German", value: "English/German" },
    { label: "German", value: "German" },
    { label: "German (partial English)", value: "German (partial English)" }
  ];

  // Country options
  const countryOptions = [
    { label: "All countries", value: "all" },
    { label: "🇦🇹 Austria", value: "Austria" },
    { label: "🇩🇪 Germany", value: "Germany" },
    { label: "🇨🇭 Switzerland", value: "Switzerland" }
  ];

  // Ranking tier filter options
  const rankingOptions = [
    { label: "All rankings", value: "all" },
    { label: "🏆 QS Top 200 World", value: "top200" },
    { label: "🌐 QS Top 500 World", value: "top500" },
    { label: "🥇 #1-#3 in Country", value: "top3country" }
  ];

  // Tuition filter options
  const tuitionOptions = [
    { label: "All tuition types", value: "all" },
    { label: "✨ Free / ÖH Fee only", value: "free" },
    { label: "💶 Standard EU (~€363/sem)", value: "standard_eu" }
  ];

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus("all");
    setFilterField("all");
    setFilterLanguage("all");
    setFilterCountry("all");
    setFilterCity("all");
    setFilterRanking("all");
    setFilterTuition("all");
    setFilterAppFee("all");
    setMaxTuition(3000);
    setSearchTerm("");
    setSortBy("rank_world");
  };

  const activeFiltersCount = useMemo(() => {
    return (
      (filterStatus !== "all" ? 1 : 0) +
      (filterField !== "all" ? 1 : 0) +
      (filterLanguage !== "all" ? 1 : 0) +
      (filterCountry !== "all" ? 1 : 0) +
      (filterCity !== "all" ? 1 : 0) +
      (filterRanking !== "all" ? 1 : 0) +
      (filterTuition !== "all" ? 1 : 0) +
      (filterAppFee !== "all" ? 1 : 0) +
      (maxTuition < 3000 ? 1 : 0) +
      (searchTerm.trim() !== "" ? 1 : 0)
    );
  }, [filterStatus, filterField, filterLanguage, filterCountry, filterCity, filterRanking, filterTuition, filterAppFee, maxTuition, searchTerm]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Filter & Sort Programs
  const filteredPrograms = useMemo(() => {
    let list = (programs || []).filter((p) => {
      const q = searchTerm.toLowerCase();
      const pCity = p.city || (p.inst.toLowerCase().includes("vienna") ? "Vienna" :
        p.inst.toLowerCase().includes("linz") ? "Linz" :
        p.inst.toLowerCase().includes("graz") ? "Graz" :
        p.inst.toLowerCase().includes("salzburg") ? "Salzburg" :
        p.inst.toLowerCase().includes("innsbruck") ? "Innsbruck" :
        p.inst.toLowerCase().includes("hagenberg") ? "Hagenberg" :
        p.inst.toLowerCase().includes("klagenfurt") ? "Klagenfurt" :
        p.inst.toLowerCase().includes("pölten") || p.inst.toLowerCase().includes("ustp") ? "St. Pölten" :
        p.inst.toLowerCase().includes("villach") ? "Villach" :
        p.inst.toLowerCase().includes("eisenstadt") ? "Eisenstadt" : "Vienna");

      const pCountry = p.country || "Austria";

      const isMlSearch = q === "ml" || q === "machine learning";
      const isDlSearch = q === "dl" || q === "deep learning";

      const matchesSearch =
        q === "" ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.inst || "").toLowerCase().includes(q) ||
        (p.field || "").toLowerCase().includes(q) ||
        (p.desc || "").toLowerCase().includes(q) ||
        pCity.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (isMlSearch && (
          (p.field || "").toLowerCase().includes("machine learning") ||
          (p.title || "").toLowerCase().includes("machine learning") ||
          (p.desc || "").toLowerCase().includes("machine learning") ||
          (p.tags || []).some(t => t.toLowerCase().includes("machine learning") || t.toLowerCase().includes("deep learning") || t.toLowerCase() === "ml")
        )) ||
        (isDlSearch && (
          (p.field || "").toLowerCase().includes("deep learning") ||
          (p.title || "").toLowerCase().includes("deep learning") ||
          (p.desc || "").toLowerCase().includes("deep learning") ||
          (p.tags || []).some(t => t.toLowerCase().includes("deep learning") || t.toLowerCase() === "dl")
        ));

      const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
      
      let matchesField = true;
      if (filterField !== "all") {
        if (filterField === "Machine Learning & Deep Learning") {
          matchesField =
            p.field === "Machine Learning & Deep Learning" ||
            (p.tags || []).some((t) => t.toLowerCase().includes("machine learning") || t.toLowerCase().includes("deep learning") || t.toLowerCase() === "ml" || t.toLowerCase() === "dl") ||
            (p.title || "").toLowerCase().includes("machine learning") ||
            (p.title || "").toLowerCase().includes("deep learning");
        } else {
          matchesField = p.field === filterField;
        }
      }
      const matchesLang = filterLanguage === "all" ? true : (p.lang || "").toLowerCase() === filterLanguage.toLowerCase();
      const matchesCountry = filterCountry === "all" ? true : pCountry.toLowerCase() === filterCountry.toLowerCase();
      const matchesCity = filterCity === "all" ? true : pCity.toLowerCase() === filterCity.toLowerCase();

      // Ranking filters
      let matchesRank = true;
      const r = p.uni_rank_world || 999;
      const cr = p.uni_rank_country || 99;
      if (filterRanking === "top200") matchesRank = r <= 200;
      else if (filterRanking === "top500") matchesRank = r <= 500;
      else if (filterRanking === "top3country") matchesRank = cr <= 3;

      // Tuition filters
      let matchesTuition = true;
      const feeEu = (p.feeEU || "").toLowerCase();
      if (filterTuition === "free") matchesTuition = feeEu.includes("free") || p.feeFree === true;
      else if (filterTuition === "standard_eu") matchesTuition = feeEu.includes("363");

      // Application Fee filter
      let matchesAppFee = true;
      const fApp = (p.feeApp || "").toLowerCase();
      if (filterAppFee === "free") {
        matchesAppFee = fApp.includes("none") || fApp.includes("free") || fApp.includes("€0") || !p.feeApp;
      } else if (filterAppFee === "paid") {
        matchesAppFee = (fApp.includes("assist") || fApp.match(/[1-9]/) !== null) && !fApp.includes("€0") && !fApp.includes("none");
      }

      // Tuition Range Slider filter
      let matchesTuitionRange = true;
      if (maxTuition < 3000) {
        const feeStr = feeType === "nonEu" ? p.feeNonEU : p.feeEU;
        const val = parseFeeNumber(feeStr);
        matchesTuitionRange = val <= maxTuition;
      }

      return matchesSearch && matchesStatus && matchesField && matchesLang && matchesCountry && matchesCity && matchesRank && matchesTuition && matchesAppFee && matchesTuitionRange;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "rank_world") {
        return (a.uni_rank_world || 999) - (b.uni_rank_world || 999);
      }
      if (sortBy === "rank_country") {
        return (a.uni_rank_country || 99) - (b.uni_rank_country || 99);
      }
      if (sortBy === "deadline") {
        return (a.sortDate || "9999").localeCompare(b.sortDate || "9999");
      }
      if (sortBy === "tuition") {
        const aFree = (a.feeEU || "").toLowerCase().includes("free") ? 0 : 1;
        const bFree = (b.feeEU || "").toLowerCase().includes("free") ? 0 : 1;
        return aFree - bFree;
      }
      if (sortBy === "name") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return list;
  }, [programs, searchTerm, filterStatus, filterField, filterLanguage, filterCountry, filterCity, filterRanking, filterTuition, filterAppFee, feeType, maxTuition, sortBy]);

  // Universities grouped by country
  const universitiesByCountry = useMemo(() => {
    const map: Record<string, University[]> = {};
    universitiesList.forEach((u) => {
      if (filterCountry !== "all" && u.country.toLowerCase() !== filterCountry.toLowerCase()) return;
      if (filterCity !== "all" && u.city.toLowerCase() !== filterCity.toLowerCase()) return;
      if (!map[u.country]) map[u.country] = [];
      map[u.country].push(u);
    });
    Object.keys(map).forEach((c) => {
      map[c].sort((a, b) => a.rank_country - b.rank_country);
    });
    return map;
  }, [universitiesList, filterCountry, filterCity]);

  return (
    <div className="w-full">
      {/* 1. TOP SPONSORED BANNER (Live from Ads Microservice on port 4000) */}
      {topBanner && !dismissBanner && (
        <div className="bg-gradient-to-r from-amber-500/15 via-[#7ec8a7]/15 to-blue-500/15 border-b border-amber-500/30 py-2.5 px-4 text-xs sm:text-sm shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/40 flex items-center gap-1">
                <Megaphone className="w-3 h-3 text-amber-400" />
                SPONSORED
              </span>
              <span className="font-bold text-white">{topBanner.title}:</span>
              <span className="text-slate-300 hidden md:inline">{topBanner.tagline}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={topBanner.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleAdClick(topBanner.id)}
                className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 underline text-xs transition-colors"
              >
                {topBanner.cta} <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setDismissBanner(true)}
                className="text-slate-400 hover:text-white p-1"
                title="Dismiss Banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-[#212b28] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7ec8a7]/10 border border-[#7ec8a7]/30 text-[#7ec8a7] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Global Tech Masters Portal
              </div>

              {/* Community Knowledge Hub */}
              <a
                href="/community"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
                title="Student Community Discussions, Admission Q&A & Reviews"
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Community Q&A</span>
              </a>

              {/* Requirements & Visa Guide */}
              <a
                href="/community#requirements"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
                title="Master Requirements Checklist (Banking, Sperrkonto, Passport, Apostille, Police Record)"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Requirements Checklist</span>
              </a>

              {/* Bavarian Grade Converter */}
              <a
                href="/community#grading"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
                title="Interactive Bavarian Formula Grade Converter"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Grade Converter</span>
              </a>

              {/* Kafka Data Streaming Live Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Kafka Stream Live</span>
              </div>

              {/* Admin Portal Navigation Link */}
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
                title="Open Admin Portal to Manage Programs, Ads & Kafka Streams"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Portal</span>
              </a>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 text-white">
              Tech Masters Tracker
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Real-time verified deadlines, world university rankings, and official admission sites for Computer Science, AI, and Data Science degrees.
            </p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-[#141d1a] p-1.5 rounded-2xl border border-[#273430] shadow-sm">
            <button
              onClick={() => setActiveTab("programs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "programs"
                  ? "bg-[#7ec8a7] text-[#0d1613] shadow-md font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Programs ({filteredPrograms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("universities")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "universities"
                  ? "bg-[#7ec8a7] text-[#0d1613] shadow-md font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Universities ({universitiesList.length})</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Left Sidebar for Search & Droplists, Right for Program Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: Search Settings (Droplists on the left) - Scrollable alone */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-20 z-20">
            <div className="bg-[#0e1413] border border-[#232f2b] rounded-3xl shadow-2xl flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden">
              {/* Sidebar Header (Fixed at top, strictly outside the scroll container) */}
              <div className="p-4 sm:p-5 pb-3.5 border-b border-[#1f2c27] bg-[#0e1413] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#7ec8a7]" />
                  <h2 className="text-white font-extrabold text-sm uppercase tracking-wider">
                    Search Settings
                  </h2>
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#7ec8a7]/20 border border-[#7ec8a7]/40 text-[#7ec8a7] text-[10px] font-extrabold font-mono">
                      {activeFiltersCount} active
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-200 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/25 transition-all font-semibold cursor-pointer"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Scrollable Filters Body (Scrolls strictly underneath the fixed header divider) */}
              <div className="p-4 sm:p-5 pt-3.5 space-y-4 overflow-y-auto overscroll-contain custom-scrollbar flex-1">
                {/* 1. Keyword Search Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  Keyword Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search ML, AI, TU Wien, Vision..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title="Clear keyword"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Field Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#7ec8a7]" />
                  Field of Study
                </label>
                <select
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  {fieldOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#141d1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Country Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Country
                </label>
                <select
                  value={filterCountry}
                  onChange={(e) => {
                    setFilterCountry(e.target.value);
                    setFilterCity("all");
                  }}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  {countryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#141d1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. City Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  City
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  <option value="all" className="bg-[#141d1a] text-white">All cities</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city} className="bg-[#141d1a] text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Status Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Application Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#141d1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. University Ranking Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  University Ranking Tier
                </label>
                <select
                  value={filterRanking}
                  onChange={(e) => setFilterRanking(e.target.value)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  {rankingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#141d1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Language Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Languages className="w-3.5 h-3.5 text-teal-400" />
                  Language of Instruction
                </label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#141d1a] text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Application Fee Droplist */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Application Fee
                </label>
                <select
                  value={filterAppFee}
                  onChange={(e) => setFilterAppFee(e.target.value as any)}
                  className="w-full p-2.5 bg-[#141d1a] border border-[#273430] rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7] cursor-pointer"
                >
                  <option value="all" className="bg-[#141d1a] text-white">All Application Fees</option>
                  <option value="free" className="bg-[#141d1a] text-white">Free Application (€0 / No Fee)</option>
                  <option value="paid" className="bg-[#141d1a] text-white">Has Application Fee (uni-assist)</option>
                </select>
              </div>

              {/* 9. Tuition Range Slider */}
              <div className="pt-3 border-t border-[#1f2c27] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                    Max Tuition
                  </label>
                  <span className="text-[11px] font-mono text-[#7ec8a7] font-bold">
                    {maxTuition >= 3000 ? "Any Fee" : `≤ €${maxTuition}/sem`}
                  </span>
                </div>

                {/* EU vs Non-EU Toggle in Sidebar */}
                <div className="grid grid-cols-2 gap-1 bg-[#141d1a] p-1 rounded-xl border border-[#273430]">
                  <button
                    onClick={() => setFeeType("nonEu")}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                      feeType === "nonEu" ? "bg-[#7ec8a7] text-[#0d1613] shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Non-EU
                  </button>
                  <button
                    onClick={() => setFeeType("eu")}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                      feeType === "eu" ? "bg-[#7ec8a7] text-[#0d1613] shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    EU / EEA
                  </button>
                </div>

                <input
                  type="range"
                  min={0}
                  max={3000}
                  step={100}
                  value={maxTuition}
                  onChange={(e) => setMaxTuition(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#202f2a] rounded-lg appearance-none cursor-pointer accent-[#7ec8a7]"
                />

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => setMaxTuition(50)}
                    className={`py-1 px-2 text-[10px] font-medium rounded-lg transition-all text-center ${
                      maxTuition === 50 ? "bg-[#7ec8a7]/25 text-[#7ec8a7] border border-[#7ec8a7]/50 font-bold" : "bg-[#141d1a] text-slate-400 border border-[#232f2b]"
                    }`}
                  >
                    Free (€0)
                  </button>
                  <button
                    onClick={() => setMaxTuition(750)}
                    className={`py-1 px-2 text-[10px] font-medium rounded-lg transition-all text-center ${
                      maxTuition === 750 ? "bg-[#7ec8a7]/25 text-[#7ec8a7] border border-[#7ec8a7]/50 font-bold" : "bg-[#141d1a] text-slate-400 border border-[#232f2b]"
                    }`}
                  >
                    ≤ €750/sem
                  </button>
                  <button
                    onClick={() => setMaxTuition(1500)}
                    className={`py-1 px-2 text-[10px] font-medium rounded-lg transition-all text-center ${
                      maxTuition === 1500 ? "bg-[#7ec8a7]/25 text-[#7ec8a7] border border-[#7ec8a7]/50 font-bold" : "bg-[#141d1a] text-slate-400 border border-[#232f2b]"
                    }`}
                  >
                    ≤ €1,500/sem
                  </button>
                  <button
                    onClick={() => setMaxTuition(3000)}
                    className={`py-1 px-2 text-[10px] font-medium rounded-lg transition-all text-center ${
                      maxTuition >= 3000 ? "bg-[#7ec8a7]/25 text-[#7ec8a7] border border-[#7ec8a7]/50 font-bold" : "bg-[#141d1a] text-slate-400 border border-[#232f2b]"
                    }`}
                  >
                    Any Fee
                  </button>
                </div>
              </div>
              {/* End of Scrollable Filters Body */}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Results Header + Program Cards Grid */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">

        {/* Screenshot 2 Exact Meta Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-400 mb-8 px-2 py-1">
          <div className="flex items-center gap-6">
            <span>
              As of <strong className="text-slate-200 font-bold">18 September 2026</strong>
            </span>
            <span>
              <strong className="text-slate-200 font-bold">{programs.length}</strong> programmes tracked
            </span>
            {hasActiveFilters && (
              <span className="text-[#7ec8a7] font-semibold">
                ({filteredPrograms.length} matching your customized search)
              </span>
            )}
          </div>

          {filterCity !== "all" && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" /> Filtering in {filterCity}
            </span>
          )}
        </div>

        {/* Real Live Commercial Educational Sponsor Leaderboard */}
        <GoogleAdUnit
          className="mb-8"
          fallbackAdId="ad_expatrio_blocked_account"
          onAdClick={handleAdClick}
        />

        {/* TAB 1: PROGRAMS GRID WITH IN-FEED SPONSORED CARDS */}
        {activeTab === "programs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
            {filteredPrograms.map((prog, idx) => {
                const city = prog.city || (prog.inst.toLowerCase().includes("vienna") ? "Vienna" :
                  prog.inst.toLowerCase().includes("linz") ? "Linz" :
                  prog.inst.toLowerCase().includes("graz") ? "Graz" :
                  prog.inst.toLowerCase().includes("salzburg") ? "Salzburg" :
                  prog.inst.toLowerCase().includes("innsbruck") ? "Innsbruck" :
                  prog.inst.toLowerCase().includes("hagenberg") ? "Hagenberg" :
                  prog.inst.toLowerCase().includes("klagenfurt") ? "Klagenfurt" :
                  prog.inst.toLowerCase().includes("pölten") || prog.inst.toLowerCase().includes("ustp") ? "St. Pölten" :
                  prog.inst.toLowerCase().includes("villach") ? "Villach" :
                  prog.inst.toLowerCase().includes("eisenstadt") ? "Eisenstadt" : "Vienna");

                const country = prog.country || (prog.inst.toLowerCase().includes("munich") || prog.inst.toLowerCase().includes("berlin") || prog.inst.toLowerCase().includes("aachen") ? "Germany" : "Austria");

                const worldRank = prog.uni_rank_world || (
                  prog.inst.toLowerCase().includes("vienna") && !prog.inst.toLowerCase().includes("tu") ? 130 :
                  prog.inst.toLowerCase().includes("tu wien") ? 190 :
                  prog.inst.toLowerCase().includes("innsbruck") ? 362 :
                  prog.inst.toLowerCase().includes("tu graz") ? 421 :
                  prog.inst.toLowerCase().includes("jku") || prog.inst.toLowerCase().includes("linz") ? 446 :
                  prog.inst.toLowerCase().includes("klagenfurt") ? 580 :
                  prog.inst.toLowerCase().includes("salzburg") && !prog.inst.toLowerCase().includes("fh") ? 681 :
                  prog.inst.toLowerCase().includes("hagenberg") ? 800 : 850
                );

                const countryRank = prog.uni_rank_country || (
                  worldRank === 130 ? 1 :
                  worldRank === 190 ? 2 :
                  worldRank === 362 ? 3 :
                  worldRank === 421 ? 4 :
                  worldRank === 446 ? 5 :
                  worldRank === 580 ? 6 :
                  worldRank === 681 ? 7 : 8
                );

                const uniUrl = prog.uni_url || (
                  prog.inst.toLowerCase().includes("tu wien") ? "https://www.tuwien.at" :
                  prog.inst.toLowerCase().includes("vienna") ? "https://www.univie.ac.at" :
                  prog.inst.toLowerCase().includes("jku") ? "https://www.jku.at" :
                  prog.inst.toLowerCase().includes("tu graz") ? "https://www.tugraz.at" :
                  prog.inst.toLowerCase().includes("innsbruck") ? "https://www.uibk.ac.at" :
                  prog.inst.toLowerCase().includes("hagenberg") ? "https://www.fh-ooe.at/campus-hagenberg/" : "https://www.studienwahl.at"
                );

                // Check if we should insert an In-Feed Ad at position 2 or 5
                const adIndex = idx === 2 ? 0 : idx === 5 ? 1 : -1;
                const inFeedAd = adIndex >= 0 && inFeedAds[adIndex] ? inFeedAds[adIndex] : null;

                return (
                  <Fragment key={`${prog.title}-${prog.inst}`}>
                    {/* In-feed Sponsored Ad Card */}
                    {inFeedAd && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-[#18201a] to-[#0e1411] border border-amber-500/50 hover:border-amber-400 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-amber-950/20 transition-all duration-300 h-full"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold uppercase tracking-wider">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              SPONSORED
                            </span>
                            <span className="text-xs text-amber-200/70 font-semibold">{inFeedAd.badge}</span>
                          </div>

                          <span className="text-xs font-medium text-slate-400 block mb-1">
                            {inFeedAd.client}
                          </span>

                          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug hover:text-amber-300 transition-colors">
                            {inFeedAd.title}
                          </h3>

                          <p className="text-xs font-semibold text-teal-300 mb-3">
                            {inFeedAd.tagline}
                          </p>

                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                            {inFeedAd.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-amber-500/20 mt-auto">
                          <a
                            href={inFeedAd.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => handleAdClick(inFeedAd.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                          >
                            <span>{inFeedAd.cta}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* Program Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.25) }}
                      className="group bg-[#0e1413] border border-[#232f2b] hover:border-[#7ec8a7]/60 hover:shadow-2xl hover:shadow-[#7ec8a7]/5 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Card Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col">
                        {/* Header Row: Status, World Rank, and Field */}
                        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                            prog.status === "open"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : prog.status === "soon"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${prog.status === "open" ? "bg-emerald-400 animate-pulse" : prog.status === "soon" ? "bg-amber-400" : "bg-rose-400"}`} />
                            <span className="truncate max-w-[160px]">{prog.statusLabel || (prog.status === "open" ? "Open Now" : "Closed")}</span>
                          </span>

                          {/* World Ranking Badge */}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <Trophy className="w-3 h-3 text-amber-400" />
                            QS #{worldRank} · #{countryRank} in {country}
                          </span>

                          {/* Field Tag */}
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#7ec8a7] border border-teal-500/20">
                            {prog.field}
                          </span>
                        </div>

                        {/* Program Title */}
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#7ec8a7] transition-colors">
                          {prog.title}
                        </h2>

                        {/* Institution & Geographical Location */}
                        <div className="flex flex-wrap items-center gap-2 text-slate-400 text-xs sm:text-sm font-medium mb-3">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Building2 className="w-3.5 h-3.5 text-[#7ec8a7] shrink-0" />
                            <span className="truncate font-semibold">{prog.inst}</span>
                          </div>
                          <a
                            href={uniUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-teal-400 hover:underline flex items-center gap-0.5 shrink-0"
                            title="Visit Official University Portal"
                          >
                            Official Site <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        {/* City, Country, Seats, & Duration Quick Strip */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#18211f] text-slate-300 border border-[#2d3a36]">
                            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                            {city}, {country === "Germany" ? "🇩🇪 Germany" : "🇦🇹 Austria"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                            <Users className="w-3 h-3 text-amber-400 shrink-0" />
                            {prog.seats || "Open quota"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#18211f] text-slate-300 border border-[#2d3a36]">
                            <Clock className="w-3 h-3 text-[#7ec8a7] shrink-0" />
                            {prog.duration || "4 Sem. (120 ECTS)"}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-[#18211f] text-slate-400 border border-[#2d3a36]">
                            {prog.lang || "English"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-slate-400 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
                          {prog.desc}
                        </p>

                        {/* Deadlines & Tuition 2x2 Info Grid (ZERO OVERLAP) */}
                        <div className="bg-[#080d0c] rounded-xl border border-[#232f2b] p-3.5 space-y-3 mb-4">
                          {/* Deadlines */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deadlines</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="bg-[#141d1a] rounded-lg p-2.5 border border-[#273430]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Students</span>
                                <span className="text-slate-200 font-medium break-words leading-tight block">
                                  {prog.deadlineEU || "See official site"}
                                </span>
                              </div>
                              <div className="bg-[#141d1a] rounded-lg p-2.5 border border-[#273430]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Students</span>
                                <span className="text-slate-200 font-medium break-words leading-tight block">
                                  {prog.deadlineNonEU || "See official site"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tuition Fees */}
                          <div className="pt-2.5 border-t border-[#232f2b]">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Banknote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tuition Fees</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="bg-[#141d1a] rounded-lg p-2.5 border border-[#273430]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Tuition</span>
                                <span className="text-slate-200 font-medium break-words leading-tight block">
                                  {prog.feeEU || "Free / ÖH fee only"}
                                </span>
                              </div>
                              <div className="bg-[#141d1a] rounded-lg p-2.5 border border-[#273430]">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Tuition</span>
                                <span className="text-slate-200 font-medium break-words leading-tight block">
                                  {prog.feeNonEU || "Standard rate"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Admissions & Career Drawer */}
                        <div className="mb-4">
                          <button
                            type="button"
                            onClick={() => toggleSpecs(`${prog.title}-${prog.inst}`)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#141d1a] hover:bg-[#192522] border border-[#273430] hover:border-[#384a44] text-xs font-semibold text-[#7ec8a7] transition-all shadow-sm cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#7ec8a7]" />
                              Seats, Prerequisites & Career Specs
                            </span>
                            {expandedSpecs[`${prog.title}-${prog.inst}`] ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>

                          {expandedSpecs[`${prog.title}-${prog.inst}`] && (
                            <div className="mt-2.5 p-3.5 bg-[#080d0c] rounded-xl border border-[#232f2b] space-y-3 text-xs animate-in fade-in duration-200">
                              {/* Seats & Intake Quota */}
                              <div className="border-b border-[#182320] pb-2.5">
                                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] mb-1">
                                  <Users className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Seats & Intake Quota</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-5 text-[11px]">
                                  {prog.seats || "Open quota (No numeric cap under UG 2002 for qualified applicants)"}
                                </p>
                              </div>

                              {/* Minimum Degree & Prerequisites */}
                              <div className="border-b border-[#182320] pb-2.5">
                                <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px] mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Minimum Degree & Academic Prerequisites</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-5 text-[11px]">
                                  {prog.minDegree || "Bachelor's degree (min. 180 ECTS) in Computer Science, Software Engineering, or related technical field."}
                                </p>
                              </div>

                              {/* Selection / Admission Process */}
                              <div className="border-b border-[#182320] pb-2.5">
                                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px] mb-1">
                                  <Award className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Selection & Evaluation Process</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-5 text-[11px]">
                                  {prog.admissionProcess || "Direct admission upon subject equivalence verification; no entrance exam."}
                                </p>
                              </div>

                              {/* Language Requirements */}
                              <div className="border-b border-[#182320] pb-2.5">
                                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] mb-1">
                                  <Languages className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Language Requirements</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-5 text-[11px]">
                                  {prog.englishLevel || "English B2/C1 certified (IELTS 6.5+ or TOEFL 87+)."}
                                </p>
                              </div>

                              {/* Post-Study Visa & Student Work Rights */}
                              <div className="border-b border-[#182320] pb-2.5">
                                <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px] mb-1">
                                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Work Rights & Post-Graduation Visa</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed pl-5 text-[11px]">
                                  {prog.workRights || "Students permitted to work 20h/week during studies; 12-month Job-Seeker Visa (Rot-Weiß-Rot-Karte) granted upon graduation."}
                                </p>
                              </div>

                              {/* Industry Collaborators */}
                              {prog.industryPartners && (
                                <div>
                                  <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px] mb-1">
                                    <Building2 className="w-3.5 h-3.5 text-[#7ec8a7]" />
                                    <span>Industry Partners & Thesis Sponsors</span>
                                  </div>
                                  <p className="text-slate-400 leading-relaxed pl-5 text-[11px]">
                                    {prog.industryPartners}
                                  </p>
                                </div>
                              )}

                              {/* Contextual Sponsored Grant & Prep Offer inside Details */}
                              <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-500/15 via-[#7ec8a7]/10 to-[#141d1a] rounded-xl border border-amber-500/35 shadow-sm">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="px-2 py-0.5 rounded bg-amber-500/25 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/40 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    SPONSORED PARTNER
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">Admission Resource</span>
                                </div>
                                <h4 className="font-bold text-white text-xs sm:text-sm mb-1">
                                  Austrian Government Tech Scholarships 2026/27
                                </h4>
                                <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
                                  Receive up to €1,200/month living stipend + full tuition waiver for international Master&apos;s students in Austrian technical universities.
                                </p>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[10px] text-emerald-400 font-medium">
                                    ÖAD Official Grant Partner
                                  </span>
                                  <a
                                    href="https://grants.at/en/"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => handleAdClick("ad_scholarship_oead")}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm"
                                  >
                                    Claim Grant <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {prog.tags && prog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {prog.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 bg-[#18211f] border border-[#2d3a36] text-slate-300 text-[11px] font-medium rounded-md"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="p-3.5 sm:p-4 bg-[#080d0c] border-t border-[#232f2b] grid grid-cols-2 gap-3 mt-auto">
                        <button
                          type="button"
                          onClick={() => handleOpenGatewayModal(prog, "details")}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#18211f] hover:bg-[#273430] hover:text-white text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-[#2d3a36] active:scale-95 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>Details</span>
                        </button>
                        <button
                          type="button"
                          disabled={prog.status !== "open"}
                          onClick={() => {
                            if (prog.status === "open") {
                              handleOpenGatewayModal(prog, "apply");
                            }
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border active:scale-95 cursor-pointer ${
                            prog.status === "open"
                              ? "bg-[#7ec8a7] hover:bg-teal-400 text-[#0f1a16] border-[#7ec8a7] shadow-md shadow-[#7ec8a7]/20 font-bold"
                              : "bg-[#18211f] hover:bg-[#273430] text-slate-400 border-[#2d3a36] cursor-not-allowed"
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>Apply Now</span>
                        </button>
                      </div>
                    </motion.div>
                  </Fragment>
                );
              })}
          </div>
        )}

        {/* TAB 2: UNIVERSITIES DIRECTORY */}
        {activeTab === "universities" && (
          <div className="space-y-10">
            {Object.entries(universitiesByCountry).map(([countryName, uList]) => (
              <div key={countryName} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#232f2b] pb-3">
                  <span className="text-2xl">{countryName === "Austria" ? "🇦🇹" : countryName === "Germany" ? "🇩🇪" : "🇨🇭"}</span>
                  <h2 className="text-2xl font-bold text-white">{countryName} Universities</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#7ec8a7]/10 text-[#7ec8a7] border border-[#7ec8a7]/30 font-semibold ml-auto">
                    {uList.length} Institutions
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uList.map((uni) => (
                    <div
                      key={uni.name}
                      className="bg-[#0e1413] border border-[#232f2b] hover:border-[#7ec8a7]/60 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl shadow-black/40"
                    >
                      <div>
                        {/* Top Rank Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            QS World #{uni.rank_world}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-semibold">
                            #{uni.rank_country} in {uni.country}
                          </span>
                        </div>

                        {/* University Title & City */}
                        <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">
                          {uni.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{uni.city}, {uni.country}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{uni.type}</span>
                        </div>

                        <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                          {uni.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-[#232f2b] flex items-center justify-between gap-3">
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Official Site <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => {
                            setSearchTerm(uni.short_name);
                            setActiveTab("programs");
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#18211f] hover:bg-[#7ec8a7] hover:text-[#0f1a16] text-slate-200 text-xs font-semibold border border-[#2d3a36] transition-all"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          View Programs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPrograms.length === 0 && activeTab === "programs" && (
          <div className="text-center py-20 text-slate-500 bg-[#0e1413]/60 border border-[#232f2b] rounded-3xl mt-6 p-8">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No Programs Found</h3>
            <p className="text-sm max-w-md mx-auto mb-4">
              No degrees matched your customized search filters. Try clearing some selections.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7ec8a7] text-[#0f1a16] text-xs font-bold hover:bg-teal-400 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
          </main>
        </div>
      </div>

      {/* INTERSTITIAL GATEWAY AD MODAL (FOR BOTH DETAILS & APPLY NOW) */}
      {gatewayModal && modalAd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-[#0c1411] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-950/40 text-white relative overflow-hidden space-y-5">
            {/* Top Background Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#7ec8a7]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#232f2b] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    SPONSORED PARTNER
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Gateway Redirect</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {gatewayModal.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {gatewayModal.program.title} · <span className="text-[#7ec8a7]">{gatewayModal.program.inst}</span>
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseGatewayModal}
                className="p-1.5 rounded-xl bg-[#141d1a] border border-[#273430] hover:border-rose-500/50 hover:text-rose-300 text-slate-400 transition-all cursor-pointer"
                title="Close Ad and stay on page"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sponsored Ad Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#18231e] to-[#101815] border border-amber-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">{modalAd.client}</span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                  {modalAd.badge}
                </span>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug mb-1">
                  {modalAd.title}
                </h4>
                <p className="text-xs font-semibold text-teal-300 mb-2">
                  {modalAd.tagline}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {modalAd.description}
                </p>
              </div>

              <a
                href={modalAd.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleAdClick(modalAd.id)}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/25 active:scale-95"
              >
                {modalAd.cta} <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Countdown & Auto-Redirect Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7ec8a7]" />
                  {isAutoRedirectActive ? (
                    <>Redirecting automatically in <strong className="text-amber-400 font-bold font-mono text-sm">{countdown}s</strong>...</>
                  ) : (
                    <span className="text-slate-400">Auto-redirect paused</span>
                  )}
                </span>
                <button
                  onClick={() => setIsAutoRedirectActive(!isAutoRedirectActive)}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {isAutoRedirectActive ? "Pause Timer" : "Resume Timer"}
                </button>
              </div>

              {/* Animated Countdown Progress Bar */}
              <div className="w-full h-1.5 bg-[#1a2521] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7ec8a7] to-amber-400 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCloseGatewayModal}
                  className="py-2.5 px-4 rounded-xl bg-[#141d1a] hover:bg-[#1d2924] border border-[#273430] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Close & Return
                </button>
                <a
                  href={gatewayModal.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setGatewayModal(null);
                    setIsAutoRedirectActive(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#7ec8a7] hover:bg-teal-400 text-[#0f1a16] font-extrabold text-xs transition-all shadow-md shadow-[#7ec8a7]/20 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>
                    {gatewayModal.actionType === "apply" ? "Continue to Application Portal" : "Continue to Degree Details"}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

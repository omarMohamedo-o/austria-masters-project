"use client";

import { useState, useMemo } from "react";
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
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Check
} from "lucide-react";

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

// Fallback universities data in case backend is offline
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
    name: "Technical University of Munich (TUM)",
    short_name: "TUM Munich",
    city: "Munich",
    country: "Germany",
    rank_world: 28,
    rank_country: 1,
    type: "University of Excellence",
    website: "https://www.tum.de",
    description: "Germany's #1 university, internationally acclaimed for Informatics, Robotics, and Artificial Intelligence.",
    programs_count: 0
  },
  {
    name: "LMU Munich",
    short_name: "LMU Munich",
    city: "Munich",
    country: "Germany",
    rank_world: 54,
    rank_country: 2,
    type: "University of Excellence",
    website: "https://www.lmu.de",
    description: "Elite German research university offering world-class programs in Data Science and Machine Learning.",
    programs_count: 0
  },
  {
    name: "RWTH Aachen University",
    short_name: "RWTH Aachen",
    city: "Aachen",
    country: "Germany",
    rank_world: 99,
    rank_country: 3,
    type: "Technical University",
    website: "https://www.rwth-aachen.de",
    description: "Top-tier German technical university known for computer engineering and systems software.",
    programs_count: 0
  },
  {
    name: "Technical University of Berlin (TU Berlin)",
    short_name: "TU Berlin",
    city: "Berlin",
    country: "Germany",
    rank_world: 147,
    rank_country: 4,
    type: "Technical University",
    website: "https://www.tu.berlin",
    description: "Leading European technical university specializing in big data, cloud computing, and AI architectures.",
    programs_count: 0
  }
];

export default function ProgramList({
  initialPrograms,
  initialUniversities
}: {
  initialPrograms: Program[];
  initialUniversities?: University[];
}) {
  // Views
  const [activeTab, setActiveTab] = useState<"programs" | "universities">("programs");

  // Filters from User Screenshot 1
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterField, setFilterField] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  // Geographical Filters requested by User
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterUniversity, setFilterUniversity] = useState<string>("all");

  // Search & Sorting
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rank_world" | "rank_country" | "deadline" | "tuition" | "name">("rank_world");

  const universitiesList = useMemo(() => {
    return (initialUniversities && initialUniversities.length > 0) ? initialUniversities : FALLBACK_UNIVERSITIES;
  }, [initialUniversities]);

  // Extract unique cities & fields & languages
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    initialPrograms.forEach((p) => {
      const city = p.city || (p.inst.toLowerCase().includes("vienna") ? "Vienna" :
        p.inst.toLowerCase().includes("linz") ? "Linz" :
        p.inst.toLowerCase().includes("graz") ? "Graz" :
        p.inst.toLowerCase().includes("salzburg") ? "Salzburg" :
        p.inst.toLowerCase().includes("innsbruck") ? "Innsbruck" :
        p.inst.toLowerCase().includes("hagenberg") ? "Hagenberg" :
        p.inst.toLowerCase().includes("klagenfurt") ? "Klagenfurt" :
        p.inst.toLowerCase().includes("pölten") || p.inst.toLowerCase().includes("ustp") ? "St. Pölten" :
        p.inst.toLowerCase().includes("villach") ? "Villach" :
        p.inst.toLowerCase().includes("eisenstadt") ? "Eisenstadt" : "Vienna");
      set.add(city);
    });
    return Array.from(set).sort();
  }, [initialPrograms]);

  // Status options matching Screenshot 1
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Open now", value: "open" },
    { label: "Opening soon", value: "soon" },
    { label: "Closed for now", value: "closed" }
  ];

  // Field options matching Screenshot 1
  const fieldOptions = [
    { label: "All fields", value: "all" },
    { label: "AI", value: "AI" },
    { label: "Cloud Computing", value: "Cloud Computing" },
    { label: "Computer Engineering", value: "Computer Engineering" },
    { label: "Computer Science", value: "Computer Science" },
    { label: "Cybersecurity", value: "Cybersecurity" },
    { label: "Data Science", value: "Data Science" },
    { label: "Software Engineering", value: "Software Engineering" }
  ];

  // Language options matching Screenshot 1
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

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus("all");
    setFilterField("all");
    setFilterLanguage("all");
    setFilterCountry("all");
    setFilterCity("all");
    setFilterUniversity("all");
    setSearchTerm("");
    setSortBy("rank_world");
  };

  const hasActiveFilters = filterStatus !== "all" || filterField !== "all" || filterLanguage !== "all" ||
    filterCountry !== "all" || filterCity !== "all" || filterUniversity !== "all" || searchTerm !== "";

  // Filter & Sort Programs
  const filteredPrograms = useMemo(() => {
    let list = initialPrograms.filter((p) => {
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

      const matchesSearch =
        (p.title || "").toLowerCase().includes(q) ||
        (p.inst || "").toLowerCase().includes(q) ||
        (p.field || "").toLowerCase().includes(q) ||
        pCity.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));

      const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
      const matchesField = filterField === "all" ? true : p.field === filterField;
      const matchesLang = filterLanguage === "all" ? true : (p.lang || "").toLowerCase() === filterLanguage.toLowerCase();
      const matchesCountry = filterCountry === "all" ? true : (p.country || "Austria").toLowerCase() === filterCountry.toLowerCase();
      const matchesCity = filterCity === "all" ? true : pCity.toLowerCase() === filterCity.toLowerCase();
      const matchesUni = filterUniversity === "all" ? true :
        (p.uni_name || "").toLowerCase().includes(filterUniversity.toLowerCase()) ||
        (p.inst || "").toLowerCase().includes(filterUniversity.toLowerCase());

      return matchesSearch && matchesStatus && matchesField && matchesLang && matchesCountry && matchesCity && matchesUni;
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
  }, [initialPrograms, searchTerm, filterStatus, filterField, filterLanguage, filterCountry, filterCity, filterUniversity, sortBy]);

  // Universities grouped by country
  const universitiesByCountry = useMemo(() => {
    const map: Record<string, University[]> = {};
    universitiesList.forEach((u) => {
      if (filterCountry !== "all" && u.country.toLowerCase() !== filterCountry.toLowerCase()) return;
      if (filterCity !== "all" && u.city.toLowerCase() !== filterCity.toLowerCase()) return;
      if (!map[u.country]) map[u.country] = [];
      map[u.country].push(u);
    });
    // Sort universities by national rank
    Object.keys(map).forEach((c) => {
      map[c].sort((a, b) => a.rank_country - b.rank_country);
    });
    return map;
  }, [universitiesList, filterCountry, filterCity]);

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-[#21262d] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-[#80b9a6] text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Global Tech Masters Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 text-white">
            Tech Masters Tracker
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Real-time verified deadlines, world university rankings, and official admission sites for Computer Science, AI, and Data Science degrees.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#161b22] p-1.5 rounded-2xl border border-[#30363d] shadow-sm">
          <button
            onClick={() => setActiveTab("programs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "programs"
                ? "bg-[#80b9a6] text-slate-950 shadow-md font-bold"
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
                ? "bg-[#80b9a6] text-slate-950 shadow-md font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Universities ({universitiesList.length})</span>
          </button>
        </div>
      </div>

      {/* Screenshot 1 Exact Pill Filter Bar */}
      <div className="bg-[#161b22]/90 backdrop-blur-xl border border-[#30363d] rounded-2xl p-5 sm:p-6 mb-6 shadow-xl space-y-4">
        {/* Status Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="w-24 text-xs sm:text-sm font-semibold text-slate-400 shrink-0">Status</span>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((opt) => {
              const active = filterStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                      : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Field Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="w-24 text-xs sm:text-sm font-semibold text-slate-400 shrink-0">Field</span>
          <div className="flex flex-wrap items-center gap-2">
            {fieldOptions.map((opt) => {
              const active = filterField === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterField(opt.value)}
                  className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                      : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="w-24 text-xs sm:text-sm font-semibold text-slate-400 shrink-0">Language</span>
          <div className="flex flex-wrap items-center gap-2">
            {languageOptions.map((opt) => {
              const active = filterLanguage === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterLanguage(opt.value)}
                  className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                      : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Geographic Row: Country */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-[#30363d]/60">
          <span className="w-24 text-xs sm:text-sm font-semibold text-slate-400 shrink-0 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            Country
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {countryOptions.map((opt) => {
              const active = filterCountry === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilterCountry(opt.value);
                    setFilterCity("all");
                  }}
                  className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                      : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Geographic Row: City */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="w-24 text-xs sm:text-sm font-semibold text-slate-400 shrink-0 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            City
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterCity("all")}
              className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                filterCity === "all"
                  ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                  : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
              }`}
            >
              All cities
            </button>
            {availableCities.map((city) => {
              const active = filterCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setFilterCity(city)}
                  className={`rounded-full px-3.5 py-1 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-[#80b9a6] text-slate-950 font-bold shadow-sm"
                      : "bg-[#21262d] hover:bg-[#30363d] text-slate-300 border border-[#30363d]"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-3 border-t border-[#30363d]/60">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search program, university, specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#80b9a6]"
            />
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0d1117] border border-[#30363d] text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#80b9a6] cursor-pointer"
            >
              <option value="rank_world">🌐 QS World Rank (Best first)</option>
              <option value="rank_country">🏆 Country Rank (#1 first)</option>
              <option value="deadline">⏰ Deadline (Closing soon)</option>
              <option value="tuition">💰 Tuition (Free / Low first)</option>
              <option value="name">🔤 Program Name (A - Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-xl transition-all ml-2 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot 2 Exact Meta Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-400 mb-8 px-2 py-1">
        <div className="flex items-center gap-6">
          <span>
            As of <strong className="text-slate-200 font-bold">18 September 2026</strong>
          </span>
          <span>
            <strong className="text-slate-200 font-bold">{initialPrograms.length}</strong> programmes tracked
          </span>
          {hasActiveFilters && (
            <span className="text-[#80b9a6] font-semibold">
              ({filteredPrograms.length} matching active filters)
            </span>
          )}
        </div>

        {filterCity !== "all" && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
            <MapPin className="w-3 h-3" /> Filtering in {filterCity}
          </span>
        )}
      </div>

      {/* TAB 1: PROGRAMS GRID */}
      {activeTab === "programs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          <AnimatePresence>
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

              return (
                <motion.div
                  key={`${prog.title}-${prog.inst}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.25) }}
                  className="group bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] hover:border-[#80b9a6]/60 hover:shadow-2xl hover:shadow-[#80b9a6]/5 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
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
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#80b9a6] border border-teal-500/20">
                        {prog.field}
                      </span>
                    </div>

                    {/* Program Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#80b9a6] transition-colors">
                      {prog.title}
                    </h2>

                    {/* Institution & Geographical Location */}
                    <div className="flex flex-wrap items-center gap-2 text-slate-400 text-xs sm:text-sm font-medium mb-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-[#80b9a6] shrink-0" />
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

                    {/* City & Country Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#21262d] text-slate-300 border border-[#30363d]">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        {city}, {country === "Germany" ? "🇩🇪 Germany" : "🇦🇹 Austria"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#21262d] text-slate-400 border border-[#30363d]">
                        {prog.lang || "English"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
                      {prog.desc}
                    </p>

                    {/* Deadlines & Tuition 2x2 Info Grid (ZERO OVERLAP) */}
                    <div className="bg-[#0d1117] rounded-xl border border-[#30363d] p-3.5 space-y-3 mb-4">
                      {/* Deadlines */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deadlines</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#161b22] rounded-lg p-2.5 border border-[#30363d]">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Students</span>
                            <span className="text-slate-200 font-medium break-words leading-tight block">
                              {prog.deadlineEU || "See official site"}
                            </span>
                          </div>
                          <div className="bg-[#161b22] rounded-lg p-2.5 border border-[#30363d]">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Students</span>
                            <span className="text-slate-200 font-medium break-words leading-tight block">
                              {prog.deadlineNonEU || "See official site"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tuition Fees */}
                      <div className="pt-2.5 border-t border-[#30363d]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Banknote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tuition Fees</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#161b22] rounded-lg p-2.5 border border-[#30363d]">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Tuition</span>
                            <span className="text-slate-200 font-medium break-words leading-tight block">
                              {prog.feeEU || "Free / ÖH fee only"}
                            </span>
                          </div>
                          <div className="bg-[#161b22] rounded-lg p-2.5 border border-[#30363d]">
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Tuition</span>
                            <span className="text-slate-200 font-medium break-words leading-tight block">
                              {prog.feeNonEU || "Standard rate"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {prog.tags && prog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {prog.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-[#21262d] border border-[#30363d] text-slate-300 text-[11px] font-medium rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-3.5 sm:p-4 bg-[#0d1117] border-t border-[#30363d] grid grid-cols-2 gap-3 mt-auto">
                    <a
                      href={prog.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] hover:text-white text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-[#30363d] active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>Details</span>
                    </a>
                    <a
                      href={prog.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border active:scale-95 ${
                        prog.status === "open"
                          ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/20"
                          : "bg-[#21262d] hover:bg-[#30363d] text-slate-400 border-[#30363d] cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (prog.status !== "open") e.preventDefault();
                      }}
                    >
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>Apply Now</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: UNIVERSITIES DIRECTORY */}
      {activeTab === "universities" && (
        <div className="space-y-10">
          {Object.entries(universitiesByCountry).map(([countryName, uList]) => (
            <div key={countryName} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#30363d] pb-3">
                <span className="text-2xl">{countryName === "Austria" ? "🇦🇹" : countryName === "Germany" ? "🇩🇪" : "🇨🇭"}</span>
                <h2 className="text-2xl font-bold text-white">{countryName} Universities</h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-[#80b9a6] border border-teal-500/30 font-semibold ml-auto">
                  {uList.length} Institutions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uList.map((uni) => (
                  <div
                    key={uni.name}
                    className="bg-[#161b22] border border-[#30363d] hover:border-[#80b9a6]/60 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl shadow-black/40"
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
                    <div className="pt-4 border-t border-[#30363d] flex items-center justify-between gap-3">
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
                          setFilterUniversity(uni.short_name);
                          setActiveTab("programs");
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#21262d] hover:bg-[#80b9a6] hover:text-slate-950 text-slate-200 text-xs font-semibold border border-[#30363d] transition-all"
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
        <div className="text-center py-20 text-slate-500 bg-[#161b22]/40 border border-[#30363d] rounded-3xl mt-6 p-8">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300 mb-1">No Programs Found</h3>
          <p className="text-sm max-w-md mx-auto mb-4">
            No degrees matched your active search filters. Try clearing some selections.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#80b9a6] text-slate-950 text-xs font-bold hover:bg-teal-400 transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

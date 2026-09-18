"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Calendar, GraduationCap, MapPin, Banknote, ShieldAlert, Sparkles, Filter } from "lucide-react";

export type Program = {
  id?: string;
  country?: string;
  title: string;
  inst: string;
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

export default function ProgramList({ initialPrograms }: { initialPrograms: Program[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterField, setFilterField] = useState<string>("all");

  const fields = useMemo(() => {
    const set = new Set<string>();
    initialPrograms.forEach((p) => {
      if (p.field) set.add(p.field);
    });
    return Array.from(set);
  }, [initialPrograms]);

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((p) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        (p.title || "").toLowerCase().includes(query) ||
        (p.inst || "").toLowerCase().includes(query) ||
        (p.field || "").toLowerCase().includes(query) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(query));

      const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
      const matchesCountry = filterCountry === "all" ? true : (p.country || "").toLowerCase() === filterCountry.toLowerCase();
      const matchesField = filterField === "all" ? true : p.field === filterField;

      return matchesSearch && matchesStatus && matchesCountry && matchesField;
    });
  }, [initialPrograms, searchTerm, filterStatus, filterCountry, filterField]);

  const getStatusBadge = (status: string, label: string) => {
    switch (status) {
      case "open":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          dot: "bg-emerald-400 animate-pulse",
          text: label || "Open Now"
        };
      case "soon":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
          dot: "bg-amber-400",
          text: label || "Opening Soon"
        };
      case "closed":
        return {
          bg: "bg-rose-500/10 border-rose-500/25 text-rose-300",
          dot: "bg-rose-400",
          text: label || "Closed"
        };
      default:
        return {
          bg: "bg-slate-800/80 border-slate-700 text-slate-300",
          dot: "bg-slate-400",
          text: label || "Check Window"
        };
    }
  };

  const getFieldBadgeStyle = (field: string) => {
    const f = (field || "").toLowerCase();
    if (f.includes("cyber")) {
      return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    }
    if (f.includes("data") || f.includes("ai") || f.includes("intelligence")) {
      return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    }
    return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Global Tech Masters Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
            Tech Masters Tracker
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
            Real-time verified deadlines, tuition costs, and admission portals for premier Master&apos;s programs.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl shadow-inner">
          <div className="text-right">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Available</span>
            <span className="text-lg font-bold text-white">{filteredPrograms.length}</span>
            <span className="text-xs text-slate-400 ml-1">programs</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-5 mb-10 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search title, university, tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm text-slate-200 placeholder-slate-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm text-slate-200 cursor-pointer appearance-none pr-8"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">🟢 Open Now</option>
              <option value="soon">🟡 Opening Soon</option>
              <option value="closed">🔴 Closed for Cycle</option>
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Country Filter */}
          <div className="relative">
            <select
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm text-slate-200 cursor-pointer appearance-none pr-8"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="all">All Countries</option>
              <option value="austria">🇦🇹 Austria</option>
              <option value="germany">🇩🇪 Germany</option>
              <option value="switzerland">🇨🇭 Switzerland</option>
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Field Filter */}
          <div className="relative">
            <select
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/60 text-sm text-slate-200 cursor-pointer appearance-none pr-8"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              <option value="all">All Specializations</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
        <AnimatePresence>
          {filteredPrograms.map((prog, idx) => {
            const badge = getStatusBadge(prog.status, prog.statusLabel);
            const fieldStyle = getFieldBadgeStyle(prog.field);

            return (
              <motion.div
                key={`${prog.title}-${prog.inst}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.25) }}
                className="group bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-md border border-slate-800/90 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
              >
                {/* Main Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Header Row: Status and Field */}
                  <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span className="truncate max-w-[200px]">{badge.text}</span>
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${fieldStyle}`}>
                      {prog.field}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {prog.title}
                  </h2>

                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
                    <MapPin className="w-4 h-4 text-blue-400/80 shrink-0" />
                    <span className="truncate">{prog.inst}</span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 font-medium shrink-0">
                      {prog.country === "Germany" ? "🇩🇪 Germany" : "🇦🇹 Austria"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-xs sm:text-sm mb-5 line-clamp-3 leading-relaxed">
                    {prog.desc}
                  </p>

                  {/* Deadlines & Tuition Structured Info Box - ZERO OVERLAP */}
                  <div className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-3.5 space-y-3 mb-4">
                    {/* Deadlines Section */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deadlines</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Students</span>
                          <span className="text-slate-200 font-medium break-words leading-tight block">
                            {prog.deadlineEU || "See official site"}
                          </span>
                        </div>
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Students</span>
                          <span className="text-slate-200 font-medium break-words leading-tight block">
                            {prog.deadlineNonEU || "See official site"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tuition Fees Section */}
                    <div className="pt-2.5 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Banknote className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tuition Fees</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">EU Tuition</span>
                          <span className="text-slate-200 font-medium break-words leading-tight block">
                            {prog.feeEU || "Free / ÖH fee only"}
                          </span>
                        </div>
                        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Non-EU Tuition</span>
                          <span className="text-slate-200 font-medium break-words leading-tight block">
                            {prog.feeNonEU || "Standard rate"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Row */}
                  {prog.tags && prog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prog.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/50 text-slate-300 text-[11px] font-medium rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-slate-800/90 grid grid-cols-2 gap-3 mt-auto">
                  <a
                    href={prog.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 text-xs sm:text-sm font-medium transition-colors border border-slate-800 active:scale-95"
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
                        : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 border-slate-700/60 cursor-not-allowed"
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

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-slate-900/30 border border-slate-800/60 rounded-3xl mt-6 p-8">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-300 mb-1">No Programs Found</h3>
          <p className="text-sm max-w-md mx-auto">
            Try adjusting your search terms or clearing your filters to see more available degrees.
          </p>
        </div>
      )}
    </div>
  );
}

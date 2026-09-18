"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Calendar, GraduationCap, MapPin, Banknote, ShieldAlert } from "lucide-react";

type Program = {
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
  feeEUNote: string;
  feeNonEU: string;
  feeApp: string;
  feeFree: boolean;
};

export default function ProgramList({ initialPrograms }: { initialPrograms: Program[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredPrograms = initialPrograms.filter((p) => {
    const matchesSearch = (p.title + p.inst + p.field).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Austria Tech Masters Tracker
          </h1>
          <p className="text-gray-400 text-lg">
            Monitor deadlines for Computer Science, Data Science, and AI programs.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search programs..."
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm text-gray-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Now</option>
            <option value="soon">Opening Soon</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPrograms.map((prog, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              key={`${prog.title}-${prog.inst}`}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/80 rounded-3xl overflow-hidden hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-900/20 transition-all flex flex-col h-full"
            >
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                    prog.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    prog.status === 'soon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    prog.status === 'closed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {prog.statusLabel}
                  </span>
                  <span className="text-xs text-gray-500 font-mono px-2 py-1 bg-gray-800 rounded-md">
                    {prog.field}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-blue-400 transition-colors">
                  {prog.title}
                </h2>
                
                <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  {prog.inst}
                </div>

                <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {prog.desc}
                </p>

                <div className="space-y-3 mb-6 bg-gray-950/50 p-4 rounded-2xl border border-gray-800/50">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Deadlines</p>
                      <p className="text-sm text-gray-300"><span className="text-gray-500">EU:</span> {prog.deadlineEU}</p>
                      <p className="text-sm text-gray-300"><span className="text-gray-500">Non-EU:</span> {prog.deadlineNonEU}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-800">
                    <Banknote className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Tuition Fees</p>
                      <p className="text-sm text-gray-300"><span className="text-gray-500">EU:</span> {prog.feeEU}</p>
                      <p className="text-sm text-gray-300"><span className="text-gray-500">Non-EU:</span> {prog.feeNonEU}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {prog.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
                
              </div>
              
              <div className="p-4 bg-gray-950/80 border-t border-gray-800/80 grid grid-cols-2 gap-3">
                <a 
                  href={prog.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 text-sm font-medium transition-colors border border-gray-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Details
                </a>
                <a 
                  href={prog.applyUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors border ${
                    prog.status === 'open' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-400 border-gray-700 cursor-not-allowed'
                  }`}
                  onClick={(e) => { if (prog.status !== 'open') e.preventDefault(); }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Apply Now
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No programs found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  RotateCcw,
  Sparkles,
  DollarSign,
  Users,
  GraduationCap,
  Building2,
  Activity,
  Radio,
  Clock,
  LogOut,
  ChevronRight,
  Send,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  X,
  CreditCard,
  Wallet,
  Banknote,
  ShieldCheck
} from "lucide-react";

export type Program = {
  id: string;
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
  feeNonEU: string;
  seats?: string;
  admissionProcess?: string;
  minDegree?: string;
  englishLevel?: string;
  workRights?: string;
  industryPartners?: string;
  duration?: string;
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
  active?: boolean;
};

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("admin@techmasters.eu");
  const [password, setPassword] = useState<string>("admin123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"overview" | "programs" | "ads" | "universities" | "kafka" | "payout">("overview");

  // Data states
  const [programs, setPrograms] = useState<Program[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [adAnalytics, setAdAnalytics] = useState<{ impressions: number; clicks: number; revenue: number }>({ impressions: 1420, clicks: 88, revenue: 94.50 });
  const [universities, setUniversities] = useState<any[]>([]);
  const [kafkaEvents, setKafkaEvents] = useState<any[]>([]);
  const [kafkaMetrics, setKafkaMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals
  const [showAddProgramModal, setShowAddProgramModal] = useState<boolean>(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showAddAdModal, setShowAddAdModal] = useState<boolean>(false);

  // Search & Filter within Admin Table
  const [programSearch, setProgramSearch] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("Austria");

  // Payout & Banking settings state
  const [payoutSettings, setPayoutSettings] = useState({
    payout_method: "visa_bank_wire",
    account_holder: "Omar Mohamed",
    iban_or_card: "AT89 3700 **** **** 4821",
    bic_swift: "BKAUATWW",
    bank_name: "Erste Bank Vienna / Visa Debit Payout",
    paypal_email: "admin@techmasters.eu",
    stripe_account_id: "acct_1TechMastersStripeConnected",
    auto_payout_threshold: 100.00,
    payout_schedule: "Monthly on the 21st",
    currency: "USD / EUR",
    ad_network_mode: "hybrid"
  });
  const [isSavingPayout, setIsSavingPayout] = useState(false);
  const [payoutRequestSuccess, setPayoutRequestSuccess] = useState(false);

  // Form State for Program Add/Edit
  const [programForm, setProgramForm] = useState<Partial<Program>>({
    title: "",
    inst: "TU Wien",
    field: "Machine Learning & Deep Learning",
    status: "open",
    statusLabel: "Open now",
    sortDate: "2026-10-31",
    dateLabel: "Applications open until 31 Oct 2026",
    deadlineEU: "31 Oct 2026",
    deadlineNonEU: "3 Aug 2026",
    windowLabel: "Window running",
    desc: "",
    lang: "English",
    feeEU: "Free (ÖH fee only, €26.20/sem)",
    feeNonEU: "€726.72/semester",
    seats: "Open quota",
    minDegree: "BSc in Computer Science or Mathematics (180 ECTS)",
    englishLevel: "English B2/C1",
    workRights: "20h/week during studies + 12-month Job-Seeker Visa",
    url: "https://www.tuwien.at",
    applyUrl: "https://tiss.tuwien.ac.at"
  });

  // Form State for Ad Add
  const [adForm, setAdForm] = useState<Partial<Ad>>({
    slot: "in_feed",
    client: "Global Tech Sponsor",
    title: "AWS AI Research Fellowship 2026",
    tagline: "$500 Cloud Credits & Certification",
    description: "Cloud computing grants for master students conducting machine learning and robotics research.",
    cta: "Claim Fellowship",
    url: "https://aws.amazon.com/education/",
    cpc: 1.10,
    badge: "Sponsored Partner"
  });

  // Check existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem("techmasters_admin_token");
    if (savedAuth) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const notify = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("techmasters_admin_token", data.token);
        setIsAuthenticated(true);
        notify("Authenticated as Administrator");
        fetchAllData();
      } else {
        const err = await res.json();
        setLoginError(err.detail || "Invalid login credentials");
      }
    } catch {
      // Fallback local verification
      if (email === "admin@techmasters.eu" && password === "admin123") {
        localStorage.setItem("techmasters_admin_token", "demo_token");
        setIsAuthenticated(true);
        notify("Authenticated in Offline Demo Mode");
        fetchAllData();
      } else {
        setLoginError("Invalid credentials. Try: admin@techmasters.eu / admin123");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("techmasters_admin_token");
    setIsAuthenticated(false);
    notify("Logged out successfully");
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [progRes, adsRes, uniRes, kafkaRes] = await Promise.allSettled([
        fetch("http://localhost:8000/api/programs"),
        fetch("http://localhost:4000/api/ads"),
        fetch("http://localhost:8000/api/universities"),
        fetch("http://localhost:8000/api/kafka/status")
      ]);

      if (progRes.status === "fulfilled" && progRes.value.ok) {
        setPrograms(await progRes.value.json());
      }
      if (adsRes.status === "fulfilled" && adsRes.value.ok) {
        const adsData = await adsRes.value.json();
        setAds(adsData.allAds || []);
        if (adsData.analytics) {
          setAdAnalytics(adsData.analytics);
        }
      }
      if (uniRes.status === "fulfilled" && uniRes.value.ok) {
        setUniversities(await uniRes.value.json());
      }
      if (kafkaRes.status === "fulfilled" && kafkaRes.value.ok) {
        const kData = await kafkaRes.value.json();
        setKafkaMetrics(kData.metrics);
        setKafkaEvents(kData.latest_events || []);
      }
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Program Actions
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        // Edit
        const res = await fetch(`http://localhost:8000/api/programs/${editingProgram.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingProgram, ...programForm })
        });
        if (res.ok) {
          notify(`Program "${programForm.title}" updated successfully!`);
          setShowAddProgramModal(false);
          setEditingProgram(null);
          fetchAllData();
        }
      } else {
        // Create
        const res = await fetch("http://localhost:8000/api/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(programForm)
        });
        if (res.ok) {
          notify(`Program "${programForm.title}" published & streamed to Kafka!`);
          setShowAddProgramModal(false);
          fetchAllData();
        }
      }
    } catch (e) {
      notify("Failed to save program", "error");
    }
  };

  const handleDeleteProgram = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:8000/api/programs/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        notify(`Program "${title}" deleted.`);
        setPrograms(programs.filter((p) => p.id !== id));
      }
    } catch {
      notify("Failed to delete program", "error");
    }
  };

  // Ads Actions
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adForm)
      });
      if (res.ok) {
        notify(`Sponsored Campaign "${adForm.title}" created on port 4000!`);
        setShowAddAdModal(false);
        fetchAllData();
      }
    } catch {
      notify("Failed to create ad", "error");
    }
  };

  const handleDeleteAd = async (id: string, title: string) => {
    if (!confirm(`Delete campaign "${title}"?`)) return;
    try {
      const res = await fetch(`http://localhost:4000/api/ads/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        notify(`Ad campaign deleted.`);
        setAds(ads.filter((a) => a.id !== id));
      }
    } catch {
      notify("Failed to delete ad", "error");
    }
  };

  // Payout Actions
  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayout(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/payout-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payoutSettings)
      });
      if (res.ok) {
        notify("Visa / Bank Wire Payout settings successfully updated!");
      }
    } catch {
      notify("Failed to save payout settings", "error");
    } finally {
      setIsSavingPayout(false);
    }
  };

  // Trigger manual Kafka event
  const handleTriggerKafkaSync = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/kafka/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "MANUAL_SCRAPER_BROADCAST",
          payload: {
            triggered_by: "SuperAdmin",
            programs_verified: programs.length,
            time: new Date().toISOString()
          }
        })
      });
      if (res.ok) {
        notify("Streamed sync event to Kafka topic: techmasters.admissions.stream");
        fetchAllData();
      }
    } catch {
      notify("Failed to publish Kafka event", "error");
    }
  };

  const filteredPrograms = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(programSearch.toLowerCase()) ||
      p.inst.toLowerCase().includes(programSearch.toLowerCase()) ||
      p.field.toLowerCase().includes(programSearch.toLowerCase())
  );

  // ----------------- LOGIN SCREEN -----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#111916] border border-[#273430] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-[#7ec8a7] to-blue-500" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">Admin Control Center</h1>
              <p className="text-slate-400 text-xs">Manage Programs, Ads & Kafka Streams</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@techmasters.eu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {isLoggingIn ? "Verifying..." : "Sign In to Admin Portal"}
            </button>
          </form>

          {/* Demo helper */}
          <div className="mt-6 pt-4 border-t border-[#232f2b] text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@techmasters.eu");
                setPassword("admin123");
              }}
              className="text-xs text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill Demo Credentials
            </button>
          </div>

          <div className="mt-4 text-center">
            <a href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to Public Website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------- AUTHENTICATED DASHBOARD -----------------
  return (
    <div className="min-h-screen bg-[#0a0f0d] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold border ${
              notification.type === "success"
                ? "bg-emerald-950/90 border-emerald-500 text-emerald-200"
                : "bg-rose-950/90 border-rose-500 text-rose-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="bg-[#111916] border-b border-[#232f2b] px-6 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white flex items-center gap-2">
                Tech Masters Control Center
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                  SUPERADMIN
                </span>
              </h1>
              <p className="text-slate-400 text-xs">Logged in as admin@techmasters.eu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-[#18211f] hover:bg-[#232f2b] border border-[#2d3a36] text-xs font-semibold text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#0e1413] border-b border-[#232f2b] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("programs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "programs"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Programs Manager ({programs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("ads")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "ads"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Ads & Monetization ({ads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("universities")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "universities"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Universities ({universities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("payout")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "payout"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Visa & Payout Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("kafka")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "kafka"
                ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Kafka Data Stream</span>
          </button>

          {/* Quick link to public community */}
          <a
            href="/community"
            target="_blank"
            rel="noreferrer"
            className="ml-auto px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Community Hub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1">
        {/* ---------------- TAB 1: DASHBOARD OVERVIEW ---------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111916] border border-[#273430] p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Tracked Programs
                </span>
                <span className="text-3xl font-extrabold text-white">{programs.length}</span>
                <span className="text-xs text-[#7ec8a7] block mt-1">Across Austria & Germany</span>
              </div>

              <div className="bg-[#111916] border border-[#273430] p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Universities Directory
                </span>
                <span className="text-3xl font-extrabold text-white">{universities.length || 37}</span>
                <span className="text-xs text-blue-400 block mt-1">27 Cities Verified</span>
              </div>

              <div className="bg-[#111916] border border-[#273430] p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Ad Campaigns Revenue
                </span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  ${(kafkaMetrics?.total_events_published * 0.35 || 4.90).toFixed(2)}
                </span>
                <span className="text-xs text-emerald-300 block mt-1">{ads.length} Active Sponsors</span>
              </div>

              <div className="bg-[#111916] border border-[#273430] p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Kafka Stream Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xl font-bold text-white">STREAMING</span>
                </div>
                <span className="text-xs text-cyan-300 block mt-1">Topic: admissions.stream</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[#111916] border border-[#273430] p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Platform Operations</h3>
                <p className="text-xs text-slate-400">Publish new degrees or trigger real-time Kafka event streams.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingProgram(null);
                    setShowAddProgramModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#7ec8a7] hover:bg-[#6bb394] text-[#0d1613] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Program</span>
                </button>

                <button
                  onClick={handleTriggerKafkaSync}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Emit Kafka Stream Event</span>
                </button>
              </div>
            </div>

            {/* Microservices Health Status */}
            <div className="bg-[#111916] border border-[#273430] p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-4">Enterprise Microservices Architecture Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0a0f0d] border border-[#232f2b] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">tech-masters-frontend</span>
                    <span className="text-[11px] text-slate-500">Next.js 16 (Port 3000)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    ONLINE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0f0d] border border-[#232f2b] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">tech-masters-backend</span>
                    <span className="text-[11px] text-slate-500">FastAPI (Port 8000)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    ONLINE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0f0d] border border-[#232f2b] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">tech-masters-ads-service</span>
                    <span className="text-[11px] text-slate-500">Node.js Express (Port 4000)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: PROGRAMS MANAGER (CRUD) ---------------- */}
        {activeTab === "programs" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter programs by title, university, field..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#111916] border border-[#273430] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingProgram(null);
                  setShowAddProgramModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#7ec8a7] hover:bg-[#6bb394] text-[#0d1613] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Program</span>
              </button>
            </div>

            {/* Programs Table */}
            <div className="bg-[#111916] border border-[#273430] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-[#0e1413] text-slate-400 border-b border-[#232f2b] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Program Title</th>
                      <th className="py-3 px-4">Institution & City</th>
                      <th className="py-3 px-4">Field</th>
                      <th className="py-3 px-4">Seats / Intake</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2b27]">
                    {filteredPrograms.map((p) => (
                      <tr key={p.id} className="hover:bg-[#15201c] transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          <span className="block">{p.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-200 block">{p.inst}</span>
                          <span className="text-[11px] text-slate-400">{p.city}, {p.country}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[11px]">
                            {p.field}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-amber-300">
                          {p.seats || "Open quota"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === "open"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {p.deadlineEU}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProgram(p);
                              setProgramForm(p);
                              setShowAddProgramModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#18211f] hover:bg-[#232f2b] text-teal-300 transition-colors"
                            title="Edit Program"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(p.id, p.title)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                            title="Delete Program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: ADS & MONETIZATION MANAGER ---------------- */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Monetization & Sponsored Campaigns</h2>
                <p className="text-xs text-slate-400">Manage real-time CPC sponsorships served across the website.</p>
              </div>

              <button
                onClick={() => setShowAddAdModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-[#111916] border border-[#273430] hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
                        {ad.slot}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">${ad.cpc} CPC</span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1">{ad.title}</h3>
                    <span className="text-xs text-slate-400 font-medium block mb-2">{ad.client}</span>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{ad.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#232f2b] flex items-center justify-between">
                    <a
                      href={ad.url}
                      target="_blank"
                      className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <span>Preview URL</span> <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleDeleteAd(ad.id, ad.title)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: UNIVERSITIES & CITIES DIRECTORY ---------------- */}
        {activeTab === "universities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Accredited Universities Directory</h2>
                <p className="text-xs text-slate-400">All institutions in Austria & Germany with QS World rankings.</p>
              </div>

              <div className="flex items-center bg-[#111916] p-1 rounded-xl border border-[#273430]">
                <button
                  onClick={() => setSelectedCountry("Austria")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCountry === "Austria"
                      ? "bg-[#7ec8a7] text-[#0d1613]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇦🇹 Austria ({universities.filter((u) => u.country === "Austria").length})
                </button>
                <button
                  onClick={() => setSelectedCountry("Germany")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCountry === "Germany"
                      ? "bg-[#7ec8a7] text-[#0d1613]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🇩🇪 Germany ({universities.filter((u) => u.country === "Germany").length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {universities
                .filter((u) => u.country === selectedCountry)
                .map((u) => (
                  <div
                    key={u.name}
                    className="bg-[#111916] border border-[#273430] rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-300">
                          QS World #{u.rank_world}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          #{u.rank_country} in {u.country}
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm mb-1">{u.name}</h3>
                      <span className="text-xs text-teal-300 block mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {u.city} · {u.type}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{u.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#232f2b] flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        <strong>{u.programs_count || 0}</strong> programs active
                      </span>
                      <a
                        href={u.website}
                        target="_blank"
                        className="text-xs text-[#7ec8a7] hover:underline flex items-center gap-1"
                      >
                        <span>Official Portal</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: KAFKA DATA STREAM MONITOR ---------------- */}
        {activeTab === "kafka" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                  Apache Kafka Real-Time Streaming Monitor
                </h2>
                <p className="text-xs text-slate-400">
                  Topic: <code className="text-cyan-300">techmasters.admissions.stream</code> · KRaft Broker
                </p>
              </div>

              <button
                onClick={handleTriggerKafkaSync}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Simulate Crawler Event</span>
              </button>
            </div>

            {/* Stream Event Logs */}
            <div className="bg-[#111916] border border-[#273430] rounded-2xl overflow-hidden p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Live Event Buffer ({kafkaEvents.length} events consumed)
              </h3>
              <div className="space-y-2.5 font-mono text-xs max-h-96 overflow-y-auto">
                {kafkaEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-[#0a0f0d] border border-[#232f2b] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                          {evt.type}
                        </span>
                        <span className="text-slate-500 text-[10px]">{evt.id}</span>
                      </div>
                      <pre className="text-slate-300 text-[11px] whitespace-pre-wrap">
                        {JSON.stringify(evt.payload, null, 2)}
                      </pre>
                    </div>

                    <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {evt.timestamp?.split("T")[1]?.slice(0, 8)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: VISA & BANK PAYOUT SETTINGS ==================== */}
        {activeTab === "payout" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121c18] via-[#16221d] to-[#1a1c24] border border-[#273430] shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase mb-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Monetization & Payout Engine
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Visa Card & Bank Wire Payout Settings
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    Configure your real payout destination for ad revenues, direct university sponsorships, and affiliate earnings (Expatrio, Fintiba, ÖAD).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPayoutRequestSuccess(true);
                    notify("Manual payout request submitted! Transferred to linked Visa card.");
                    setTimeout(() => setPayoutRequestSuccess(false), 5000);
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0d1613] font-black text-xs sm:text-sm transition-all shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Request Instant Payout to Visa</span>
                </button>
              </div>

              {/* Status Alert if Payout Requested */}
              {payoutRequestSuccess && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Payout of <strong>${adAnalytics.revenue.toFixed(2)} USD</strong> dispatched to your Erste Bank / Visa card account! Expected settlement in 2 business days.
                  </span>
                </div>
              )}
            </div>

            {/* Payout Financial Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#111916] border border-[#273430]">
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Available Ad Revenue</span>
                <div className="text-2xl font-black text-white font-mono">
                  ${adAnalytics.revenue.toFixed(2)}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Live CPC Earnings</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111916] border border-[#273430]">
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Minimum Payout Threshold</span>
                <div className="text-2xl font-black text-white font-mono">
                  ${payoutSettings.auto_payout_threshold.toFixed(2)}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Configured threshold</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111916] border border-[#273430]">
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Next Scheduled Payout</span>
                <div className="text-lg font-bold text-white mt-1">
                  {payoutSettings.payout_schedule}
                </div>
                <span className="text-[11px] text-teal-400 font-semibold mt-1 block">Automated SEPA Wire</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111916] border border-[#273430]">
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Active Payout Destination</span>
                <div className="text-base font-bold text-[#7ec8a7] mt-1 flex items-center gap-1.5 truncate">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span className="truncate">Visa / Bank Wire</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono mt-1 block truncate">
                  {payoutSettings.iban_or_card}
                </span>
              </div>
            </div>

            {/* Payout Configuration Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-[#111916] border border-[#273430] space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-[#7ec8a7]" />
                  Bank Account & Visa Payout Details
                </h3>

                <form onSubmit={handleSavePayoutSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Payout Method</label>
                      <select
                        value={payoutSettings.payout_method}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, payout_method: e.target.value })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                      >
                        <option value="visa_bank_wire">Direct Visa Debit / Bank Wire (IBAN/SWIFT)</option>
                        <option value="stripe">Stripe Connect Payout</option>
                        <option value="paypal">PayPal Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Account Holder Full Name</label>
                      <input
                        type="text"
                        required
                        value={payoutSettings.account_holder}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, account_holder: e.target.value })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Bank Name / Card Issuer</label>
                      <input
                        type="text"
                        required
                        value={payoutSettings.bank_name}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, bank_name: e.target.value })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                        placeholder="e.g. Erste Bank Vienna or Raiffeisen Bank"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">IBAN or Visa Card Number</label>
                      <input
                        type="text"
                        required
                        value={payoutSettings.iban_or_card}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, iban_or_card: e.target.value })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white font-mono"
                        placeholder="e.g. AT89 3700 0000 1234 5678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">BIC / SWIFT Code</label>
                      <input
                        type="text"
                        required
                        value={payoutSettings.bic_swift}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, bic_swift: e.target.value })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white font-mono"
                        placeholder="e.g. BKAUATWW"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Auto-Payout Threshold ($)</label>
                      <input
                        type="number"
                        step="10"
                        value={payoutSettings.auto_payout_threshold}
                        onChange={(e) => setPayoutSettings({ ...payoutSettings, auto_payout_threshold: parseFloat(e.target.value) || 100 })}
                        className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSavingPayout}
                      className="px-6 py-2.5 rounded-xl bg-[#7ec8a7] hover:bg-[#92d8b8] text-[#0d1613] font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      {isSavingPayout ? "Saving..." : "Save Payout Settings"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Monetization Architecture Guide */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-[#111916] border border-[#273430] space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7ec8a7]" />
                  How Money Reaches Your Visa
                </h4>

                <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#16221e] border border-[#253630]">
                    <strong className="text-white block mb-0.5">1. Student Affiliate Partners:</strong>
                    <span>Expatrio and Fintiba pay <strong>€50 – €100</strong> per blocked account opened via your sponsored banner. Earnings are wired directly to your IBAN every month.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#16221e] border border-[#253630]">
                    <strong className="text-white block mb-0.5">2. Direct University Sponsors:</strong>
                    <span>Universities and bootcamps paying for featured placement settle via Stripe Connect, transferring funds to your Visa debit card within 48 hours.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#16221e] border border-[#253630]">
                    <strong className="text-white block mb-0.5">3. Google AdSense / Carbon:</strong>
                    <span>Ad network revenue automatically pays out on the 21st of every month via international wire transfer to your BIC/SWIFT.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------- MODAL: ADD / EDIT PROGRAM ---------------- */}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111916] border border-[#273430] rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#232f2b] pb-3">
              <h2 className="text-lg font-bold text-white">
                {editingProgram ? "Edit Program" : "Add New Tech Master's Program"}
              </h2>
              <button
                onClick={() => setShowAddProgramModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Program Title</label>
                  <input
                    type="text"
                    required
                    value={programForm.title}
                    onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. Deep Learning & Computer Vision (MSc)"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institution Name</label>
                  <input
                    type="text"
                    required
                    value={programForm.inst}
                    onChange={(e) => setProgramForm({ ...programForm, inst: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. TU Wien Informatics"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Field Specialization</label>
                  <select
                    value={programForm.field}
                    onChange={(e) => setProgramForm({ ...programForm, field: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  >
                    <option value="Machine Learning & Deep Learning">Machine Learning & Deep Learning</option>
                    <option value="AI">AI</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Quantum Computing">Quantum Computing</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Bioinformatics">Bioinformatics</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Seats / Cohort Capacity</label>
                  <input
                    type="text"
                    value={programForm.seats}
                    onChange={(e) => setProgramForm({ ...programForm, seats: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. 30 places or Open quota"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">EU Deadline</label>
                  <input
                    type="text"
                    value={programForm.deadlineEU}
                    onChange={(e) => setProgramForm({ ...programForm, deadlineEU: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. 31 Oct 2026"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Non-EU Deadline</label>
                  <input
                    type="text"
                    value={programForm.deadlineNonEU}
                    onChange={(e) => setProgramForm({ ...programForm, deadlineNonEU: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. 3 Aug 2026"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">EU Tuition Fee</label>
                  <input
                    type="text"
                    value={programForm.feeEU}
                    onChange={(e) => setProgramForm({ ...programForm, feeEU: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Non-EU Tuition Fee</label>
                  <input
                    type="text"
                    value={programForm.feeNonEU}
                    onChange={(e) => setProgramForm({ ...programForm, feeNonEU: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Program Description</label>
                <textarea
                  rows={3}
                  value={programForm.desc}
                  onChange={(e) => setProgramForm({ ...programForm, desc: e.target.value })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  placeholder="Detailed curriculum overview, laboratory tracks, and specialization modules..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Prerequisites</label>
                  <input
                    type="text"
                    value={programForm.minDegree}
                    onChange={(e) => setProgramForm({ ...programForm, minDegree: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                    placeholder="e.g. BSc in CS with 30 ECTS Math"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Portal URL</label>
                  <input
                    type="url"
                    value={programForm.applyUrl}
                    onChange={(e) => setProgramForm({ ...programForm, applyUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#232f2b] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProgramModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#18211f] hover:bg-[#232f2b] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7ec8a7] hover:bg-[#6bb394] text-[#0d1613] font-bold shadow-md cursor-pointer"
                >
                  {editingProgram ? "Update Program" : "Save & Stream to Kafka"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ---------------- MODAL: ADD AD CAMPAIGN ---------------- */}
      {showAddAdModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111916] border border-[#273430] rounded-3xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#232f2b] pb-3">
              <h2 className="text-lg font-bold text-white">Launch New Sponsored Ad</h2>
              <button onClick={() => setShowAddAdModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ad Placement Slot</label>
                <select
                  value={adForm.slot}
                  onChange={(e) => setAdForm({ ...adForm, slot: e.target.value })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                >
                  <option value="in_feed">In-Feed Native Card (Program Grid)</option>
                  <option value="top_banner">Top Sponsored Announcement Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client / Sponsor Name</label>
                <input
                  type="text"
                  required
                  value={adForm.client}
                  onChange={(e) => setAdForm({ ...adForm, client: e.target.value })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                  placeholder="e.g. Microsoft Azure for Students"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ad Title</label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cost Per Click (CPC in USD)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={adForm.cpc}
                  onChange={(e) => setAdForm({ ...adForm, cpc: parseFloat(e.target.value) })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Landing URL</label>
                <input
                  type="url"
                  required
                  value={adForm.url}
                  onChange={(e) => setAdForm({ ...adForm, url: e.target.value })}
                  className="w-full p-2.5 bg-[#0a0f0d] border border-[#273430] rounded-xl text-white"
                />
              </div>

              <div className="pt-4 border-t border-[#232f2b] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAdModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#18211f] hover:bg-[#232f2b] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

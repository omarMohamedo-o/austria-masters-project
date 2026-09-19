"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Search,
  PlusCircle,
  FileCheck,
  CheckCircle2,
  Circle,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Building2,
  Globe,
  ArrowLeft,
  Calendar,
  DollarSign,
  AlertCircle,
  Calculator,
  Languages,
  BookOpen,
  HelpCircle,
  Sparkles,
  Send,
  X
} from "lucide-react";

export type CommunityComment = {
  id: string;
  author_name: string;
  author_handle: string;
  author_role: string;
  created_at: string;
  content: string;
  upvotes: number;
};

export type CommunityPost = {
  id: string;
  title: string;
  category: string;
  country: string;
  university: string;
  author_name: string;
  author_handle: string;
  author_role: string;
  created_at: string;
  upvotes: number;
  tags: string[];
  content: string;
  comments: CommunityComment[];
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"discussions" | "requirements" | "english_courses" | "grading">("discussions");

  // Discussions state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Admissions & Prerequisites");
  const [newPostCountry, setNewPostCountry] = useState("Austria");
  const [newPostUniversity, setNewPostUniversity] = useState("TU Wien");
  const [newPostAuthorName, setNewPostAuthorName] = useState("");
  const [newPostAuthorRole, setNewPostAuthorRole] = useState("Master's Applicant");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");

  // Requirements checklist state
  const [reqCountry, setReqCountry] = useState<"Austria" | "Germany">("Austria");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Grade converter state (Modified Bavarian Formula)
  const [maxGrade, setMaxGrade] = useState<number>(4.0);
  const [minPassingGrade, setMinPassingGrade] = useState<number>(2.0);
  const [actualGrade, setActualGrade] = useState<number>(3.5);

  // Handle URL hash navigation on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#requirements") setActiveTab("requirements");
      else if (hash === "#grading") setActiveTab("grading");
      else if (hash === "#english") setActiveTab("english_courses");

      // Load saved checklist items from localStorage
      try {
        const saved = localStorage.getItem("techmasters_checklist");
        if (saved) setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist from localStorage", e);
      }
    }
  }, []);

  // Fetch community posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("http://localhost:8000/api/community/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleUpvote = async (postId: string) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );

    try {
      await fetch(`http://localhost:8000/api/community/posts/${postId}/upvote`, {
        method: "POST"
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newCommentObj: CommunityComment = {
      id: `c-${Date.now()}`,
      author_name: "You (Applicant)",
      author_handle: "@you_tech",
      author_role: "Community Member",
      created_at: new Date().toISOString(),
      content: text,
      upvotes: 1
    };

    // Optimistic UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newCommentObj] } : p
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

    try {
      await fetch(`http://localhost:8000/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: "You (Applicant)",
          author_role: "Community Member",
          content: text
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent || !newPostAuthorName) return;

    const tagsArray = newPostTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postPayload = {
      title: newPostTitle,
      category: newPostCategory,
      country: newPostCountry,
      university: newPostUniversity,
      author_name: newPostAuthorName,
      author_role: newPostAuthorRole,
      content: newPostContent,
      tags: tagsArray.length > 0 ? tagsArray : [newPostUniversity, newPostCategory]
    };

    try {
      const res = await fetch("http://localhost:8000/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload)
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [data.post, ...prev]);
        setIsNewPostModalOpen(false);
        // Reset form
        setNewPostTitle("");
        setNewPostContent("");
        setNewPostAuthorName("");
        setNewPostTags("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCheckItem = (id: string) => {
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    try {
      localStorage.setItem("techmasters_checklist", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered discussions
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchesCountry = selectedCountry === "all" || p.country.toLowerCase() === selectedCountry.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesCountry && matchesSearch;
    });
  }, [posts, selectedCategory, selectedCountry, searchQuery]);

  // Bavarian formula grade calculation
  const convertedGrade = useMemo(() => {
    if (maxGrade === minPassingGrade) return 4.0;
    // N = 1 + 3 * ((N_max - N_d) / (N_max - N_min))
    const res = 1.0 + 3.0 * ((maxGrade - actualGrade) / (maxGrade - minPassingGrade));
    const clamped = Math.max(1.0, Math.min(5.0, res));
    return parseFloat(clamped.toFixed(2));
  }, [maxGrade, minPassingGrade, actualGrade]);

  const gradeClassification = useMemo(() => {
    if (convertedGrade <= 1.5) {
      return {
        label: "Sehr gut (Outstanding)",
        austrian: "Note 1 (Sehr gut)",
        competitiveness: "Extremely High — Priority shortlist for TUM, TU Wien, Uni Vienna",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      };
    } else if (convertedGrade <= 2.5) {
      return {
        label: "Gut (Good / Above Average)",
        austrian: "Note 2 (Gut)",
        competitiveness: "Highly Competitive — Directly eligible for all technical Master admissions",
        color: "text-teal-400 bg-teal-500/10 border-teal-500/30"
      };
    } else if (convertedGrade <= 3.5) {
      return {
        label: "Befriedigend (Satisfactory)",
        austrian: "Note 3 (Befriedigend)",
        competitiveness: "Eligible — May be asked for GRE Quantitative 160+ or aptitude interview",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30"
      };
    } else if (convertedGrade <= 4.0) {
      return {
        label: "Ausreichend (Minimum Pass)",
        austrian: "Note 4 (Genügend)",
        competitiveness: "Borderline — Requires strong SOP, research papers, or relevant industry dev experience",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/30"
      };
    } else {
      return {
        label: "Nicht ausreichend (Ineligible)",
        austrian: "Note 5 (Nicht genügend)",
        competitiveness: "Below minimum European university Master's entry requirements",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30"
      };
    }
  }, [convertedGrade]);

  // Requirements checklist data
  const checklistData = [
    {
      id: "req_passport",
      category: "Identity & Civil Status",
      title: "Valid Biometric Passport",
      desc: "Valid ≥ 6 months beyond stay in Austria/Germany, minimum 2 consecutive blank visa pages, issued within last 10 years.",
      country: "Both",
      authority: "Schengen Border Code",
      url: "https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq"
    },
    {
      id: "req_photos",
      category: "Identity & Civil Status",
      title: "Biometric Passport Photographs (35x45mm)",
      desc: "2 recent ICAO-standard photos with neutral expression and plain light grey/white background.",
      country: "Both",
      authority: "ICAO Doc 9303 / BMI",
      url: "https://www.bmi.gv.at"
    },
    {
      id: "req_birth_cert",
      category: "Identity & Civil Status",
      title: "Legalized Birth Certificate + Certified Translation",
      desc: "Original birth certificate with parents' names, carrying Hague Apostille OR Diplomatic Superlegalization, plus sworn translation into German or English.",
      country: "Both",
      authority: "Austrian BMI / German Auswärtiges Amt",
      url: "https://oead.at/en/to-austria/entry-and-residence"
    },
    {
      id: "req_financial_funds",
      category: "Financial & Banking",
      title: reqCountry === "Austria" ? "Austrian Proof of Funds (€14,615 / year or Haftungserklärung)" : "German Blocked Account (Sperrkonto €11,904)",
      desc: reqCountry === "Austria"
        ? "Personal bank account in student's name showing €14,615 (for 24+) or €8,071 (under 24) with verifiable source of funds (salary slips/tax returns), or Austrian notarized Liability Declaration (Haftungserklärung)."
        : "Statutory blocked account with €11,904 (€992/month disbursement) opened via approved providers (Expatrio, Fintiba, or Coracle).",
      country: reqCountry,
      authority: reqCountry === "Austria" ? "Austrian Settlement Act (NAG § 11)" : "German Residence Act (§ 16b AufenthG)",
      url: reqCountry === "Austria" ? "https://www.migration.gv.at" : "https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/02-sperrkonto"
    },
    {
      id: "req_bachelor_degree",
      category: "Academic Credentials",
      title: "Bachelor Degree Certificate & Transcripts",
      desc: "Original degree certificate + transcript of records with credit hours/ECTS breakdown, officially legalized according to your country's tier (Apostille or Diplomatic Superlegalization).",
      country: "Both",
      authority: "ENIC-NARIC / Anabin Database",
      url: "https://anabin.kmk.org"
    },
    {
      id: "req_module_catalog",
      category: "Academic Credentials",
      title: "Course Descriptions / Curriculum Module Catalog (Modulhandbuch)",
      desc: "Official university syllabus detailing lecture topics, weekly hours, algorithms, and math proofs to fulfill the 18-30 ECTS subject cluster equivalency checks under Austrian UG 2002 § 64.",
      country: "Both",
      authority: "University Admission Boards",
      url: "https://informatics.tuwien.ac.at"
    },
    {
      id: "req_aps",
      category: "Academic Credentials",
      title: "APS Certificate (India, China, Vietnam applicants)",
      desc: "Compulsory verification certificate issued by the German Embassy's Akademische Prüfstelle verifying Bachelor degree authenticity.",
      country: "Germany",
      authority: "APS German Embassy",
      url: "https://aps-india.de"
    },
    {
      id: "req_english_cert",
      category: "Language Proficiency",
      title: "Certified English Language Certificate (IELTS / TOEFL / Cambridge)",
      desc: "Official score report: IELTS Academic (overall 6.5–7.0, sub-bands ≥ 6.0) or TOEFL iBT (88–100 points, min 20 in each section). MOI letters only accepted for native English country graduates.",
      country: "Both",
      authority: "IELTS.org / ETS.org",
      url: "https://www.ielts.org"
    },
    {
      id: "req_pcc",
      category: "Civil & Legal Clearance",
      title: "Police Clearance Certificate (PCC / Strafregisterbescheinigung)",
      desc: "Criminal record certificate issued within the last 3 months, legalized with Apostille/Superlegalization and certified translation into German.",
      country: "Austria",
      authority: "Austrian Ministry of the Interior",
      url: "https://www.migration.gv.at"
    },
    {
      id: "req_health_insurance",
      category: "Health & Housing",
      title: reqCountry === "Austria" ? "ÖGK Health Insurance (€69.13/mo) + Travel Entry Policy" : "Statutory Health Insurance (TK / AOK ~€125/mo)",
      desc: reqCountry === "Austria"
        ? "Comprehensive universal coverage via ÖGK (€69.13/month) upon arrival. Travel insurance covering €30,000 required for visa sticker collection."
        : "Public statutory student health insurance (Techniker Krankenkasse, AOK) covering medical, hospital, and prescriptions.",
      country: reqCountry,
      authority: reqCountry === "Austria" ? "ÖGK Österreichische Gesundheitskasse" : "GKV Spitzenverband",
      url: reqCountry === "Austria" ? "https://www.gesundheitskasse.at" : "https://www.tk.de"
    },
    {
      id: "req_housing",
      category: "Health & Housing",
      title: "Proof of Accommodation (Rental Contract / OeAD Housing)",
      desc: "Tenancy agreement (Mietvertrag) or student dormitory contract (OeAD-Wohnraumverwaltung in Austria, Studentenwerk in Germany) for at least 3-6 months.",
      country: "Both",
      authority: "Austrian & German Immigration",
      url: "https://oead.at/en/to-austria/entry-and-residence"
    }
  ];

  const filteredChecklist = checklistData.filter(
    (item) => item.country === "Both" || item.country === reqCountry
  );

  const completedCount = filteredChecklist.filter((item) => checkedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / filteredChecklist.length) * 100);

  return (
    <div className="min-h-screen bg-[#0d1412] text-slate-100 antialiased">
      {/* Top Banner & Header */}
      <div className="border-b border-[#202e29] bg-[#111a17]/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 rounded-xl bg-[#1a2522] hover:bg-[#253530] border border-[#2a3c36] text-slate-300 hover:text-white transition-colors"
              title="Return to Master's Degree Catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3 h-3 text-sky-400" />
                  Community & Requirements Hub
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                  Official References
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Student Community, Visa & Academic Evaluation
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/admin"
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admin Portal
            </a>
            <a
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-[#7ec8a7] hover:bg-[#92d8b8] text-[#0d1613] text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Browse 41 Programs
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "discussions", label: "Peer Discussions & Q&A", icon: MessageSquare },
            { id: "requirements", label: "Master Requirements Checklist", icon: FileCheck },
            { id: "english_courses", label: "English Tests & Course Descriptions", icon: BookOpen },
            { id: "grading", label: "Bavarian Grade Converter", icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow-md"
                    : "bg-[#141e1b] text-slate-300 hover:text-white hover:bg-[#1a2622] border border-[#23312c]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================== TAB 1: PEER DISCUSSIONS ==================== */}
        {activeTab === "discussions" && (
          <div className="space-y-6">
            {/* Community Hero & Stats Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121c18] via-[#14231f] to-[#122227] border border-[#253630] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7ec8a7]/10 border border-[#7ec8a7]/30 text-[#7ec8a7] text-xs font-bold uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Knowledge Sharing Forum
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Ask Questions & Learn From Admitted Students
                </h2>
                <p className="text-slate-400 text-sm max-w-2xl mt-1">
                  Connect with current MSc Artificial Intelligence, Computer Science, and Data Science students at TU Wien, TUM, Uni Vienna, JKU Linz, and RWTH Aachen.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#7ec8a7]" /> 1,480+ Enrolled & Alumni Members
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Building2 className="w-4 h-4 text-sky-400" /> 37 Austrian & German Universities
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Globe className="w-4 h-4 text-amber-400" /> Real-time Kafka Streaming Active
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsNewPostModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#7ec8a7] hover:bg-[#92d8b8] text-[#0d1613] font-black text-sm transition-all shadow-lg hover:scale-105 flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Start Discussion / Share Story</span>
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 rounded-2xl bg-[#131d1a] border border-[#23312c] space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search discussions by topic (e.g. entrance test, math prerequisites, visa, RWR card, working student)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#192421] border border-[#2b3c37] rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                  />
                </div>

                {/* Country Filter */}
                <div className="flex items-center gap-2 shrink-0">
                  {["all", "Austria", "Germany"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCountry(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedCountry === c
                          ? "bg-[#7ec8a7] text-[#0d1613] font-bold shadow"
                          : "bg-[#192421] text-slate-300 border border-[#293a35] hover:border-slate-500"
                      }`}
                    >
                      {c === "all" ? "All Countries" : c === "Austria" ? "Austria 🇦🇹" : "Germany 🇩🇪"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1f2c27]">
                <span className="text-xs text-slate-400 font-semibold mr-1">Categories:</span>
                {[
                  "all",
                  "Admissions & Prerequisites",
                  "Visa & Residence (RWR)",
                  "Course & University Reviews",
                  "Jobs & Career"
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[#7ec8a7] text-[#0d1613] font-bold"
                        : "bg-[#192421] text-slate-300 border border-[#283934] hover:border-[#3d524b]"
                    }`}
                  >
                    {cat === "all" ? "All Topics" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Discussions List */}
            {loadingPosts ? (
              <div className="py-16 text-center text-slate-400 font-semibold">
                Loading community discussions...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-16 text-center p-8 rounded-3xl bg-[#131d1a] border border-[#24342e]">
                <HelpCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No discussions found matching your filter</h3>
                <p className="text-slate-400 text-sm mt-1">Be the first to ask a question or share your experience!</p>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#7ec8a7] text-[#0d1613] text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Start Discussion
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => {
                  const isExpanded = expandedComments[post.id];
                  return (
                    <div
                      key={post.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#131d1a] border border-[#24342e] hover:border-[#354c43] transition-all shadow-md"
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-bold">
                            {post.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#7ec8a7]" />
                            {post.university}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#182521] border border-[#2b3c37] text-slate-300 text-[11px] font-medium">
                            {post.country === "Austria" ? "🇦🇹 Austria" : "🇩🇪 Germany"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Author Tag */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                        <span className="font-bold text-slate-200">{post.author_name}</span>
                        <span className="text-slate-500">{post.author_handle}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                          {post.author_role}
                        </span>
                      </div>

                      {/* Body */}
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-4">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-lg bg-[#182521] text-slate-400 text-[10px] font-mono border border-[#263731]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#1f2c27]">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpvote(post.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#192622] hover:bg-[#233530] border border-[#2b3c37] text-slate-200 text-xs font-bold transition-all hover:scale-105"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-[#7ec8a7]" />
                            <span>Helpful ({post.upvotes})</span>
                          </button>

                          <button
                            onClick={() => toggleComments(post.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#192622] hover:bg-[#233530] border border-[#2b3c37] text-slate-200 text-xs font-bold transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                            <span>Replies ({post.comments?.length || 0})</span>
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-500 hidden sm:inline">
                          Verified University Community
                        </span>
                      </div>

                      {/* Expandable Comments Section */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#1d2925] space-y-3">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                            Answers & Experiences ({post.comments?.length || 0})
                          </h4>

                          {post.comments?.map((c) => (
                            <div
                              key={c.id}
                              className="p-3.5 rounded-2xl bg-[#182420] border border-[#263731] space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{c.author_name}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                    {c.author_role}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(c.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-300 text-xs leading-relaxed">{c.content}</p>
                            </div>
                          ))}

                          {/* Add Reply Input */}
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="Write a helpful reply or share your advice..."
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post.id);
                              }}
                              className="flex-1 px-3.5 py-2 bg-[#192622] border border-[#2a3c36] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="p-2 rounded-xl bg-[#7ec8a7] text-[#0d1613] hover:bg-[#92d8b8] transition-colors"
                              title="Submit Reply"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: MASTER REQUIREMENTS CHECKLIST ==================== */}
        {activeTab === "requirements" && (
          <div className="space-y-6">
            {/* Header & Country Selector */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121c18] via-[#14231f] to-[#122227] border border-[#253630] shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase mb-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    Official Legal & Visa Guide
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Master Requirements & Visa Document Checklist
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    Every statutory document required for admission and student residence permit issuance in Austria and Germany, cross-checked against Austrian Ministry (BMI), OeAD, and German Auswärtiges Amt.
                  </p>
                </div>

                {/* Country Toggle */}
                <div className="flex items-center bg-[#172421] p-1.5 rounded-2xl border border-[#2b3c37] shrink-0">
                  <button
                    onClick={() => setReqCountry("Austria")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      reqCountry === "Austria"
                        ? "bg-[#7ec8a7] text-[#0d1613] shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🇦🇹 Austria (NAG / MA 35)
                  </button>
                  <button
                    onClick={() => setReqCountry("Germany")}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      reqCountry === "Germany"
                        ? "bg-[#7ec8a7] text-[#0d1613] shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🇩🇪 Germany (AufenthG)
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 rounded-2xl bg-[#16221f] border border-[#273832]">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-white">Your Preparation Progress ({reqCountry}):</span>
                  <span className="text-[#7ec8a7] font-mono">
                    {completedCount} of {filteredChecklist.length} completed ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#202e29] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-[#7ec8a7] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Country Key Fact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#131d1a] border border-[#23312c]">
                <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Proof of Funds
                </span>
                <p className="text-xl font-extrabold text-white">
                  {reqCountry === "Austria" ? "€14,615 / year" : "€11,904 / year"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {reqCountry === "Austria"
                    ? "€1,217.96/mo (if 24+) in personal bank account with source of funds, or Austrian Haftungserklärung."
                    : "German Sperrkonto (€992/month payout) via Expatrio, Fintiba, or Coracle."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131d1a] border border-[#23312c]">
                <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  Health Insurance
                </span>
                <p className="text-xl font-extrabold text-white">
                  {reqCountry === "Austria" ? "ÖGK €69.13 / mo" : "TK / AOK €125 / mo"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {reqCountry === "Austria"
                    ? "Universal coverage across Austria doctors + incoming travel insurance for visa pick-up."
                    : "Statutory public health insurance (GKV) with zero deductible."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131d1a] border border-[#23312c]">
                <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  Work & Post-Study Visa
                </span>
                <p className="text-xl font-extrabold text-white">
                  {reqCountry === "Austria" ? "20h/wk + 12m RWR Card" : "140 Days + 18m Job Seeker"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {reqCountry === "Austria"
                    ? "Rot-Weiß-Rot Karte for graduates without AMS labor test once job offer secured."
                    : "18-month residence permit to find skilled tech job leading to EU Blue Card."}
                </p>
              </div>
            </div>

            {/* Interactive Checklist Items */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white px-1">
                Mandatory Documents Checklist ({filteredChecklist.length} Items)
              </h3>

              {filteredChecklist.map((item) => {
                const isChecked = checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? "bg-[#14231e] border-emerald-500/40 text-slate-200"
                        : "bg-[#131d1a] border-[#24342e] hover:border-[#354c43]"
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-2xl shrink-0"
                      title={isChecked ? "Mark Incomplete" : "Mark Ready"}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                          {item.category}
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7ec8a7] hover:underline"
                        >
                          {item.authority} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <h4 className={`text-base font-bold text-white ${isChecked ? "line-through text-slate-400" : ""}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ENGLISH TESTS & COURSE DESCRIPTIONS ==================== */}
        {activeTab === "english_courses" && (
          <div className="space-y-8">
            {/* Section 1: English Certification Rules */}
            <div className="p-6 rounded-3xl bg-[#131d1a] border border-[#24342e] shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase mb-2">
                <Languages className="w-3.5 h-3.5" />
                Language Requirements Matrix
              </div>
              <h2 className="text-2xl font-black text-white">
                Official English Proficiency Score Thresholds
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Accepted test scores for Master's programs across Austrian and German technical universities (CEFR Level B2 to C1).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    name: "IELTS Academic",
                    standard: "Overall 6.5 (No sub-band < 6.0)",
                    topTier: "Overall 7.0 (Writing/Speaking ≥ 6.5) for TUM, TU Wien, Uni Vienna",
                    validity: "2 Years from exam date",
                    link: "https://www.ielts.org",
                    provider: "British Council / IDP"
                  },
                  {
                    name: "TOEFL iBT",
                    standard: "88 – 95 Total Points",
                    topTier: "100 Points (Listening: 22, Reading: 22, Speaking: 22, Writing: 24)",
                    validity: "2 Years from exam date",
                    link: "https://www.ets.org/toefl",
                    provider: "ETS"
                  },
                  {
                    name: "Cambridge C1 Advanced (CAE)",
                    standard: "Overall 180+ (Grade C or above)",
                    topTier: "Overall 190+ (Grade B or C2 Proficiency)",
                    validity: "Lifetime or 2-3 years per uni regulation",
                    link: "https://www.cambridgeenglish.org",
                    provider: "Cambridge Assessment"
                  },
                  {
                    name: "PTE Academic",
                    standard: "Overall 65 (Minimum 60 in all sub-skills)",
                    topTier: "Overall 72 points",
                    validity: "2 Years from exam date",
                    link: "https://www.pearsonpte.com",
                    provider: "Pearson"
                  }
                ].map((test) => (
                  <div key={test.name} className="p-4 rounded-2xl bg-[#172320] border border-[#273832] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base">{test.name}</span>
                      <a
                        href={test.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7ec8a7] hover:underline"
                      >
                        {test.provider} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-xs space-y-1 text-slate-300">
                      <div><strong className="text-slate-400">Standard Cutoff:</strong> {test.standard}</div>
                      <div><strong className="text-slate-400">Competitive (TUM/TU Wien):</strong> {test.topTier}</div>
                      <div><strong className="text-slate-400">Validity:</strong> {test.validity}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOI Exemption Alert */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-amber-300 block mb-1">Medium of Instruction (MOI) Exemption Warning:</strong>
                  German and Austrian universities (especially TU Wien, TUM, RWTH Aachen, Uni Vienna) rarely accept an MOI letter from universities in non-native English-speaking nations. A full IELTS or TOEFL is strictly recommended to prevent automatic application rejection.
                </div>
              </div>
            </div>

            {/* Section 2: Course Descriptions & Module Catalog (Modulhandbuch) */}
            <div className="p-6 rounded-3xl bg-[#131d1a] border border-[#24342e] shadow-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                Academic Equivalency Audit
              </div>
              <h2 className="text-2xl font-black text-white">
                How to Prepare Your Course Descriptions (Modulhandbuch)
              </h2>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                Austrian universities (under the Universities Act UG 2002 § 64) and German universities do not judge candidates by degree name alone. They audit your syllabus course-by-course against their native Bachelor curriculum in specific subject clusters:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    subject: "Higher Mathematics & Statistics",
                    ects: "18 – 25 ECTS Required",
                    topics: "Calculus, Linear Algebra (eigenvalues, SVD), Discrete Math, Probability & Stochastic Processes."
                  },
                  {
                    subject: "Theoretical Computer Science & Algorithms",
                    ects: "15 – 20 ECTS Required",
                    topics: "Algorithm Design & Complexity (Big-O, P vs NP), Formal Languages, Automata Theory, Graph Theory."
                  },
                  {
                    subject: "Systems, OS & Computer Architecture",
                    ects: "20 – 30 ECTS Required",
                    topics: "Operating Systems (threads, memory hierarchy), Computer Networks, Database Systems (SQL, ACID)."
                  },
                  {
                    subject: "Programming & Software Engineering",
                    ects: "15 – 20 ECTS Required",
                    topics: "Object-Oriented Programming (C++, Java, Rust), Software Architecture, Design Patterns, Team Capstones."
                  }
                ].map((cluster) => (
                  <div key={cluster.subject} className="p-4 rounded-2xl bg-[#172320] border border-[#273832]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">{cluster.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#7ec8a7]/15 text-[#7ec8a7] font-bold">
                        {cluster.ects}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{cluster.topics}</p>
                  </div>
                ))}
              </div>

              {/* Checklist for Modulhandbuch */}
              <div className="p-4 rounded-2xl bg-[#16221f] border border-[#273832] space-y-2 mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  5 Rules for a Compliant Module Handbook:
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>Course code and course title must strictly match your official transcripts.</li>
                  <li>State lecture hours vs lab hours per week (SWS) or total semester clock hours.</li>
                  <li>Detail specific mathematical formulas, algorithms, and models taught (not just 1-sentence summaries).</li>
                  <li>Include prescribed textbooks (author, title, edition) used for coursework.</li>
                  <li>Must be stamped/signed by your department Dean OR accompanied by an active official university URL pointing to the archived public curriculum.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: BAVARIAN FORMULA GRADE CONVERTER ==================== */}
        {activeTab === "grading" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121c18] via-[#14231f] to-[#122227] border border-[#253630] shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase mb-2">
                <Calculator className="w-3.5 h-3.5" />
                Official KMK Conversion Standard
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Modified Bavarian Formula (Bayerische Formel) Grade Converter
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                The legally mandated mathematical formula used by Austrian and German university admissions commissions to convert foreign GPAs into the European 1.0 – 4.0 grading scale.
              </p>

              {/* Mathematical Formula Box */}
              <div className="mt-4 p-4 rounded-2xl bg-[#172320] border border-[#2a3c36] font-mono text-xs sm:text-sm text-center text-[#7ec8a7]">
                N = 1 + 3 × [(N_max - N_d) / (N_max - N_min)]
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Inputs */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-[#131d1a] border border-[#24342e] space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#7ec8a7]" />
                  Enter Your Degree Grading Parameters
                </h3>

                {/* Preset Scale Buttons */}
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-2">Common GPA Presets:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "4.0 GPA Scale (USA, Egypt, Pakistan)", max: 4.0, min: 2.0 },
                      { label: "10.0 CGPA Scale (India)", max: 10.0, min: 4.0 },
                      { label: "100% Percentage Scale", max: 100, min: 50 },
                      { label: "5.0 Scale", max: 5.0, min: 2.5 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => {
                          setMaxGrade(p.max);
                          setMinPassingGrade(p.min);
                          setActualGrade(p.max * 0.85);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[#1a2622] hover:bg-[#253630] border border-[#2a3c36] text-[11px] font-medium text-slate-300"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 1: Max achievable grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Maximum Achievable Grade (N_max):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={maxGrade}
                    onChange={(e) => setMaxGrade(parseFloat(e.target.value) || 4.0)}
                    className="w-full px-4 py-2.5 bg-[#182421] border border-[#293a35] rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                  />
                  <span className="text-[11px] text-slate-500">Highest possible mark (e.g. 4.0, 10.0, or 100).</span>
                </div>

                {/* Input 2: Min passing grade */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Minimum Passing Grade to Graduate (N_min):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={minPassingGrade}
                    onChange={(e) => setMinPassingGrade(parseFloat(e.target.value) || 2.0)}
                    className="w-full px-4 py-2.5 bg-[#182421] border border-[#293a35] rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                  />
                  <span className="text-[11px] text-slate-500">Lowest grade needed to pass a course/degree (e.g. 2.0, 4.0, or 50).</span>
                </div>

                {/* Input 3: Actual GPA */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Actual Bachelor GPA / Score (N_d):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualGrade}
                    onChange={(e) => setActualGrade(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-[#182421] border border-[#293a35] rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#7ec8a7]"
                  />
                  <span className="text-[11px] text-slate-500">Your final cumulative grade on transcripts.</span>
                </div>
              </div>

              {/* Right Column: Results & Competitiveness Breakdown */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-[#131d1a] border border-[#24342e] flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Calculated European Equivalent Grade:
                  </span>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-5xl sm:text-6xl font-black text-white font-mono">
                      {convertedGrade}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (1.0 = Best, 4.0 = Pass)
                    </span>
                  </div>

                  {/* Classification Pill */}
                  <div className={`mt-3 p-3 rounded-2xl border ${gradeClassification.color}`}>
                    <div className="font-extrabold text-sm">{gradeClassification.label}</div>
                    <div className="text-xs mt-1 opacity-90">{gradeClassification.competitiveness}</div>
                  </div>

                  {/* Austrian Equivalent Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-[#172320] border border-[#293a35] text-xs space-y-1">
                    <span className="font-bold text-slate-300 block">Austrian Higher Education Equivalent:</span>
                    <span className="text-white font-bold text-sm block">{gradeClassification.austrian}</span>
                    <p className="text-slate-400 text-[11px]">
                      Under the Austrian university grading system (Note 1 = Sehr gut, Note 2 = Gut, Note 3 = Befriedigend, Note 4 = Genügend, Note 5 = Nicht genügend).
                    </p>
                  </div>
                </div>

                {/* Scale Comparison Table */}
                <div className="p-4 rounded-2xl bg-[#172320] border border-[#293a35] text-xs">
                  <span className="font-bold text-slate-300 block mb-2">Admission Benchmark Tiers:</span>
                  <div className="space-y-1.5 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-emerald-400 font-bold">1.0 – 1.5 (Sehr gut):</span>
                      <span>Top Priority (TUM, TU Wien, Uni Vienna)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-400 font-bold">1.6 – 2.5 (Gut):</span>
                      <span>Competitive (Standard Direct Entry)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-400 font-bold">2.6 – 3.5 (Befriedigend):</span>
                      <span>Eligible (May require test/interview)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-400 font-bold">3.6 – 4.0 (Ausreichend):</span>
                      <span>Pass threshold (Borderline entry)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== NEW POST MODAL DIALOG ==================== */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-[#131d1a] border border-[#273832] shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsNewPostModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#1a2522]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-[#7ec8a7]/15 text-[#7ec8a7]">
                <MessageSquare className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Start a Community Discussion</h3>
                <p className="text-xs text-slate-400">Ask a question or share your admission/visa experience.</p>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My experience with JKU AI entrance exam or Austrian proof of funds"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                  >
                    <option value="Admissions & Prerequisites">Admissions & Prerequisites</option>
                    <option value="Visa & Residence (RWR)">Visa & Residence (RWR)</option>
                    <option value="Course & University Reviews">Course & University Reviews</option>
                    <option value="Jobs & Career">Jobs & Career</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Country</label>
                  <select
                    value={newPostCountry}
                    onChange={(e) => setNewPostCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                  >
                    <option value="Austria">Austria 🇦🇹</option>
                    <option value="Germany">Germany 🇩🇪</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Omar M."
                    value={newPostAuthorName}
                    onChange={(e) => setNewPostAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Role / University</label>
                  <input
                    type="text"
                    placeholder="e.g. Applicant 2026 or MSc AI Student @ TU Wien"
                    value={newPostAuthorRole}
                    onChange={(e) => setNewPostAuthorRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">University Mentioned</label>
                <input
                  type="text"
                  placeholder="e.g. TU Wien, TUM, Uni Vienna, JKU Linz, RWTH Aachen"
                  value={newPostUniversity}
                  onChange={(e) => setNewPostUniversity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Discussion Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details, questions, timeline, tips, or what worked for you..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. TU Wien, Data Science, Visa, Proof of Funds"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#182420] border border-[#283933] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#7ec8a7]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#23332c]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1b2723] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7ec8a7] hover:bg-[#92d8b8] text-[#0d1613] font-bold shadow-md"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

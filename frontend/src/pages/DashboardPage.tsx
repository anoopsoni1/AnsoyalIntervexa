import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookmarkCheck,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Briefcase,
  TrendingUp,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { CandidateCard } from "../components/CandidateCard";
import { ShortlistModal } from "../components/ShortlistModal";
import { CandidateCardSkeleton } from "../components/SkeletonLoader";
import { DashboardMetricsDTO, RecruiterCandidateDTO } from "../types";
import { SEOHead } from "../components/SEOHead";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCandidateForShortlist, setSelectedCandidateForShortlist] =
    useState<RecruiterCandidateDTO | null>(null);
  const [heroSearch, setHeroSearch] = useState("");

  const { data, isLoading, refetch } = useQuery<DashboardMetricsDTO>({
    queryKey: ["dashboardMetrics"],
    queryFn: () => api.get("/dashboard/metrics"),
    refetchInterval: 60000,
  });

  const quickFilters = [
    "React",
    "Node.js",
    "Python",
    "Java",
    "Full Stack",
    "Frontend",
    "Backend",
    "TypeScript",
  ];

  const handleQuickFilterClick = (filter: string) => {
    navigate(`/candidates?skills=${encodeURIComponent(filter)}`);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/candidates?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/candidates");
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-300">
      <SEOHead title="Talent Intelligence Dashboard" noindex={true} canonicalPath="/dashboard" />
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
              Talent Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Talent Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover candidates through verified proof of skill.
          </p>
        </div>

        <Link
          to="/candidates"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <span>Discover Talent</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Available Talent",
            value: data?.totalAvailableCandidates || 12,
            icon: Users,
            color: "text-cyan-400",
            desc: "Verified profiles open to discovery",
          },
          {
            label: "Shortlisted",
            value: data?.shortlistedCount || 0,
            icon: BookmarkCheck,
            color: "text-emerald-400",
            desc: "Active candidates in your pipeline",
          },
          {
            label: "New Candidates",
            value: 6,
            icon: Sparkles,
            color: "text-indigo-400",
            desc: "Added this week with verified proof",
          },
          {
            label: "Active Searches",
            value: 3,
            icon: Briefcase,
            color: "text-amber-400",
            desc: "Role requirements monitored",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="glass-2 p-5 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">{metric.label}</span>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div className={`text-3xl font-black font-mono tracking-tight ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{metric.desc}</div>
            </div>
          );
        })}
      </div>

      {/* TALENT DISCOVERY HERO */}
      <div className="glass-3 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/25 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Candidate Sourcing</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Find people who can <span className="text-cyan-400">actually do the work</span>.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Evaluate software engineers based on real test execution, AI technical interviews, GitHub commits, and deployed applications rather than keyword-stuffed resumes.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleHeroSearch} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by role, skill, technology (e.g. React, Node.js, Python)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
            >
              Search Talent
            </button>
          </form>

          {/* Quick Filters */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Quick Filters:</span>
            {quickFilters.map((qf) => (
              <button
                key={qf}
                type="button"
                onClick={() => handleQuickFilterClick(qf)}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all"
              >
                {qf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RECOMMENDED TALENT SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Recommended Verified Talent</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Top engineers scored across coding assessments, project depth, and consistency.
            </p>
          </div>

          <Link
            to="/candidates"
            className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Talent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CandidateCardSkeleton />
            <CandidateCardSkeleton />
            <CandidateCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.recommendedCandidates || []).slice(0, 6).map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onShortlist={(c) => setSelectedCandidateForShortlist(c)}
              />
            ))}
          </div>
        )}
      </div>

      {/* RECENT ACTIVITY & AUDIT TIMELINE */}
      <div className="glass-2 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Recent Team Sourcing Activity</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Enterprise Audit Log</span>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {[
            {
              action: "Candidate Viewed",
              detail: "Anoop Soni (Full Stack Developer) profile & credibility examined",
              time: "10m ago",
              user: "Recruiter Lead",
            },
            {
              action: "Candidate Shortlisted",
              detail: "Dev Bhraman added to 'Frontend Architect' hiring pipeline",
              time: "1h ago",
              user: "Recruiter Lead",
            },
            {
              action: "Candidate Contacted",
              detail: "Opportunity relay sent to Hemant Singh regarding Full Stack opening",
              time: "3h ago",
              user: "Recruiter Lead",
            },
            {
              action: "Evidence Inspected",
              detail: "Priya Sharma's verified distributed systems test assertions checked",
              time: "5h ago",
              user: "Technical Evaluator",
            },
          ].map((act, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <div>
                  <span className="font-bold text-white mr-2">{act.action}:</span>
                  <span className="text-slate-400">{act.detail}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 shrink-0">{act.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Shortlist Modal */}
      {selectedCandidateForShortlist && (
        <ShortlistModal
          candidate={selectedCandidateForShortlist}
          onClose={() => setSelectedCandidateForShortlist(null)}
          onSuccess={() => {
            setSelectedCandidateForShortlist(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

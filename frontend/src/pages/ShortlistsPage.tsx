import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Tag,
  Trash2,
  Filter,
  ShieldCheck,
  ArrowRight,
  Mail,
  UserCheck,
} from "lucide-react";
import { api } from "../services/api";
import { ShortlistDTO, ShortlistStatus } from "../types";
import { SEOHead } from "../components/SEOHead";

const STAGES: { label: string; status: ShortlistStatus; color: string }[] = [
  { label: "Shortlisted", status: "SHORTLISTED", color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20" },
  { label: "Contacted", status: "CONTACTED", color: "text-blue-400 border-blue-500/30 bg-blue-950/20" },
  { label: "Interviewing", status: "INTERVIEWING", color: "text-amber-400 border-amber-500/30 bg-amber-950/20" },
  { label: "Hired", status: "HIRED", color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20" },
  { label: "Archived", status: "REJECTED", color: "text-slate-400 border-white/10 bg-white/5" },
];

export const ShortlistsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStage = (searchParams.get("stage") as ShortlistStatus) || "ALL";
  const [activeFilter, setActiveFilter] = useState<ShortlistStatus | "ALL">(initialStage);

  const { data: shortlists = [], isLoading, refetch } = useQuery<ShortlistDTO[]>({
    queryKey: ["shortlists"],
    queryFn: () => api.get("/shortlists"),
  });

  const handleStageChange = async (shortlistId: string, newStatus: ShortlistStatus) => {
    try {
      await api.patch(`/shortlists/${shortlistId}`, { status: newStatus });
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to update stage");
    }
  };

  const handleRemove = async (shortlistId: string) => {
    if (!window.confirm("Remove candidate from company pipeline?")) return;
    try {
      await api.delete(`/shortlists/${shortlistId}`);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to remove");
    }
  };

  const filteredShortlists =
    activeFilter === "ALL"
      ? shortlists
      : shortlists.filter((s) => s.status === activeFilter);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <SEOHead title="Shortlisted Talent Pipeline" noindex={true} canonicalPath="/shortlists" />
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
              Pipeline Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hiring Pipeline & Shortlists
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage candidates across active recruitment stages with private team notes and status tracking.
          </p>
        </div>

        {/* Filter Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono font-semibold glass-2 p-1 border-white/10">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === "ALL"
                ? "bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({shortlists.length})
          </button>
          {STAGES.map((st) => {
            const count = shortlists.filter((s) => s.status === st.status).length;
            return (
              <button
                key={st.status}
                onClick={() => setActiveFilter(st.status)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === st.status
                    ? "bg-cyan-500 text-black font-bold shadow-sm shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Shortlist Items Feed */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 glass-2 animate-pulse" />
          ))}
        </div>
      ) : filteredShortlists.length === 0 ? (
        <div className="glass-2 p-16 text-center space-y-4">
          <BookmarkCheck className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No candidates in this stage</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Discover verified talent from the candidate directory and click "Shortlist" to add them to your hiring workflow.
          </p>
          <Link
            to="/candidates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            <span>Browse Candidates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredShortlists.map((item) => {
            const candidate = item.candidate;
            const currentStageObj = STAGES.find((st) => st.status === item.status) || STAGES[0];

            return (
              <div
                key={item.id}
                className="glass-2 p-5 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                {/* Left: Candidate Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-white/15 flex items-center justify-center text-white font-bold text-base shrink-0 font-mono">
                    {candidate?.name
                      ? candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "C"}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/candidates/${item.candidateId}`}
                        className="font-bold text-sm text-white hover:text-cyan-400 transition-colors"
                      >
                        {candidate?.name || "Candidate Profile"}
                      </Link>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${currentStageObj.color}`}
                      >
                        {currentStageObj.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono">
                      {candidate?.role || "Software Engineer"}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="text-cyan-400 font-bold">
                        Credibility: {candidate?.credibility?.overallScore || 85}/100
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Stage Selector & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono text-xs">
                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) => handleStageChange(item.id, e.target.value as ShortlistStatus)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-medium focus:outline-none focus:border-cyan-500/50"
                  >
                    {STAGES.map((st) => (
                      <option key={st.status} value={st.status}>
                        Stage: {st.label}
                      </option>
                    ))}
                  </select>

                  <Link
                    to={`/candidates/${item.candidateId}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                    title="View Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

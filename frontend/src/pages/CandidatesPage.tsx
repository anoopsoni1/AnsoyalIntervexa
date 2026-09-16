import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";
import { CandidateCard } from "../components/CandidateCard";
import { FilterSidebar } from "../components/FilterSidebar";
import { ShortlistModal } from "../components/ShortlistModal";
import { CandidateCardSkeleton } from "../components/SkeletonLoader";
import { RecruiterCandidateDTO, VerificationLevel } from "../types";
import { SEOHead } from "../components/SEOHead";

export const CandidatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() => {
    const s = searchParams.get("skills");
    return s ? s.split(",").map((x) => x.trim()) : [];
  });
  const [minCredibility, setMinCredibility] = useState<number>(() => {
    const c = searchParams.get("minCredibility");
    return c ? parseInt(c, 10) : 0;
  });
  const [selectedVerification, setSelectedVerification] = useState<VerificationLevel | "">("");
  const [selectedRole, setSelectedRole] = useState<string>("All Roles");
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("credibility");

  const [shortlistCandidate, setShortlistCandidate] = useState<RecruiterCandidateDTO | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedSkills([]);
    setMinCredibility(0);
    setSelectedVerification("");
    setSelectedRole("All Roles");
    setPage(1);
    setSort("credibility");
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "candidates",
      debouncedSearch,
      selectedSkills.join(","),
      minCredibility,
      selectedVerification,
      selectedRole,
      page,
      sort,
    ],
    queryFn: () =>
      api.get("/candidates", {
        q: debouncedSearch || (selectedRole !== "All Roles" ? selectedRole : undefined),
        skills: selectedSkills.length > 0 ? selectedSkills.join(",") : undefined,
        minCredibility: minCredibility > 0 ? minCredibility : undefined,
        verificationLevel: selectedVerification || undefined,
        page,
        limit: 12,
        sort,
      }),
  });

  const candidates: RecruiterCandidateDTO[] = data?.candidates || [];
  const pagination = data?.pagination || { page: 1, total: 0, totalPages: 1 };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <SEOHead title="Discover Verified Talent" noindex={true} canonicalPath="/candidates" />
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
              Talent Discovery Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Discover Verified Talent
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse software engineers backed by code execution tests, AI interview communication scores, and verified repositories.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          <span className="font-semibold text-slate-400">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500/50"
          >
            <option value="credibility">Highest Credibility</option>
            <option value="best_match">Best Match</option>
            <option value="recent">Most Recent</option>
            <option value="verified">Most Verified Signals</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar + Candidate Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 sticky top-20">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
            minCredibility={minCredibility}
            setMinCredibility={setMinCredibility}
            selectedVerification={selectedVerification}
            setSelectedVerification={setSelectedVerification}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            resetFilters={resetFilters}
          />
        </div>

        {/* Candidate Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Total Results Counter */}
          <div className="glass-2 p-3.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>
                <strong className="text-white">{candidates.length}</strong> candidates displayed ·{" "}
                <strong className="text-cyan-400">{pagination.total}</strong> qualified total
              </span>
            </span>
            {pagination.totalPages > 1 && (
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CandidateCardSkeleton />
              <CandidateCardSkeleton />
              <CandidateCardSkeleton />
              <CandidateCardSkeleton />
            </div>
          ) : isError ? (
            <div className="glass-2 p-10 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">
                Unable to query talent pool
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {(error as any)?.message || "Student Platform connection temporarily interrupted."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-cyan-500 text-black font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
              >
                Retry Search
              </button>
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onShortlist={(c) => setShortlistCandidate(c)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-2 p-12 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">
                No candidates match your current filter parameters
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Try widening your skill filters or lowering the minimum credibility score threshold.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </div>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Shortlist Modal */}
      {shortlistCandidate && (
        <ShortlistModal
          candidate={shortlistCandidate}
          onClose={() => setShortlistCandidate(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};

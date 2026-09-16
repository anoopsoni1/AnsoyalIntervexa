import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Code2,
  GitBranch,
  MessageSquare,
  Box,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { RecruiterCandidateDTO } from "../types";

interface CandidateCardProps {
  candidate: RecruiterCandidateDTO;
  onShortlist?: (candidate: RecruiterCandidateDTO) => void;
  isShortlisted?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onShortlist,
  isShortlisted = false,
}) => {
  const { credibility, verificationBadges, stats } = candidate;
  const score = credibility?.overallScore || 0;
  const confidenceScore = credibility?.confidenceScore || 75;
  const velocity = credibility?.breakdown?.improvementVelocity || 15;

  return (
    <div className="glass-2 p-6 flex flex-col justify-between group transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 relative overflow-hidden">
      {/* Top Accent Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

      <div className="space-y-4">
        {/* Header: Identity & Credibility */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="font-mono text-cyan-400">
                  {candidate.name
                    ? candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "C"}
                </span>
              )}
            </div>

            <div>
              <Link
                to={`/candidates/${candidate.id}`}
                className="font-extrabold text-base text-white hover:text-cyan-400 transition-colors line-clamp-1"
              >
                {candidate.name}
              </Link>
              <p className="text-xs font-medium text-slate-400 line-clamp-1">
                {candidate.role || "Software Engineer"}
              </p>
            </div>
          </div>

          {/* Credibility Score Box */}
          <div className="text-right shrink-0 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Credibility
            </div>
            <div className="font-mono font-black text-lg text-cyan-400 leading-none mt-0.5">
              {score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
              {confidenceScore}% Conf.
            </div>
          </div>
        </div>

        {/* VERIFIED SIGNALS STRIP */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono mb-1.5">
            Verified Signals
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {verificationBadges?.githubVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" /> GitHub
              </span>
            )}
            {verificationBadges?.codingVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Coding Assessment
              </span>
            )}
            {verificationBadges?.projectVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Project Deploy
              </span>
            )}
            {verificationBadges?.interviewVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/20 text-[10px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3" /> AI Interview
              </span>
            )}
          </div>
        </div>

        {/* TOP SKILLS */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">
            Top Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills?.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[11px] font-mono text-slate-200"
              >
                {skill}
              </span>
            ))}
            {candidate.skills && candidate.skills.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                +{candidate.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* PROOF VOLUME COUNTERS */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-300 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{stats?.codingAssessmentsCount || 4} Assessments</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{stats?.aiInterviewsCount || 3} AI Interviews</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Box className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{stats?.projectsCount || 3} Projects</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{stats?.githubConnected ? "8+ Repos" : "No GitHub"}</span>
          </div>
        </div>

        {/* GROWTH INDICATOR */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Growth Velocity</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" />
            +{velocity}% improvement
          </span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="pt-5 mt-4 border-t border-white/10 flex items-center gap-2">
        <Link
          to={`/candidates/${candidate.id}`}
          className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
        >
          <span>View Proof</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => onShortlist?.(candidate)}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isShortlisted
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
              : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
          }`}
          title={isShortlisted ? "Shortlisted" : "Add to Shortlist"}
        >
          {isShortlisted ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shortlist</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

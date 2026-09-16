import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  PlusCircle,
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  DollarSign,
  Layers,
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  requiredSkills: string[];
  minCredibility: number;
  requiredVerifications: string[];
  matchingCount: number;
  bestMatchScore: number;
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  createdAt: string;
}

const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job_001",
    title: "Senior Full Stack Engineer (TypeScript & React)",
    department: "Core Engineering",
    location: "Remote / Hybrid",
    type: "Full-Time",
    salaryRange: "$130k - $160k",
    requiredSkills: ["React", "TypeScript", "Node.js", "MongoDB"],
    minCredibility: 80,
    requiredVerifications: ["Coding Verified", "Project Verified", "GitHub Verified"],
    matchingCount: 4,
    bestMatchScore: 94,
    status: "ACTIVE",
    createdAt: "3 days ago",
  },
  {
    id: "job_002",
    title: "AI & Distributed Systems Backend Engineer",
    department: "Platform & Infrastructure",
    location: "San Francisco / Remote",
    type: "Full-Time",
    salaryRange: "$150k - $190k",
    requiredSkills: ["Node.js", "Python", "Docker", "PostgreSQL"],
    minCredibility: 85,
    requiredVerifications: ["Coding Verified", "Interview Verified"],
    matchingCount: 3,
    bestMatchScore: 91,
    status: "ACTIVE",
    createdAt: "1 week ago",
  },
  {
    id: "job_003",
    title: "UI/UX Architect & Frontend Specialist",
    department: "Design & Experience",
    location: "Remote",
    type: "Full-Time",
    salaryRange: "$120k - $145k",
    requiredSkills: ["React", "TypeScript", "TailwindCSS"],
    minCredibility: 78,
    requiredVerifications: ["Project Verified"],
    matchingCount: 5,
    bestMatchScore: 96,
    status: "ACTIVE",
    createdAt: "2 weeks ago",
  },
];

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOBS);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMatchTalent = (job: JobPosting) => {
    const skillsParam = encodeURIComponent(job.requiredSkills.slice(0, 2).join(","));
    navigate(`/candidates?skills=${skillsParam}&minCredibility=${job.minCredibility}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
              Talent Matching Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Active Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Match open roles against authentic verified skills and candidate credibility scores.
          </p>
        </div>

        <Link
          to="/jobs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-2 p-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter roles by title, skill, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredJobs.length}</span> active positions
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="glass-2 p-6 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* Left Info */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {job.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {job.department} · {job.type}
                </span>
                <span className="text-xs text-slate-500 font-mono">Posted {job.createdAt}</span>
              </div>

              <h2 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  {job.salaryRange}
                </span>
                <span className="flex items-center gap-1 font-mono text-cyan-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Min. Credibility: {job.minCredibility}/100
                </span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-mono"
                  >
                    {skill}
                  </span>
                ))}
                {job.requiredVerifications.map((v) => (
                  <span
                    key={v}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/25 text-cyan-300 font-mono flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Matching Box */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 lg:border-l lg:border-white/10 lg:pl-6">
              <div className="text-left lg:text-right">
                <div className="flex items-center lg:justify-end gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explainable Match</span>
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono tracking-tight">
                  {job.bestMatchScore}% <span className="text-xs text-slate-400 font-normal">Top Match</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {job.matchingCount} verified candidates qualify
                </div>
              </div>

              <button
                onClick={() => handleMatchTalent(job)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black border border-white/15 text-white font-bold text-xs transition-all shadow-md"
              >
                <Users className="w-4 h-4" />
                <span>Find Matching Talent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

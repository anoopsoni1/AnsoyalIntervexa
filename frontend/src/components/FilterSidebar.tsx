import React, { useState } from "react";
import { Filter, RotateCcw, Check, Sparkles, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { VerificationLevel } from "../types";

interface FilterSidebarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedSkills: string[];
  toggleSkill: (skill: string) => void;
  minCredibility: number;
  setMinCredibility: (val: number) => void;
  selectedVerification: VerificationLevel | "";
  setSelectedVerification: (val: VerificationLevel | "") => void;
  selectedRole?: string;
  setSelectedRole?: (role: string) => void;
  resetFilters: () => void;
}

const COMMON_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "TailwindCSS",
  "Kubernetes",
  "Go",
  "AWS",
];

const ROLES = [
  "All Roles",
  "Full Stack Developer",
  "Frontend Engineer",
  "Backend Engineer",
  "AI/ML Engineer",
  "DevOps Engineer",
];

const VERIFICATION_OPTIONS: { label: string; value: VerificationLevel | "" }[] = [
  { label: "All Candidates", value: "" },
  { label: "Assessment Verified", value: "ASSESSMENT_VERIFIED" },
  { label: "GitHub Verified", value: "GITHUB_VERIFIED" },
  { label: "Interview Verified", value: "INTERVIEW_VERIFIED" },
  { label: "Project Verified", value: "PROJECT_VERIFIED" },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  search,
  setSearch,
  selectedSkills,
  toggleSkill,
  minCredibility,
  setMinCredibility,
  selectedVerification,
  setSelectedVerification,
  selectedRole = "All Roles",
  setSelectedRole,
  resetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minCoding, setMinCoding] = useState(0);
  const [minCommunication, setMinCommunication] = useState(0);
  const [minConsistency, setMinConsistency] = useState(0);

  return (
    <div className="glass-2 p-5 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-xs text-white uppercase tracking-wider font-mono">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Talent Filters</span>
        </div>
        <button
          onClick={() => {
            resetFilters();
            setMinCoding(0);
            setMinCommunication(0);
            setMinConsistency(0);
          }}
          className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Role Selector */}
      {setSelectedRole && (
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
            Target Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 font-mono"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Minimum Credibility Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Min Credibility Score
          </label>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md">
            {minCredibility}+
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="95"
          step="5"
          value={minCredibility}
          onChange={(e) => setMinCredibility(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>0 (Any)</span>
          <span>70 (Proficient)</span>
          <span>85+ (Elite)</span>
        </div>
      </div>

      {/* Verification Level */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
          Required Verification
        </label>
        <div className="space-y-1">
          {VERIFICATION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSelectedVerification(opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors font-mono ${
                selectedVerification === opt.value
                  ? "bg-cyan-950/50 text-cyan-300 font-bold border border-cyan-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{opt.label}</span>
              {selectedVerification === opt.value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Multiselect */}
      <div>
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
          Verified Skills
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                  isSelected
                    ? "bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible Advanced Proof Dimension Filters */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-white py-1"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Advanced Dimension Filters</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-3 mt-2 border-t border-white/5 animate-in fade-in duration-200">
            {/* Coding Ability Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <span className="text-slate-400">Min Coding Ability</span>
                <span className="text-cyan-400 font-bold">{minCoding}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minCoding}
                onChange={(e) => setMinCoding(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-cyan-400"
              />
            </div>

            {/* Communication Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <span className="text-slate-400">Min Communication</span>
                <span className="text-indigo-400 font-bold">{minCommunication}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minCommunication}
                onChange={(e) => setMinCommunication(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-indigo-400"
              />
            </div>

            {/* Consistency Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <span className="text-slate-400">Min Consistency</span>
                <span className="text-emerald-400 font-bold">{minConsistency}+</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minConsistency}
                onChange={(e) => setMinConsistency(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded accent-emerald-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  PlusCircle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Save,
} from "lucide-react";

export const JobCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Remote");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [salaryRange, setSalaryRange] = useState("$120,000 - $160,000");
  const [description, setDescription] = useState("");
  const [minCredibility, setMinCredibility] = useState(75);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Node.js"]);
  const [requiredVerifications, setRequiredVerifications] = useState<string[]>([
    "Coding Verified",
    "Project Verified",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleVerification = (v: string) => {
    if (requiredVerifications.includes(v)) {
      setRequiredVerifications(requiredVerifications.filter((item) => item !== v));
    } else {
      setRequiredVerifications([...requiredVerifications, v]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/jobs");
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back Button */}
      <button
        onClick={() => navigate("/jobs")}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Active Jobs</span>
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
            Role Setup
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Evidence-Based Job Opening
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specify role requirements, required skill evidence, and minimum credibility thresholds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Role Details Card */}
        <div className="glass-2 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Role Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Full Stack Engineer (TypeScript & React)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Engineering">Core Engineering</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Design & Frontend">Design & Frontend</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Product & Systems">Product & Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location & Workplace
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / Hybrid, San Francisco"
                className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Contract / Project">Contract / Project</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Technical Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $130,000 - $160,000"
                className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role Description & Key Responsibilities
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the challenges, stack, and goals for this role..."
                className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Evidence & Credibility Requirements Card */}
        <div className="glass-2 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Proof-of-Skill Thresholds</span>
          </h2>

          {/* Credibility Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Minimum Credibility Score</span>
              <span className="font-mono text-cyan-400 font-bold">{minCredibility} / 100</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={minCredibility}
              onChange={(e) => setMinCredibility(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Only candidates whose multi-dimensional evidence score meets or exceeds this threshold will qualify for instant matching.
            </p>
          </div>

          {/* Required Verifications */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Required Evidence Verifications
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { name: "Coding Verified", desc: "Passed verified coding assessments" },
                { name: "Project Verified", desc: "Production deployment & repository proof" },
                { name: "Interview Verified", desc: "Technical AI interview communication verified" },
                { name: "GitHub Verified", desc: "Continuous commit history & repo activity" },
              ].map((item) => (
                <div
                  key={item.name}
                  onClick={() => toggleVerification(item.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    requiredVerifications.includes(item.name)
                      ? "bg-cyan-950/40 border-cyan-500/40 text-white"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      requiredVerifications.includes(item.name)
                        ? "text-cyan-400"
                        : "text-slate-600"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Skills Chips */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required Technical Skills (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-cyan-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add skill (e.g. React, TypeScript, Python)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="w-full px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing Job..." : "Publish Job Opening"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

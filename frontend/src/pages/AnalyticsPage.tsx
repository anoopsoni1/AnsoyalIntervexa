import React from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
  Filter,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SEOHead } from "../components/SEOHead";

const FUNNEL_DATA = [
  { stage: "Profiles Viewed", count: 142, fill: "#06b6d4" },
  { stage: "Shortlisted", count: 38, fill: "#38bdf8" },
  { stage: "Contacted", count: 24, fill: "#6366f1" },
  { stage: "Interviewing", count: 12, fill: "#a855f7" },
  { stage: "Offers & Hired", count: 6, fill: "#10b981" },
];

const CREDIBILITY_RADAR_DATA = [
  { dimension: "Coding Ability", average: 88, fullMark: 100 },
  { dimension: "Communication", average: 82, fullMark: 100 },
  { dimension: "Consistency", average: 87, fullMark: 100 },
  { dimension: "Resume Quality", average: 90, fullMark: 100 },
  { dimension: "Project Depth", average: 86, fullMark: 100 },
  { dimension: "Velocity", average: 84, fullMark: 100 },
];

const SKILL_DEMAND_DATA = [
  { skill: "React", verifiedTalent: 84, averageScore: 91 },
  { skill: "TypeScript", verifiedTalent: 76, averageScore: 89 },
  { skill: "Node.js", verifiedTalent: 72, averageScore: 88 },
  { skill: "Python", verifiedTalent: 65, averageScore: 87 },
  { skill: "PostgreSQL", verifiedTalent: 58, averageScore: 85 },
  { skill: "Docker", verifiedTalent: 52, averageScore: 84 },
];

const VERIFICATION_PIE = [
  { name: "Coding Verified", value: 38, color: "#06b6d4" },
  { name: "Project Verified", value: 28, color: "#10b981" },
  { name: "Interview Verified", value: 20, color: "#6366f1" },
  { name: "GitHub Verified", value: 14, color: "#a855f7" },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <SEOHead title="Recruiter Pipeline Analytics" noindex={true} canonicalPath="/analytics" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
              Talent Intelligence & Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruiter Pipeline Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time pipeline metrics, candidate credibility distributions, and verified talent throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Timeframe:</span>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 font-bold">
            Last 30 Days
          </span>
        </div>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Talent Conversion Rate",
            val: "15.8%",
            change: "+4.2%",
            sub: "Viewed to Interviewed",
            color: "text-cyan-400",
          },
          {
            title: "Avg Candidate Credibility",
            val: "86.2",
            change: "+3.1 pts",
            sub: "Across all evaluated talent",
            color: "text-emerald-400",
          },
          {
            title: "Proof Verification Rate",
            val: "91.4%",
            change: "+6.8%",
            sub: "Backed by multi-source evidence",
            color: "text-indigo-400",
          },
          {
            title: "Avg Days to Verification",
            val: "2.4 d",
            change: "-0.8 d",
            sub: "Accelerated technical evaluation",
            color: "text-amber-400",
          },
        ].map((stat) => (
          <div key={stat.title} className="glass-2 p-5 space-y-2">
            <div className="text-xs text-slate-400 font-medium">{stat.title}</div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>
                {stat.val}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {stat.change}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel & Credibility Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <div className="glass-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Hiring Pipeline Throughput</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Total: 142 candidates</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} fontStyle="mono" />
                <YAxis
                  dataKey="stage"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#030712",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Credibility Radar Chart */}
        <div className="glass-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Average Credibility Profile (6 Dimensions)</span>
            </h2>
            <span className="text-[11px] font-mono text-cyan-400">Target Benchmark: 80+</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={CREDIBILITY_RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Radar
                  name="Cohort Average"
                  dataKey="average"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#030712",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Verified Skills & Evidence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Verified Skills Table */}
        <div className="lg:col-span-2 glass-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>In-Demand Verified Skills Distribution</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Ranked by Proof Volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Technical Skill</th>
                  <th className="pb-3 font-semibold">Verified Talent Pool</th>
                  <th className="pb-3 font-semibold">Average Assessment Score</th>
                  <th className="pb-3 font-semibold text-right">Evidence Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {SKILL_DEMAND_DATA.map((row) => (
                  <tr key={row.skill} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold text-white">{row.skill}</td>
                    <td className="py-3 text-slate-300">{row.verifiedTalent} candidates</td>
                    <td className="py-3">
                      <span className="text-cyan-400 font-bold">{row.averageScore}</span>
                      <span className="text-slate-500"> / 100</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> High Proof
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence Verification Share */}
        <div className="glass-2 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Evidence Types</span>
          </h2>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VERIFICATION_PIE}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {VERIFICATION_PIE.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#030712",
                    borderColor: "rgba(255,255,255,0.15)",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            {VERIFICATION_PIE.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

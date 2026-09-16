import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookmarkCheck,
  Building2,
  Settings,
  ShieldCheck,
  Award,
  Briefcase,
  PlusCircle,
  BarChart3,
  MailCheck,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isContactedActive =
    location.pathname === "/shortlists" && location.search.includes("stage=CONTACTED");
  const isShortlistedActive =
    location.pathname === "/shortlists" && !location.search.includes("stage=CONTACTED");

  return (
    <aside className="w-64 bg-[#030712] border-r border-white/10 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/10 bg-black/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              ANSOYAL <span className="text-cyan-400 font-black">AI</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-0.5 font-mono">
              Recruiter Workspace
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3.5 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          {/* Main Dashboard */}
          <div>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Talent Section */}
          <div>
            <div className="px-3.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Talent Discovery
            </div>
            <div className="space-y-1">
              <NavLink
                to="/candidates"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Users className="w-4 h-4" />
                <span>Discover Talent</span>
              </NavLink>

              <NavLink
                to="/shortlists"
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isShortlistedActive
                    ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Shortlisted</span>
              </NavLink>

              <NavLink
                to="/shortlists?stage=CONTACTED"
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isContactedActive
                    ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <MailCheck className="w-4 h-4" />
                <span>Contacted</span>
              </NavLink>
            </div>
          </div>

          {/* Jobs Section */}
          <div>
            <div className="px-3.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Jobs & Matching
            </div>
            <div className="space-y-1">
              <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Briefcase className="w-4 h-4" />
                <span>Active Jobs</span>
              </NavLink>

              <NavLink
                to="/jobs/new"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Job</span>
              </NavLink>
            </div>
          </div>

          {/* Corporate & Intelligence */}
          <div>
            <div className="px-3.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Corporate & Analytics
            </div>
            <div className="space-y-1">
              <NavLink
                to="/company"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Building2 className="w-4 h-4" />
                <span>Company Profile</span>
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </NavLink>

              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Proof Philosophy Callout */}
      <div className="p-4 m-3 rounded-2xl glass-1 border-white/10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Proof-of-Skill Core</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          "Discover people through verified proof of skill, not self-reported claims."
        </p>
      </div>
    </aside>
  );
};

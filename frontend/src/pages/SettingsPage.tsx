import React from "react";
import { User, Shield, Key, Bell, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user, company } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
            Account Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Recruiter Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal recruiter profile, authentication parameters, and workspace perimeter.
        </p>
      </div>

      <div className="glass-2 p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 pb-3 border-b border-white/10">
          <User className="w-4 h-4 text-cyan-400" />
          <span>Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-mono">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Full Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || ""}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Work Email</label>
            <input
              type="text"
              readOnly
              value={user?.email || ""}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Assigned Company</label>
            <input
              type="text"
              readOnly
              value={company?.name || ""}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">Role & Authorization</label>
            <input
              type="text"
              readOnly
              value={user?.role || "RECRUITER"}
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-bold text-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Security & Data Privacy Notice */}
      <div className="glass-2 p-6 sm:p-8 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 pb-3 border-b border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Multi-Tenant Data Isolation</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Your recruiter workspace belongs exclusively to <strong className="text-cyan-400">{company?.name}</strong>. Candidate evaluation notes, talent tags, and pipeline shortlists are strictly isolated at the database layer. Student platform source-of-truth records remain tamper-proof.
        </p>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, ShieldCheck, Globe, MapPin, Briefcase, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CompanyDTO, RecruiterUserDTO } from "../types";
import { SEOHead } from "../components/SEOHead";

export const CompanyPage: React.FC = () => {
  const { user } = useAuth();

  const { data: company, isLoading: loadingCompany } = useQuery<CompanyDTO>({
    queryKey: ["companyProfile"],
    queryFn: () => api.get("/company/profile"),
  });

  const { data: members = [], isLoading: loadingMembers, refetch: refetchMembers } = useQuery<
    RecruiterUserDTO[]
  >({
    queryKey: ["teamMembers"],
    queryFn: () => api.get("/company/members"),
  });

  const isManager = user?.role === "OWNER" || user?.role === "ADMIN";

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await api.patch(`/company/members/${memberId}/role`, { role: newRole });
      refetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <SEOHead title="Company & Team Workspace" noindex={true} canonicalPath="/company" />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
            Employer Workspace
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Company & Team Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Enterprise company profile and hiring team role management.
        </p>
      </div>

      {/* Company Overview Card */}
      <div className="glass-3 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {company?.name || "Ansoyal AI Technologies"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Employer
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                {company?.domain || "ansoyal.com"}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            Account Role: <span className="font-bold text-cyan-400">{user?.role}</span>
          </div>
        </div>

        {/* Company Meta Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Industry</span>
            </div>
            <div className="font-bold text-white text-sm">
              {company?.industry || "AI & Talent Discovery"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Company Size</span>
            </div>
            <div className="font-bold text-white text-sm">
              {company?.size || "50-200 employees"}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location</span>
            </div>
            <div className="font-bold text-white text-sm">
              {company?.location || "San Francisco / Remote"}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="glass-2 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Recruiter Team Roster</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage internal recruiter permissions and collaborative shortlists.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            {members.length} Team Members
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {members.map((member) => (
            <div
              key={member.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white font-mono">
                  {member.name?.[0]?.toUpperCase() || "M"}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{member.name}</div>
                  <div className="text-slate-400 text-xs">{member.email}</div>
                  <div className="text-[11px] text-slate-500">{member.designation}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-bold">
                  {member.role}
                </span>

                {isManager && member.id !== user?.id && (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500/50 text-xs"
                  >
                    <option value="RECRUITER">Role: Recruiter</option>
                    <option value="HIRING_MANAGER">Role: Hiring Manager</option>
                    <option value="ADMIN">Role: Admin</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

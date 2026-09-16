import React from "react";
import { CheckCircle2, GitBranch, Code2, MessageSquare, Box, Award, AlertCircle } from "lucide-react";
import { VerificationLevel } from "../types";

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level,
  size = "sm",
  showIcon = true,
}) => {
  const getDetails = (lvl: VerificationLevel) => {
    switch (lvl) {
      case "ASSESSMENT_VERIFIED":
        return {
          label: "Coding Verified",
          icon: Code2,
          color: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
      case "GITHUB_VERIFIED":
        return {
          label: "GitHub Verified",
          icon: GitBranch,
          color: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
        };
      case "INTERVIEW_VERIFIED":
        return {
          label: "Interview Verified",
          icon: MessageSquare,
          color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        };
      case "PROJECT_VERIFIED":
      case "PLATFORM_VERIFIED":
        return {
          label: "Platform Verified",
          icon: Box,
          color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        };
      case "SELF_REPORTED":
      default:
        return {
          label: "Self Reported",
          icon: AlertCircle,
          color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const details = getDetails(level);
  const Icon = details.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      } ${details.color}`}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />}
      <span>{details.label}</span>
    </span>
  );
};

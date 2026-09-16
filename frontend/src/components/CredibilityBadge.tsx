import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

interface CredibilityBadgeProps {
  score: number;
  confidence?: "Low" | "Medium" | "High";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const CredibilityBadge: React.FC<CredibilityBadgeProps> = ({
  score,
  confidence = "Medium",
  size = "md",
  showLabel = true,
}) => {
  // Curated color scheme based on evidence score tier
  const getColorClass = (val: number) => {
    if (val >= 75) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (val >= 50) return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    if (val >= 25) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3.5 py-1.5 text-base font-semibold",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${getColorClass(
        score
      )} ${sizeClasses[size]}`}
    >
      <ShieldCheck className={size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      {showLabel && <span className="font-medium text-xs text-slate-500 dark:text-slate-400">Credibility</span>}
      <span className="font-bold tracking-tight">{score}</span>
      <span className="text-[10px] opacity-70 font-normal">/ 100</span>
    </div>
  );
};

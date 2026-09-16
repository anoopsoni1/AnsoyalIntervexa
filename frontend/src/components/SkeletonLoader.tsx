import React from "react";

export const CandidateCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm animate-pulse space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-1.5">
            <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      <div className="h-12 bg-slate-100 dark:bg-slate-800/40 rounded-lg" />

      <div className="space-y-2">
        <div className="w-12 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex gap-1.5">
          <div className="w-14 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-12 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>

      <div className="h-8 border-t border-slate-100 dark:border-slate-800 pt-2 flex gap-2">
        <div className="flex-1 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

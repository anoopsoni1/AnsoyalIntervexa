import React, { useState } from "react";
import { X, BookmarkPlus, Check } from "lucide-react";
import { api } from "../services/api";
import { ShortlistStatus } from "../types";

interface ShortlistModalProps {
  candidateId: string;
  candidateName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (shortlist: any) => void;
  initialStatus?: ShortlistStatus;
  initialTags?: string[];
  initialNotes?: string;
}

const STAGES: { label: string; value: ShortlistStatus }[] = [
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interviewing", value: "INTERVIEWING" },
  { label: "Hired", value: "HIRED" },
  { label: "Archived / Rejected", value: "REJECTED" },
];

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  candidateId,
  candidateName,
  isOpen,
  onClose,
  onSuccess,
  initialStatus = "SHORTLISTED",
  initialTags = [],
  initialNotes = "",
}) => {
  const [status, setStatus] = useState<ShortlistStatus>(initialStatus);
  const [tagsInput, setTagsInput] = useState(initialTags.join(", "));
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const data = await api.post("/shortlists", {
        candidateId,
        status,
        tags,
        notes: notes.trim(),
      });
      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update shortlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-brand-600" />
              <span>Pipeline Stage for {candidateName}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track this candidate's status within your company's recruitment pipeline.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
              {error}
            </div>
          )}

          {/* Stage Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pipeline Stage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-all text-left font-medium ${
                    status === s.value
                      ? "bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{s.label}</span>
                  {status === s.value && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend, High Priority, Ready to Relocate"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Private Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Initial Private Note
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Discussed with frontend team lead. High score on coding assessment."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg shadow-sm"
            >
              {isSubmitting ? "Saving..." : "Save to Pipeline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

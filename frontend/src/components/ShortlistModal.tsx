import React, { useState } from "react";
import { X, BookmarkPlus, Check } from "lucide-react";
import { api } from "../services/api";
import { ShortlistStatus, RecruiterCandidateDTO } from "../types";

export interface ShortlistModalProps {
  candidate?: RecruiterCandidateDTO | null;
  candidateId?: string;
  candidateName?: string;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: (shortlist?: any) => void;
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
  candidate,
  candidateId: propCandidateId,
  candidateName: propCandidateName,
  isOpen,
  onClose,
  onSuccess,
  initialStatus = "SHORTLISTED",
  initialTags = [],
  initialNotes = "",
}) => {
  const targetId = candidate?.id || propCandidateId || "";
  const targetName = candidate?.name || propCandidateName || "Candidate";
  const shouldShow = isOpen !== undefined ? isOpen : Boolean(candidate || propCandidateId);

  const [status, setStatus] = useState<ShortlistStatus>(initialStatus);
  const [tagsInput, setTagsInput] = useState(initialTags.join(", "));
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!shouldShow) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    
    setError(null);
    setIsSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const data = await api.post("/shortlists", {
        candidateId: targetId,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-3 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-cyan-500/20">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-cyan-400" />
              <span>Pipeline Stage: {targetName}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track candidate status in your verified recruitment pipeline.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 text-rose-300 text-xs rounded-lg border border-rose-500/30">
              {error}
            </div>
          )}

          {/* Stage Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Pipeline Stage
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl border transition-all text-left font-medium ${
                    status === s.value
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10"
                      : "border-white/10 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span>{s.label}</span>
                  {status === s.value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend, High Priority, Immediate Joiner"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Private Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Private Note
            </label>
            <textarea
              rows={3}
              placeholder="e.g. High evidence confidence score. Discussed with team lead."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-xl shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? "Saving..." : "Save to Pipeline"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

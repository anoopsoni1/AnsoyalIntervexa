import React, { useState } from "react";
import { X, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";

import { RecruiterCandidateDTO } from "../types";

interface ContactModalProps {
  candidate?: RecruiterCandidateDTO;
  candidateId?: string;
  candidateName?: string;
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  candidate,
  candidateId,
  candidateName,
  isOpen = true,
  onClose,
  onSuccess,
}) => {
  const effectiveId = candidate?.id || candidateId || "";
  const effectiveName = candidate?.name || candidateName || "Candidate";

  const [subject, setSubject] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  if (isOpen === false || !effectiveId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await api.post(`/candidates/${candidateId}/contact`, {
        subject: subject.trim(),
        message: message.trim(),
        roleTitle: roleTitle.trim(),
      });
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to send contact request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Message Dispatched!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your opportunity message has been routed to {candidateName} through Ansoyal's secure notification system.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Contact {candidateName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reach out regarding technical opportunities. Communication is routed securely without exposing private student emails.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role / Opportunity
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer, Full Stack Intern"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Line <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Exciting engineering role at our company"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe why their verified skills and projects caught your attention..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Sending..." : "Send Opportunity"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import { AuditLog } from "../models/AuditLog.model.js";

export class AuditService {
  public async logAction(data: {
    companyId: string;
    recruiterId: string;
    recruiterName: string;
    action:
      | "CANDIDATE_VIEWED"
      | "CANDIDATE_SHORTLISTED"
      | "SHORTLIST_STAGE_UPDATED"
      | "CANDIDATE_CONTACTED"
      | "NOTE_ADDED"
      | "RESUME_ACCESSED"
      | "EVIDENCE_INSPECTED";
    candidateId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }) {
    try {
      await AuditLog.create(data);
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err);
    }
  }

  public async getRecentCompanyActivity(companyId: string, limit = 15) {
    const logs = await AuditLog.find({ companyId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return logs.map((log: any) => ({
      ...log,
      id: log._id ? log._id.toString() : "",
    }));
  }
}

export const auditService = new AuditService();

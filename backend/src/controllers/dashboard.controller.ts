import { Response, NextFunction } from "express";
import { Shortlist } from "../models/Shortlist.model.js";
import { ContactRequest } from "../models/ContactRequest.model.js";
import { studentPlatformService } from "../services/StudentPlatformService.js";
import { auditService } from "../services/AuditService.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user!.companyId;

    // 1. Get live candidate counts & top verified talent from Student Platform
    const studentData = await studentPlatformService.getCandidates({
      limit: 6,
      sort: "credibility",
    });

    const totalAvailable = studentData?.pagination?.total || 0;
    const recommended = studentData?.candidates || [];

    // 2. Company pipeline counts
    const shortlistedCount = await Shortlist.countDocuments({ companyId });
    const contactedCount = await ContactRequest.countDocuments({ companyId });
    const activeInterviewingCount = await Shortlist.countDocuments({
      companyId,
      status: "INTERVIEWING",
    });

    const pipelineCounts = await Shortlist.aggregate([
      { $match: { companyId: new (await import("mongoose")).Types.ObjectId(companyId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const pipelineBreakdown: Record<string, number> = {
      SHORTLISTED: 0,
      CONTACTED: 0,
      INTERVIEWING: 0,
      REJECTED: 0,
      HIRED: 0,
    };

    pipelineCounts.forEach((p) => {
      if (pipelineBreakdown[p._id] !== undefined) {
        pipelineBreakdown[p._id] = p.count;
      }
    });

    // 3. Recent activity
    const recentActivity = await auditService.getRecentCompanyActivity(companyId, 10);

    return res.status(200).json({
      success: true,
      data: {
        totalAvailableCandidates: totalAvailable,
        shortlistedCount,
        contactedCount,
        activeInterviewingCount,
        pipelineBreakdown,
        recommendedCandidates: recommended,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

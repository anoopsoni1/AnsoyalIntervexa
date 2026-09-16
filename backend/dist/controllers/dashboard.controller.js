"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const Shortlist_model_js_1 = require("../models/Shortlist.model.js");
const ContactRequest_model_js_1 = require("../models/ContactRequest.model.js");
const StudentPlatformService_js_1 = require("../services/StudentPlatformService.js");
const AuditService_js_1 = require("../services/AuditService.js");
const getDashboardMetrics = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        // 1. Get live candidate counts & top verified talent from Student Platform
        const studentData = await StudentPlatformService_js_1.studentPlatformService.getCandidates({
            limit: 6,
            sort: "credibility",
        });
        const totalAvailable = studentData?.pagination?.total || 0;
        const recommended = studentData?.candidates || [];
        // 2. Company pipeline counts
        const shortlistedCount = await Shortlist_model_js_1.Shortlist.countDocuments({ companyId });
        const contactedCount = await ContactRequest_model_js_1.ContactRequest.countDocuments({ companyId });
        const activeInterviewingCount = await Shortlist_model_js_1.Shortlist.countDocuments({
            companyId,
            status: "INTERVIEWING",
        });
        const pipelineCounts = await Shortlist_model_js_1.Shortlist.aggregate([
            { $match: { companyId: new (await import("mongoose")).Types.ObjectId(companyId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const pipelineBreakdown = {
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
        const recentActivity = await AuditService_js_1.auditService.getRecentCompanyActivity(companyId, 10);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardMetrics = getDashboardMetrics;

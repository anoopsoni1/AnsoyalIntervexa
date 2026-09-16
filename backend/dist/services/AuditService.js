"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditService = void 0;
const AuditLog_model_js_1 = require("../models/AuditLog.model.js");
class AuditService {
    async logAction(data) {
        try {
            await AuditLog_model_js_1.AuditLog.create(data);
        }
        catch (err) {
            console.error("[AuditService] Failed to record audit log:", err);
        }
    }
    async getRecentCompanyActivity(companyId, limit = 15) {
        const logs = await AuditLog_model_js_1.AuditLog.find({ companyId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return logs.map((log) => ({
            ...log,
            id: log._id ? log._id.toString() : "",
        }));
    }
}
exports.AuditService = AuditService;
exports.auditService = new AuditService();

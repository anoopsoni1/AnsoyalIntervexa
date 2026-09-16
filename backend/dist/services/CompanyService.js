"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = exports.CompanyService = void 0;
const Company_model_js_1 = require("../models/Company.model.js");
const Recruiter_model_js_1 = require("../models/Recruiter.model.js");
class CompanyService {
    async getCompanyProfile(companyId) {
        const company = await Company_model_js_1.Company.findById(companyId);
        if (!company) {
            const err = new Error("Company not found");
            err.statusCode = 404;
            throw err;
        }
        return company;
    }
    async updateCompanyProfile(companyId, updates) {
        const company = await Company_model_js_1.Company.findByIdAndUpdate(companyId, updates, { new: true });
        if (!company) {
            const err = new Error("Company not found");
            err.statusCode = 404;
            throw err;
        }
        return company;
    }
    async getTeamMembers(companyId) {
        const members = await Recruiter_model_js_1.Recruiter.find({ companyId })
            .select("-passwordHash")
            .sort({ createdAt: 1 });
        return members;
    }
    async updateMemberRole(companyId, memberId, newRole) {
        const member = await Recruiter_model_js_1.Recruiter.findOneAndUpdate({ _id: memberId, companyId }, { role: newRole }, { new: true }).select("-passwordHash");
        if (!member) {
            const err = new Error("Team member not found in your company");
            err.statusCode = 404;
            throw err;
        }
        return member;
    }
}
exports.CompanyService = CompanyService;
exports.companyService = new CompanyService();

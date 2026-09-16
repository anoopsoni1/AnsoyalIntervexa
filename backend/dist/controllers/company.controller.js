"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberRole = exports.getTeamMembers = exports.updateCompanyProfile = exports.getCompanyProfile = void 0;
const CompanyService_js_1 = require("../services/CompanyService.js");
const getCompanyProfile = async (req, res, next) => {
    try {
        const company = await CompanyService_js_1.companyService.getCompanyProfile(req.user.companyId);
        return res.status(200).json({ success: true, data: company });
    }
    catch (error) {
        next(error);
    }
};
exports.getCompanyProfile = getCompanyProfile;
const updateCompanyProfile = async (req, res, next) => {
    try {
        const updated = await CompanyService_js_1.companyService.updateCompanyProfile(req.user.companyId, req.body);
        return res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCompanyProfile = updateCompanyProfile;
const getTeamMembers = async (req, res, next) => {
    try {
        const members = await CompanyService_js_1.companyService.getTeamMembers(req.user.companyId);
        return res.status(200).json({ success: true, data: members });
    }
    catch (error) {
        next(error);
    }
};
exports.getTeamMembers = getTeamMembers;
const updateMemberRole = async (req, res, next) => {
    try {
        const { memberId } = req.params;
        const { role } = req.body;
        const updated = await CompanyService_js_1.companyService.updateMemberRole(req.user.companyId, memberId, role);
        return res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMemberRole = updateMemberRole;

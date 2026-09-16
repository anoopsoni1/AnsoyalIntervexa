"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromShortlist = exports.updateShortlistStatus = exports.addToShortlist = exports.getShortlists = void 0;
const ShortlistService_js_1 = require("../services/ShortlistService.js");
const AuditService_js_1 = require("../services/AuditService.js");
const getShortlists = async (req, res, next) => {
    try {
        const { status } = req.query;
        const items = await ShortlistService_js_1.shortlistService.getCompanyShortlist(req.user.companyId, status);
        return res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        next(error);
    }
};
exports.getShortlists = getShortlists;
const addToShortlist = async (req, res, next) => {
    try {
        const { candidateId, status, tags, notes } = req.body;
        if (!candidateId) {
            return res.status(400).json({
                success: false,
                message: "candidateId is required",
                code: "VALIDATION_ERROR",
            });
        }
        const item = await ShortlistService_js_1.shortlistService.addToShortlist({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            candidateId,
            status,
            tags,
            notes,
        });
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            action: "CANDIDATE_SHORTLISTED",
            candidateId,
            metadata: { stage: item.status, tags: item.tags },
            ipAddress: req.ip || "",
        });
        return res.status(201).json({
            success: true,
            message: "Candidate added to shortlist successfully",
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addToShortlist = addToShortlist;
const updateShortlistStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, tags, notes } = req.body;
        const item = await ShortlistService_js_1.shortlistService.updateShortlistStatus(req.user.companyId, id, { status, tags, notes });
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            action: "SHORTLIST_STAGE_UPDATED",
            candidateId: item.candidateId,
            metadata: { newStage: item.status },
            ipAddress: req.ip || "",
        });
        return res.status(200).json({
            success: true,
            message: "Shortlist status updated",
            data: item,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateShortlistStatus = updateShortlistStatus;
const removeFromShortlist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await ShortlistService_js_1.shortlistService.removeFromShortlist(req.user.companyId, id);
        return res.status(200).json({
            success: true,
            message: "Candidate removed from shortlist",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeFromShortlist = removeFromShortlist;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactCandidate = exports.getCandidateGitHub = exports.getCandidateProjects = exports.getCandidateCredibility = exports.getCandidateEvidence = exports.getCandidateById = exports.getCandidates = void 0;
const StudentPlatformService_js_1 = require("../services/StudentPlatformService.js");
const ShortlistService_js_1 = require("../services/ShortlistService.js");
const AuditService_js_1 = require("../services/AuditService.js");
const ContactRequest_model_js_1 = require("../models/ContactRequest.model.js");
const Company_model_js_1 = require("../models/Company.model.js");
const getCandidates = async (req, res, next) => {
    try {
        const { q, skills, minCredibility, verificationLevel, page, limit, sort } = req.query;
        const result = await StudentPlatformService_js_1.studentPlatformService.getCandidates({
            q: q,
            skills: skills,
            minCredibility: minCredibility ? parseInt(minCredibility, 10) : undefined,
            verificationLevel: verificationLevel,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 12,
            sort: sort,
        });
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidates = getCandidates;
const getCandidateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const candidate = await StudentPlatformService_js_1.studentPlatformService.getCandidateById(id);
        // Fetch company shortlist status for this candidate
        const shortlistStatus = await ShortlistService_js_1.shortlistService.getShortlistStatusForCandidate(req.user.companyId, id);
        // Record audit log
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            action: "CANDIDATE_VIEWED",
            candidateId: id,
            metadata: { candidateName: candidate.name, role: candidate.role },
            ipAddress: req.ip || "",
        });
        return res.status(200).json({
            success: true,
            data: {
                ...candidate,
                shortlist: shortlistStatus,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateById = getCandidateById;
const getCandidateEvidence = async (req, res, next) => {
    try {
        const { id } = req.params;
        const evidence = await StudentPlatformService_js_1.studentPlatformService.getCandidateEvidence(id);
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            action: "EVIDENCE_INSPECTED",
            candidateId: id,
            ipAddress: req.ip || "",
        });
        return res.status(200).json({ success: true, data: evidence });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateEvidence = getCandidateEvidence;
const getCandidateCredibility = async (req, res, next) => {
    try {
        const { id } = req.params;
        const credibility = await StudentPlatformService_js_1.studentPlatformService.getCandidateCredibility(id);
        return res.status(200).json({ success: true, data: credibility });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateCredibility = getCandidateCredibility;
const getCandidateProjects = async (req, res, next) => {
    try {
        const { id } = req.params;
        const projects = await StudentPlatformService_js_1.studentPlatformService.getCandidateProjects(id);
        return res.status(200).json({ success: true, data: projects });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateProjects = getCandidateProjects;
const getCandidateGitHub = async (req, res, next) => {
    try {
        const { id } = req.params;
        const github = await StudentPlatformService_js_1.studentPlatformService.getCandidateGitHub(id);
        return res.status(200).json({ success: true, data: github });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateGitHub = getCandidateGitHub;
const contactCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { subject, message, roleTitle } = req.body;
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Subject and message are required",
                code: "VALIDATION_ERROR",
            });
        }
        const company = await Company_model_js_1.Company.findById(req.user.companyId);
        // Relay to Student Platform via secure backend-to-backend API
        const studentResponse = await StudentPlatformService_js_1.studentPlatformService.contactCandidate(id, {
            subject,
            message,
            roleTitle,
            recruiterName: req.user.name,
            companyName: company?.name || "Verified Recruiting Partner",
        });
        // Save contact request in Recruiter database
        const contactRecord = await ContactRequest_model_js_1.ContactRequest.create({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            candidateId: id,
            subject,
            message,
            roleTitle: roleTitle || "",
            status: "DELIVERED",
        });
        // Update shortlist status to CONTACTED if shortlisted
        const existingShortlist = await ShortlistService_js_1.shortlistService.getShortlistStatusForCandidate(req.user.companyId, id);
        if (existingShortlist && existingShortlist.status === "SHORTLISTED") {
            await ShortlistService_js_1.shortlistService.updateShortlistStatus(req.user.companyId, existingShortlist.id, { status: "CONTACTED" });
        }
        // Audit log
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            action: "CANDIDATE_CONTACTED",
            candidateId: id,
            metadata: { subject, roleTitle },
            ipAddress: req.ip || "",
        });
        return res.status(200).json({
            success: true,
            message: "Contact request routed to candidate successfully",
            data: contactRecord,
            studentService: studentResponse,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.contactCandidate = contactCandidate;

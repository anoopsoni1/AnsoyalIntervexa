import { Response, NextFunction } from "express";
import { studentPlatformService } from "../services/StudentPlatformService.js";
import { shortlistService } from "../services/ShortlistService.js";
import { auditService } from "../services/AuditService.js";
import { ContactRequest } from "../models/ContactRequest.model.js";
import { Company } from "../models/Company.model.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCandidates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, skills, minCredibility, verificationLevel, page, limit, sort } = req.query;

    const result = await studentPlatformService.getCandidates({
      q: q as string,
      skills: skills as string,
      minCredibility: minCredibility ? parseInt(minCredibility as string, 10) : undefined,
      verificationLevel: verificationLevel as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
      sort: sort as string,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const candidate = await studentPlatformService.getCandidateById(id);

    // Fetch company shortlist status for this candidate
    const shortlistStatus = await shortlistService.getShortlistStatusForCandidate(
      req.user!.companyId,
      id
    );

    // Record audit log
    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
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
  } catch (error) {
    next(error);
  }
};

export const getCandidateEvidence = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const evidence = await studentPlatformService.getCandidateEvidence(id);

    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
      action: "EVIDENCE_INSPECTED",
      candidateId: id,
      ipAddress: req.ip || "",
    });

    return res.status(200).json({ success: true, data: evidence });
  } catch (error) {
    next(error);
  }
};

export const getCandidateCredibility = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const credibility = await studentPlatformService.getCandidateCredibility(id);
    return res.status(200).json({ success: true, data: credibility });
  } catch (error) {
    next(error);
  }
};

export const getCandidateProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const projects = await studentPlatformService.getCandidateProjects(id);
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getCandidateGitHub = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const github = await studentPlatformService.getCandidateGitHub(id);
    return res.status(200).json({ success: true, data: github });
  } catch (error) {
    next(error);
  }
};

export const contactCandidate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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

    const company = await Company.findById(req.user!.companyId);

    // Relay to Student Platform via secure backend-to-backend API
    const studentResponse = await studentPlatformService.contactCandidate(id, {
      subject,
      message,
      roleTitle,
      recruiterName: req.user!.name,
      companyName: company?.name || "Verified Recruiting Partner",
    });

    // Save contact request in Recruiter database
    const contactRecord = await ContactRequest.create({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      candidateId: id,
      subject,
      message,
      roleTitle: roleTitle || "",
      status: "DELIVERED",
    });

    // Update shortlist status to CONTACTED if shortlisted
    const existingShortlist: any = await shortlistService.getShortlistStatusForCandidate(
      req.user!.companyId,
      id
    );
    if (existingShortlist && existingShortlist.status === "SHORTLISTED") {
      await shortlistService.updateShortlistStatus(
        req.user!.companyId,
        existingShortlist.id,
        { status: "CONTACTED" }
      );
    }

    // Audit log
    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
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
  } catch (error) {
    next(error);
  }
};

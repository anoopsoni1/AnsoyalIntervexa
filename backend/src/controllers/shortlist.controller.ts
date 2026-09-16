import { Response, NextFunction } from "express";
import { shortlistService } from "../services/ShortlistService.js";
import { auditService } from "../services/AuditService.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getShortlists = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const items = await shortlistService.getCompanyShortlist(
      req.user!.companyId,
      status as any
    );
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const addToShortlist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { candidateId, status, tags, notes } = req.body;
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "candidateId is required",
        code: "VALIDATION_ERROR",
      });
    }

    const item = await shortlistService.addToShortlist({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      candidateId,
      status,
      tags,
      notes,
    });

    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
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
  } catch (error) {
    next(error);
  }
};

export const updateShortlistStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, tags, notes } = req.body;

    const item = await shortlistService.updateShortlistStatus(
      req.user!.companyId,
      id,
      { status, tags, notes }
    );

    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
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
  } catch (error) {
    next(error);
  }
};

export const removeFromShortlist = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await shortlistService.removeFromShortlist(req.user!.companyId, id);
    return res.status(200).json({
      success: true,
      message: "Candidate removed from shortlist",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

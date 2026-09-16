import { Response, NextFunction } from "express";
import { companyService } from "../services/CompanyService.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCompanyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await companyService.getCompanyProfile(req.user!.companyId);
    return res.status(200).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await companyService.updateCompanyProfile(req.user!.companyId, req.body);
    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamMembers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await companyService.getTeamMembers(req.user!.companyId);
    return res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;
    const updated = await companyService.updateMemberRole(req.user!.companyId, memberId, role);
    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

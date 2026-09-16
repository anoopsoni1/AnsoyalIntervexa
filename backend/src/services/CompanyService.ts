import { Company } from "../models/Company.model.js";
import { Recruiter } from "../models/Recruiter.model.js";

export class CompanyService {
  public async getCompanyProfile(companyId: string) {
    const company = await Company.findById(companyId);
    if (!company) {
      const err = new Error("Company not found");
      (err as any).statusCode = 404;
      throw err;
    }
    return company;
  }

  public async updateCompanyProfile(
    companyId: string,
    updates: {
      name?: string;
      website?: string;
      industry?: string;
      size?: string;
      location?: string;
      description?: string;
    }
  ) {
    const company = await Company.findByIdAndUpdate(companyId, updates, { new: true });
    if (!company) {
      const err = new Error("Company not found");
      (err as any).statusCode = 404;
      throw err;
    }
    return company;
  }

  public async getTeamMembers(companyId: string) {
    const members = await Recruiter.find({ companyId })
      .select("-passwordHash")
      .sort({ createdAt: 1 });
    return members;
  }

  public async updateMemberRole(
    companyId: string,
    memberId: string,
    newRole: "ADMIN" | "RECRUITER" | "HIRING_MANAGER"
  ) {
    const member = await Recruiter.findOneAndUpdate(
      { _id: memberId, companyId },
      { role: newRole },
      { new: true }
    ).select("-passwordHash");

    if (!member) {
      const err = new Error("Team member not found in your company");
      (err as any).statusCode = 404;
      throw err;
    }
    return member;
  }
}

export const companyService = new CompanyService();

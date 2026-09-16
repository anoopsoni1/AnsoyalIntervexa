import { Shortlist, ShortlistStatus } from "../models/Shortlist.model.js";
import { studentPlatformService } from "./StudentPlatformService.js";

export class ShortlistService {
  public async getCompanyShortlist(companyId: string, status?: ShortlistStatus) {
    const query: any = { companyId };
    if (status) query.status = status;

    const shortlists = await Shortlist.find(query).sort({ updatedAt: -1 }).lean();

    // Fetch candidate details for each item asynchronously
    const itemsWithCandidates = await Promise.all(
      shortlists.map(async (item: any) => {
        try {
          const candidate = await studentPlatformService.getCandidateById(item.candidateId);
          return {
            ...item,
            id: item._id ? item._id.toString() : "",
            candidate,
          };
        } catch {
          return {
            ...item,
            id: item._id ? item._id.toString() : "",
            candidate: null,
          };
        }
      })
    );

    return itemsWithCandidates;
  }

  public async getShortlistStatusForCandidate(companyId: string, candidateId: string) {
    const item = (await Shortlist.findOne({ companyId, candidateId }).lean()) as any;
    if (!item) return null;
    return {
      ...item,
      id: item._id ? item._id.toString() : "",
    };
  }

  public async addToShortlist(data: {
    companyId: string;
    recruiterId: string;
    candidateId: string;
    status?: ShortlistStatus;
    tags?: string[];
    notes?: string;
  }) {
    // Verify candidate exists and has discovery enabled
    await studentPlatformService.getCandidateById(data.candidateId);

    const existing = await Shortlist.findOne({
      companyId: data.companyId,
      candidateId: data.candidateId,
    });

    if (existing) {
      existing.status = data.status || existing.status;
      if (data.tags) existing.tags = data.tags;
      if (data.notes !== undefined) existing.notes = data.notes;
      await existing.save();
      return existing;
    }

    const item = await Shortlist.create({
      companyId: data.companyId,
      recruiterId: data.recruiterId,
      candidateId: data.candidateId,
      status: data.status || "SHORTLISTED",
      tags: data.tags || [],
      notes: data.notes || "",
    });

    return item;
  }

  public async updateShortlistStatus(
    companyId: string,
    id: string,
    updates: { status?: ShortlistStatus; tags?: string[]; notes?: string }
  ) {
    const item = await Shortlist.findOneAndUpdate(
      { _id: id, companyId },
      { $set: updates },
      { new: true }
    );

    if (!item) {
      const err = new Error("Shortlist entry not found in your company");
      (err as any).statusCode = 404;
      throw err;
    }

    return item;
  }

  public async removeFromShortlist(companyId: string, id: string) {
    const deleted = await Shortlist.findOneAndDelete({ _id: id, companyId });
    if (!deleted) {
      const err = new Error("Shortlist entry not found in your company");
      (err as any).statusCode = 404;
      throw err;
    }
    return { success: true, removedId: id };
  }
}

export const shortlistService = new ShortlistService();

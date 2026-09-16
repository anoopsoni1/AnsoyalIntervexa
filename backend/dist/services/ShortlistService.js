"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortlistService = exports.ShortlistService = void 0;
const Shortlist_model_js_1 = require("../models/Shortlist.model.js");
const StudentPlatformService_js_1 = require("./StudentPlatformService.js");
class ShortlistService {
    async getCompanyShortlist(companyId, status) {
        const query = { companyId };
        if (status)
            query.status = status;
        const shortlists = await Shortlist_model_js_1.Shortlist.find(query).sort({ updatedAt: -1 }).lean();
        // Fetch candidate details for each item asynchronously
        const itemsWithCandidates = await Promise.all(shortlists.map(async (item) => {
            try {
                const candidate = await StudentPlatformService_js_1.studentPlatformService.getCandidateById(item.candidateId);
                return {
                    ...item,
                    id: item._id ? item._id.toString() : "",
                    candidate,
                };
            }
            catch {
                return {
                    ...item,
                    id: item._id ? item._id.toString() : "",
                    candidate: null,
                };
            }
        }));
        return itemsWithCandidates;
    }
    async getShortlistStatusForCandidate(companyId, candidateId) {
        const item = (await Shortlist_model_js_1.Shortlist.findOne({ companyId, candidateId }).lean());
        if (!item)
            return null;
        return {
            ...item,
            id: item._id ? item._id.toString() : "",
        };
    }
    async addToShortlist(data) {
        // Verify candidate exists and has discovery enabled
        await StudentPlatformService_js_1.studentPlatformService.getCandidateById(data.candidateId);
        const existing = await Shortlist_model_js_1.Shortlist.findOne({
            companyId: data.companyId,
            candidateId: data.candidateId,
        });
        if (existing) {
            existing.status = data.status || existing.status;
            if (data.tags)
                existing.tags = data.tags;
            if (data.notes !== undefined)
                existing.notes = data.notes;
            await existing.save();
            return existing;
        }
        const item = await Shortlist_model_js_1.Shortlist.create({
            companyId: data.companyId,
            recruiterId: data.recruiterId,
            candidateId: data.candidateId,
            status: data.status || "SHORTLISTED",
            tags: data.tags || [],
            notes: data.notes || "",
        });
        return item;
    }
    async updateShortlistStatus(companyId, id, updates) {
        const item = await Shortlist_model_js_1.Shortlist.findOneAndUpdate({ _id: id, companyId }, { $set: updates }, { new: true });
        if (!item) {
            const err = new Error("Shortlist entry not found in your company");
            err.statusCode = 404;
            throw err;
        }
        return item;
    }
    async removeFromShortlist(companyId, id) {
        const deleted = await Shortlist_model_js_1.Shortlist.findOneAndDelete({ _id: id, companyId });
        if (!deleted) {
            const err = new Error("Shortlist entry not found in your company");
            err.statusCode = 404;
            throw err;
        }
        return { success: true, removedId: id };
    }
}
exports.ShortlistService = ShortlistService;
exports.shortlistService = new ShortlistService();

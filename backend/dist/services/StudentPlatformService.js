"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentPlatformService = exports.StudentPlatformService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_js_1 = require("../config/env.js");
class StudentPlatformService {
    client;
    cache = new Map();
    constructor() {
        this.client = axios_1.default.create({
            baseURL: env_js_1.ENV.STUDENT_API_URL,
            timeout: 8000,
            headers: {
                "x-service-key": env_js_1.ENV.STUDENT_SERVICE_KEY,
                "Content-Type": "application/json",
            },
        });
    }
    getFromCache(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setInCache(key, data, ttlSeconds) {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }
    invalidateCandidateCache(id) {
        for (const key of this.cache.keys()) {
            if (key.includes(id)) {
                this.cache.delete(key);
            }
        }
    }
    handleError(error, context) {
        if (axios_1.default.isAxiosError(error)) {
            const err = error;
            const status = err.response?.status;
            const responseData = err.response?.data;
            if (status === 404) {
                const errorObj = new Error(responseData?.message || "Candidate not found or recruiter visibility is disabled");
                errorObj.statusCode = 404;
                errorObj.code = "CANDIDATE_NOT_FOUND";
                throw errorObj;
            }
            if (status === 401 || status === 403) {
                const errorObj = new Error("Server-to-server authorization failed with Student Platform");
                errorObj.statusCode = 502;
                errorObj.code = "STUDENT_SERVICE_AUTH_FAILED";
                throw errorObj;
            }
            const errorObj = new Error(`Student Platform service temporarily unavailable (${context}): ${err.message}`);
            errorObj.statusCode = 503;
            errorObj.code = "CANDIDATE_SERVICE_UNAVAILABLE";
            throw errorObj;
        }
        const genericError = new Error(`Unexpected error in StudentPlatformService: ${error.message}`);
        genericError.statusCode = 500;
        genericError.code = "INTERNAL_STUDENT_SERVICE_ERROR";
        throw genericError;
    }
    async getCandidates(query) {
        const cacheKey = `candidates:${JSON.stringify(query)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get("/candidates", { params: query });
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120); // 2 min cache
            return data;
        }
        catch (error) {
            this.handleError(error, "getCandidates");
        }
    }
    async getCandidateById(id) {
        const cacheKey = `candidate:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get(`/candidates/${id}`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 300); // 5 min cache
            return data;
        }
        catch (error) {
            this.handleError(error, `getCandidateById(${id})`);
        }
    }
    async getCandidateEvidence(id) {
        const cacheKey = `evidence:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get(`/candidates/${id}/evidence`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 300);
            return data;
        }
        catch (error) {
            this.handleError(error, `getCandidateEvidence(${id})`);
        }
    }
    async getCandidateCredibility(id) {
        const cacheKey = `credibility:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get(`/candidates/${id}/credibility`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 300);
            return data;
        }
        catch (error) {
            this.handleError(error, `getCandidateCredibility(${id})`);
        }
    }
    async getCandidateProjects(id) {
        const cacheKey = `projects:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get(`/candidates/${id}/projects`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 300);
            return data;
        }
        catch (error) {
            this.handleError(error, `getCandidateProjects(${id})`);
        }
    }
    async getCandidateGitHub(id) {
        const cacheKey = `github:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        try {
            const response = await this.client.get(`/candidates/${id}/github`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 300);
            return data;
        }
        catch (error) {
            this.handleError(error, `getCandidateGitHub(${id})`);
        }
    }
    async contactCandidate(id, payload) {
        try {
            const response = await this.client.post(`/candidates/${id}/contact`, payload);
            return response.data?.data || response.data;
        }
        catch (error) {
            this.handleError(error, `contactCandidate(${id})`);
        }
    }
}
exports.StudentPlatformService = StudentPlatformService;
exports.studentPlatformService = new StudentPlatformService();

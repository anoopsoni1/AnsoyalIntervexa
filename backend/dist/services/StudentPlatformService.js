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
        let baseUrl = (env_js_1.ENV.STUDENT_API_URL || "https://intervexa.onrender.com/api/v1/recruiter").trim();
        // Normalize URL to remove trailing slashes or duplicate /candidates
        baseUrl = baseUrl.replace(/\/+$/, "").replace(/\/recuriter\/?$/, "/recruiter");
        if (baseUrl.endsWith("/candidates")) {
            baseUrl = baseUrl.replace(/\/candidates$/, "");
        }
        this.client = axios_1.default.create({
            baseURL: baseUrl,
            timeout: 15000,
            headers: {
                "x-service-key": env_js_1.ENV.STUDENT_SERVICE_KEY,
                "Authorization": `Bearer ${env_js_1.ENV.STUDENT_SERVICE_KEY}`,
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
    handleError(error, endpoint) {
        const fullUrl = `${this.client.defaults.baseURL}${endpoint}`;
        if (axios_1.default.isAxiosError(error)) {
            const status = error.response?.status;
            const code = error.code;
            if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
                console.error(`[StudentPlatformService] Student Platform request timed out for GET ${fullUrl}`);
                const err = new Error("Student Platform request timed out");
                err.statusCode = 502;
                err.code = "STUDENT_PLATFORM_UNAVAILABLE";
                throw err;
            }
            if (status === 401 || status === 403) {
                console.error(`[StudentPlatformService] Student Platform rejected service authentication for ${fullUrl}`);
                const err = new Error("Student Platform service authentication failed");
                err.statusCode = 502;
                err.code = "STUDENT_PLATFORM_UNAUTHORIZED";
                throw err;
            }
            if (status === 404) {
                console.error(`[StudentPlatformService] Student Platform recruiter endpoint not found: ${fullUrl}`);
                const err = new Error("Candidate not found or recruiter visibility is disabled");
                err.statusCode = 404;
                err.code = "CANDIDATE_NOT_FOUND";
                throw err;
            }
            if (status && status >= 500) {
                console.error(`[StudentPlatformService] Student Platform returned upstream server error (${status}) for ${fullUrl}`);
                const err = new Error("Student Platform is currently experiencing server errors");
                err.statusCode = 502;
                err.code = "STUDENT_PLATFORM_UNAVAILABLE";
                throw err;
            }
            console.error(`[StudentPlatformService] Upstream connection failure (${code || status || 'UNKNOWN'}) for ${fullUrl}`);
        }
        else {
            console.error(`[StudentPlatformService] Internal request error for ${fullUrl}:`, error.message);
        }
        const upstreamErr = new Error("Student Platform is currently unavailable");
        upstreamErr.statusCode = 502;
        upstreamErr.code = "STUDENT_PLATFORM_UNAVAILABLE";
        throw upstreamErr;
    }
    /**
     * Safe connectivity check to host/health
     */
    async checkHealth() {
        try {
            const rootUrl = new URL(this.client.defaults.baseURL || "https://intervexa.onrender.com").origin;
            const healthUrl = `${rootUrl}/health`;
            console.log(`[StudentPlatformService] Checking connectivity: GET ${healthUrl}`);
            const res = await axios_1.default.get(healthUrl, { timeout: 5000 });
            return { status: res.statusText || "OK", url: healthUrl, online: res.status === 200 };
        }
        catch (err) {
            console.warn(`[StudentPlatformService] Health check failed:`, err.message);
            return { status: "UNREACHABLE", url: "https://intervexa.onrender.com/health", online: false };
        }
    }
    async getCandidates(query) {
        const cacheKey = `candidates:${JSON.stringify(query)}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = "/candidates";
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint, { params: query });
            console.log(`[StudentPlatformService] Candidate discovery request successful`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 60);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async getCandidateById(id) {
        const cacheKey = `candidate:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = `/candidates/${id}`;
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint);
            console.log(`[StudentPlatformService] Candidate profile request successful for ${id}`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async getCandidateEvidence(id) {
        const cacheKey = `evidence:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = `/candidates/${id}/evidence`;
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint);
            console.log(`[StudentPlatformService] Evidence fetch successful for ${id}`);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async getCandidateCredibility(id) {
        const cacheKey = `credibility:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = `/candidates/${id}/credibility`;
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async getCandidateProjects(id) {
        const cacheKey = `projects:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = `/candidates/${id}/projects`;
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async getCandidateGitHub(id) {
        const cacheKey = `github:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const endpoint = `/candidates/${id}/github`;
        console.log(`[StudentPlatformService] Requesting: GET ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.get(endpoint);
            const data = response.data?.data || response.data;
            this.setInCache(cacheKey, data, 120);
            return data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
    async contactCandidate(id, payload) {
        const endpoint = `/candidates/${id}/contact`;
        console.log(`[StudentPlatformService] Requesting: POST ${this.client.defaults.baseURL}${endpoint}`);
        try {
            const response = await this.client.post(endpoint, payload);
            return response.data?.data || response.data;
        }
        catch (error) {
            this.handleError(error, endpoint);
        }
    }
}
exports.StudentPlatformService = StudentPlatformService;
exports.studentPlatformService = new StudentPlatformService();

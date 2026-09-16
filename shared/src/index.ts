/**
 * Ansoyal AI — Shared Contracts & Types
 * Defines the strict boundaries between Student Platform, Recruiter Backend, and Recruiter Frontend.
 */

export type VerificationLevel =
  | "SELF_REPORTED"
  | "PLATFORM_VERIFIED"
  | "ASSESSMENT_VERIFIED"
  | "INTERVIEW_VERIFIED"
  | "GITHUB_VERIFIED"
  | "PROJECT_VERIFIED";

export type VerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | "FLAGGED"
  | "REJECTED";

export interface VerificationBadgesDTO {
  githubVerified: boolean;
  codingVerified: boolean;
  interviewVerified: boolean;
  projectVerified: boolean;
  platformVerified: boolean;
}

export interface VerificationRecordDTO {
  level: VerificationLevel;
  status: VerificationStatus;
  source: string;
  verifiedAt: string | Date;
}

export interface CredibilityBreakdownDTO {
  codingAbility: number;
  communication: number;
  consistency: number;
  resumeQuality: number;
  projectDepth: number;
  improvementVelocity: number;
}

export interface CredibilityScoreDTO {
  overallScore: number;
  breakdown: CredibilityBreakdownDTO;
  confidence: "Low" | "Medium" | "High";
  confidenceScore: number;
  evidenceCount: number;
  lastCalculatedAt: string | null;
}

export interface SkillScoreDTO {
  skill: string;
  score: number;
  evidenceCount: number;
  evidenceTypes: string[];
  verificationLevel: VerificationLevel;
  lastActivity: string | Date;
}

export interface GrowthHistoryItemDTO {
  calculatedAt: string | Date;
  overallScore: number;
  codingAbility: number;
  communication: number;
  consistency: number;
  resumeQuality: number;
  projectDepth: number;
  improvementVelocity: number;
}

export interface CandidateStatsDTO {
  codingAssessmentsCount: number;
  aiInterviewsCount: number;
  projectsCount: number;
  githubConnected: boolean;
}

export interface CodingAssessmentDTO {
  id: string;
  title: string;
  language: string;
  score: number;
  passed: number;
  totalTests: number;
  quality: string;
  complexity: string;
  completedAt: string | Date;
}

export interface DeploymentDTO {
  id: string;
  url: string;
  deployedAt: string | Date;
}

/**
 * Strict Recruiter-Safe Candidate DTO
 * Scrubbed of all internal passwords, OAuth tokens, and private prompts.
 */
export interface RecruiterCandidateDTO {
  id: string; // References Student Platform userId
  detailId: string;
  name: string;
  role: string;
  summary: string;
  skills: string[];
  experience: string[];
  projects: string[];
  education: string;
  github: string | null;
  linkedin: string | null;
  website: string | null;
  avatar: string | null;
  credibility: CredibilityScoreDTO;
  verificationBadges: VerificationBadgesDTO;
  verifications: VerificationRecordDTO[];
  stats: CandidateStatsDTO;
  growthHistory?: GrowthHistoryItemDTO[];
  skillScores?: SkillScoreDTO[];
  codingAssessments?: CodingAssessmentDTO[];
  deployments?: DeploymentDTO[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CandidateSearchQuery {
  q?: string;
  skills?: string;
  minCredibility?: number;
  verificationLevel?: VerificationLevel;
  page?: number;
  limit?: number;
  sort?: "credibility" | "recent";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ----------------------------------------------------
// Recruiter Platform Domain Models & DTOs
// ----------------------------------------------------

export type RecruiterRole = "OWNER" | "ADMIN" | "RECRUITER" | "HIRING_MANAGER";

export interface RecruiterUserDTO {
  id: string;
  name: string;
  email: string;
  companyId: string;
  role: RecruiterRole;
  designation: string;
  permissions: string[];
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string | Date;
}

export interface CompanyDTO {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  verifiedStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string | Date;
}

export type ShortlistStatus =
  | "SHORTLISTED"
  | "CONTACTED"
  | "INTERVIEWING"
  | "REJECTED"
  | "HIRED";

export interface ShortlistDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  candidateId: string;
  status: ShortlistStatus;
  tags: string[];
  notesCount?: number;
  candidate?: RecruiterCandidateDTO;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RecruiterNoteDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  recruiterName?: string;
  candidateId: string;
  note: string;
  isPrivateToAuthor: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ContactRequestDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  candidateId: string;
  subject: string;
  message: string;
  roleTitle?: string;
  status: "PENDING" | "DELIVERED" | "FAILED";
  createdAt: string | Date;
}

export interface AuditLogDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  recruiterName?: string;
  action:
    | "CANDIDATE_VIEWED"
    | "CANDIDATE_SHORTLISTED"
    | "SHORTLIST_STAGE_UPDATED"
    | "CANDIDATE_CONTACTED"
    | "NOTE_ADDED"
    | "RESUME_ACCESSED"
    | "EVIDENCE_INSPECTED";
  candidateId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string | Date;
}

export interface DashboardMetricsDTO {
  totalAvailableCandidates: number;
  shortlistedCount: number;
  contactedCount: number;
  activeInterviewingCount: number;
  pipelineBreakdown: Record<ShortlistStatus, number>;
  recommendedCandidates: RecruiterCandidateDTO[];
  recentActivity: AuditLogDTO[];
}

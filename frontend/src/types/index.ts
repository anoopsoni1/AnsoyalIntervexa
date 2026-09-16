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
  verifiedAt: string;
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
  lastActivity: string;
}

export interface GrowthHistoryItemDTO {
  calculatedAt: string;
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
  completedAt: string;
}

export interface DeploymentDTO {
  id: string;
  url: string;
  deployedAt: string;
}

export interface RecruiterCandidateDTO {
  id: string;
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
  shortlist?: {
    id: string;
    status: ShortlistStatus;
    tags: string[];
    notes: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

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
  createdAt: string;
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
  createdAt: string;
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
  notes?: string;
  candidate?: RecruiterCandidateDTO;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterNoteDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  recruiterName: string;
  candidateId: string;
  note: string;
  isPrivateToAuthor: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export interface AuditLogDTO {
  id: string;
  companyId: string;
  recruiterId: string;
  recruiterName?: string;
  action: string;
  candidateId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
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

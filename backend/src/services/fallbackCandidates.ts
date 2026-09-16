export interface FallbackCandidate {
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
  credibility: {
    overallScore: number;
    breakdown: {
      codingAbility: number;
      communication: number;
      consistency: number;
      resumeQuality: number;
      projectDepth: number;
      improvementVelocity: number;
    };
    confidence: "Low" | "Medium" | "High";
    confidenceScore: number;
    evidenceCount: number;
    lastCalculatedAt: string;
  };
  verificationBadges: {
    githubVerified: boolean;
    codingVerified: boolean;
    interviewVerified: boolean;
    projectVerified: boolean;
    platformVerified: boolean;
  };
  verifications: Array<{
    level: string;
    status: string;
    source: string;
    verifiedAt: string;
  }>;
  stats: {
    codingAssessmentsCount: number;
    aiInterviewsCount: number;
    projectsCount: number;
    githubConnected: boolean;
  };
  skillScores: Array<{
    skill: string;
    score: number;
    evidenceCount: number;
    evidenceTypes: string[];
    verificationLevel: string;
    lastActivity: string;
  }>;
  codingAssessments?: Array<{
    id: string;
    title: string;
    language: string;
    score: number;
    passed: number;
    totalTests: number;
    quality: string;
    complexity: string;
    completedAt: string;
  }>;
  deployments?: Array<{
    id: string;
    url: string;
    deployedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const FALLBACK_CANDIDATES: FallbackCandidate[] = [
  {
    id: "6640c31a78e1a5a0d10b9801",
    detailId: "det_001_anoop",
    name: "Anoop Soni",
    role: "Full Stack Developer",
    summary:
      "Full-stack engineer with deep expertise in TypeScript, React, Node.js, and distributed systems. Built high-throughput microservices and AI-assisted workflows.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "TailwindCSS"],
    experience: [
      "Lead Full Stack Developer @ Intervexa Technologies (2024 - Present)",
      "Software Engineering Intern @ CloudScale Labs (2023 - 2024)",
    ],
    projects: [
      "Intervexa AI Recruiter Platform",
      "Credibility Verification Engine",
      "Real-time Collaboration Canvas",
    ],
    education: "B.Tech in Computer Science & Engineering, Top Honors (2020 - 2024)",
    github: "https://github.com/anoopsoni",
    linkedin: "https://linkedin.com/in/anoopsoni",
    website: "https://anoopsoni.dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 88,
      breakdown: {
        codingAbility: 92,
        communication: 84,
        consistency: 90,
        resumeQuality: 91,
        projectDepth: 86,
        improvementVelocity: 85,
      },
      confidence: "High",
      confidenceScore: 89,
      evidenceCount: 18,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "ASSESSMENT_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal Coding Assessments",
        verifiedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        level: "GITHUB_VERIFIED",
        status: "VERIFIED",
        source: "GitHub API OAuth Sync",
        verifiedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        level: "INTERVIEW_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal AI Technical Interview",
        verifiedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        level: "PROJECT_VERIFIED",
        status: "VERIFIED",
        source: "Live Vercel & GitHub Repository Commit Proof",
        verifiedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 8,
      aiInterviewsCount: 4,
      projectsCount: 5,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "React",
        score: 94,
        evidenceCount: 6,
        evidenceTypes: ["CODING_ASSESSMENT", "PROJECT_DEPLOYMENT"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        skill: "TypeScript",
        score: 91,
        evidenceCount: 5,
        evidenceTypes: ["CODING_ASSESSMENT", "GITHUB_REPOS"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        skill: "Node.js",
        score: 89,
        evidenceCount: 5,
        evidenceTypes: ["PROJECT_VERIFICATION", "AI_INTERVIEW"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        skill: "MongoDB",
        score: 85,
        evidenceCount: 3,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        skill: "Python",
        score: 72,
        evidenceCount: 1,
        evidenceTypes: ["SELF_REPORTED"],
        verificationLevel: "SELF_REPORTED",
        lastActivity: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
    ],
    codingAssessments: [
      {
        id: "eval_001",
        title: "Dynamic Programming & Graph Traversal",
        language: "TypeScript",
        score: 95,
        passed: 12,
        totalTests: 12,
        quality: "Optimal Time O(V+E)",
        complexity: "Hard",
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "eval_002",
        title: "Concurrent Task Queue & Rate Limiter",
        language: "TypeScript",
        score: 90,
        passed: 10,
        totalTests: 10,
        quality: "Clean Async Architecture",
        complexity: "Medium",
        completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    deployments: [
      {
        id: "dep_001",
        url: "https://intervexa-app.vercel.app",
        deployedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6640c31a78e1a5a0d10b9802",
    detailId: "det_002_hemant",
    name: "Hemant Singh",
    role: "Full Stack Developer",
    summary:
      "Full-stack software engineer specialized in responsive modern web apps, high-concurrency Node.js REST and GraphQL backends, and cloud orchestration.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "MongoDB", "TailwindCSS", "Docker"],
    experience: [
      "Full Stack Software Engineer @ TechForward (2023 - Present)",
      "Frontend Developer @ WebCraft Studio (2022 - 2023)",
    ],
    projects: ["Real-Time Evidence Audit Engine", "Distributed Task Orchestrator", "E-Commerce Microservices"],
    education: "B.Tech in Information Technology (2019 - 2023)",
    github: "https://github.com/hemantsingh",
    linkedin: "https://linkedin.com/in/hemantsingh",
    website: "https://hemantsingh.dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 84,
      breakdown: {
        codingAbility: 86,
        communication: 80,
        consistency: 85,
        resumeQuality: 88,
        projectDepth: 82,
        improvementVelocity: 83,
      },
      confidence: "High",
      confidenceScore: 85,
      evidenceCount: 14,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "ASSESSMENT_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal Coding Assessments",
        verifiedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        level: "GITHUB_VERIFIED",
        status: "VERIFIED",
        source: "GitHub API Sync",
        verifiedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 6,
      aiInterviewsCount: 3,
      projectsCount: 4,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "React",
        score: 88,
        evidenceCount: 4,
        evidenceTypes: ["CODING_ASSESSMENT", "PROJECT_DEPLOYMENT"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        skill: "Node.js",
        score: 87,
        evidenceCount: 5,
        evidenceTypes: ["CODING_ASSESSMENT", "GITHUB_REPOS"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6640c31a78e1a5a0d10b9803",
    detailId: "det_003_dev",
    name: "Dev Bhraman",
    role: "Frontend Engineer & UI Architect",
    summary:
      "Passionate frontend engineer obsessed with sleek cyberpunk minimalist glassmorphism, Framer Motion animations, accessible design systems, and web performance.",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Framer Motion", "Three.js", "GraphQL"],
    experience: [
      "Senior Frontend Engineer @ Nexus Design Systems (2023 - Present)",
      "UI/UX Developer @ HyperSpace Digital (2021 - 2023)",
    ],
    projects: ["Ultra-Modern Glassmorphic UI Kit", "Interactive 3D Data Visualizer", "SpeedRunner Dashboard"],
    education: "Bachelor of Design & Software Engineering (2018 - 2022)",
    github: "https://github.com/devbhraman",
    linkedin: "https://linkedin.com/in/devbhraman",
    website: "https://devbhraman.design",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 86,
      breakdown: {
        codingAbility: 83,
        communication: 92,
        consistency: 87,
        resumeQuality: 94,
        projectDepth: 88,
        improvementVelocity: 82,
      },
      confidence: "High",
      confidenceScore: 87,
      evidenceCount: 16,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "PROJECT_VERIFIED",
        status: "VERIFIED",
        source: "Verified Production Deployments",
        verifiedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        level: "INTERVIEW_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal AI Communication Assessment",
        verifiedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 5,
      aiInterviewsCount: 4,
      projectsCount: 6,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "React",
        score: 96,
        evidenceCount: 8,
        evidenceTypes: ["PROJECT_VERIFICATION", "AI_INTERVIEW"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        skill: "TypeScript",
        score: 89,
        evidenceCount: 5,
        evidenceTypes: ["CODING_ASSESSMENT", "GITHUB_REPOS"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        skill: "TailwindCSS",
        score: 98,
        evidenceCount: 6,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6640c31a78e1a5a0d10b9804",
    detailId: "det_004_priya",
    name: "Priya Sharma",
    role: "Backend & Distributed Systems Engineer",
    summary:
      "Backend specialist focused on high-throughput Go and Node.js microservices, Kafka event streaming, Redis caching, and resilient database architectures.",
    skills: ["Node.js", "Go", "Python", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"],
    experience: [
      "Backend Engineer @ ScaleGrid Systems (2023 - Present)",
      "Systems Programmer @ CoreData Labs (2022 - 2023)",
    ],
    projects: ["High-Throughput Log Aggregator", "Distributed Event Streamer", "Fintech Payment Pipeline"],
    education: "B.Tech in Computer Science, IIT Delhi (2019 - 2023)",
    github: "https://github.com/priyasharma",
    linkedin: "https://linkedin.com/in/priyasharma",
    website: "https://priyasharma.io",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 91,
      breakdown: {
        codingAbility: 95,
        communication: 82,
        consistency: 93,
        resumeQuality: 89,
        projectDepth: 94,
        improvementVelocity: 91,
      },
      confidence: "High",
      confidenceScore: 92,
      evidenceCount: 21,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "ASSESSMENT_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal Backend Architecture Evaluation",
        verifiedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        level: "GITHUB_VERIFIED",
        status: "VERIFIED",
        source: "GitHub API Sync (1.2k commits)",
        verifiedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 11,
      aiInterviewsCount: 5,
      projectsCount: 7,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "Node.js",
        score: 93,
        evidenceCount: 6,
        evidenceTypes: ["CODING_ASSESSMENT", "PROJECT_DEPLOYMENT"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        skill: "Go",
        score: 91,
        evidenceCount: 4,
        evidenceTypes: ["CODING_ASSESSMENT", "GITHUB_REPOS"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        skill: "PostgreSQL",
        score: 88,
        evidenceCount: 4,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6640c31a78e1a5a0d10b9805",
    detailId: "det_005_arjun",
    name: "Arjun Mehta",
    role: "AI/ML Engineer & Data Scientist",
    summary:
      "Machine learning engineer specializing in LLM agent orchestration, RAG pipelines, fine-tuning PyTorch models, and real-time semantic inference APIs.",
    skills: ["Python", "PyTorch", "LangChain", "FastAPI", "PostgreSQL", "Docker", "AWS", "VectorDB"],
    experience: [
      "AI Research Engineer @ Synthetica AI (2023 - Present)",
      "ML Engineer @ DeepVision Labs (2022 - 2023)",
    ],
    projects: ["Multi-Agent Code Synthesis Engine", "Neural Search for Legal Contracts", "Real-Time RAG Benchmark"],
    education: "M.S. in Artificial Intelligence, Carnegie Mellon (2021 - 2023)",
    github: "https://github.com/arjunmehta-ai",
    linkedin: "https://linkedin.com/in/arjunmehta",
    website: "https://arjunmehta.ai",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 89,
      breakdown: {
        codingAbility: 90,
        communication: 86,
        consistency: 88,
        resumeQuality: 92,
        projectDepth: 93,
        improvementVelocity: 87,
      },
      confidence: "High",
      confidenceScore: 90,
      evidenceCount: 19,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "ASSESSMENT_VERIFIED",
        status: "VERIFIED",
        source: "Ansoyal AI/ML Benchmark",
        verifiedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        level: "PROJECT_VERIFIED",
        status: "VERIFIED",
        source: "HuggingFace & Paper Implementations",
        verifiedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 7,
      aiInterviewsCount: 4,
      projectsCount: 5,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "Python",
        score: 96,
        evidenceCount: 8,
        evidenceTypes: ["CODING_ASSESSMENT", "GITHUB_REPOS"],
        verificationLevel: "ASSESSMENT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        skill: "PyTorch",
        score: 92,
        evidenceCount: 5,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 70 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6640c31a78e1a5a0d10b9806",
    detailId: "det_006_neha",
    name: "Neha Patel",
    role: "DevOps & Cloud Architect",
    summary:
      "Cloud platform and site reliability engineer specialized in automated Kubernetes clusters, Terraform infrastructure as code, CI/CD pipelines, and zero-downtime rollouts.",
    skills: ["Kubernetes", "Docker", "Terraform", "AWS", "Go", "Python", "Prometheus", "GitHub Actions"],
    experience: [
      "Site Reliability Engineer @ CloudNative Corp (2023 - Present)",
      "DevOps Specialist @ InfraScale Systems (2021 - 2023)",
    ],
    projects: ["Multi-Region Kubernetes Failover", "GitOps Terraform Engine", "Zero-Trust Service Mesh"],
    education: "B.Tech in Computer Science (2018 - 2022)",
    github: "https://github.com/nehapatel",
    linkedin: "https://linkedin.com/in/nehapatel",
    website: "https://nehapatel.tech",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    credibility: {
      overallScore: 87,
      breakdown: {
        codingAbility: 85,
        communication: 88,
        consistency: 91,
        resumeQuality: 90,
        projectDepth: 90,
        improvementVelocity: 84,
      },
      confidence: "High",
      confidenceScore: 88,
      evidenceCount: 15,
      lastCalculatedAt: new Date().toISOString(),
    },
    verificationBadges: {
      githubVerified: true,
      codingVerified: true,
      interviewVerified: true,
      projectVerified: true,
      platformVerified: true,
    },
    verifications: [
      {
        level: "PROJECT_VERIFIED",
        status: "VERIFIED",
        source: "Terraform & Helm Deployments",
        verifiedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
    stats: {
      codingAssessmentsCount: 5,
      aiInterviewsCount: 3,
      projectsCount: 6,
      githubConnected: true,
    },
    skillScores: [
      {
        skill: "Kubernetes",
        score: 94,
        evidenceCount: 6,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        skill: "AWS",
        score: 91,
        evidenceCount: 5,
        evidenceTypes: ["PROJECT_VERIFICATION"],
        verificationLevel: "PROJECT_VERIFIED",
        lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 80 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

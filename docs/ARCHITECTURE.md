# Ansoyal AI Recruiter Platform — Architecture

## 1. Executive Summary

Ansoyal AI Recruiter Platform is an enterprise, proof-of-skill candidate discovery system built specifically for hiring managers and recruiters. Unlike traditional job boards that rely strictly on self-reported resumes, Ansoyal surfaces candidates backed by authentic, verified evidence (machine-graded coding tests, AI interview articulation scores, verified GitHub commits, and live deployments).

## 2. The Two-Application Architecture

The ecosystem consists of two strictly separated applications:

```
               ┌──────────────────────────────────────────────┐
               │         ANSOYAL STUDENT PLATFORM             │
               │         (Source of Truth for Talent)         │
               │                                              │
               │  - Candidate User Accounts & Profiles        │
               │  - Saved Resume Details & Education          │
               │  - Evidence Engine & Verification Records    │
               │  - Credibility Engine (6 Score Dimensions)   │
               │  - Judge0 Coding Assessments & Test Results  │
               │  - Whisper + AI Interview Transcripts        │
               │  - Talent Network Visibility Settings        │
               └──────────────────────┬───────────────────────┘
                                      │
                              Secure Server-to-Server
                           API Layer (`x-service-key`)
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │          RECRUITER BACKEND (Port 5002)       │
               │                                              │
               │  - StudentPlatformService Client             │
               │  - Candidate Search & Filter Layer           │
               │  - JWT Authentication & RBAC                 │
               │  - Company Isolation Middleware              │
               │  - Shortlist & Kanban Pipeline Engine        │
               │  - Private Internal Notes Engine             │
               │  - Candidate Contact Relay Engine            │
               │  - Recruiter Security Audit Logger           │
               │  - Recruiter MongoDB (ANSOYAL_RECRUITER_DB)   │
               └──────────────────────┬───────────────────────┘
                                      │
                             REST APIs (Bearer JWT)
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │         RECRUITER FRONTEND (Port 5174)       │
               │                                              │
               │  - React 18 + Vite + TypeScript + Tailwind   │
               │  - TanStack Query (React Query)              │
               │  - Live Candidate Discovery & Faceted Filter │
               │  - 11-Section Deep Evidence Profile View     │
               │  - Drag-and-Drop / Kanban Pipeline           │
               │  - Contact Candidate Modal                   │
               │  - Company & Team Access Management          │
               └──────────────────────────────────────────────┘
```

## 3. Strict Boundary Rules

1. **No Shared Database**:
   The Recruiter Platform MUST NOT directly connect to the Student Platform's MongoDB collections. All candidate data flows via authenticated server-to-server REST APIs.
2. **No Data Duplication**:
   The recruiter database (`ANSOYAL_RECRUITER_DB`) does not replicate student resumes, passwords, or submissions. It stores only recruiter-owned data: `Company`, `Recruiter`, `Shortlist`, `RecruiterNote`, `ContactRequest`, and `AuditLog`.
3. **Talent Discovery Consent**:
   A student only appears in search if `privacySettings.visibleToRecruiters: true`. If a candidate opts out, they are instantly excluded from discovery and direct lookups return `404 CANDIDATE_NOT_FOUND`.
4. **Single Source of Truth**:
   The Student Platform calculates all credibility scores and verification states. The Recruiter Platform never recalculates or fabricates evidence.

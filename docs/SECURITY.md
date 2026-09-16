# Ansoyal AI Recruiter Platform — Security & Privacy Architecture

## 1. Multi-Tenant Company Isolation

- Every recruiter belongs to a specific `Company`.
- All shortlist records, stage transitions, and private notes are indexed and queried strictly with `{ companyId: req.user.companyId }`.
- Even if an attacker attempts an IDOR attack by supplying an `id` belonging to Company B, the database query `findOne({ _id: id, companyId: req.user.companyId })` returns `404 Not Found`.

## 2. Server-to-Server Authentication

- The Recruiter Backend authenticates to the Student Platform via a cryptographically secure service secret (`x-service-key`).
- This secret is stored strictly in server-side environment variables (`process.env.RECRUITER_SERVICE_SECRET`) and is NEVER bundled into or exposed to the client browser.

## 3. Student Privacy & Talent Network Consent

- Students control their visibility via `privacySettings.visibleToRecruiters`.
- Candidates who have opted out (`visibleToRecruiters = false`) are:
  1. Filtered out from all recruiter search and list queries.
  2. Blocked from direct ID lookup with `404 CANDIDATE_NOT_FOUND`.
- Sensitive student data (passwords, email reset tokens, private AI prompts, phone numbers) are stripped by a strict Data Transfer Object (`RecruiterCandidateDTO`) before ever leaving the Student Platform.

## 4. Recruiter Audit Logging

- The `AuditLog` collection automatically logs key recruiter actions:
  - `CANDIDATE_VIEWED`
  - `CANDIDATE_SHORTLISTED`
  - `SHORTLIST_STAGE_UPDATED`
  - `CANDIDATE_CONTACTED`
  - `NOTE_ADDED`
  - `EVIDENCE_INSPECTED`
- Logs record the acting `recruiterId`, `companyId`, candidate identity, IP address, and timestamp to provide an immutable compliance trail.

## 5. Rate Limiting & Abuse Prevention

- Express rate limiters protect the Recruiter Platform endpoints (120 requests/min per IP) to mitigate scrapers and credential stuffing attacks.

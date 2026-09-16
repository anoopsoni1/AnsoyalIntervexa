# Ansoyal AI — Student Platform ↔ Recruiter Platform API Contract

This document specifies the server-to-server API contract between the Ansoyal Student Platform (`http://127.0.0.1:5001/api/v1/recruiter`) and the Recruiter Backend.

## 1. Authentication

- All requests from the Recruiter Backend MUST include the header:
  `x-service-key: <RECRUITER_SERVICE_SECRET>`
- Or `Authorization: Bearer <RECRUITER_SERVICE_SECRET>`
- Missing or mismatched keys return:
  ```json
  {
    "success": false,
    "statusCode": 401,
    "message": "Unauthorized server-to-server access. Invalid or missing service key.",
    "code": "UNAUTHORIZED_SERVICE_ACCESS"
  }
  ```

---

## 2. Endpoints

### `GET /api/v1/recruiter/candidates`
Searches and returns recruiter-safe candidate profiles.

**Query Parameters:**
- `q` (string): Keyword search on candidate name, role, skills, summary, education.
- `skills` (string): Comma-separated skill filter (e.g. `React,Node.js`).
- `minCredibility` (number, 0-100): Minimum overall credibility score.
- `verificationLevel` (string): e.g. `ASSESSMENT_VERIFIED`, `GITHUB_VERIFIED`, `INTERVIEW_VERIFIED`.
- `page` (number): Page index (1-based, default 1).
- `limit` (number): Page size (default 12, max 50).
- `sort` (string): `credibility` (descending score) or `recent` (most recently active).

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "candidates": [
      {
        "id": "69b9394a0d132b1bd0114995",
        "detailId": "69b9394a0d132b1bd0114997",
        "name": "Hemant Singh",
        "role": "Full Stack Developer",
        "summary": "Experienced full stack engineer...",
        "skills": ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
        "experience": ["Full Stack Engineer at Acme..."],
        "projects": ["Solemate Shoe Store (Deployed)..."],
        "education": "B.Tech IIIT Bhopal",
        "github": "github.com/hemantsingh",
        "linkedin": null,
        "website": "https://hemant.vercel.app",
        "avatar": null,
        "credibility": {
          "overallScore": 82,
          "breakdown": {
            "codingAbility": 87,
            "communication": 79,
            "consistency": 84,
            "resumeQuality": 91,
            "projectDepth": 76,
            "improvementVelocity": 82
          },
          "confidence": "High",
          "confidenceScore": 85,
          "evidenceCount": 12,
          "lastCalculatedAt": "2026-09-14T06:00:00.000Z"
        },
        "verificationBadges": {
          "githubVerified": true,
          "codingVerified": true,
          "interviewVerified": true,
          "projectVerified": true,
          "platformVerified": true
        },
        "stats": {
          "codingAssessmentsCount": 4,
          "aiInterviewsCount": 3,
          "projectsCount": 3,
          "githubConnected": true
        },
        "createdAt": "2026-09-10T12:00:00.000Z",
        "updatedAt": "2026-09-14T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 29,
      "totalPages": 3
    }
  },
  "message": "Candidates fetched successfully for recruiter discovery"
}
```

---

### `GET /api/v1/recruiter/candidates/:id`
Retrieves detailed profile by candidate `userId`.

**Response (200 OK):**
Contains complete candidate DTO with `growthHistory`, `skillScores`, `codingAssessments`, and `deployments`.

**Error (404 Not Found):**
Candidate does not exist or has `privacySettings.visibleToRecruiters: false`.
```json
{
  "statusCode": 404,
  "message": "Candidate has opted out of recruiter discovery or does not exist",
  "success": false
}
```

---

### `POST /api/v1/recruiter/candidates/:id/contact`
Relays an opportunity message to the candidate through the platform notification engine.

**Request Body:**
```json
{
  "subject": "Senior Frontend Opportunity",
  "message": "We were impressed by your verified coding projects...",
  "roleTitle": "Senior Frontend Engineer",
  "recruiterName": "Sarah Connor",
  "companyName": "TechCorp Global"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "delivered": true,
    "candidateNotified": true
  },
  "message": "Contact request successfully routed to candidate"
}
```

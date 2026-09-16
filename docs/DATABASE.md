# Ansoyal AI Recruiter Platform — Database Architecture

The Recruiter Platform operates on a dedicated MongoDB database: **`ANSOYAL_RECRUITER_DB`**.
It stores only recruiter-owned and company-specific data.

## Collections & Schemas

### 1. `companies`
Stores corporate employer profiles and domain mappings.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique company ID |
| `name` | String | Official company name |
| `domain` | String (Unique) | Corporate email domain (e.g. `techcorp.com`) |
| `logo` | String | Cloudinary / CDN logo URL |
| `website` | String | Company homepage |
| `industry` | String | e.g. "Software", "Fintech" |
| `size` | String | e.g. "50-200 employees" |
| `location` | String | e.g. "San Francisco, CA / Remote" |
| `verifiedStatus` | Enum | `PENDING`, `VERIFIED`, `REJECTED` |

---

### 2. `recruiters`
Stores recruiter user accounts and RBAC permissions.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique recruiter user ID |
| `name` | String | Recruiter's full name |
| `email` | String (Unique) | Recruiter's corporate email |
| `passwordHash` | String | Bcrypt hash |
| `companyId` | ObjectId | References `companies` |
| `role` | Enum | `OWNER`, `ADMIN`, `RECRUITER`, `HIRING_MANAGER` |
| `designation` | String | e.g. "Senior Technical Recruiter" |
| `permissions` | [String] | Granular permission list |

---

### 3. `shortlists`
Tracks shortlisted candidates per company.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique shortlist ID |
| `companyId` | ObjectId | References `companies` (Indexed) |
| `recruiterId` | ObjectId | References `recruiters` |
| `candidateId` | String | References Student Platform `userId` |
| `status` | Enum | `SHORTLISTED`, `CONTACTED`, `INTERVIEWING`, `REJECTED`, `HIRED` |
| `tags` | [String] | Custom recruiter tags |
| `notes` | String | Initial candidate shortlist notes |

*Compound unique index on `{ companyId: 1, candidateId: 1 }` prevents duplicate entries.*

---

### 4. `recruiternotes`
Private internal notes visible only within the company.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Note ID |
| `companyId` | ObjectId | References `companies` |
| `recruiterId` | ObjectId | References author `recruiters` |
| `candidateId` | String | Student Platform `userId` |
| `note` | String | Note content |
| `isPrivateToAuthor`| Boolean | True if visible only to the author |

---

### 5. `contactrequests`
Records recruiter contact attempts dispatched to candidates.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Contact request ID |
| `companyId` | ObjectId | References `companies` |
| `recruiterId` | ObjectId | References `recruiters` |
| `candidateId` | String | Student Platform `userId` |
| `subject` | String | Opportunity subject |
| `message` | String | Message body |
| `roleTitle` | String | Targeted role |
| `status` | Enum | `PENDING`, `DELIVERED`, `FAILED` |

---

### 6. `auditlogs`
Security compliance audit trail.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Log ID |
| `companyId` | ObjectId | References `companies` |
| `recruiterId` | ObjectId | References acting recruiter |
| `action` | Enum | `CANDIDATE_VIEWED`, `CANDIDATE_SHORTLISTED`, etc. |
| `candidateId` | String | Targeted candidate |
| `metadata` | Mixed | Contextual action metadata |
| `ipAddress` | String | Origin IP |
| `createdAt` | Date | Timestamp |

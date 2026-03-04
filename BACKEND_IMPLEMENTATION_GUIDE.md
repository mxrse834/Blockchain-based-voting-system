# Backend Implementation Guide for Candidates Endpoints

The frontend application requires additional backend endpoints for candidate management. This guide provides the complete implementation.

## Missing Endpoints

The frontend uses these candidate endpoints that need to be added:

```
GET    /elections/:electionId/candidates              - Get all candidates
POST   /elections/:electionId/candidates              - Add candidate
DELETE /elections/:electionId/candidates/:candidateId - Delete candidate
```

## Implementation Steps

### Step 1: Add Missing Functions to Election Controller

Add these functions to `backend/src/controllers/election.controller.js`:

```javascript
// Add after the existing addCandidateToElection function

const getCandidates = asyncHandler(async (req, res) => {
  const { electionId } = req.params;

  if (!electionId) {
    throw new ApiError(400, "Election id is required");
  }

  if (!isUuid(electionId)) {
    throw new ApiError(400, "Invalid election id format");
  }

  const [election] = await db.query(
    "SELECT election_id FROM elections WHERE election_id = ?",
    [electionId]
  );

  if (election.length === 0) {
    throw new ApiError(404, "Election does not exist");
  }

  const [candidates] = await db.query(
    "SELECT candidate_id, name, election_id FROM candidates WHERE election_id = ? ORDER BY name",
    [electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, candidates, "Candidates fetched successfully")
  );
});

const deleteCandidateFromElection = asyncHandler(async (req, res) => {
  const { electionId, candidateId } = req.params;

  if (!electionId) {
    throw new ApiError(400, "Election id is required");
  }

  if (!candidateId) {
    throw new ApiError(400, "Candidate id is required");
  }

  if (!isUuid(electionId) || !isUuid(candidateId)) {
    throw new ApiError(400, "Invalid election or candidate id format");
  }

  const [existing] = await db.query(
    "SELECT candidate_id FROM candidates WHERE candidate_id = ? AND election_id = ?",
    [candidateId, electionId]
  );

  if (existing.length === 0) {
    throw new ApiError(404, "Candidate not found in this election");
  }

  await db.query(
    "DELETE FROM candidates WHERE candidate_id = ? AND election_id = ?",
    [candidateId, electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Candidate deleted successfully")
  );
});
```

### Step 2: Update Election Controller Exports

Update the export statement at the bottom of `backend/src/controllers/election.controller.js`:

```javascript
export {
  createElection,
  getAllElections,
  getElectionById,
  deleteElection,
  updateElection,
  addCandidateToElection,
  getCandidates,
  deleteCandidateFromElection
};
```

### Step 3: Update Election Routes

Update `backend/src/routes/election.routes.js`:

```javascript
import express from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById,
  updateElection,
  addCandidateToElection,
  getCandidates,
  deleteCandidateFromElection
} from "../controllers/election.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// Election management routes
router.post("/", verifyJWT, authorizeRole("ADMIN"), createElection);
router.get("/", verifyJWT, getAllElections);
router.get("/:electionId", verifyJWT, getElectionById);
router.patch("/:electionId", verifyJWT, authorizeRole("ADMIN"), updateElection);
router.delete("/:electionId", verifyJWT, authorizeRole("ADMIN"), deleteElection);

// Candidate management routes
router.get("/:electionId/candidates", verifyJWT, getCandidates);
router.post("/:electionId/candidates", verifyJWT, authorizeRole("ADMIN"), addCandidateToElection);
router.delete("/:electionId/candidates/:candidateId", verifyJWT, authorizeRole("ADMIN"), deleteCandidateFromElection);

export default router;
```

### Step 4: Ensure Routes Are Registered in Server

Make sure your `backend/server.js` includes the route registration (add if missing):

```javascript
import authRoutes from "./src/routes/auth.routes.js";
import electionRoutes from "./src/routes/election.routes.js";
import voteRoutes from "./src/routes/vote.routes.js";

// ... middleware setup ...

app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", voteRoutes);
```

## Testing the Endpoints

### Create Election
```bash
POST http://localhost:5000/elections
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Test Election",
  "startTime": "2024-12-01T10:00:00",
  "endTime": "2024-12-01T18:00:00"
}
```

### Get Candidates
```bash
GET http://localhost:5000/elections/{election_id}/candidates
Authorization: Bearer <access_token>
```

### Add Candidate
```bash
POST http://localhost:5000/elections/{election_id}/candidates
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe"
}
```

### Delete Candidate
```bash
DELETE http://localhost:5000/elections/{election_id}/candidates/{candidate_id}
Authorization: Bearer <access_token>
```

## Database Verification

Ensure your database has the candidates table:

```sql
CREATE TABLE candidates (
  candidate_id CHAR(36) PRIMARY KEY,
  election_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
```

## Additional Fixes Required

### Fix 1: Vote Controller (add missing imports)

Update `backend/src/controllers/vote.controller.js` to include the candidates table query:

Before the vote insertion, verify candidate exists and fetch onchain_index if applicable.

### Fix 2: Middleware Names

Note: Some routes reference `auth.middleware.js` while others reference `jwt.middleware.js`. Ensure consistency. The correct import should be from `auth.middleware.js`.

Update all election routes from:
```javascript
import { verifyJWT } from "../middlewares/jwt.middleware.js";
```

To:
```javascript
import { verifyJWT } from "../middlewares/auth.middleware.js";
```

## Environment Variables

Ensure backend has these in `.env`:

```
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=voting_system
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

## Summary

After implementing these changes:
1. The frontend will be able to manage candidates
2. Admins can add/remove candidates from elections
3. Voters can see all candidates and vote
4. All endpoints are properly protected with JWT and role-based access

Test thoroughly with both Postman and the frontend application before deployment.

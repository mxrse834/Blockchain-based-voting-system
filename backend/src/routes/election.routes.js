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
import {
  getCandidatesByElection,
  createCandidate,
  deleteCandidate
} from "../controllers/candidates.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// Election CRUD
router.post("/", verifyJWT, authorizeRole("ADMIN"), createElection);

router.get("/", verifyJWT, getAllElections);

// Nested candidate routes (before :electionId route to avoid conflict)
router.get("/:electionId/candidates", verifyJWT, getCandidates);

router.post(
  "/:electionId/candidates",
  verifyJWT,
  authorizeRole("ADMIN"),
  addCandidateToElection
);

router.delete(
  "/:electionId/candidates/:candidateId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteCandidateFromElection
);

// Single election operations (after nested routes)
router.get("/:electionId", verifyJWT, getElectionById);

router.patch(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateElection
);

router.delete(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteElection
);

export default router;

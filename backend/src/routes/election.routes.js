import express from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById,
  updateElection
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
router.get("/:electionId/candidates", verifyJWT, getCandidatesByElection);

router.post(
  "/:electionId/candidates",
  verifyJWT,
  authorizeRole("ADMIN"),
  (req, res, next) => {
    // Transform electionId from path to body for handler
    req.body.electionId = req.params.electionId;
    next();
  },
  createCandidate
);

router.delete(
  "/:electionId/candidates/:candidateId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteCandidate
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

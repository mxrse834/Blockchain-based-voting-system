import express from "express";
import {
  createCandidate,
  getCandidatesByElection,
  getCandidateById,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidates.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, authorizeRole("ADMIN"), createCandidate);

router.get("/election/:electionId", verifyJWT, getCandidatesByElection);

router.get("/:candidateId", verifyJWT, getCandidateById);

router.patch("/:candidateId", verifyJWT, authorizeRole("ADMIN"), updateCandidate);

router.delete("/:candidateId", verifyJWT, authorizeRole("ADMIN"), deleteCandidate);

export default router;
import express from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById,
  updateElection
} from "../controllers/election.controller.js";

import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, authorizeRole("ADMIN"), createElection);

router.get("/", verifyJWT, getAllElections);

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

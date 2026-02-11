import express from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById
} from "../controllers/election.controller.js";

import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  authorizeRole("ADMIN"),
  createElection
);

router.get(
  "/",
  verifyJWT,
  getAllElections
);

router.get(
  "/:electionId",
  verifyJWT,
  getElectionById
);

router.delete(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteElection
);

router.patch(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateElection
);

export default router;

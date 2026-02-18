import express from "express";
import { createElection } from "../controllers/election.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  authorizeRole("ADMIN"),
  createElection
);

export default router;

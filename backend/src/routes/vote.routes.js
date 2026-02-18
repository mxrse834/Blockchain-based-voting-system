import express from "express";
import { castVote, getElectionResults, getMyVote } from "../controllers/vote.controller.js";
import { verifyJWT } from "../middlewares/jwt.middleware.js";

const router = express.Router();

router.post("/:electionId", verifyJWT, castVote);

router.get("/:electionId/results", verifyJWT, getElectionResults);

router.get("/:electionId/my-vote", verifyJWT, getMyVote);

export default router;

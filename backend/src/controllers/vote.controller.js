import db from "../db/connection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4, validate as isUuid } from "uuid";
import blockchain from "../utils/blockchain.service.js";

const castVote = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const { candidateId } = req.body;
  const userId = req.user?.user_id;

  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!isUuid(electionId)) throw new ApiError(400, "Invalid election id");
  if (!isUuid(candidateId)) throw new ApiError(400, "Invalid candidate id");

  // Check election
  const [election] = await db.query(
    "SELECT start_time, end_time FROM elections WHERE election_id = ?",
    [electionId]
  );
  if (election.length === 0) throw new ApiError(404, "Election not found");

  const now = new Date();
  if (now < new Date(election[0].start_time))
    throw new ApiError(400, "Election has not started yet");
  if (now > new Date(election[0].end_time))
    throw new ApiError(400, "Election has ended");

  // Check candidate belongs to election
  const [candidate] = await db.query(
    "SELECT candidate_id FROM candidates WHERE candidate_id = ? AND election_id = ?",
    [candidateId, electionId]
  );
  if (candidate.length === 0)
    throw new ApiError(404, "Candidate not found in this election");

  // Check if already voted
  const [existing] = await db.query(
    "SELECT has_voted FROM voting_status WHERE user_id = ? AND election_id = ?",
    [userId, electionId]
  );

  if (existing.length > 0 && existing[0].has_voted)
    throw new ApiError(409, "You have already voted");

  // Insert or update voting_status
  await db.query(
    `
    INSERT INTO voting_status (user_id, election_id, has_voted, candidate_id, voted_at)
    VALUES (?, ?, TRUE, ?, NOW())
    ON DUPLICATE KEY UPDATE
      has_voted = TRUE,
      candidate_id = VALUES(candidate_id),
      voted_at = NOW()
    `,
    [userId, electionId, candidateId]
  );

  return res.status(201).json(
    new ApiResponse(201, { candidateId }, "Vote cast successfully")
  );
});

const getElectionResults = asyncHandler(async (req, res) => {
  const { electionId } = req.params;

  const [results] = await db.query(
    `
    SELECT 
      c.candidate_id,
      c.name,
      COUNT(vs.user_id) AS vote_count
    FROM candidates c
    LEFT JOIN voting_status vs 
      ON c.candidate_id = vs.candidate_id AND vs.has_voted = TRUE
    WHERE c.election_id = ?
    GROUP BY c.candidate_id
    ORDER BY vote_count DESC
    `,
    [electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, results, "Results fetched successfully")
  );
});

const getMyVote = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const userId = req.user?.user_id;

  const [vote] = await db.query(
    `
    SELECT c.candidate_id, c.name
    FROM voting_status vs
    JOIN candidates c ON vs.candidate_id = c.candidate_id
    WHERE vs.user_id = ? AND vs.election_id = ?
    `,
    [userId, electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, vote.length ? vote[0] : null, "Vote fetched successfully")
  );
});

export { castVote, getElectionResults, getMyVote };
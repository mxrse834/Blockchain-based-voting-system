import db from "../db/connection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4, validate as isUuid } from "uuid";

const castVote = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const { candidateId } = req.body;

  const userId = req.user?.user_id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!isUuid(electionId)) {
    throw new ApiError(400, "Invalid election id");
  }

  if (!isUuid(candidateId)) {
    throw new ApiError(400, "Invalid candidate id");
  }

  // Check election exists
  const [election] = await db.query(
    "SELECT election_id, start_time, end_time FROM elections WHERE election_id = ?",
    [electionId]
  );

  if (election.length === 0) {
    throw new ApiError(404, "Election not found");
  }

  const now = new Date();
  const { start_time, end_time } = election[0];

  if (now < new Date(start_time)) {
    throw new ApiError(400, "Election has not started yet");
  }

  if (now > new Date(end_time)) {
    throw new ApiError(400, "Election has ended");
  }

  // Check candidate exists in that election
  const [candidate] = await db.query(
    "SELECT candidate_id FROM candidates WHERE candidate_id = ? AND election_id = ?",
    [candidateId, electionId]
  );

  if (candidate.length === 0) {
    throw new ApiError(404, "Candidate not found in this election");
  }

  // Check if user already voted
  const [existingVote] = await db.query(
    "SELECT vote_id FROM votes WHERE election_id = ? AND user_id = ?",
    [electionId, userId]
  );

  if (existingVote.length > 0) {
    throw new ApiError(409, "You have already voted in this election");
  }

  const voteId = uuidv4();

  await db.query(
    `INSERT INTO votes (vote_id, election_id, candidate_id, user_id)
     VALUES (?, ?, ?, ?)`,
    [voteId, electionId, candidateId, userId]
  );

  return res.status(201).json(
    new ApiResponse(201, null, "Vote cast successfully")
  );
});


const getElectionResults = asyncHandler(async (req, res) => {
  const { electionId } = req.params;

  if (!isUuid(electionId)) {
    throw new ApiError(400, "Invalid election id");
  }

  const [results] = await db.query(
    `
    SELECT 
      c.candidate_id,
      c.name,
      COUNT(v.vote_id) AS vote_count
    FROM candidates c
    LEFT JOIN votes v ON c.candidate_id = v.candidate_id
    WHERE c.election_id = ?
    GROUP BY c.candidate_id
    ORDER BY vote_count DESC
    `,
    [electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, results, "Election results fetched successfully")
  );
});


const getMyVote = asyncHandler(async (req, res) => {
  const { electionId } = req.params;
  const userId = req.user?.user_id;

  if (!isUuid(electionId)) {
    throw new ApiError(400, "Invalid election id");
  }

  const [vote] = await db.query(
    `
    SELECT candidate_id
    FROM votes
    WHERE election_id = ? AND user_id = ?
    `,
    [electionId, userId]
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      vote.length > 0 ? vote[0] : null,
      "Vote fetched successfully"
    )
  );
});

export { castVote, getElectionResults, getMyVote };

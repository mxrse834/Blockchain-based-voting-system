import db from "../db/connection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4, validate as isUuid } from "uuid";

/**
 * 🟢 Create Candidate (ADMIN)
 */
const createCandidate = asyncHandler(async (req, res) => {
  const { electionId, name } = req.body;

  if (!isUuid(electionId)) throw new ApiError(400, "Invalid election id");
  if (!name || !name.trim()) throw new ApiError(400, "Candidate name required");

  // Check election exists
  const [election] = await db.query(
    "SELECT election_id FROM elections WHERE election_id = ?",
    [electionId]
  );
  if (election.length === 0) throw new ApiError(404, "Election not found");

  const candidateId = uuidv4();

  await db.query(
    "INSERT INTO candidates (candidate_id, election_id, name) VALUES (?, ?, ?)",
    [candidateId, electionId, name.trim()]
  );

  return res.status(201).json(
    new ApiResponse(201, { candidate_id: candidateId, name: name.trim(), election_id: electionId }, "Candidate added successfully")
  );
});

/**
 * 🟢 Get all candidates for an election
 */
const getCandidatesByElection = asyncHandler(async (req, res) => {
  const { electionId } = req.params;

  if (!isUuid(electionId)) throw new ApiError(400, "Invalid election id");

  // Check election exists
  const [electionCheck] = await db.query(
    "SELECT election_id FROM elections WHERE election_id = ?",
    [electionId]
  );
  if (electionCheck.length === 0) throw new ApiError(404, "Election not found");

  const [candidates] = await db.query(
    "SELECT candidate_id, name, election_id FROM candidates WHERE election_id = ?",
    [electionId]
  );

  return res.status(200).json(
    new ApiResponse(200, candidates, "Candidates fetched successfully")
  );
});

/**
 * 🟢 Get candidate by ID
 */
const getCandidateById = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;

  if (!isUuid(candidateId)) throw new ApiError(400, "Invalid candidate id");

  const [candidate] = await db.query(
    "SELECT candidate_id, name, election_id FROM candidates WHERE candidate_id = ?",
    [candidateId]
  );

  if (candidate.length === 0)
    throw new ApiError(404, "Candidate not found");

  return res.status(200).json(
    new ApiResponse(200, candidate[0], "Candidate fetched successfully")
  );
});

/**
 * 🟡 Update candidate (ADMIN)
 */
const updateCandidate = asyncHandler(async (req, res) => {
  const { candidateId } = req.params;
  const { name } = req.body;

  if (!isUuid(candidateId)) throw new ApiError(400, "Invalid candidate id");
  if (!name || !name.trim()) throw new ApiError(400, "Name is required");

  const [existing] = await db.query(
    "SELECT candidate_id FROM candidates WHERE candidate_id = ?",
    [candidateId]
  );

  if (existing.length === 0)
    throw new ApiError(404, "Candidate not found");

  await db.query(
    "UPDATE candidates SET name = ? WHERE candidate_id = ?",
    [name.trim(), candidateId]
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Candidate updated successfully")
  );
});

/**
 * 🔴 Delete candidate (ADMIN)
 */
const deleteCandidate = asyncHandler(async (req, res) => {
    const { candidateId } = req.params;

    if (!isUuid(candidateId)) throw new ApiError(400, "Invalid candidate id");

    const [existing] = await db.query(
        "SELECT candidate_id FROM candidates WHERE candidate_id = ?",
        [candidateId]
    );

    if (existing.length === 0)
        throw new ApiError(404, "Candidate not found");

    await db.query(
        "DELETE FROM candidates WHERE candidate_id = ?",
        [candidateId]
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Candidate deleted successfully")
    );
});

export {
  createCandidate,
  getCandidatesByElection,
  getCandidateById,
  updateCandidate,
  deleteCandidate
};
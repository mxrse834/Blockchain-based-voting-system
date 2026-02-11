import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from "uuid";

const createElection = asyncHandler(async (req, res) => {
    const { title, startTime, endTime } = req.body;
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) throw new ApiError(400, "Title is necessary");
    if (!startTime) throw new ApiError(400, "Election start time is necessary");
    if (!endTime) throw new ApiError(400, "Election end time is necessary");

    if (isNaN(new Date(startTime)) || isNaN(new Date(endTime))) throw new ApiError(400, "Invalid date format");

    if (new Date(endTime) <= new Date(startTime)) throw new ApiError(400, "End time must be after start time");

    const [existing] = await db.query(
        "SELECT election_id FROM elections WHERE title = ?",
        [trimmedTitle]
    );

    if (existing.length > 0)
        throw new ApiError(409, "Election already exists");

    const electionId = uuidv4();

    await db.query(
        `INSERT INTO elections (election_id, title, start_time, end_time)
        VALUES (?, ?, ?, ?)`,
        [electionId, trimmedTitle, startTime, endTime]
    );

    const [election] = await db.query(
        `SELECT election_id, title, start_time, end_time, status
        FROM elections WHERE election_id = ?`,
        [electionId]
    );

    if (election.length === 0)
        throw new ApiError(500, "Election creation failed");

    return res.status(201).json(
        new ApiResponse(201, election[0], "Election created successfully")
    );
});

const getAllElections = asyncHandler(async (req, res) => {
    const [ elections ] = await db.query(
        "SELECT election_id, title, start_time, end_time, status FROM elections ORDER BY created_at DESC"
    );

    return res
    .status(200)
    .json(new ApiResponse(200, elections, "All elections fetched successfully"));
});

const getElectionById = asyncHandler(async (req, res) => {
  const { electionId } = req.params;

  if (!electionId) {
    throw new ApiError(400, "Election id is necessary");
  }

  if (!isUuid(electionId)) {
    throw new ApiError(400, "Invalid election id format");
  }

  const [election] = await db.query(
    `SELECT election_id, title, start_time, end_time, status
     FROM elections
     WHERE election_id = ?`,
    [electionId]
  );

  if (election.length === 0) {
    throw new ApiError(404, "Election does not exist");
  }

  return res.status(200).json(
    new ApiResponse(200, election[0], "Election fetched successfully")
  );
});

const deleteElection = asyncHandler(async (req, res) => {
    const { electionId } = req.params;

    if (!electionId) {
        throw new ApiError(400, "Election id is required");
    }

    if (!isUuid(electionId)) {
        throw new ApiError(400, "Invalid election id format");
    }

    // Check if election exists
    const [existing] = await db.query(
        "SELECT election_id FROM elections WHERE election_id = ?",
        [electionId]
    );

    if (existing.length === 0) {
        throw new ApiError(404, "Election does not exist");
    }

    // Delete election
    await db.query(
        "DELETE FROM elections WHERE election_id = ?",
        [electionId]
    );

    return res.status(200).json(
        new ApiResponse(200, null, "Election deleted successfully")
    );
});


const updateElection = asyncHandler(async (req, res) => {
    const { electionId } = req.params;
    const { title, startTime, endTime, status } = req.body;

    if (!electionId) {
        throw new ApiError(400, "Election id is required");
    }

    if (!isUuid(electionId)) {
        throw new ApiError(400, "Invalid election id format");
    }

    // Check if election exists
    const [existing] = await db.query(
        "SELECT * FROM elections WHERE election_id = ?",
        [electionId]
    );

    if (existing.length === 0) {
        throw new ApiError(404, "Election does not exist");
    }

    const election = existing[0];

    // Prepare updated values (fallback to old values if not provided)
    const updatedTitle = title?.trim() || election.title;
    const updatedStartTime = startTime || election.start_time;
    const updatedEndTime = endTime || election.end_time;
    const updatedStatus = status || election.status;

    // Validate dates if provided
    if (
        new Date(updatedEndTime) <= new Date(updatedStartTime)
    ) {
        throw new ApiError(400, "End time must be after start time");
    }

    // Prevent duplicate title
    if (title) {
        const [duplicate] = await db.query(
        "SELECT election_id FROM elections WHERE title = ? AND election_id != ?",
        [updatedTitle, electionId]
        );

        if (duplicate.length > 0) {
        throw new ApiError(409, "Election title already exists");
        }
    }

    await db.query(
        `UPDATE elections
        SET title = ?, start_time = ?, end_time = ?, status = ?
        WHERE election_id = ?`,
        [
        updatedTitle,
        updatedStartTime,
        updatedEndTime,
        updatedStatus,
        electionId
        ]
    );

    const [updatedElection] = await db.query(
        `SELECT election_id, title, start_time, end_time, status
        FROM elections WHERE election_id = ?`,
        [electionId]
    );

    return res.status(200).json(
        new ApiResponse(200, updatedElection[0], "Election updated successfully")
    );
});


const addCandidateToElection = asyncHandler(async (req, res) => {

});

export { createElection, getAllElections, getElectionById, deleteElection, updateElection, addCandidateToElection }
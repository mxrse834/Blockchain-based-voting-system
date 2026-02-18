import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/connection.js";

export const createElection = asyncHandler(async (req, res) => {
  const { title, start_time, end_time } = req.body;

  if (!title || !start_time || !end_time) {
    throw new ApiError(400, "All fields are required");
  }

  await db.query(
    `INSERT INTO elections (election_id, title, start_time, end_time, status)
     VALUES (UUID(), ?, ?, ?, 'UPCOMING')`,
    [title, start_time, end_time]
  );

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Election created successfully"));
});

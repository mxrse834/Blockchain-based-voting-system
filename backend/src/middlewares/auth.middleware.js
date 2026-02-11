import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import db from "../db/connection.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const [rows] = await db.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
    [decoded.user_id]
  );

  if (rows.length === 0) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = rows[0];
  next();
});

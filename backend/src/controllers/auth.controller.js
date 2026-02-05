import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import db from "../db/connection.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/token.util.js";
import { generateRefreshToken } from "../utils/token.util.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) throw new ApiError(400, "All fields are required");

    const [existing] = await db.query(
        "SELECT user_id FROM users WHERE email = ?",
        [email]
    );

    if (existing.length > 0) {
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        `INSERT INTO users (user_id, name, email, password_hash, role)
        VALUES (UUID(), ?, ?, ?, 'VOTER')`,
        [name, email, hashedPassword]
    );

    const [users] = await db.query(
    `SELECT user_id, name, email, role, created_at
     FROM users WHERE email = ?`,
    [email]
    );

    if (users.length === 0) throw new ApiError(500, "User registration failed");

    return res
    .status(201)
    .json(new ApiResponse(201, users[0], "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const [users] = await db.query(
        `SELECT user_id, name, email, role, password_hash, created_at
        FROM users WHERE email = ?`,
        [email]
    );

    if (users.length === 0) {
        throw new ApiError(401, "Invalid email or password");
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken({
        user_id: user.user_id,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        user_id: user.user_id
    });

    delete user.password_hash;

    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new ApiResponse(
        200,
        { user, accessToken},
        "Login successful"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res
    .status(200)
    .json( new ApiResponse(200, null, "Logged out successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "Current user fetched successfully"));

});

export { registerUser, loginUser, logoutUser, getCurrentUser }
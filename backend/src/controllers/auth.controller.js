import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import db from "../db/connection.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessToken } from "../utils/token.util.js";
import { generateRefreshToken } from "../utils/token.util.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, walletAddress } = req.body;

  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedWalletAddress = walletAddress?.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  if (!trimmedWalletAddress) {
    throw new ApiError(400, "Wallet address is required. Please connect your MetaMask wallet.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
    
  // Check if user already exists
  const [existingUser] = await db.query(
    "SELECT user_id FROM users WHERE email = ?",
    [trimmedEmail]
  );
  if (existingUser.length > 0) {
    throw new ApiError(409, "User already exists");
  }

  // Check if wallet already exists
  const [existingWallet] = await db.query(
    "SELECT user_id FROM users WHERE wallet_address = ?",
    [trimmedWalletAddress]
  );
  if (existingWallet.length > 0) {
    throw new ApiError(409, "Wallet already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = uuidv4();

  // Insert user
  await db.query(
    `INSERT INTO users (user_id, name, email, wallet_address, password_hash, role)
     VALUES (?, ?, ?, ?, ?, 'VOTER')`,
    [userId, trimmedName, trimmedEmail, trimmedWalletAddress, hashedPassword]
  );

  // Fetch created user
  const [users] = await db.query(
    `SELECT user_id, name, email, wallet_address, role, created_at
     FROM users WHERE user_id = ?`,
    [userId]
  );

  if (users.length === 0) {
    throw new ApiError(500, "User registration failed");
  }

  return res.status(201).json(
    new ApiResponse(201, users[0], "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const [users] = await db.query(
        `SELECT user_id, name, email, role, password_hash, created_at
        FROM users WHERE email = ?`,
        [trimmedEmail]
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

    // Remove password before sending response
    delete user.password_hash;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(
        new ApiResponse(
        200,
        { user, accessToken },
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

const refreshAccessToken = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!oldRefreshToken) throw new ApiError(401, "Unauthorized request.");

    let decodedInfo;
    try {
        decodedInfo = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token.");
    }

    const [rows] = await db.query(
        "SELECT user_id, role FROM users WHERE user_id = ?",
        [decodedInfo.user_id]
    );

    if (rows.length === 0) {
        throw new ApiError(401, "Invalid refresh token.");
    }

    const user = rows[0];

    const accessToken = generateAccessToken({
        user_id: user.user_id,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        user_id: user.user_id
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
        new ApiResponse(
            200,
            { accessToken },
            "Access token refreshed successfully."
        )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "Current user fetched successfully"));

});

export { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken }
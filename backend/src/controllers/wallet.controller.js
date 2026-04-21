import db from "../db/connection.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Link a MetaMask wallet address to the authenticated user.
 * This is the core of the Security Proxy Mapping — it binds a
 * verified blockchain identity (wallet) to the off-chain user account.
 *
 * POST /wallet/link
 * Body: { walletAddress: "0x..." }
 */
const linkWallet = asyncHandler(async (req, res) => {
  const userId = req.user?.user_id;
  const { walletAddress } = req.body;

  if (!userId) throw new ApiError(401, "Unauthorized");

  // Validate Ethereum address format: 0x + 40 hex characters
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!walletAddress || !ethAddressRegex.test(walletAddress)) {
    throw new ApiError(400, "Invalid Ethereum wallet address format");
  }

  const normalizedAddress = walletAddress.toLowerCase();

  // Check if this wallet is already linked to another user
  const [existing] = await db.query(
    "SELECT user_id FROM users WHERE wallet_address = ? AND user_id != ?",
    [normalizedAddress, userId]
  );

  if (existing.length > 0) {
    throw new ApiError(
      409,
      "This wallet address is already linked to another account"
    );
  }

  // Link the wallet to the current user
  await db.query(
    "UPDATE users SET wallet_address = ? WHERE user_id = ?",
    [normalizedAddress, userId]
  );

  return res.status(200).json(
    new ApiResponse(200, { walletAddress: normalizedAddress }, "Wallet linked successfully")
  );
});

/**
 * Check if the current user has a wallet linked.
 *
 * GET /wallet/verify
 */
const verifyWallet = asyncHandler(async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const [rows] = await db.query(
    "SELECT wallet_address FROM users WHERE user_id = ?",
    [userId]
  );

  if (rows.length === 0) {
    throw new ApiError(404, "User not found");
  }

  const walletAddress = rows[0].wallet_address;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        linked: !!walletAddress,
        walletAddress: walletAddress || null
      },
      walletAddress ? "Wallet is linked" : "No wallet linked"
    )
  );
});

export { linkWallet, verifyWallet };

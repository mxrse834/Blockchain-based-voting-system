import express from "express";
import { linkWallet, verifyWallet } from "../controllers/wallet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Link a MetaMask wallet address to the authenticated user
router.post("/link", verifyJWT, linkWallet);

// Check if the current user has a linked wallet
router.get("/verify", verifyJWT, verifyWallet);

export default router;

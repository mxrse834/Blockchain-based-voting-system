import "./src/db/connection.js"; // DB init

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import blockchain from "./src/utils/blockchain.service.js";

// ✅ import routes
import authRoutes from "./src/routes/auth.routes.js";
import electionRoutes from "./src/routes/election.routes.js";
import votingRoutes from "./src/routes/vote.routes.js";
import walletRoutes from "./src/routes/wallet.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files (candidate photos, etc.)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ✅ use routes
app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", votingRoutes);
app.use("/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;

(async function start() {
  try {
    await blockchain.init();
    console.log("Blockchain service initialized");
  } catch (err) {
    console.warn("Blockchain init warning:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
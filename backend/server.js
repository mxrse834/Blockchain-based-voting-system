import "dotenv/config";
import "./src/db/connection.js"; // DB init

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import blockchain from "./src/utils/blockchain.service.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ import routes
import authRoutes from "./src/routes/auth.routes.js";
import electionRoutes from "./src/routes/election.routes.js";
import votingRoutes from "./src/routes/vote.routes.js";

const app = express();

// Serve static files from public/uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000" || "http://localhost:3001",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// ✅ use routes
app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", votingRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

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
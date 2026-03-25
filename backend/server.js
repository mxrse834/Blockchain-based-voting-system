import "./src/db/connection.js"; // DB init

import express from "express";
import cookieParser from "cookie-parser";
import blockchain from "./src/utils/blockchain.service.js";

// ✅ import routes
import authRoutes from "./src/routes/auth.routes.js";
import electionRoutes from "./src/routes/election.routes.js";
import votingRoutes from "./src/routes/vote.routes.js";
import candidateRoutes from "./src/routes/candidates.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ use routes
app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", votingRoutes);
app.use("/candidates", candidateRoutes);

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
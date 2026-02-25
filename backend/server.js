import "./src/db/connection.js";   // just initialize DB
import express from "express";
import cookieParser from "cookie-parser";
import blockchain from "./src/utils/blockchain.service.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;

(async function start() {
  try {
    await blockchain.init();
    console.log('Blockchain service initialized');
  } catch (err) {
    console.warn('Blockchain init warning:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
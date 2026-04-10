import express from "express";
import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById,
  updateElection,
  addCandidateToElection,
  getCandidates,
  deleteCandidateFromElection
} from "../controllers/election.controller.js";
import {
  getCandidatesByElection,
  createCandidate,
  deleteCandidate
} from "../controllers/candidates.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Election CRUD
router.post("/", verifyJWT, authorizeRole("ADMIN"), createElection);

router.get("/", verifyJWT, getAllElections);

// Nested candidate routes (before :electionId route to avoid conflict)
router.get("/:electionId/candidates", verifyJWT, getCandidates);

router.post(
  "/:electionId/candidates",
  verifyJWT,
  authorizeRole("ADMIN"),
  (req, res, next) => {
    const startUpload = upload.single("photo");
    startUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ success: false, message: `Server Error: ${err.message}` });
      }
      next();
    });
  },
  addCandidateToElection
);

router.delete(
  "/:electionId/candidates/:candidateId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteCandidateFromElection
);

// Single election operations (after nested routes)
router.get("/:electionId", verifyJWT, getElectionById);

router.patch(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateElection
);

router.delete(
  "/:electionId",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteElection
);

export default router;

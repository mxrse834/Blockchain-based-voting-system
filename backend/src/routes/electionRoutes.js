const express = require("express");
const router = express.Router();
const ElectionModel = require("../models/electionModel");
const CandidateModel = require("../models/candidateModel");

// Create a new election
router.post("/create", async (req, res) => {
  try {
    const { title, description, startDate, endDate, createdBy } = req.body;

    if (!title || !startDate || !endDate || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    const election = await ElectionModel.createElection(
      title,
      description,
      startDate,
      endDate,
      createdBy
    );

    res.status(201).json({
      success: true,
      message: "Election created successfully",
      data: election,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get election by ID
router.get("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await ElectionModel.getElectionWithCandidates(electionId);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    res.json({
      success: true,
      data: election,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all elections
router.get("/", async (req, res) => {
  try {
    const elections = await ElectionModel.getAllElections();

    res.json({
      success: true,
      data: elections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get active elections
router.get("/active/list", async (req, res) => {
  try {
    const activeElections = await ElectionModel.getActiveElections();

    res.json({
      success: true,
      data: activeElections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update election status
router.put("/:electionId/status", async (req, res) => {
  try {
    const { electionId } = req.params;
    const { status } = req.body;

    if (!status || !["draft", "active", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    await ElectionModel.updateElectionStatus(electionId, status);

    res.json({
      success: true,
      message: "Election status updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update blockchain contract address
router.put("/:electionId/blockchain", async (req, res) => {
  try {
    const { electionId } = req.params;
    const { contractAddress } = req.body;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        message: "Contract address required",
      });
    }

    await ElectionModel.updateBlockchainAddress(electionId, contractAddress);

    res.json({
      success: true,
      message: "Blockchain contract address updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add candidate to election
router.post("/:electionId/candidate", async (req, res) => {
  try {
    const { electionId } = req.params;
    const { name, description, candidateNumber, position } = req.body;

    if (!name || !candidateNumber) {
      return res.status(400).json({
        success: false,
        message: "Candidate name and number required",
      });
    }

    const candidate = await CandidateModel.addCandidate(
      electionId,
      name,
      description,
      candidateNumber,
      position || 0
    );

    res.status(201).json({
      success: true,
      message: "Candidate added successfully",
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get candidates for an election
router.get("/:electionId/candidates", async (req, res) => {
  try {
    const { electionId } = req.params;

    const candidates = await CandidateModel.getCandidatesByElection(electionId);

    res.json({
      success: true,
      data: {
        electionId,
        candidateCount: candidates.length,
        candidates,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete election
router.delete("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    await ElectionModel.deleteElection(electionId);

    res.json({
      success: true,
      message: "Election deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
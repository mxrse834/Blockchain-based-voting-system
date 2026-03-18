const express = require("express");
const router = express.Router();
const VoteModel = require("../models/voteModel");
const ElectionModel = require("../models/electionModel");
const BlockchainModel = require("../models/blockchainModel");

// Submit a vote
router.post("/submit", async (req, res) => {
  try {
    const { electionId, userId, candidateId } = req.body;

    // Validate input
    if (!electionId || !userId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if user has already voted
    const hasVoted = await VoteModel.hasUserVoted(electionId, userId);
    if (hasVoted) {
      return res.status(409).json({
        success: false,
        message: "User has already voted in this election",
      });
    }

    // Submit vote
    const vote = await VoteModel.submitVote(electionId, userId, candidateId);

    res.status(201).json({
      success: true,
      message: "Vote submitted successfully",
      data: vote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get vote results for an election
router.get("/results/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const voteResults = await VoteModel.getVoteCountByCandidate(electionId);
    const totalVotes = await VoteModel.getTotalVotesCount(electionId);

    res.json({
      success: true,
      data: {
        electionId,
        totalVotes,
        results: voteResults.map((result) => ({
          candidateId: result.id,
          candidateName: result.name,
          candidateNumber: result.candidate_number,
          votes: result.vote_count,
          percentage: totalVotes > 0 ? ((result.vote_count / totalVotes) * 100).toFixed(2) : 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all votes for an election
router.get("/election/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const votes = await VoteModel.getVotesByElection(electionId);

    res.json({
      success: true,
      data: {
        electionId,
        voteCount: votes.length,
        votes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get vote by ID
router.get("/:voteId", async (req, res) => {
  try {
    const { voteId } = req.params;

    const vote = await VoteModel.getVoteById(voteId);

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    res.json({
      success: true,
      data: vote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get unverified votes (for blockchain verification)
router.get("/unverified/list", async (req, res) => {
  try {
    const unverifiedVotes = await VoteModel.getUnverifiedVotes();

    res.json({
      success: true,
      data: {
        count: unverifiedVotes.length,
        votes: unverifiedVotes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update vote with blockchain verification
router.put("/:voteId/verify", async (req, res) => {
  try {
    const { voteId } = req.params;
    const { transactionHash } = req.body;

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        message: "Transaction hash required",
      });
    }

    // Update vote with blockchain hash
    await VoteModel.updateVoteWithBlockchainHash(voteId, transactionHash);

    res.json({
      success: true,
      message: "Vote verified on blockchain",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
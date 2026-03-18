const express = require("express");
const router = express.Router();
const BlockchainModel = require("../models/blockchainModel");

// Record a new blockchain transaction
router.post("/record", async (req, res) => {
  try {
    const { voteId, transactionHash, status } = req.body;

    if (!voteId || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: "Vote ID and transaction hash required",
      });
    }

    const transaction = await BlockchainModel.recordTransaction(
      voteId,
      transactionHash,
      status || "pending"
    );

    res.status(201).json({
      success: true,
      message: "Transaction recorded",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get transaction by hash
router.get("/hash/:transactionHash", async (req, res) => {
  try {
    const { transactionHash } = req.params;

    const transaction = await BlockchainModel.getTransactionByHash(transactionHash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get transaction by vote ID
router.get("/vote/:voteId", async (req, res) => {
  try {
    const { voteId } = req.params;

    const transaction = await BlockchainModel.getTransactionByVoteId(voteId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all pending transactions
router.get("/pending/list", async (req, res) => {
  try {
    const pendingTransactions = await BlockchainModel.getPendingTransactions();

    res.json({
      success: true,
      data: {
        count: pendingTransactions.length,
        transactions: pendingTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update transaction status
router.put("/:transactionHash/confirm", async (req, res) => {
  try {
    const { transactionHash } = req.params;
    const { status, blockNumber, gasUsed, transactionFee } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status required",
      });
    }

    await BlockchainModel.updateTransactionStatus(
      transactionHash,
      status,
      blockNumber,
      gasUsed,
      transactionFee
    );

    res.json({
      success: true,
      message: "Transaction status updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Record failed transaction
router.post("/record-failure", async (req, res) => {
  try {
    const { voteId, transactionHash, errorMessage } = req.body;

    if (!voteId || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: "Vote ID and transaction hash required",
      });
    }

    const transaction = await BlockchainModel.recordFailedTransaction(
      voteId,
      transactionHash,
      errorMessage || "Unknown error"
    );

    res.status(201).json({
      success: true,
      message: "Failed transaction recorded",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get transactions for an election
router.get("/election/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const transactions = await BlockchainModel.getTransactionsByElection(electionId);

    res.json({
      success: true,
      data: {
        electionId,
        count: transactions.length,
        transactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get transaction statistics
router.get("/stats/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;

    const stats = await BlockchainModel.getTransactionStats(electionId);

    res.json({
      success: true,
      data: {
        electionId,
        ...stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
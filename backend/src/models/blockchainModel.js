const pool = require("../db/connection");

const BlockchainModel = {
  // Record blockchain transaction
  recordTransaction: async (voteId, transactionHash, status = "pending") => {
    try {
      const [result] = await pool.query(
        `INSERT INTO blockchain_transactions (vote_id, transaction_hash, status) 
         VALUES (?, ?, ?)`,
        [voteId, transactionHash, status]
      );
      return { transactionId: result.insertId, voteId, transactionHash, status };
    } catch (error) {
      throw new Error(`Error recording transaction: ${error.message}`);
    }
  },

  // Get transaction by hash
  getTransactionByHash: async (transactionHash) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM blockchain_transactions WHERE transaction_hash = ?`,
        [transactionHash]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  },

  // Update transaction status
  updateTransactionStatus: async (transactionHash, status, blockNumber = null, gasUsed = null, fee = null) => {
    try {
      const query = `
        UPDATE blockchain_transactions 
        SET status = ?, block_number = ?, gas_used = ?, transaction_fee = ?, confirmed_at = NOW()
        WHERE transaction_hash = ?
      `;
      await pool.query(query, [status, blockNumber, gasUsed, fee, transactionHash]);
      return true;
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  },

  // Get all pending transactions
  getPendingTransactions: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT bt.*, v.election_id, v.user_id, v.candidate_id
         FROM blockchain_transactions bt
         JOIN votes v ON bt.vote_id = v.id
         WHERE bt.status = 'pending'
         ORDER BY bt.created_at ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching pending transactions: ${error.message}`);
    }
  },

  // Get transaction by vote ID
  getTransactionByVoteId: async (voteId) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM blockchain_transactions WHERE vote_id = ?`,
        [voteId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching transaction: ${error.message}`);
    }
  },

  // Record failed transaction
  recordFailedTransaction: async (voteId, transactionHash, errorMessage) => {
    try {
      const [result] = await pool.query(
        `INSERT INTO blockchain_transactions (vote_id, transaction_hash, status, error_message) 
         VALUES (?, ?, 'failed', ?)`,
        [voteId, transactionHash, errorMessage]
      );
      return { transactionId: result.insertId };
    } catch (error) {
      throw new Error(`Error recording failed transaction: ${error.message}`);
    }
  },

  // Get transactions for an election
  getTransactionsByElection: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT bt.*, v.user_id, v.candidate_id
         FROM blockchain_transactions bt
         JOIN votes v ON bt.vote_id = v.id
         WHERE v.election_id = ?
         ORDER BY bt.created_at DESC`,
        [electionId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
  },

  // Get transaction stats
  getTransactionStats: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
          COUNT(*) as total_transactions,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(COALESCE(transaction_fee, 0)) as total_gas_fees
         FROM blockchain_transactions bt
         JOIN votes v ON bt.vote_id = v.id
         WHERE v.election_id = ?`,
        [electionId]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting transaction stats: ${error.message}`);
    }
  },
};

module.exports = BlockchainModel;
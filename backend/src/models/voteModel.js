const pool = require("../db/connection");

const VoteModel = {
  // Submit a vote
  submitVote: async (electionId, userId, candidateId) => {
    try {
      const [result] = await pool.query(
        `INSERT INTO votes (election_id, user_id, candidate_id, vote_timestamp) 
         VALUES (?, ?, ?, NOW())`,
        [electionId, userId, candidateId]
      );
      return { voteId: result.insertId, electionId, userId, candidateId };
    } catch (error) {
      throw new Error(`Error submitting vote: ${error.message}`);
    }
  },

  // Check if user has already voted in an election
  hasUserVoted: async (electionId, userId) => {
    try {
      const [rows] = await pool.query(
        `SELECT id FROM votes WHERE election_id = ? AND user_id = ?`,
        [electionId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking vote status: ${error.message}`);
    }
  },

  // Get vote by ID
  getVoteById: async (voteId) => {
    try {
      const [rows] = await pool.query(
        `SELECT v.*, u.username, c.name as candidate_name, e.title as election_title
         FROM votes v
         JOIN users u ON v.user_id = u.id
         JOIN candidates c ON v.candidate_id = c.id
         JOIN elections e ON v.election_id = e.id
         WHERE v.id = ?`,
        [voteId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching vote: ${error.message}`);
    }
  },

  // Get all votes for an election
  getVotesByElection: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT v.*, c.name as candidate_name, u.username
         FROM votes v
         JOIN candidates c ON v.candidate_id = c.id
         JOIN users u ON v.user_id = u.id
         WHERE v.election_id = ?
         ORDER BY v.created_at DESC`,
        [electionId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching votes: ${error.message}`);
    }
  },

  // Get vote count by candidate
  getVoteCountByCandidate: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT c.id, c.name, c.candidate_number, COUNT(v.id) as vote_count
         FROM candidates c
         LEFT JOIN votes v ON c.id = v.candidate_id
         WHERE c.election_id = ?
         GROUP BY c.id, c.name, c.candidate_number
         ORDER BY vote_count DESC`,
        [electionId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error getting vote counts: ${error.message}`);
    }
  },

  // Update vote with blockchain transaction hash
  updateVoteWithBlockchainHash: async (voteId, transactionHash) => {
    try {
      await pool.query(
        `UPDATE votes SET transaction_hash = ?, blockchain_verified = TRUE WHERE id = ?`,
        [transactionHash, voteId]
      );
      return true;
    } catch (error) {
      throw new Error(`Error updating vote: ${error.message}`);
    }
  },

  // Get unverified votes
  getUnverifiedVotes: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT v.*, c.name as candidate_name, e.title as election_title, u.username
         FROM votes v
         JOIN candidates c ON v.candidate_id = c.id
         JOIN elections e ON v.election_id = e.id
         JOIN users u ON v.user_id = u.id
         WHERE v.blockchain_verified = FALSE
         ORDER BY v.created_at ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching unverified votes: ${error.message}`);
    }
  },

  // Get total votes for an election
  getTotalVotesCount: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT COUNT(*) as total_votes FROM votes WHERE election_id = ?`,
        [electionId]
      );
      return rows[0].total_votes;
    } catch (error) {
      throw new Error(`Error getting vote count: ${error.message}`);
    }
  },
};

module.exports = VoteModel;
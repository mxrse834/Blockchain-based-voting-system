const pool = require("../db/connection");

const CandidateModel = {
  // Add a candidate to an election
  addCandidate: async (electionId, name, description, candidateNumber, position) => {
    try {
      const [result] = await pool.query(
        `INSERT INTO candidates (election_id, name, description, candidate_number, position) 
         VALUES (?, ?, ?, ?, ?)`,
        [electionId, name, description, candidateNumber, position]
      );
      return { id: result.insertId, electionId, name, candidateNumber };
    } catch (error) {
      throw new Error(`Error adding candidate: ${error.message}`);
    }
  },

  // Get candidate by ID
  getCandidateById: async (candidateId) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM candidates WHERE id = ?`,
        [candidateId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching candidate: ${error.message}`);
    }
  },

  // Get all candidates for an election
  getCandidatesByElection: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM candidates WHERE election_id = ? ORDER BY position ASC`,
        [electionId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching candidates: ${error.message}`);
    }
  },

  // Update candidate
  updateCandidate: async (candidateId, name, description) => {
    try {
      await pool.query(
        `UPDATE candidates SET name = ?, description = ? WHERE id = ?`,
        [name, description, candidateId]
      );
      return true;
    } catch (error) {
      throw new Error(`Error updating candidate: ${error.message}`);
    }
  },

  // Delete candidate
  deleteCandidate: async (candidateId) => {
    try {
      await pool.query(`DELETE FROM candidates WHERE id = ?`, [candidateId]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting candidate: ${error.message}`);
    }
  },

  // Get candidate with vote count
  getCandidateWithVotes: async (candidateId) => {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, COUNT(v.id) as vote_count
         FROM candidates c
         LEFT JOIN votes v ON c.id = v.candidate_id
         WHERE c.id = ?
         GROUP BY c.id`,
        [candidateId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching candidate with votes: ${error.message}`);
    }
  },
};

module.exports = CandidateModel;
const pool = require("../db/connection");

const ElectionModel = {
  // Create a new election
  createElection: async (title, description, startDate, endDate, createdBy) => {
    try {
      const [result] = await pool.query(
        `INSERT INTO elections (title, description, start_date, end_date, created_by, status) 
         VALUES (?, ?, ?, ?, ?, 'draft')`,
        [title, description, startDate, endDate, createdBy]
      );
      return { id: result.insertId, title, description };
    } catch (error) {
      throw new Error(`Error creating election: ${error.message}`);
    }
  },

  // Get election by ID
  getElectionById: async (electionId) => {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, u.username as created_by_name
         FROM elections e
         JOIN users u ON e.created_by = u.id
         WHERE e.id = ?`,
        [electionId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching election: ${error.message}`);
    }
  },

  // Get all elections
  getAllElections: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, u.username as created_by_name
         FROM elections e
         JOIN users u ON e.created_by = u.id
         ORDER BY e.created_at DESC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching elections: ${error.message}`);
    }
  },

  // Get active elections
  getActiveElections: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT e.*, u.username as created_by_name
         FROM elections e
         JOIN users u ON e.created_by = u.id
         WHERE e.status = 'active' AND NOW() BETWEEN e.start_date AND e.end_date
         ORDER BY e.end_date ASC`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching active elections: ${error.message}`);
    }
  },

  // Update election status
  updateElectionStatus: async (electionId, status) => {
    try {
      await pool.query(`UPDATE elections SET status = ? WHERE id = ?`, [
        status,
        electionId,
      ]);
      return true;
    } catch (error) {
      throw new Error(`Error updating election status: ${error.message}`);
    }
  },

  // Update blockchain contract address
  updateBlockchainAddress: async (electionId, contractAddress) => {
    try {
      await pool.query(
        `UPDATE elections SET blockchain_contract_address = ? WHERE id = ?`,
        [contractAddress, electionId]
      );
      return true;
    } catch (error) {
      throw new Error(`Error updating blockchain address: ${error.message}`);
    }
  },

  // Get election with candidates
  getElectionWithCandidates: async (electionId) => {
    try {
      const election = await this.getElectionById(electionId);
      if (!election) return null;

      const [candidates] = await pool.query(
        `SELECT * FROM candidates WHERE election_id = ? ORDER BY position ASC`,
        [electionId]
      );

      return { ...election, candidates };
    } catch (error) {
      throw new Error(`Error fetching election with candidates: ${error.message}`);
    }
  },

  // Delete election
  deleteElection: async (electionId) => {
    try {
      await pool.query(`DELETE FROM elections WHERE id = ?`, [electionId]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting election: ${error.message}`);
    }
  },
};

module.exports = ElectionModel;
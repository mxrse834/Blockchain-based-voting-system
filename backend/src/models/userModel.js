const pool = require("../db/connection");
const bcrypt = require("bcrypt");

const UserModel = {
  // Create a new user
  createUser: async (username, email, password, voterId) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        `INSERT INTO users (username, email, password_hash, voter_id) 
         VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, voterId]
      );
      return { id: result.insertId, username, email, voterId };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  // Get user by username
  getUserByUsername: async (username) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [
        userId,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Get user by voter ID
  getUserByVoterId: async (voterId) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE voter_id = ?`,
        [voterId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  },

  // Update user wallet address
  updateWalletAddress: async (userId, walletAddress) => {
    try {
      await pool.query(`UPDATE users SET wallet_address = ? WHERE id = ?`, [
        walletAddress,
        userId,
      ]);
      return true;
    } catch (error) {
      throw new Error(`Error updating wallet: ${error.message}`);
    }
  },

  // Verify user
  verifyUser: async (userId) => {
    try {
      await pool.query(
        `UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?`,
        [userId]
      );
      return true;
    } catch (error) {
      throw new Error(`Error verifying user: ${error.message}`);
    }
  },

  // Validate password
  validatePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const [rows] = await pool.query(`SELECT id, username, email, voter_id, is_verified, created_at FROM users`);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },
};

module.exports = UserModel;
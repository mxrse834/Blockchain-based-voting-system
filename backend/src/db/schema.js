const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

// Create connection without selecting database first
const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

    // Select the database
    await connection.changeUser({ database: process.env.DB_NAME });

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        voter_id VARCHAR(255) UNIQUE NOT NULL,
        wallet_address VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_voter_id (voter_id),
        INDEX idx_wallet (wallet_address)
      )
    `);
    console.log("✅ Users table created");

    // Create Elections table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS elections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATETIME NOT NULL,
        end_date DATETIME NOT NULL,
        created_by INT NOT NULL,
        status ENUM('draft', 'active', 'closed') DEFAULT 'draft',
        blockchain_contract_address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id),
        INDEX idx_status (status),
        INDEX idx_dates (start_date, end_date)
      )
    `);
    console.log("✅ Elections table created");

    // Create Candidates table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        election_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        candidate_number INT,
        position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
        UNIQUE KEY unique_candidate (election_id, candidate_number),
        INDEX idx_election (election_id)
      )
    `);
    console.log("✅ Candidates table created");

    // Create Votes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        election_id INT NOT NULL,
        user_id INT NOT NULL,
        candidate_id INT NOT NULL,
        transaction_hash VARCHAR(255) UNIQUE,
        blockchain_verified BOOLEAN DEFAULT FALSE,
        vote_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
        UNIQUE KEY unique_vote (election_id, user_id),
        INDEX idx_election (election_id),
        INDEX idx_user (user_id),
        INDEX idx_candidate (candidate_id),
        INDEX idx_verified (blockchain_verified)
      )
    `);
    console.log("✅ Votes table created");

    // Create Blockchain Transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blockchain_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vote_id INT NOT NULL,
        transaction_hash VARCHAR(255) UNIQUE NOT NULL,
        block_number INT,
        gas_used INT,
        transaction_fee DECIMAL(18, 8),
        status ENUM('pending', 'confirmed', 'failed') DEFAULT 'pending',
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP,
        FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_hash (transaction_hash),
        INDEX idx_vote (vote_id)
      )
    `);
    console.log("✅ Blockchain Transactions table created");

    // Create Audit Log table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        user_id INT,
        election_id INT,
        vote_id INT,
        details JSON,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE SET NULL,
        FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE SET NULL,
        INDEX idx_action (action),
        INDEX idx_created (created_at)
      )
    `);
    console.log("✅ Audit Logs table created");

    // Create Voter Eligibility table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS voter_eligibility (
        id INT AUTO_INCREMENT PRIMARY KEY,
        election_id INT NOT NULL,
        user_id INT NOT NULL,
        is_eligible BOOLEAN DEFAULT TRUE,
        has_voted BOOLEAN DEFAULT FALSE,
        voting_token VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_eligibility (election_id, user_id),
        INDEX idx_election (election_id),
        INDEX idx_eligible (is_eligible)
      )
    `);
    console.log("✅ Voter Eligibility table created");

    console.log("\n✅ All tables created successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
  } finally {
    await connection.end();
  }
};

// Run initialization
initializeDatabase();
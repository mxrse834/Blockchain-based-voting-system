-- Create voting_system database
CREATE DATABASE IF NOT EXISTS voting_system;
USE voting_system;

-- USERS TABLE
CREATE TABLE users (
  user_id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role ENUM('ADMIN', 'VOTER') NOT NULL DEFAULT 'VOTER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ELECTIONS TABLE
CREATE TABLE elections (
  election_id CHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL UNIQUE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('UPCOMING', 'ACTIVE', 'CLOSED') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- CANDIDATES TABLE
CREATE TABLE candidates (
  candidate_id CHAR(36) PRIMARY KEY,
  election_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE,
  INDEX idx_election_id (election_id)
) ENGINE=InnoDB;

-- VOTING STATUS TABLE
CREATE TABLE voting_status (
  user_id CHAR(36) NOT NULL,
  election_id CHAR(36) NOT NULL,
  candidate_id CHAR(36),   
  has_voted BOOLEAN DEFAULT FALSE,
  tx_hash TEXT,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, election_id),

  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,

  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE,

  FOREIGN KEY (candidate_id)
    REFERENCES candidates(candidate_id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_candidates_election ON candidates(election_id);
CREATE INDEX idx_voting_status_has_voted ON voting_status(has_voted);

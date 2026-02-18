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
  title VARCHAR(200) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status ENUM('UPCOMING', 'ACTIVE', 'CLOSED') NOT NULL
) ENGINE=InnoDB;

-- CANDIDATES TABLE
CREATE TABLE candidates (
  candidate_id CHAR(36) PRIMARY KEY,
  election_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- VOTING STATUS TABLE
CREATE TABLE voting_status (
  user_id CHAR(36) NOT NULL,
  election_id CHAR(36) NOT NULL,
  has_voted BOOLEAN DEFAULT FALSE,
  tx_hash TEXT,
  voted_at TIMESTAMP,
  PRIMARY KEY (user_id, election_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (election_id)
    REFERENCES elections(election_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

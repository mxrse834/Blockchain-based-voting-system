-- USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('ADMIN', 'VOTER')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ELECTIONS TABLE
CREATE TABLE elections (
    election_id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(15) CHECK (status IN ('UPCOMING', 'ACTIVE', 'CLOSED')) NOT NULL
);

-- CANDIDATES TABLE
CREATE TABLE candidates (
    candidate_id UUID PRIMARY KEY,
    election_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE
);

-- VOTING STATUS TABLE
CREATE TABLE voting_status (
    user_id UUID NOT NULL,
    election_id UUID NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE,
    tx_hash TEXT,
    voted_at TIMESTAMP,
    PRIMARY KEY (user_id, election_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (election_id) REFERENCES elections(election_id) ON DELETE CASCADE
);

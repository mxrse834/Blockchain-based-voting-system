-- Seed data for voting_system database
-- Run this after schema.sql to populate with test data

USE voting_system;

-- Insert admin user (password: admin123456)
-- Hash: $2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX... (use seed.js for actual hash)
INSERT INTO users (user_id, name, email, password_hash, role, created_at) 
VALUES (
  'admin-user-id-0001',
  'Admin User',
  'admin@test.com',
  '$2b$10$8f2.8cZhQxR6k2vxjRqJYO1LxS9xZ8KkL5vZ7jK6nL9mK8x9jR5Sa',
  'ADMIN',
  NOW()
);

-- Insert voter user (password: voter123456)
-- Hash: $2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX... (use seed.js for actual hash)
INSERT INTO users (user_id, name, email, password_hash, role, created_at) 
VALUES (
  'voter-user-id-0001',
  'Voter User',
  'voter@test.com',
  '$2b$10$8f2.8cZhQxR6k2vxjRqJYO1LxS9xZ8KkL5vZ7jK6nL9mK8x9jR5Sa',
  'VOTER',
  NOW()
);

-- Insert sample elections
INSERT INTO elections (election_id, title, start_time, end_time, status, created_at) 
VALUES (
  'election-id-0001',
  'Presidential Election 2024',
  DATE_SUB(NOW(), INTERVAL 1 DAY),
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  'ACTIVE',
  NOW()
);

INSERT INTO elections (election_id, title, start_time, end_time, status, created_at) 
VALUES (
  'election-id-0002',
  'Board of Directors 2024',
  DATE_ADD(NOW(), INTERVAL 10 DAY),
  DATE_ADD(NOW(), INTERVAL 20 DAY),
  'UPCOMING',
  NOW()
);

-- Insert candidates for election 1
INSERT INTO candidates (candidate_id, election_id, name) 
VALUES (
  'candidate-id-0001',
  'election-id-0001',
  'John Smith'
);

INSERT INTO candidates (candidate_id, election_id, name) 
VALUES (
  'candidate-id-0002',
  'election-id-0001',
  'Jane Doe'
);

INSERT INTO candidates (candidate_id, election_id, name) 
VALUES (
  'candidate-id-0003',
  'election-id-0001',
  'Mike Johnson'
);

-- Insert candidates for election 2
INSERT INTO candidates (candidate_id, election_id, name) 
VALUES (
  'candidate-id-0004',
  'election-id-0002',
  'Alice Williams'
);

INSERT INTO candidates (candidate_id, election_id, name) 
VALUES (
  'candidate-id-0005',
  'election-id-0002',
  'Bob Brown'
);

-- Note: Use seed.js to properly hash passwords with bcrypt

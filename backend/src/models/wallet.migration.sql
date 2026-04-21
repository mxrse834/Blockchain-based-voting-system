-- ============================================================
-- Wallet Address Migration
-- Adds a wallet_address column to the users table for
-- Security Proxy Mapping (linking MetaMask wallet to user account)
-- ============================================================
-- Run this ONCE against your voting_system database:
--   mysql -u root -p voting_system < wallet.migration.sql
-- ============================================================

ALTER TABLE users
  ADD COLUMN wallet_address VARCHAR(42) UNIQUE DEFAULT NULL
  AFTER role;

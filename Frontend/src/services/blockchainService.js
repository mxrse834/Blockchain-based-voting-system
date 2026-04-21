/**
 * blockchainService.js
 * 
 * Centralized Web3 / ethers.js service for interacting with the SecureVoting
 * smart contract.  All blockchain logic lives here — React components import
 * these functions instead of using ethers directly.
 */

import { ethers } from 'ethers';
import VotingABI from '../contracts/Voting.json';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// ---------------------------------------------------------------------------
// Wallet helpers
// ---------------------------------------------------------------------------

/**
 * Prompt the user to connect MetaMask (or any injected provider).
 * @returns {{ provider: ethers.BrowserProvider, signer: ethers.Signer, address: string }}
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask not found. Please install it.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = accounts[0];

  return { provider, signer, address };
}

// ---------------------------------------------------------------------------
// Contract instance
// ---------------------------------------------------------------------------

/**
 * Return an ethers.Contract bound to the given signer or provider.
 * @param {ethers.Signer | ethers.Provider} signerOrProvider
 */
export function getContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === ethers.ZeroAddress) {
    throw new Error(
      'Contract address is not configured. Set VITE_CONTRACT_ADDRESS in your .env file.'
    );
  }
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signerOrProvider);
}

// ---------------------------------------------------------------------------
// Write operations (require a Signer)
// ---------------------------------------------------------------------------

/**
 * Cast a vote on-chain.
 * @param {ethers.Signer} signer – The connected wallet signer
 * @param {number}         candidateIndex – Zero-based candidate index
 * @returns {ethers.TransactionResponse}
 */
export async function castVoteOnChain(signer, candidateIndex) {
  const contract = getContract(signer);
  const tx = await contract.vote(candidateIndex);
  return tx;
}

/**
 * Start an election on-chain (admin only).
 * @param {ethers.Signer} signer
 */
export async function startElectionOnChain(signer) {
  const contract = getContract(signer);
  const tx = await contract.startElection();
  return tx;
}

/**
 * End an election on-chain (admin only).
 * @param {ethers.Signer} signer
 */
export async function endElectionOnChain(signer) {
  const contract = getContract(signer);
  const tx = await contract.endElection();
  return tx;
}

// ---------------------------------------------------------------------------
// Read operations (can use a Provider – no gas)
// ---------------------------------------------------------------------------

/**
 * Check whether the on-chain election is currently active.
 * @param {ethers.Provider} provider
 * @returns {boolean}
 */
export async function getElectionStatus(provider) {
  const contract = getContract(provider);
  return await contract.electionActive();
}

/**
 * Check if a wallet address has already voted.
 * @param {ethers.Provider} provider
 * @param {string} address – Ethereum address to check
 * @returns {boolean}
 */
export async function checkHasVoted(provider, address) {
  const contract = getContract(provider);
  return await contract.hasVoted(address);
}

/**
 * Fetch the on-chain vote counts for N candidates.
 * @param {ethers.Provider} provider
 * @param {number} candidateCount
 * @returns {Array<{ index: number, votes: number }>}
 */
export async function fetchElectionResults(provider, candidateCount) {
  const contract = getContract(provider);
  const results = [];

  for (let i = 0; i < candidateCount; i++) {
    const count = await contract.getVotes(i);
    results.push({ index: i, votes: Number(count) });
  }

  return results;
}

/**
 * Get the list of candidate names from the contract.
 * @param {ethers.Provider} provider
 * @returns {string[]}
 */
export async function getCandidatesOnChain(provider) {
  const contract = getContract(provider);
  return await contract.getCandidates();
}

/**
 * Get the admin (deployer) address from the contract.
 * @param {ethers.Provider} provider
 * @returns {string}
 */
export async function getContractAdmin(provider) {
  const contract = getContract(provider);
  return await contract.admin();
}

import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

let provider;
let signer;
let contract;

async function init() {
  provider = new ethers.JsonRpcProvider(RPC_URL);
  signer = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : provider;

  const artifactPath = path.resolve(process.cwd(), '..', 'Blockchain', 'artifacts', 'SecureVoting.json');
  const raw = await fs.readFile(artifactPath, 'utf8');
  const artifact = JSON.parse(raw);
  const abi = artifact.abi || (artifact.data && artifact.data.abi) || null;
  if (!abi) throw new Error('ABI not found in SecureVoting artifact');
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not set; blockchain contract will not be available');
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS || ethers.ZeroAddress, abi, signer);
  return contract;
}

function getContract() {
  if (!contract) throw new Error('Contract not initialized. Call init() first.');
  return contract;
}

async function callView(method, ...args) {
  const c = getContract();
  return await c[method](...args);
}

async function sendTx(method, ...args) {
  const c = getContract();
  if (!PRIVATE_KEY) throw new Error('PRIVATE_KEY not set for sending transactions');
  const tx = await c.connect(signer)[method](...args);
  return tx;
}

export default { init, getContract, callView, sendTx };

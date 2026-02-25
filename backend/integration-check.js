import dotenv from 'dotenv';
dotenv.config();

import db from './src/db/connection.js';
import blockchain from './src/utils/blockchain.service.js';
import { ethers } from 'ethers';

async function checkDb() {
  try {
    const conn = await db.getConnection();
    conn.release();
    console.log('DB: connected');
    return { ok: true };
  } catch (err) {
    console.error('DB: connection failed', err.message || err);
    return { ok: false, error: err.message || String(err) };
  }
}

async function checkRpc() {
  const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
    });
    const data = await res.json();
    if (data.result) {
      const block = parseInt(data.result, 16);
      console.log('RPC: reachable, blockNumber=', block);
      return { ok: true, blockNumber: block };
    }
    console.error('RPC: unexpected response', data);
    return { ok: false, error: 'unexpected response' };
  } catch (err) {
    console.error('RPC: unreachable', err.message || err);
    return { ok: false, error: err.message || String(err) };
  }
}

async function checkContract() {
  try {
    const c = await blockchain.init();
    try {
      // Try a view call if ABI has getCandidates
      if (c && typeof c.getCandidates === 'function') {
        const candidates = await c.getCandidates();
        console.log('Contract: getCandidates() OK, count=', candidates.length || candidates.length === 0 ? candidates.length : 'unknown');
        return { ok: true, candidatesCount: candidates.length };
      }
      console.log('Contract: initialized (no getCandidates view)');
      return { ok: true };
    } catch (err) {
      console.error('Contract: initialized but view call failed:', err.message || err);
      return { ok: false, error: err.message || String(err) };
    }
  } catch (err) {
    console.error('Contract: init failed', err.message || err);
    return { ok: false, error: err.message || String(err) };
  }
}

async function main() {
  console.log('--- Integration check starting ---');
  const dbRes = await checkDb();
  const rpcRes = await checkRpc();
  const contractRes = await checkContract();
  console.log('--- Summary ---');
  console.log({ db: dbRes, rpc: rpcRes, contract: contractRes });
}

main().catch(err => {
  console.error('Integration check failed:', err);
  process.exit(1);
});

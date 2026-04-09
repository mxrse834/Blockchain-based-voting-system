import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:5545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function deploy() {
  try {
    console.log("🚀 Deploying SecureVoting contract...");
    console.log("📡 RPC URL:", RPC_URL);

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("👤 Deployer address:", wallet.address);

    // Load contract ABI and bytecode
    const contractPath = path.join(__dirname, "artifacts/contracts/SecureVoting.sol/SecureVoting.json");
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

    const factory = new ethers.ContractFactory(
      contractJSON.abi,
      contractJSON.bytecode,
      wallet
    );

    const candidates = ["Candidate A", "Candidate B", "Candidate C"];
    console.log("📝 Deploying with candidates:", candidates);

    const contract = await factory.deploy(candidates);
    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();
    console.log("✅ Contract deployed at:", contractAddress);

    // Update .env file
    const envPath = path.join(__dirname, ".env");
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);

    console.log("📝 .env file updated with contract address!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

deploy();
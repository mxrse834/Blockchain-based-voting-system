const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  console.log("Contract deployed to:", await voting.getAddress());
}

main().catch(e => { console.error(e); process.exit(1); });

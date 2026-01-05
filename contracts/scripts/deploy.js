const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying StampCoinNFT contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contract
  const StampCoinNFT = await ethers.getContractFactory("StampCoinNFT");
  const royaltyReceiver = deployer.address; // Use deployer as initial royalty receiver
  
  const contract = await StampCoinNFT.deploy(royaltyReceiver);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("StampCoinNFT deployed to:", contractAddress);
  console.log("Royalty receiver:", royaltyReceiver);

  // Grant roles for testing/development
  console.log("\nGranting roles...");
  
  // Minter role to deployer (can be changed later)
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  console.log("MINTER_ROLE:", MINTER_ROLE);
  
  // Authenticator role to deployer (can be changed later)
  const AUTHENTICATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("AUTHENTICATOR_ROLE"));
  console.log("AUTHENTICATOR_ROLE:", AUTHENTICATOR_ROLE);

  console.log("\nDeployment complete!");
  console.log("\nNext steps:");
  console.log("1. Verify contract on block explorer:");
  console.log(`   npx hardhat verify --network <network> ${contractAddress} ${royaltyReceiver}`);
  console.log("\n2. Update .env with:");
  console.log(`   NFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   MINTER_ROLE=${MINTER_ROLE}`);
  console.log(`   AUTHENTICATOR_ROLE=${AUTHENTICATOR_ROLE}`);
  console.log("\n3. Grant roles to platform wallet:");
  console.log(`   await contract.grantRole(MINTER_ROLE, platformWalletAddress)`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

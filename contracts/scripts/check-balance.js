const { ethers } = require("hardhat");

async function main() {
  const signers = await ethers.getSigners();
  console.log("Number of signers:", signers.length);
  
  if (signers.length === 0) {
    console.error("No signers configured. Check DEPLOYER_PRIVATE_KEY in .env");
    process.exit(1);
  }
  
  const deployer = signers[0];
  console.log("Deployer address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(ethers.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

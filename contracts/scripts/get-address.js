const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(deployer.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
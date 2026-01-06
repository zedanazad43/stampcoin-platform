import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
      chainId: 137,
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
      chainId: 80002,
    },
    ethereum: {
      url: process.env.ETHEREUM_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/demo",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [`0x${process.env.DEPLOYER_PRIVATE_KEY}`] : [],
      chainId: 1,
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;

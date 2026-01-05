# Smart Contract Deployment Guide

## Overview
The StampCoin NFT contract (`StampCoinNFT.sol`) is ready for deployment. This guide walks through deployment to different blockchain networks.

## Contract Features
- ✅ ERC-721 NFT standard
- ✅ ERC-2981 royalty support (5% royalties)
- ✅ Role-based access control (MINTER_ROLE, AUTHENTICATOR_ROLE)
- ✅ On-chain authentication tracking
- ✅ Provenance recording
- ✅ Physical stamp linking
- ✅ Batch minting support

## Compilation Status
✅ **Contract compiled successfully** - No compilation needed (already compiled)

---

## Deployment Options

### Option 1: Local Testing (Hardhat Network)

**Best for:** Development and testing

```bash
cd /workspaces/Stampcoin-platform/contracts

# Start local blockchain
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.ts --network localhost
```

**No environment variables required** - Uses local test accounts with pre-funded ETH.

---

### Option 2: Polygon Mumbai (Testnet)

**Best for:** Pre-production testing with real blockchain

#### Setup Required:

1. **Get Mumbai MATIC Faucet:**
   - Visit: https://faucet.polygon.technology/
   - Enter your wallet address
   - Get free test MATIC

2. **Create/Update `.env` file:**
```bash
cd /workspaces/Stampcoin-platform
```

Add to `.env`:
```env
# Deployer Wallet Private Key (WITHOUT 0x prefix)
DEPLOYER_PRIVATE_KEY=your_wallet_private_key_here

# Mumbai RPC URL (Free options)
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
# OR use Alchemy/Infura:
# MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY

# For contract verification (optional)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

3. **Deploy:**
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network mumbai
```

4. **Verify Contract (optional):**
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> <ROYALTY_RECEIVER_ADDRESS>
```

---

### Option 3: Polygon Mainnet

**Best for:** Production deployment

#### Setup Required:

1. **Get MATIC tokens** - You'll need ~0.1 MATIC for gas fees
   - Buy from exchanges (Binance, Coinbase, etc.)
   - Bridge from Ethereum

2. **Update `.env`:**
```env
DEPLOYER_PRIVATE_KEY=your_wallet_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
# OR use Alchemy:
# POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

3. **Deploy:**
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network polygon
```

4. **Verify Contract:**
```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <ROYALTY_RECEIVER_ADDRESS>
```

---

### Option 4: Ethereum Mainnet

**Best for:** Maximum security and visibility (expensive gas fees)

#### Setup Required:

1. **Get ETH** - You'll need ~0.05-0.1 ETH for deployment

2. **Update `.env`:**
```env
DEPLOYER_PRIVATE_KEY=your_wallet_private_key_here
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

ETHERSCAN_API_KEY=your_etherscan_api_key
```

3. **Deploy:**
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network ethereum
```

---

## After Deployment

### 1. Save Deployment Information

The deployment script will output:
```
✅ StampCoinNFT deployed to: 0xYourContractAddress
✅ Royalty receiver: 0xYourWalletAddress
✅ MINTER_ROLE: 0x...
✅ AUTHENTICATOR_ROLE: 0x...
```

### 2. Update Platform Configuration

Add to `/workspaces/Stampcoin-platform/.env`:
```env
# Smart Contract Configuration
NFT_CONTRACT_ADDRESS=0xYourContractAddress
BLOCKCHAIN_NETWORK=polygon  # or mumbai, ethereum, localhost
MINTER_ROLE=0x...
AUTHENTICATOR_ROLE=0x...

# RPC URL for platform to interact with blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
# OR
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### 3. Grant Platform Roles

From Hardhat console or script:
```javascript
const contract = await ethers.getContractAt("StampCoinNFT", "0xYourContractAddress");

// Grant MINTER_ROLE to platform backend wallet
await contract.grantRole(MINTER_ROLE, "0xPlatformBackendWallet");

// Grant AUTHENTICATOR_ROLE to expert authenticators
await contract.grantRole(AUTHENTICATOR_ROLE, "0xExpertWallet1");
await contract.grantRole(AUTHENTICATOR_ROLE, "0xExpertWallet2");
```

### 4. Update Fly.io Secrets

```bash
flyctl secrets set \
  NFT_CONTRACT_ADDRESS=0xYourContractAddress \
  BLOCKCHAIN_NETWORK=polygon \
  POLYGON_RPC_URL=https://polygon-rpc.com \
  MINTER_ROLE=0x... \
  AUTHENTICATOR_ROLE=0x...
```

---

## Cost Estimates

### Gas Fees (Approximate)

| Network | Deployment Cost | Per-Mint Cost |
|---------|----------------|---------------|
| **Hardhat Local** | Free | Free |
| **Mumbai Testnet** | Free (faucet) | Free (faucet) |
| **Polygon Mainnet** | ~0.05 MATIC (~$0.04) | ~0.001 MATIC (~$0.0008) |
| **Ethereum Mainnet** | ~0.03 ETH (~$70) | ~0.005 ETH (~$12) |

💡 **Recommendation:** Use Polygon for production (1000x cheaper than Ethereum)

---

## Security Checklist

Before mainnet deployment:

- [ ] Private key stored securely (never commit to Git)
- [ ] `.env` file added to `.gitignore`
- [ ] Deployer wallet has sufficient funds
- [ ] Royalty receiver address is correct
- [ ] Test deployment on testnet first
- [ ] Contract verified on block explorer
- [ ] Roles granted only to trusted addresses
- [ ] Admin role transferred to multisig wallet (optional)

---

## RPC Provider Options

### Free Tier (Good for testing):
- **Polygon Public RPC:** https://polygon-rpc.com
- **Mumbai Public RPC:** https://rpc-mumbai.maticvigil.com

### Paid/API Key (Better reliability):
- **Alchemy:** https://www.alchemy.com/ (Free tier: 300M requests/month)
- **Infura:** https://www.infura.io/ (Free tier: 100k requests/day)
- **QuickNode:** https://www.quicknode.com/

---

## Troubleshooting

### "Insufficient funds for gas"
- **Solution:** Send MATIC/ETH to your deployer wallet

### "Invalid private key"
- **Solution:** Ensure private key is 64 hex characters (no `0x` prefix in `.env`)

### "Network connection timeout"
- **Solution:** Try different RPC URL or check internet connection

### "Contract already deployed at address"
- **Solution:** Use a fresh deployer wallet or deploy to different network

---

## Next Steps

1. **Test locally first:**
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.ts --network localhost
   ```

2. **Deploy to Mumbai testnet**
3. **Test NFT minting and authentication**
4. **Deploy to Polygon mainnet**
5. **Integrate with platform backend**

---

## Quick Start (Local Testing)

```bash
# Terminal 1 - Start local blockchain
cd /workspaces/Stampcoin-platform/contracts
npx hardhat node

# Terminal 2 - Deploy
cd /workspaces/Stampcoin-platform/contracts
npx hardhat run scripts/deploy.ts --network localhost

# Copy the contract address from output
# Update platform .env with NFT_CONTRACT_ADDRESS
```

Ready to deploy! 🚀

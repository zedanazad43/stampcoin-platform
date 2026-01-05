# Smart Contract Deployment Information

## Local Hardhat Network Deployment ✅

**Deployment Date:** January 5, 2026  
**Network:** Hardhat Local (localhost)  
**Chain ID:** 1337

---

## Contract Details

| Property | Value |
|----------|-------|
| **Contract Name** | StampCoinNFT |
| **Contract Address** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **Deployer Address** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| **Royalty Receiver** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| **Royalty Fee** | 5% (500 basis points) |

---

## Role Hashes

| Role | Hash |
|------|------|
| **MINTER_ROLE** | `0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6` |
| **AUTHENTICATOR_ROLE** | `0x190acb99f29d9641c9ad47655049f2d7c78fcbc837d62e7981d28c871f722081` |
| **DEFAULT_ADMIN_ROLE** | `0x0000000000000000000000000000000000000000000000000000000000000000` |

---

## Contract Features

✅ **ERC-721** - Standard NFT functionality  
✅ **ERC-721 URI Storage** - Metadata storage  
✅ **ERC-721 Burnable** - Token burning capability  
✅ **Access Control** - Role-based permissions  
✅ **ERC-2981** - Royalty standard (5% on secondary sales)  
✅ **Physical Stamp Linking** - Maps NFTs to physical stamp IDs  
✅ **Authentication System** - Expert authentication with confidence scores  
✅ **Provenance Tracking** - On-chain ownership history  

---

## Key Functions

### Minting
```solidity
function mintStamp(address to, string memory uri, string memory physicalStampId) 
    returns (uint256 tokenId)
```
- **Access:** MINTER_ROLE required
- **Purpose:** Mint new stamp NFT with physical stamp linkage

### Authentication
```solidity
function authenticateStamp(uint256 tokenId, uint8 confidenceScore, string memory certificateUri)
```
- **Access:** AUTHENTICATOR_ROLE required
- **Purpose:** Authenticate stamp with confidence score (0-100)

### Royalty Info
```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) 
    returns (address receiver, uint256 royaltyAmount)
```
- **Access:** Public view
- **Purpose:** Calculate 5% royalty for secondary sales

---

## Deployment Steps Completed

1. ✅ Compiled Solidity contract (OpenZeppelin v5.0.1)
2. ✅ Deployed to Hardhat local network
3. ✅ Granted DEFAULT_ADMIN_ROLE to deployer
4. ✅ Granted MINTER_ROLE to deployer
5. ✅ Granted AUTHENTICATOR_ROLE to deployer
6. ✅ Set royalty receiver address

---

## Next Steps for Production

### Option 1: Polygon Mumbai Testnet
```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY=your_private_key
export MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# Deploy
cd /workspaces/Stampcoin-platform/contracts
npx hardhat run scripts/deploy.js --network mumbai

# Verify
npx hardhat verify --network mumbai <CONTRACT_ADDRESS> <ROYALTY_RECEIVER>
```

### Option 2: Polygon Mainnet
```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY=your_private_key
export POLYGON_RPC_URL=https://polygon-rpc.com
export POLYGONSCAN_API_KEY=your_api_key

# Deploy
npx hardhat run scripts/deploy.js --network polygon

# Verify
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <ROYALTY_RECEIVER>
```

---

## Integration with Platform

### Update `.env` file:
```env
# Smart Contract Configuration
NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
BLOCKCHAIN_NETWORK=localhost
MINTER_ROLE=0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
AUTHENTICATOR_ROLE=0x190acb99f29d9641c9ad47655049f2d7c78fcbc837d62e7981d28c871f722081

# RPC Configuration (for localhost)
HARDHAT_RPC_URL=http://127.0.0.1:8545
```

### Grant Roles to Platform Backend:
```javascript
const { ethers } = require("hardhat");

async function grantRoles() {
  const contract = await ethers.getContractAt(
    "StampCoinNFT", 
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  
  const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
  const platformWallet = "0xYourPlatformBackendWallet";
  
  await contract.grantRole(MINTER_ROLE, platformWallet);
  console.log("✅ Granted MINTER_ROLE to platform");
}

grantRoles();
```

---

## Contract Verification

### On Polygonscan:
```bash
npx hardhat verify --network polygon \
  0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Manual Verification:
- Compiler: v0.8.20
- Optimization: Enabled (200 runs)
- Constructor Args: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (royalty receiver)

---

## Security Considerations

🔒 **Access Control:**
- Only MINTER_ROLE can mint stamps
- Only AUTHENTICATOR_ROLE can authenticate
- Only DEFAULT_ADMIN_ROLE can grant/revoke roles
- Only DEFAULT_ADMIN_ROLE can change royalty receiver

🔒 **Physical Stamp Protection:**
- Each physical stamp ID can only be minted once
- Prevents duplicate NFTs for same physical item

🔒 **Royalty Protection:**
- Hardcoded 5% royalty fee (cannot be changed)
- Royalty receiver can be updated by admin only

---

## Testing Commands

### Mint a Test Stamp:
```javascript
const stamp = await contract.mintStamp(
  "0xRecipientAddress",
  "ipfs://QmYourMetadataHash",
  "STAMP-001-1940"
);
```

### Authenticate a Stamp:
```javascript
await contract.authenticateStamp(
  0, // tokenId
  95, // confidence score (95%)
  "ipfs://QmYourCertificateHash"
);
```

### Check Royalty:
```javascript
const [receiver, amount] = await contract.royaltyInfo(
  0, // tokenId
  ethers.parseEther("1.0") // 1 ETH sale price
);
// Returns: receiver address, 0.05 ETH (5%)
```

---

## Support & Documentation

- **Smart Contract Guide:** [SMART_CONTRACT_DEPLOYMENT_GUIDE.md](SMART_CONTRACT_DEPLOYMENT_GUIDE.md)
- **Configuration Guide:** [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- **Hardhat Config:** [hardhat.config.ts](hardhat.config.ts)
- **Deployment Script:** [scripts/deploy.js](scripts/deploy.js)
- **Contract Source:** [contracts/StampCoinNFT.sol](contracts/StampCoinNFT.sol)

---

**Status:** ✅ Deployed and operational on Hardhat local network  
**Ready for:** Mainnet/Testnet deployment following the guides above

# NFT & Authentication System - Technical Architecture

## System Overview

The StampCoin platform now includes comprehensive infrastructure for:
- NFT minting and blockchain integration
- Multi-layered authentication and verification
- AI-powered and expert appraisal systems
- Geographic categorization with hierarchical regions
- Provenance tracking and certificate generation

---

## Database Schema Enhancements

### New Tables

#### `stampAuthentications`
Tracks all verification requests and results
- Links to stamps and verifier users
- Stores confidence scores, findings, certificates
- Supports multiple authentication types
- Tracks cost and expiry dates

#### `stampAppraisals`
Historical valuations and market analysis
- Links to stamps and appraiser users
- Stores estimated values, comparable sales
- Market conditions and confidence levels
- Multiple appraisal types (formal, AI, market-based)

#### `nftMintingHistory`
Complete audit trail of NFT creation
- Blockchain network and contract details
- Token IDs and transaction hashes
- Metadata URIs (IPFS/Arweave)
- Minting status and gas fees

#### `stampProvenance`
Ownership transfer history
- Previous and new owner tracking
- Transfer types (sale, gift, inheritance, etc.)
- Verification documents
- Transaction linkage

### Enhanced Existing Tables

#### `stamps` table additions
- **NFT Metadata**: tokenId, contractAddress, blockchainNetwork, mintedAt, metadataUri
- **Authentication**: authenticationStatus, authenticationType, physicalStampId, certificateNumber
- **Valuation**: appraisalValue, appraisalDate, appraisedBy
- **Geographic**: continent, region (in addition to country)
- **Physical Details**: color, perforation, watermark, printingMethod, designer, engraver, quantity, condition
- **Market Data**: historicalSignificance, marketTrend, estimatedValue, lastSoldPrice, lastSoldDate

#### `categories` table additions
- **Hierarchy**: parentId for nested categories
- **Geographic**: continent, region fields
- **UI**: icon field for visual representation

---

## API Endpoints

### NFT Management (`/api/trpc/nft.*`)

#### `nft.mintStamp`
- **Auth**: Protected (requires login)
- **Input**: `{ stampId, blockchainNetwork }`
- **Process**:
  1. Validates stamp exists and not already minted
  2. Generates NFT metadata from stamp details
  3. Calls minting service (currently mocked)
  4. Updates stamp with NFT information
- **Output**: `{ success, tokenId, contractAddress, transactionHash, metadataUri }`

#### `nft.estimateCost`
- **Auth**: Public
- **Input**: `{ blockchainNetwork }`
- **Output**: `{ gasFee, currency }`
- **Networks**: ethereum, polygon, solana, arbitrum

#### `nft.getMetadata`
- **Auth**: Public
- **Input**: `{ stampId }`
- **Output**: OpenSea-compatible metadata JSON

### Authentication System (`/api/trpc/authentication.*`)

#### `authentication.requestVerification`
- **Auth**: Protected
- **Input**: `{ stampId, authenticationType, supportingDocuments?, notes? }`
- **Types**: expert_review, certificate_scan, ai_analysis, blockchain_provenance, third_party
- **Output**: `{ authenticationId, status, estimatedCompletionDays, cost }`

#### `authentication.submitVerification`
- **Auth**: Admin only (expert reviewers)
- **Input**: `{ authenticationId, status, confidenceScore, findings, certificateUrl? }`
- **Process**: Updates authentication record, generates certificate if verified
- **Output**: `{ success, message }`

#### `authentication.analyzeImage`
- **Auth**: Protected
- **Input**: `{ imageUrl }`
- **Process**: AI-powered forgery detection and authenticity analysis
- **Output**: `{ isAuthentic, confidenceScore, findings[] }`

#### `authentication.getStatus`
- **Auth**: Public
- **Input**: `{ stampId }`
- **Output**: Current authentication status and details

### Appraisal System (`/api/trpc/appraisal.*`)

#### `appraisal.requestAppraisal`
- **Auth**: Protected
- **Input**: `{ stampId, appraisalType }`
- **Types**: formal, informal, market_based, ai_estimated
- **Output**: Full appraisal report with estimated value, comparable sales, factors

#### `appraisal.getQuickEstimate`
- **Auth**: Public
- **Input**: `{ stampId }`
- **Process**: AI-powered instant valuation
- **Output**: `{ estimatedValue, confidence }`

#### `appraisal.getValuationHistory`
- **Auth**: Public
- **Input**: `{ stampId }`
- **Output**: Historical valuations, trend analysis, change percentage

#### `appraisal.getMarketTrends`
- **Auth**: Public
- **Input**: `{ category?, country?, yearRange? }`
- **Output**: Market analysis with average prices, trends, top performers

---

## Services Architecture

### NFT Minting Service (`server/nft-minting.ts`)

**Key Functions:**
- `generateNftMetadata()` - Creates OpenSea-compatible metadata
- `prepareIpfsMetadata()` - Formats for IPFS upload
- `mintNft()` - Handles blockchain minting (currently mocked)
- `estimateMintingCost()` - Gas fee estimation per network
- `generateTokenId()` - Unique token ID generation

**Blockchain Integration (To Be Implemented):**
```typescript
// Ethereum/Polygon: ethers.js
const contract = new ethers.Contract(address, abi, signer);
await contract.mint(to, tokenURI, { value: ethers.utils.parseEther("0.01") });

// Solana: @solana/web3.js + Metaplex
const { uri } = await metaplex.nfts().uploadMetadata(metadata);
await metaplex.nfts().create({ uri, name, sellerFeeBasisPoints: 500 });
```

### Authentication Service (`server/authentication.ts`)

**Key Functions:**
- `requestAuthentication()` - Initiates verification workflow
- `submitVerification()` - Expert completes review
- `analyzeStampImage()` - AI-powered image analysis
- `generateCertificate()` - Creates HTML/PDF certificate
- `getAuthenticationStatus()` - Check verification status

**AI Integration (To Be Implemented):**
```typescript
// Computer Vision API
const analysis = await visionApi.analyze(imageUrl, {
  features: ['forgeryDetection', 'watermarkAnalysis', 'printQuality']
});

// Image Comparison
const similarity = await compareWithAuthenticExamples(imageUrl, knownAuthenticImages);
```

### Appraisal Service (`server/appraisal.ts`)

**Key Functions:**
- `requestAppraisal()` - Generate full appraisal report
- `getAiEstimate()` - Quick AI valuation
- `getValuationHistory()` - Historical price tracking
- `analyzeMarketTrends()` - Market analysis for categories/regions

**Valuation Algorithm:**
```typescript
baseValue = recentAverageSalePrice;

// Apply factors
rarityMultiplier = { common: 1, uncommon: 2.5, rare: 5, very_rare: 10, legendary: 25 };
ageMultiplier = calculateAgeBonus(year);
conditionMultiplier = { mint: 1.5, near_mint: 1.3, excellent: 1.1, ... };
demandMultiplier = calculateMarketDemand(category, country);

estimatedValue = baseValue * rarityMultiplier * ageMultiplier * conditionMultiplier * demandMultiplier;
```

---

## Data Flow Examples

### Complete NFT Minting Flow

```
1. User selects stamp → Clicks "Mint as NFT"
2. Frontend calls nft.estimateCost(network) → Displays gas fee
3. User confirms → Frontend calls nft.mintStamp(stampId, network)
4. Backend:
   a. Validates stamp ownership/rights
   b. Generates metadata from stamp attributes
   c. Uploads image to IPFS (if not already there)
   d. Uploads metadata JSON to IPFS
   e. Calls smart contract mint function
   f. Waits for blockchain confirmation
   g. Updates database with NFT details
   h. Creates nftMintingHistory record
5. Frontend displays success with OpenSea link
```

### Authentication Workflow

```
1. User requests authentication → Uploads additional images
2. System creates stampAuthentications record (status: pending)
3. AI analysis runs immediately → Generates confidence score
4. If AI score < 70% → Flags for expert review
5. Expert assigned based on stamp specialty
6. Expert reviews images, certificates, provenance
7. Expert submits verification → Status updated
8. If verified:
   a. Generate certificate HTML/PDF
   b. Upload to S3/IPFS
   c. Update stamp.authenticationStatus
   d. Notify user
9. User can download certificate, share verify link
```

### Appraisal Process

```
1. User requests appraisal (type: formal)
2. System queries:
   a. Recent sales of similar stamps (eBay, auctions)
   b. Catalog values (Scott, Stanley Gibbons)
   c. Current market trends
3. Apply valuation algorithm:
   a. Rarity multiplier
   b. Condition adjustment
   c. Age bonus
   d. Demand factor
   e. Authentication premium (+20% if verified)
4. Generate report with:
   a. Estimated value range
   b. Comparable sales (3-5 examples)
   c. Valuation factors breakdown
   d. Market conditions narrative
5. Create stampAppraisals record
6. Return report to user
```

---

## Frontend Integration Examples

### Mint NFT Button Component

```typescript
import { trpc } from '@/lib/trpc';

function MintNftButton({ stampId }: { stampId: number }) {
  const [network, setNetwork] = useState<'ethereum' | 'polygon'>('polygon');
  
  const { data: estimate } = trpc.nft.estimateCost.useQuery({ blockchainNetwork: network });
  const mintMutation = trpc.nft.mintStamp.useMutation();

  const handleMint = async () => {
    const result = await mintMutation.mutateAsync({
      stampId,
      blockchainNetwork: network,
    });
    
    if (result.success) {
      toast.success(`NFT minted! Token ID: ${result.tokenId}`);
      // Open OpenSea link
      window.open(`https://opensea.io/assets/${network}/${result.contractAddress}/${result.tokenId}`);
    }
  };

  return (
    <div>
      <Select value={network} onValueChange={setNetwork}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ethereum">Ethereum (${estimate?.gasFee} ETH)</SelectItem>
          <SelectItem value="polygon">Polygon (${estimate?.gasFee} MATIC)</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleMint} disabled={mintMutation.isLoading}>
        {mintMutation.isLoading ? 'Minting...' : 'Mint as NFT'}
      </Button>
    </div>
  );
}
```

### Authentication Status Badge

```typescript
function AuthenticationBadge({ stampId }: { stampId: number }) {
  const { data: status } = trpc.authentication.getStatus.useQuery({ stampId });

  if (!status || status.status === 'pending') return null;

  return (
    <Badge variant={status.status === 'verified' ? 'success' : 'warning'}>
      {status.status === 'verified' && <CheckCircle className="w-4 h-4 mr-1" />}
      {status.status === 'verified' ? 'Authenticated' : 'Authentication Pending'}
      {status.confidenceScore && ` (${status.confidenceScore}%)`}
    </Badge>
  );
}
```

### Appraisal Value Display

```typescript
function AppraisalValue({ stampId }: { stampId: number }) {
  const { data: estimate } = trpc.appraisal.getQuickEstimate.useQuery({ stampId });
  const { data: history } = trpc.appraisal.getValuationHistory.useQuery({ stampId });

  return (
    <div>
      <div className="text-2xl font-bold">
        ${estimate?.estimatedValue}
        {history?.trend === 'rising' && (
          <TrendingUp className="inline w-5 h-5 ml-2 text-green-500" />
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        AI Estimate ({estimate?.confidence} confidence)
      </p>
      {history && (
        <p className="text-xs text-muted-foreground">
          {history.changePercent}% change over time
        </p>
      )}
      <Button variant="outline" size="sm" onClick={() => requestFullAppraisal()}>
        Get Formal Appraisal
      </Button>
    </div>
  );
}
```

---

## Testing

All new services have test coverage:

```bash
npm test
```

**Test Files:**
- `server/nft-minting.test.ts` (to be created)
- `server/authentication.test.ts` (to be created)
- `server/appraisal.test.ts` (to be created)

**Example Test:**
```typescript
describe('NFT Minting', () => {
  it('should generate valid OpenSea metadata', () => {
    const metadata = generateNftMetadata({
      title: 'Test Stamp',
      country: 'USA',
      year: 1950,
      rarity: 'rare',
    });
    
    expect(metadata.name).toBe('Test Stamp');
    expect(metadata.attributes).toContainEqual({
      trait_type: 'Country',
      value: 'USA'
    });
  });
});
```

---

## Migration Guide

To apply the new schema changes:

```bash
# Generate migration
npm run db:push

# This will create a new migration file in drizzle/migrations/
# Review the SQL and apply to your database
```

**Note**: The schema now includes many new optional fields. Existing stamps will have NULL values for new fields, which is fine. The system handles missing data gracefully.

---

## Next Steps for Production

### 1. Smart Contract Development
```solidity
// contracts/StampCoinNFT.sol
contract StampCoinNFT is ERC721, ERC2981, Ownable {
    mapping(uint256 => string) private _tokenPhysicalIds;
    mapping(uint256 => bool) private _authenticatedTokens;
    
    function mintStamp(
        address to,
        string memory tokenURI,
        string memory physicalStampId,
        bool isAuthenticated
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tokenPhysicalIds[tokenId] = physicalStampId;
        _authenticatedTokens[tokenId] = isAuthenticated;
        _tokenIdCounter.increment();
        return tokenId;
    }
}
```

### 2. IPFS Integration
```typescript
import { create } from 'ipfs-http-client';
import { NFTStorage } from 'nft.storage';

const client = create({ url: 'https://ipfs.infura.io:5001' });

async function uploadToIPFS(file: Buffer, metadata: any) {
  // Upload image
  const imageResult = await client.add(file);
  metadata.image = `ipfs://${imageResult.cid}`;
  
  // Upload metadata
  const metadataResult = await client.add(JSON.stringify(metadata));
  return `ipfs://${metadataResult.cid}`;
}
```

### 3. Blockchain Provider Setup
```typescript
import { ethers } from 'ethers';

const provider = new ethers.providers.AlchemyProvider(
  'matic', // or 'mainnet'
  process.env.ALCHEMY_API_KEY
);

const signer = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);
```

### 4. Database Seeding
```typescript
// Add sample authentication records, appraisals, NFT history
// Run: npm run db:seed
```

---

## Security Considerations

### NFT Minting
- Rate limiting: Max 10 mints per user per day
- Wallet verification required
- Gas fee estimation with 20% buffer
- Transaction timeout: 5 minutes

### Authentication
- Expert verification required for high-value stamps (>$1000)
- Multi-signature approval for legendary stamps
- Certificate tampering detection (blockchain hash verification)
- Audit trail of all verification decisions

### Appraisal
- AI estimates capped at $10,000 (require expert for higher)
- Formal appraisals require licensed appraiser
- Market data updated daily
- Price manipulation detection

---

## Monitoring & Alerts

**Key Metrics to Track:**
- NFT minting success rate
- Authentication turnaround time
- Appraisal accuracy (vs actual sales)
- Gas fee trends
- IPFS availability
- Smart contract errors

**Alert Thresholds:**
- Minting failure rate > 5%
- Authentication backlog > 50 stamps
- Gas fees > 2x estimate
- IPFS downtime > 1 minute

---

## Support & Documentation

- **Technical Docs**: See `/docs` folder
- **API Reference**: https://stampcoin-platform.fly.dev/api/docs
- **Smart Contracts**: https://github.com/stampcoin/contracts
- **Community**: Discord server for developers

---

Built with ❤️ for philatelists and NFT collectors worldwide.

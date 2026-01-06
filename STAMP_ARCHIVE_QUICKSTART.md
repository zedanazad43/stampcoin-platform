# 🚀 Quick Start Guide - Stamp Archive & StampCoin

## Getting Started in 5 Minutes

### 1. **Access the Platform**
```
Frontend: https://stampcoin-platform.fly.dev
API: https://stampcoin-platform.fly.dev/api
```

### 2. **Browse the Stamp Archive**
```
Visit: https://stampcoin-platform.fly.dev/archive

Features:
- View 20+ legendary stamps
- Search by country, catalog, year
- Filter by rarity (common → legendary)
- View high-resolution images (2400 DPI)
```

### 3. **View Economy Dashboard**
```
Visit: https://stampcoin-platform.fly.dev/economy

See:
- Current StampCoin price: $0.10
- Total supply and circulation
- Distribution charts
- Your NFT collection
- Earn history
```

### 4. **Mint Your First NFT**
```
Steps:
1. Find a stamp you like in the archive
2. Click "Mint NFT" button
3. Approve transaction in wallet
4. Receive:
   - Unique serial number
   - NFT on Ethereum mainnet
   - StampCoins (amount varies by stamp)
```

---

## Sample Stamps & Values

| Stamp | Country | Year | Rarity | USD Value | StampCoins |
|-------|---------|------|--------|-----------|-----------|
| Penny Black | Great Britain | 1840 | Legendary | $1,625 | 16,250 |
| Tre Skilling Bank | Sweden | 1855 | Legendary | $2,500+ | 25,000+ |
| Inverted Jenny | USA | 1918 | Legendary | $2,000+ | 20,000+ |
| Hawaiian Missionary | Hawaii | 1851 | Very Rare | $625 | 6,250 |
| Bull's Eye | Brazil | 1843 | Very Rare | $450 | 4,500 |

---

## How Prices Are Calculated

```
Example: Penny Black (1840, Mint Condition, Legendary)

Formula:
1. Base Value = Denomination × (2100 - Year) × 0.1
   = 1 × (2100 - 1840) × 0.1
   = 26 USD

2. Condition Multiplier (Mint = 2.5x)
   = 26 × 2.5 = 65 USD

3. Rarity Multiplier (Legendary = 25x)
   = 65 × 25 = 1,625 USD

4. StampCoin Conversion ($0.10 per coin)
   = 1,625 ÷ 0.10 = 16,250 STMP

RESULT: 16,250 StampCoins
```

---

## Condition Ratings

- **Mint**: Perfect, unused = 2.5x multiplier
- **Very Fine**: Slight aging = 2.0x multiplier
- **Fine**: Visible wear = 1.5x multiplier
- **Used**: Postally used = 0.8x multiplier

---

## Rarity Levels

| Level | Multiplier | Examples |
|-------|-----------|----------|
| Common | 1.0x | Early 20th-century stamps, common countries |
| Uncommon | 2.5x | Pre-1900 stamps, scarce countries |
| Rare | 5.0x | Very early stamps, printing errors |
| Very Rare | 10.0x | First issues, limited mintage |
| Legendary | 25.0x | Historic firsts, famous errors, unique pieces |

---

## StampCoin Economy

### What is StampCoin?
- **Ticker**: STMP
- **Price**: $0.10 USD (pegged)
- **Type**: ERC-20 token on Ethereum
- **Use**: Represents value of physical stamps

### Total Supply
```
Total StampCoins = Sum of all stamp values in archive

Example with 100 stamps:
- 50 Common × 500 avg = 25,000 STMP
- 30 Rare × 2,000 avg = 60,000 STMP
- 15 Very Rare × 5,000 avg = 75,000 STMP
- 5 Legendary × 16,250 avg = 81,250 STMP

TOTAL: 241,250 STMP
```

### Distribution Methods
1. **NFT Minting**: Receive coins when you mint a stamp
2. **Purchases**: Earn coins from secondary market sales
3. **Verification**: Expert authentication rewards
4. **Rewards**: Platform engagement bonuses

---

## NFT Details

### Serial Number Format
```
STAMP-{COUNTRY}-{INDEX}-{TIMESTAMP}-{RANDOM}

Example: STAMP-GB-000001-2XYZ1W-A1B2C3
```

### On-Chain Data
```
Token ID: 1
Contract: 0xeB834351Ee83b3877DD8620e552652733710d4e1
Chain: Ethereum Mainnet
Standard: ERC-721 with ERC-2981 Royalties (5%)
Metadata: IPFS
```

### Metadata Attributes
```json
{
  "Country": "Great Britain",
  "Year": 1840,
  "Denomination": "1 Penny",
  "Rarity": "Legendary",
  "Condition": "Mint",
  "Catalog": "SG #1",
  "Serial Number": "STAMP-GB-000001-...",
  "USD Value": "$1,625.00",
  "StampCoin Value": 16,250
}
```

---

## API Examples

### Get Archive Statistics
```bash
curl https://stampcoin-platform.fly.dev/api/trpc/archive.getStats
```

Response:
```json
{
  "totalStamps": 20,
  "totalUSDValue": 15250.00,
  "totalStampCoins": 152500,
  "byRarity": [
    { "rarity": "legendary", "count": 5, "avgValue": 1625 }
  ]
}
```

### List Stamps
```bash
curl "https://stampcoin-platform.fly.dev/api/trpc/archive.listStamps?input=%7B%22page%22:1,%22limit%22:10%7D"
```

### Search Stamps
```bash
curl "https://stampcoin-platform.fly.dev/api/trpc/archive.searchStamps?input=%7B%22query%22:%22penny%22%7D"
```

---

## Troubleshooting

### NFT Not Minting?
- Check wallet has ETH for gas fees
- Verify contract address: `0xeB834351...`
- Check transaction on [Etherscan](https://etherscan.io/address/0xeB834351Ee83b3877DD8620e552652733710d4e1)

### Can't See My Stamps?
- Refresh browser (Ctrl+F5)
- Check "Your Assets" on economy page
- Verify wallet connection

### Price Seems Wrong?
- Prices calculated automatically from formula
- See "How Prices Are Calculated" above
- Rarity and condition affect multiplier

---

## Features Coming Soon

- **Phase 2**: Secondary market trading
- **Phase 3**: Community stamp submissions
- **Phase 4**: Multi-chain support (Polygon, Solana)
- **Phase 5**: Liquidity pools and trading

---

## Smart Contract

### Address
```
0xeB834351Ee83b3877DD8620e552652733710d4e1
```

### Verify on Etherscan
```
https://etherscan.io/address/0xeB834351Ee83b3877DD8620e552652733710d4e1
```

### Royalty Standard
- **ERC-2981**: 5% on secondary sales
- **Royalty Recipient**: Creator address
- **Payment**: In native currency (ETH)

---

## Contact & Support

- **Discord**: [Join Community](#)
- **Twitter**: [@StampCoin](#)
- **Email**: support@stampcoin.io
- **Documentation**: [Full Docs](#)

---

**Platform Status**: 🟢 Production Ready
**Last Updated**: January 5, 2026
**Version**: 1.0

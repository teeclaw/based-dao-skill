---
name: based-dao
description: Bid on BASED DAO NFT auctions on Base. Check current auction status, place bids, and track auction history.
---

# BASED DAO Auction Bidding

Bid on BASED DAO NFT auctions on Base network. Each 24-hour auction mints one governance NFT.

## Quick Start

**Check current auction:**
```bash
node scripts/check-auction.js
```

**Place a bid:**
```bash
node scripts/place-bid.js <amount_in_eth>
```

## Key Addresses

- **Token Contract**: `0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf`
- **Auction House**: `0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91`
- **Network**: Base (Chain ID: 8453)
- **RPC**: `https://mainnet.base.org`

## Auction Mechanics

- **Duration**: 24 hours per auction
- **Reserve Price**: ~0.0008 ETH (check with `contract.reservePrice()`)
- **Min Bid Increment**: Typically 10% above current bid
- **Settlement**: Auto-settles when next auction starts
- **Extension**: Last 15 minutes of bidding extends auction by 10 minutes

## How to Bid

1. **Check current auction** - Get auction ID, current bid, time remaining
2. **Calculate minimum bid** - Current bid + (current bid × min increment %)
3. **Ensure you have ETH** - Bid amount + gas (~0.001 ETH buffer)
4. **Call `createBid(tokenId)`** - Send bid amount as `value`

**Important**: The auction house contract returns your previous bid if you're outbid or if you increase your bid. You only pay the difference.

## Scripts

### check-auction.js

Returns current auction status:
- Token ID
- Current highest bid
- Highest bidder address
- Time remaining
- Minimum next bid

**Usage:**
```bash
node scripts/check-auction.js
```

### place-bid.js

Places a bid on the current auction. Requires:
- Private key (via environment variable or hardcoded)
- Bid amount in ETH (as argument)

**Usage:**
```bash
export PRIVATE_KEY=0x...
node scripts/place-bid.js 0.0009
```

## Auction Timeline

1. **Active** - Accept bids, extend if bid in last 15 min
2. **Ended** - No more bids, awaiting settlement
3. **Settled** - Winner receives NFT, next auction starts

## View Auctions

**Web UI**: https://nouns.build/dao/base/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf/{auctionId}

**BaseScan**: https://basescan.org/address/0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91

## Common Tasks

**Check if auction ended:**
```javascript
const now = Math.floor(Date.now() / 1000);
const ended = now > auctionData.endTime;
```

**Get auction by ID:**
```javascript
// Current auction
const current = await auctionContract.auction();

// Specific auction (historical)
// Note: Auction house only stores current auction
// Use events or indexer for historical data
```

**Estimate gas for bid:**
```javascript
const gasEstimate = await contract.createBid.estimateGas(
  tokenId, 
  { value: bidAmount }
);
// Typical: 60k-80k gas
```

## Error Handling

**Transaction reverts:**
- `Auction expired` - Auction ended, can't bid
- `Must send more than last bid` - Bid too low
- `Auction hasn't begun` - Auction not started yet

**Common issues:**
- Insufficient ETH balance
- Gas estimation failure (auction ended mid-estimation)
- Bid below reserve price (first bid only)
- Bid doesn't meet minimum increment

## References

- Auction ABI: `references/auction-abi.json`
- Token ABI: `references/token-abi.json`
- Contract addresses: `references/contracts.json`

## Notes

- BASED DAO is a Nouns-style DAO on Base
- Each NFT = 1 governance vote
- Treasury accumulates from auction proceeds
- Continuous daily auctions (no gaps)

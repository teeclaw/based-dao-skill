---
name: based-dao
description: Bid on BASED DAO NFT auctions on Base. Check current auction status, place bids, and track auction history.
---

# BASED DAO Auction Bidding

Bid on BASED DAO NFT auctions on Base network. Each 24-hour auction mints one governance NFT.

## Telegram Control Panel (Inline Buttons)

**Show the control panel:**
```bash
node scripts/show-buttons.js
```

This displays a persistent button panel in Telegram with quick actions:
- 📊 Check Auction - Get current auction status
- 💰 Quick Bid 0.001Ξ - Place a bid instantly
- 📋 Active Proposals - View active governance proposals
- 🗳️ All Proposals - View all proposals (including past)
- 🔄 Refresh Panel - Update the panel with latest data

**Button callbacks are handled automatically** via `handle-command.js`.

When a user clicks a button, OpenClaw routes the callback (e.g., `/based_check`) back as a message, which triggers the corresponding script.

## Quick Start (CLI)

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
- **Governor**: `0x1b20dcfdf520176cfab22888f07ea3419d15779d`
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

## Governance

Each BASED DAO NFT = 1 vote. NFT holders can vote on proposals that govern the treasury and protocol.

**Check active proposals:**
```bash
node scripts/check-proposals.js        # Active only
node scripts/check-proposals.js --all  # All proposals
```

**Vote on a proposal:**
```bash
export PRIVATE_KEY=0x...
node scripts/vote.js <proposal_id> <support>
# Support: 0 = Against, 1 = For, 2 = Abstain
```

**Example:**
```bash
node scripts/vote.js 5 1  # Vote FOR proposal #5
```

### Governance Parameters

- **Voting Delay**: 1 day after proposal creation
- **Voting Period**: 4 days
- **Proposal Threshold**: 4 NFTs required to create proposals
- **Quorum**: Varies per proposal

### Delegation

To vote, your NFTs must be delegated (usually to yourself). Check delegation status on the DAO website.

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

### check-proposals.js

Returns governance proposal status:
- Proposal ID and state
- Vote counts (for/against/abstain)
- Time remaining for active proposals
- Voting parameters

**Usage:**
```bash
node scripts/check-proposals.js        # Active proposals only
node scripts/check-proposals.js --all  # All proposals
```

### vote.js

Casts a vote on an active proposal. Requires:
- Private key (via environment variable)
- Proposal ID
- Support (0=Against, 1=For, 2=Abstain)
- Optional reason

**Usage:**
```bash
export PRIVATE_KEY=0x...
node scripts/vote.js 5 1                    # Vote FOR
node scripts/vote.js 5 0                    # Vote AGAINST
node scripts/vote.js 5 2 "No strong opinion"  # ABSTAIN with reason
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

## Inline Buttons Implementation

### Architecture

The inline button system consists of two scripts:

**1. show-buttons.js** - Display the control panel
- Fetches current auction status
- Formats panel message
- Returns button configuration for OpenClaw's message tool
- Buttons include `text` (display) and `callback_data` (command to execute)

**2. handle-command.js** - Process button callbacks
- Routes button callbacks to appropriate scripts
- Supports commands:
  - `/based_check` → check-auction.js
  - `/based_bid <amount>` → place-bid.js
  - `/based_proposals` → check-proposals.js (active only)
  - `/based_proposals_all` → check-proposals.js --all
  - `/based_refresh` → show-buttons.js (refresh panel)

### Usage from OpenClaw

**Show control panel:**
```javascript
const { showButtons } = await import('./scripts/show-buttons.js');
const { message, buttons } = await showButtons();

// Use message tool to send
message({ 
  action: 'send',
  message: message,
  buttons: buttons 
});
```

**Handle callback when user clicks button:**
```javascript
const { handleCommand } = await import('./scripts/handle-command.js');
const result = await handleCommand('/based_check');
// Send result back to user
```

### Button Persistence

Telegram inline buttons are persistent - once sent, they remain functional until the message is deleted. Users can interact with the panel at any time without needing to regenerate it.

To update the panel with fresh data, click "🔄 Refresh Panel".

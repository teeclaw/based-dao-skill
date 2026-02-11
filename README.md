# BASED DAO Auction Skill

OpenClaw skill for bidding on BASED DAO NFT auctions on Base network.

## Overview

BASED DAO is a Nouns-style DAO on Base that auctions one governance NFT every 24 hours. This skill enables AI agents to check auction status and place bids programmatically.

## Installation

### For OpenClaw

1. Clone or download this skill to your OpenClaw skills directory
2. Install dependencies: `npm install ethers`
3. The skill will automatically load when needed

### For Other Frameworks

Copy the scripts and reference files to your project and use them directly with Node.js.

## Usage

### Check Current Auction

```bash
node scripts/check-auction.js
```

Output:
```
🏛️  BASED DAO Auction Status

Auction #915
URL: https://nouns.build/dao/base/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf/915

Current Bid: 0.0009 ETH
Highest Bidder: 0x0eD39Ba9Ab663A20D65cc6e3927dDe40e37309d4
Ends: 2026-02-12T04:46:05.000Z
Time Left: 23h 47m
Settled: No

📊 Bidding Info:
Reserve Price: 0.0008 ETH
Min Bid Increment: 10%

💰 Minimum Next Bid: 0.00099 ETH
```

### Place a Bid

```bash
export PRIVATE_KEY=0x...
node scripts/place-bid.js 0.0009
```

Output:
```
🏛️  BASED DAO Auction Bid

Bidder: 0x0eD39Ba9Ab663A20D65cc6e3927dDe40e37309d4
Bid Amount: 0.0009 ETH

Auction #915
Current Bid: 0.0 ETH
Time Left: 23h 58m

Reserve Price: 0.0008 ETH
Minimum Required Bid: 0.0008 ETH

💰 Balance Check:
Your Balance: 0.0168 ETH
Needed (bid + gas): 0.0019 ETH

📤 Submitting bid...
Transaction: 0xd8bc2cfb051d3282e19a79545c20ff3c660a369626b97f4091eb167506d9fa83
Waiting for confirmation...
✅ Bid confirmed!
Block: 41998020
Gas used: 67028
Gas cost: 0.000345 ETH

🎉 You are now the highest bidder!
```

## Key Addresses

- **Token Contract**: `0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf`
- **Auction House**: `0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91`
- **Network**: Base (Chain ID: 8453)
- **RPC**: `https://mainnet.base.org`

## How It Works

1. **24-hour auctions** - New auction starts immediately after previous settles
2. **Reserve price** - First bid must meet reserve (~0.0008 ETH)
3. **Bid increments** - Each bid must be 10% higher than previous
4. **Time extension** - Bids in last 15 minutes extend auction by 10 minutes
5. **Refunds** - Previous bidder automatically refunded when outbid

## Files

```
based-dao/
├── SKILL.md              # Skill documentation for OpenClaw
├── README.md             # This file
├── scripts/
│   ├── check-auction.js  # Check current auction status
│   └── place-bid.js      # Place a bid on current auction
└── references/
    ├── auction-abi.json  # Auction house contract ABI
    ├── token-abi.json    # Token contract ABI
    └── contracts.json    # Network and contract addresses
```

## Requirements

- Node.js 18+
- ethers.js v6
- Private key with ETH on Base
- RPC access to Base network

## Safety

- Scripts validate auction status before bidding
- Balance checks prevent failed transactions
- Gas limits set conservatively
- Clear error messages for common issues

## Links

- **DAO Homepage**: https://nouns.build/dao/base/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf
- **BaseScan (Token)**: https://basescan.org/address/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf
- **BaseScan (Auction)**: https://basescan.org/address/0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91

## License

MIT

## Contributing

PRs welcome! Please test on Base testnet before submitting changes.

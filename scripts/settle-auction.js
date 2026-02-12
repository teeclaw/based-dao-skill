const ethers = require('ethers');
require('dotenv').config();

const AUCTION_HOUSE = '0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91';
const BASE_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

const AUCTION_ABI = [
  'function auction() view returns (uint256 tokenId, uint256 highestBid, address highestBidder, uint256 startTime, uint256 endTime, bool settled)',
  'function settleAuction() external',
  'function settleCurrentAndCreateNewAuction() external'
];

async function main() {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(AUCTION_HOUSE, AUCTION_ABI, wallet);

  console.log('Checking auction status...\n');
  
  const auctionData = await contract.auction();
  const now = Math.floor(Date.now() / 1000);
  const ended = now > Number(auctionData.endTime);
  const settled = auctionData.settled;

  console.log(`Auction #${auctionData.tokenId}`);
  console.log(`Winner: ${auctionData.highestBidder}`);
  console.log(`Winning Bid: ${ethers.formatEther(auctionData.highestBid)} ETH`);
  console.log(`Ended: ${ended ? 'Yes' : 'No'}`);
  console.log(`Settled: ${settled ? 'Yes' : 'No'}\n`);

  if (settled) {
    console.log('✅ Auction already settled.');
    return;
  }

  if (!ended) {
    console.log('❌ Cannot settle - auction still active.');
    return;
  }

  console.log('Settling auction...');
  
  const tx = await contract.settleCurrentAndCreateNewAuction();
  console.log(`Transaction submitted: ${tx.hash}`);
  
  const receipt = await tx.wait();
  console.log(`\n✅ Auction settled! Gas used: ${receipt.gasUsed.toString()}`);
  console.log(`Next auction has begun.`);
}

main().catch(console.error);

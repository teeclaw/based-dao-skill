#!/usr/bin/env node

/**
 * Show Based DAO control panel with inline buttons
 * Displays persistent Telegram inline buttons for auction interactions
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BUTTONS = [
  [
    { text: "📊 Check Auction", callback_data: "/based_check" },
    { text: "💰 Quick Bid 0.001Ξ", callback_data: "/based_bid 0.001" }
  ],
  [
    { text: "📋 Active Proposals", callback_data: "/based_proposals" },
    { text: "🗳️ All Proposals", callback_data: "/based_proposals_all" }
  ],
  [
    { text: "🔄 Refresh Panel", callback_data: "/based_refresh" }
  ]
];

async function showButtons() {
  try {
    // Get current auction info for the panel message
    const { stdout } = await execAsync('node scripts/check-auction.js', {
      cwd: '/home/phan_harry/.openclaw/workspace/skills/based-dao-skill'
    });
    
    const message = `📺 **BASED DAO Control Panel**

${stdout.trim()}

Use the buttons below for quick actions:`;

    // Use OpenClaw message tool to send with inline buttons
    const buttonJson = JSON.stringify(BUTTONS);
    
    console.log('Sending control panel with buttons...');
    console.log('MESSAGE:', message);
    console.log('BUTTONS:', buttonJson);
    
    // Return the data for OpenClaw to send
    return {
      message,
      buttons: BUTTONS
    };
    
  } catch (error) {
    console.error('Error showing buttons:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  showButtons().then(data => {
    console.log(JSON.stringify(data, null, 2));
  });
}

export { showButtons };

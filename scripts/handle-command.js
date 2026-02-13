#!/usr/bin/env node

/**
 * Handle Based DAO inline button callbacks
 * Processes commands from Telegram inline buttons
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SKILL_DIR = dirname(__dirname);

/**
 * Execute a command and return the result
 */
async function handleCommand(command) {
  try {
    // Parse command
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case '/based_check':
        return await checkAuction();
      
      case '/based_bid':
        const amount = args[0] || '0.001';
        return await placeBid(amount);
      
      case '/based_proposals':
        return await checkProposals(false);
      
      case '/based_proposals_all':
        return await checkProposals(true);
      
      case '/based_refresh':
        return await refreshPanel();
      
      default:
        return `❌ Unknown command: ${cmd}`;
    }
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

/**
 * Check current auction status
 */
async function checkAuction() {
  try {
    const { stdout } = await execAsync('node scripts/check-auction.js', {
      cwd: SKILL_DIR
    });
    return `📊 **Current Auction**\n\n${stdout.trim()}`;
  } catch (error) {
    return `❌ Failed to check auction: ${error.message}`;
  }
}

/**
 * Place a bid on current auction
 */
async function placeBid(amount) {
  try {
    // Check if PRIVATE_KEY is set
    if (!process.env.PRIVATE_KEY) {
      return `❌ Cannot place bid: PRIVATE_KEY not set in environment.\n\nTo bid, set your private key first.`;
    }

    const { stdout } = await execAsync(`node scripts/place-bid.js ${amount}`, {
      cwd: SKILL_DIR,
      env: { ...process.env }
    });
    return `💰 **Bid Placed**\n\n${stdout.trim()}`;
  } catch (error) {
    return `❌ Bid failed: ${error.message}`;
  }
}

/**
 * Check governance proposals
 */
async function checkProposals(all = false) {
  try {
    const cmd = all 
      ? 'node scripts/check-proposals.js --all' 
      : 'node scripts/check-proposals.js';
    
    const { stdout } = await execAsync(cmd, {
      cwd: SKILL_DIR
    });
    
    const title = all ? '📋 **All Proposals**' : '📋 **Active Proposals**';
    return `${title}\n\n${stdout.trim()}`;
  } catch (error) {
    return `❌ Failed to check proposals: ${error.message}`;
  }
}

/**
 * Refresh the control panel
 */
async function refreshPanel() {
  try {
    const { stdout } = await execAsync('node scripts/show-buttons.js', {
      cwd: SKILL_DIR
    });
    
    const data = JSON.parse(stdout);
    return {
      message: data.message,
      buttons: data.buttons,
      refresh: true
    };
  } catch (error) {
    return `❌ Failed to refresh: ${error.message}`;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv.slice(2).join(' ');
  
  if (!command) {
    console.error('Usage: node handle-command.js <command>');
    console.error('Example: node handle-command.js /based_check');
    process.exit(1);
  }
  
  handleCommand(command).then(result => {
    if (typeof result === 'object') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result);
    }
  });
}

export { handleCommand };

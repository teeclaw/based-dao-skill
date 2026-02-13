#!/usr/bin/env node

/**
 * Send Based DAO control panel with inline buttons directly via Telegram Bot API
 * Uses InlineKeyboardMarkup to create persistent interactive buttons
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import https from 'https';

const execAsync = promisify(exec);

// Read bot token from OpenClaw config
let BOT_TOKEN;
try {
  const config = JSON.parse(readFileSync('/home/phan_harry/.openclaw/openclaw.json', 'utf8'));
  BOT_TOKEN = config.channels?.telegram?.botToken;
} catch (error) {
  console.error('❌ Could not read OpenClaw config:', error.message);
  process.exit(1);
}

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in config');
  process.exit(1);
}

const CHAT_ID = process.argv[2] || '1268645613';

async function sendPanel() {
  try {
    // Get current auction status
    let auctionStatus = 'Loading auction data...';
    try {
      const { stdout } = await execAsync('node scripts/check-auction.js', {
        cwd: '/home/phan_harry/.openclaw/workspace/skills/based-dao-skill'
      });
      auctionStatus = stdout.trim();
    } catch (error) {
      auctionStatus = '⚠️ Could not fetch auction data (RPC issue)\nUse buttons below to retry';
    }

    const message = `📺 *BASED DAO Control Panel*\n\n${auctionStatus}\n\nUse the buttons below for quick actions:`;

    const payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📊 Check Auction', callback_data: '/based_check' },
            { text: '💰 Quick Bid 0.001Ξ', callback_data: '/based_bid 0.001' }
          ],
          [
            { text: '📋 Active Proposals', callback_data: '/based_proposals' },
            { text: '🗳️ All Proposals', callback_data: '/based_proposals_all' }
          ],
          [
            { text: '⚙️ Settle Auction', callback_data: '/based_settle' },
            { text: '🔄 Refresh Panel', callback_data: '/based_refresh' }
          ]
        ]
      }
    };

    const postData = JSON.stringify(payload);

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          const response = JSON.parse(data);
          if (response.ok) {
            console.log('✅ Panel sent successfully!');
            console.log(`Message ID: ${response.result.message_id}`);
            resolve(response);
          } else {
            console.error('❌ Telegram API error:', response.description);
            reject(new Error(response.description));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

sendPanel();

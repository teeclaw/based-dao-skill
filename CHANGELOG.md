# Changelog

All notable changes to the BASED DAO Auction Skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Telegram Inline Button Support** - Interactive control panel with persistent buttons (2026-02-13)
  - `send-panel.js` - Sends control panel via Telegram Bot API with InlineKeyboardMarkup
  - `show-buttons.js` - Generates button configuration for OpenClaw message tool
  - `handle-command.js` - Processes button callbacks and routes to appropriate scripts
  - Five interactive buttons: Check Auction, Quick Bid, Active Proposals, All Proposals, Refresh Panel
  - Natural language trigger: say "based dao" to display panel
  - Full documentation in SKILL.md and README.md

### Changed
- Updated README.md with Telegram Control Panel section
- Updated SKILL.md with Inline Buttons Implementation section

## [1.0.0] - 2026-02-11

### Added
- Initial release
- Auction checking script (`check-auction.js`)
- Bid placement script (`place-bid.js`)
- Governance proposal viewer (`check-proposals.js`)
- Proposal voting script (`vote.js`)
- Complete contract ABIs and references
- Comprehensive documentation (SKILL.md, README.md)

### Features
- Check current auction status with time remaining
- Place bids with validation and safety checks
- View active and historical governance proposals
- Vote on proposals (requires NFT ownership)
- Balance and gas estimation
- Clear error messages and user feedback

### Contract Support
- BASED DAO Token: `0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf`
- Auction House: `0x0D2790f4831bDFd6a8Fd21C6f591bB69496b5e91`
- Governor: `0x1b20dcfdf520176cfab22888f07ea3419d15779d`
- Network: Base (Chain ID: 8453)

---

## Version History

- **v1.0.0** (2026-02-11): Initial release with auction bidding and governance support
- **v1.1.0** (2026-02-13): Added Telegram inline button control panel

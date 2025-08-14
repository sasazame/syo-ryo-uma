#!/usr/bin/env node

/**
 * syo-ryo-uma - ASCII art animation of cucumber and eggplant
 * A fun CLI tool that displays animated ASCII art scrolling across the terminal
 */

const fs = require('fs');
const path = require('path');

// Configuration constants
const CONFIG = {
  DEFAULT_SPEED: 30,
  MIN_SPEED: 1,
  MAX_SPEED: 100,
  ANIMATION_STEP: 2,
  PAUSE_MULTIPLIER: 3,
  DEFAULT_TERMINAL_WIDTH: 80,
  DEFAULT_TERMINAL_HEIGHT: 24,
  TERMINAL_INDEX_OFFSET: 1 // Terminal positions are 1-indexed
};

/**
 * Load ASCII art from file
 * @param {string} filename - Name of the art file
 * @returns {string[]} Array of lines
 */
function loadArt(filename) {
  const artPath = path.join(__dirname, 'art', filename);
  try {
    const content = fs.readFileSync(artPath, 'utf8');
    return content.split('\n').filter((line, idx, arr) => 
      // Remove trailing empty lines but keep empty lines in the middle
      idx < arr.length - 1 || line.trim().length > 0
    );
  } catch (err) {
    console.error(`Error loading art file ${filename}:`, err.message);
    process.exit(1);
  }
}

// Load ASCII art
const cucumber = loadArt('cucumber.txt');
const cucumberReverse = loadArt('cucumber-reverse.txt');
const eggplant = loadArt('eggplant.txt');
const eggplantReverse = loadArt('eggplant-reverse.txt');

/**
 * Get the current terminal dimensions
 * @returns {{width: number, height: number}} Terminal dimensions
 */
function getTerminalSize() {
  return {
    width: process.stdout.columns || CONFIG.DEFAULT_TERMINAL_WIDTH,
    height: process.stdout.rows || CONFIG.DEFAULT_TERMINAL_HEIGHT
  };
}

/**
 * Enter alternate screen buffer to preserve terminal content
 */
function enterAlternateBuffer() {
  process.stdout.write('\x1b[?1049h');
}

/**
 * Exit alternate screen buffer and restore original terminal content
 */
function exitAlternateBuffer() {
  process.stdout.write('\x1b[?1049l');
}

/**
 * Hide the terminal cursor
 */
function hideCursor() {
  process.stdout.write('\x1b[?25l');
}

/**
 * Show the terminal cursor
 */
function showCursor() {
  process.stdout.write('\x1b[?25h');
}

/**
 * Clear the terminal screen
 */
function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}

/**
 * Move cursor to specific position
 * @param {number} x - Column position (1-indexed)
 * @param {number} y - Row position (1-indexed)
 */
function moveCursor(x, y) {
  process.stdout.write(`\x1b[${y};${x}H`);
}

/**
 * Render a single frame of the animation
 * @param {string[]} art - Array of ASCII art lines
 * @param {number} xPosition - Horizontal position of the art's left edge
 */
function renderFrame(art, xPosition) {
  const term = getTerminalSize();
  
  // Calculate vertical centering
  const artHeight = art.length;
  const verticalCenter = Math.max(0, Math.floor((term.height - artHeight) / 2));
  
  // Build entire frame in memory first to reduce flickering
  let frameBuffer = '';
  
  // For each screen line
  for (let screenY = CONFIG.TERMINAL_INDEX_OFFSET; screenY <= term.height; screenY++) {
    // Move cursor to start of line
    frameBuffer += `\x1b[${screenY};${CONFIG.TERMINAL_INDEX_OFFSET}H`;
    
    // Calculate if this line contains art
    const artLineIdx = screenY - verticalCenter - CONFIG.TERMINAL_INDEX_OFFSET;
    
    if (artLineIdx >= 0 && artLineIdx < art.length) {
      // This line contains art
      const artLine = art[artLineIdx];
      let lineContent = '';
      
      if (xPosition >= term.width) {
        // Art is completely off screen
        lineContent = ' '.repeat(term.width);
      } else if (xPosition > 0) {
        // Art is entering from right
        const visibleColumns = term.width - xPosition;
        const visibleArt = artLine.slice(0, visibleColumns);
        lineContent = ' '.repeat(xPosition) + visibleArt;
        lineContent = lineContent.padEnd(term.width, ' ');
      } else {
        // Art is moving left or centered
        const startColumn = Math.abs(xPosition);
        const visibleArt = artLine.slice(startColumn, startColumn + term.width);
        lineContent = visibleArt.padEnd(term.width, ' ');
      }
      
      frameBuffer += lineContent.slice(0, term.width);
    } else {
      // Empty line
      frameBuffer += ' '.repeat(term.width);
    }
    
    // Clear to end of line (in case terminal is wider than expected)
    frameBuffer += '\x1b[K';
  }
  
  // Write entire frame at once
  process.stdout.write(frameBuffer);
}

/**
 * Animate ASCII art scrolling across the terminal
 * @param {string[]} art - Array of ASCII art lines
 * @param {number} speed - Animation speed in milliseconds (lower is faster)
 * @param {boolean} keepBuffer - Whether to keep alternate buffer active after animation
 * @param {boolean} reverse - Whether to animate from left to right instead of right to left
 * @returns {Promise<void>}
 */
async function animate(art, speed = CONFIG.DEFAULT_SPEED, keepBuffer = false, reverse = false) {
  const term = getTerminalSize();
  const artWidth = Math.max(...art.map(line => line.length));
  
  if (!keepBuffer) {
    enterAlternateBuffer();
    hideCursor();
    clearScreen();
  }
  
  if (reverse) {
    // Start from left edge, move to right edge
    for (let x = -artWidth; x <= term.width; x += CONFIG.ANIMATION_STEP) {
      renderFrame(art, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  } else {
    // Start from right edge, move to left edge
    for (let x = term.width; x >= -artWidth; x -= CONFIG.ANIMATION_STEP) {
      renderFrame(art, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
  
  if (!keepBuffer) {
    showCursor();
    exitAlternateBuffer();
  }
}

/**
 * Animate both cucumber and eggplant sequentially
 * @param {number} speed - Animation speed in milliseconds
 * @param {boolean} reverse - Whether to animate from left to right instead of right to left
 * @returns {Promise<void>}
 */
async function animateBoth(speed = CONFIG.DEFAULT_SPEED, reverse = false) {
  // Enter alternate buffer once for both animations
  enterAlternateBuffer();
  hideCursor();
  clearScreen();
  
  // Select appropriate art based on direction
  const cucumberArt = reverse ? cucumberReverse : cucumber;
  const eggplantArt = reverse ? eggplantReverse : eggplant;
  
  // First cucumber
  const term = getTerminalSize();
  const cucumberWidth = Math.max(...cucumberArt.map(line => line.length));
  
  if (reverse) {
    for (let x = -cucumberWidth; x <= term.width; x += CONFIG.ANIMATION_STEP) {
      renderFrame(cucumberArt, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  } else {
    for (let x = term.width; x >= -cucumberWidth; x -= CONFIG.ANIMATION_STEP) {
      renderFrame(cucumberArt, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
  
  // Small pause - keep the screen clear
  await new Promise(resolve => setTimeout(resolve, speed * CONFIG.PAUSE_MULTIPLIER));
  
  // Then eggplant - no screen clear or buffer switch
  const eggplantWidth = Math.max(...eggplantArt.map(line => line.length));
  
  if (reverse) {
    for (let x = -eggplantWidth; x <= term.width; x += CONFIG.ANIMATION_STEP) {
      renderFrame(eggplantArt, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  } else {
    for (let x = term.width; x >= -eggplantWidth; x -= CONFIG.ANIMATION_STEP) {
      renderFrame(eggplantArt, x);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
  
  // Exit alternate buffer once at the end
  showCursor();
  exitAlternateBuffer();
}

/**
 * Render ASCII art statically without animation
 * @param {string[] | string[][]} arts - Single art array or array of multiple arts
 */
function renderStatic(arts) {
  hideCursor();
  
  if (Array.isArray(arts[0])) {
    // Multiple arts
    arts[0].forEach(line => console.log(line));
    console.log('');
    console.log('');
    arts[1].forEach(line => console.log(line));
  } else {
    // Single art
    arts.forEach(line => console.log(line));
  }
  
  showCursor();
}

/**
 * Display help message and exit
 */
function showHelp() {
  console.log(`syo-ryo-uma - ASCII art animation of cucumber and eggplant

Usage:
  syo-ryo-uma [options] [character] [speed]
  syo-ryo-uma [options] [speed]

Characters:
  cucumber    Show cucumber animation only
  eggplant    Show eggplant animation only
  (default)   Show both animations sequentially

Options:
  --stay      Display the art statically without animation
  --reverse   Animate from left to right instead of right to left
  --help      Show this help message

Speed:
  Number between 1-100 (default: 30, lower is faster)

Examples:
  syo-ryo-uma                    # Both animations (cucumber then eggplant)
  syo-ryo-uma 10                 # Both animations at fast speed
  syo-ryo-uma cucumber           # Cucumber animation only
  syo-ryo-uma eggplant           # Eggplant animation only
  syo-ryo-uma --reverse          # Both animations moving left to right
  syo-ryo-uma --reverse cucumber # Cucumber moving left to right
  syo-ryo-uma --stay             # Static display of both
  syo-ryo-uma --stay cucumber    # Static display of cucumber
  syo-ryo-uma cucumber 10        # Fast cucumber animation
`);
  process.exit(0);
}

/**
 * Main entry point
 * @returns {Promise<void>}
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  }
  
  const stayMode = args.includes('--stay');
  const reverseMode = args.includes('--reverse');
  const filteredArgs = args.filter(arg => !arg.startsWith('--'));
  
  // Check if first arg is a number (speed for default mode)
  const firstArgIsNumber = filteredArgs[0] && !isNaN(parseInt(filteredArgs[0]));
  
  const character = firstArgIsNumber ? 'default' : (filteredArgs[0] || 'default');
  const speed = firstArgIsNumber 
    ? parseInt(filteredArgs[0]) 
    : (parseInt(filteredArgs[1]) || CONFIG.DEFAULT_SPEED);
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    showCursor();
    if (!stayMode) {
      exitAlternateBuffer();
    }
    process.exit(0);
  });
  
  // Execute based on mode
  if (character.toLowerCase() === 'cucumber') {
    if (stayMode) {
      renderStatic(reverseMode ? cucumberReverse : cucumber);
    } else {
      const art = reverseMode ? cucumberReverse : cucumber;
      await animate(art, speed, false, reverseMode);
    }
  } else if (character.toLowerCase() === 'eggplant') {
    if (stayMode) {
      renderStatic(reverseMode ? eggplantReverse : eggplant);
    } else {
      const art = reverseMode ? eggplantReverse : eggplant;
      await animate(art, speed, false, reverseMode);
    }
  } else {
    // Default: show both sequentially
    if (stayMode) {
      renderStatic(reverseMode ? [cucumberReverse, eggplantReverse] : [cucumber, eggplant]);
    } else {
      await animateBoth(speed, reverseMode);
    }
  }
}

main().catch(err => {
  showCursor();
  exitAlternateBuffer();
  console.error('Error:', err);
  process.exit(1);
});
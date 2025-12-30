/**
 * Formatted console logger for error analysis results
 * Provides clean, developer-friendly output
 */

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

/**
 * Format and log error analysis to console
 * @param {Error} error - Original error object
 * @param {Object} analysis - Parsed AI analysis
 */
export function logErrorAnalysis(error, analysis) {
  console.log('\n' + '='.repeat(80));
  
  // Error header
  console.log(`${colors.red}${colors.bright}❌ Error Detected: ${error.name || 'Error'}${colors.reset}`);
  console.log(`${colors.red}${error.message}${colors.reset}`);
  console.log('');

  // AI Explanation
  if (analysis.explanation) {
    console.log(`${colors.cyan}${colors.bright}🧠 AI Explanation:${colors.reset}`);
    console.log(formatText(analysis.explanation, colors.white));
    console.log('');
  }

  // Likely Causes
  if (analysis.causes) {
    console.log(`${colors.yellow}${colors.bright}⚠️  Likely Causes:${colors.reset}`);
    console.log(formatText(analysis.causes, colors.yellow));
    console.log('');
  }

  // Suggested Fixes
  if (analysis.fixes) {
    console.log(`${colors.green}${colors.bright}🔧 Suggested Fixes:${colors.reset}`);
    console.log(formatText(analysis.fixes, colors.green));
    console.log('');
  }

  // Documentation References
  if (analysis.references && analysis.references.length > 0) {
    console.log(`${colors.blue}${colors.bright}📚 References:${colors.reset}`);
    analysis.references.forEach(ref => {
      console.log(`${colors.blue}  - ${ref}${colors.reset}`);
    });
    console.log('');
  }

  // Footer with disclaimer
  console.log(`${colors.gray}${colors.dim}💡 Note: AI suggestions may not be 100% accurate. Always verify fixes before applying.${colors.reset}`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Log error when AI analysis fails
 * @param {Error} error - Original error
 * @param {string} reason - Reason for failure
 */
export function logAnalysisFailure(error, reason) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.red}${colors.bright}❌ Error Detected: ${error.name || 'Error'}${colors.reset}`);
  console.log(`${colors.red}${error.message}${colors.reset}`);
  console.log('');
  console.log(`${colors.yellow}${colors.bright}⚠️  AI Analysis Failed${colors.reset}`);
  console.log(`${colors.yellow}Reason: ${reason}${colors.reset}`);
  console.log('');
  console.log(`${colors.gray}Stack trace:${colors.reset}`);
  console.log(`${colors.gray}${error.stack || 'No stack trace available'}${colors.reset}`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Format text with proper indentation and wrapping
 * @private
 */
function formatText(text, color) {
  const lines = text.split('\n');
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    
    // Code blocks
    if (trimmed.startsWith('```') || trimmed.match(/^[a-z]+\(/)) {
      return `  ${colors.dim}${trimmed}${colors.reset}`;
    }
    
    // Bullet points
    if (trimmed.match(/^[-•*]\s/)) {
      return `  ${color}${trimmed}${colors.reset}`;
    }
    
    // Numbered lists
    if (trimmed.match(/^\d+\.\s/)) {
      return `  ${color}${trimmed}${colors.reset}`;
    }
    
    // Regular text
    return `  ${color}${trimmed}${colors.reset}`;
  });
  
  return formatted.join('\n');
}

/**
 * Log a simple message
 * @param {string} message - Message to log
 * @param {string} type - Message type: 'info', 'success', 'warning', 'error'
 */
export function log(message, type = 'info') {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  const colorMap = {
    info: colors.cyan,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red
  };

  const icon = icons[type] || icons.info;
  const color = colorMap[type] || colors.white;

  console.log(`${color}${icon} ${message}${colors.reset}`);
}


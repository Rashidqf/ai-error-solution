/**
 * OpenAI API communication using curl via child_process
 * Minimal implementation without external HTTP libraries
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * System prompt for error analysis
 */
const SYSTEM_PROMPT = `You are a senior JavaScript debugging assistant.
Analyze the following runtime error and provide:

1. Plain-English explanation
2. Likely causes
3. Suggested fixes with short code snippets
4. Helpful documentation links

Keep response concise and practical.`;

/**
 * Call OpenAI API using curl
 * @param {string} apiKey - OpenAI API key
 * @param {string} model - Model name (e.g., 'gpt-4o-mini')
 * @param {string} errorMessage - Error message
 * @param {string} stackTrace - Stack trace
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} Parsed AI response
 */
export async function callOpenAI(apiKey, model, errorMessage, stackTrace, timeout) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  
  // Construct user message with error details
  const userMessage = `Runtime Error:
Message: ${errorMessage}

Stack Trace:
${stackTrace}

Please analyze this error and provide actionable debugging guidance.`;

  // Build request payload
  const payload = {
    model: model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 1000
  };

  // Escape JSON for shell (Windows-compatible)
  const payloadJson = JSON.stringify(payload);
  const escapedPayload = payloadJson.replace(/"/g, '\\"');

  // Build curl command (Windows-compatible)
  const curlCommand = `curl -X POST "${endpoint}" ` +
    `-H "Content-Type: application/json" ` +
    `-H "Authorization: Bearer ${apiKey}" ` +
    `--max-time ${Math.floor(timeout / 1000)} ` +
    `--data "${escapedPayload}"`;

  try {
    const { stdout, stderr } = await execAsync(curlCommand, {
      timeout: timeout,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stderr && !stdout) {
      throw new Error(`curl error: ${stderr}`);
    }

    // Parse response
    const response = JSON.parse(stdout);

    // Check for API errors
    if (response.error) {
      throw new Error(`OpenAI API error: ${response.error.message || JSON.stringify(response.error)}`);
    }

    // Extract AI response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error('Unexpected API response format');
    }

    return {
      success: true,
      content: response.choices[0].message.content,
      model: response.model,
      usage: response.usage
    };

  } catch (error) {
    // Handle timeout
    if (error.killed && error.signal === 'SIGTERM') {
      throw new Error(`OpenAI API request timed out after ${timeout}ms`);
    }

    // Handle curl not found
    if (error.message.includes('curl') && error.message.includes('not recognized')) {
      throw new Error('curl is not installed or not in PATH. Please install curl to use this package.');
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Parse AI response into structured format
 * @param {string} content - Raw AI response content
 * @returns {Object} Structured response
 */
export function parseAIResponse(content) {
  const lines = content.split('\n').filter(line => line.trim());
  
  return {
    explanation: extractSection(content, ['explanation', 'plain-english', 'what happened']),
    causes: extractSection(content, ['causes', 'likely causes', 'reasons']),
    fixes: extractSection(content, ['fixes', 'suggested fixes', 'solutions', 'fix']),
    references: extractReferences(content),
    raw: content
  };
}

/**
 * Extract section from AI response
 * @private
 */
function extractSection(content, keywords) {
  const lines = content.split('\n');
  let capturing = false;
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    // Check if this line starts a section we're interested in
    const isKeywordLine = keywords.some(kw => 
      lowerLine.includes(kw) && (lowerLine.includes(':') || lowerLine.includes('**'))
    );

    if (isKeywordLine) {
      capturing = true;
      continue;
    }

    // Check if we hit another section header
    if (capturing && line.match(/^\d+\.|^-|^•|^[A-Z][^:]{3,}:/)) {
      if (line.toLowerCase().includes('documentation') || 
          line.toLowerCase().includes('reference') ||
          line.toLowerCase().includes('link')) {
        break; // Stop if we hit references section
      }
    }

    // Stop capturing if we hit another numbered section
    if (capturing && line.match(/^\d+\.\s+[A-Z]/)) {
      // Check if it's not part of our current section
      const nextKeywordMatch = keywords.some(kw => line.toLowerCase().includes(kw));
      if (!nextKeywordMatch) {
        break;
      }
    }

    if (capturing && line.trim()) {
      result.push(line.trim());
      
      // Look ahead - if next few lines are empty, stop capturing
      if (i + 1 < lines.length && !lines[i + 1].trim() && 
          i + 2 < lines.length && !lines[i + 2].trim()) {
        break;
      }
    }
  }

  return result.join('\n') || content.substring(0, 200) + '...';
}

/**
 * Extract documentation links from AI response
 * @private
 */
function extractReferences(content) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex) || [];
  return matches.map(url => url.replace(/[),.\]>]+$/, '')); // Clean trailing punctuation
}


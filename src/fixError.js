/**
 * Main error handler - captures error and requests AI analysis
 */

import { getConfig } from './init.js';
import { callOpenAI, parseAIResponse } from './openaiCurl.js';
import { logErrorAnalysis, logAnalysisFailure } from './logger.js';

/**
 * Analyze an error using OpenAI and display results
 * @param {Error|string} error - Error object or error message
 * @param {Object} [options] - Optional configuration
 * @param {boolean} [options.silent=false] - If true, returns analysis without logging
 * @returns {Promise<Object|null>} Analysis object if silent=true, null otherwise
 */
export async function fixError(error, options = {}) {
  try {
    // Get global configuration
    const config = getConfig();

    // Normalize error input
    const errorObj = normalizeError(error);
    const errorMessage = errorObj.message || 'Unknown error';
    const stackTrace = errorObj.stack || 'No stack trace available';

    // Call OpenAI API
    let aiResponse;
    let lastError;
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        aiResponse = await callOpenAI(
          config.apiKey,
          config.model,
          errorMessage,
          stackTrace,
          config.timeout
        );
        break; // Success, exit retry loop
      } catch (err) {
        lastError = err;
        if (attempt < config.maxRetries) {
          // Wait before retry (exponential backoff)
          await sleep(1000 * Math.pow(2, attempt));
        }
      }
    }

    if (!aiResponse) {
      throw lastError || new Error('Failed to get response from OpenAI');
    }

    // Parse AI response
    const analysis = parseAIResponse(aiResponse.content);

    // Log results or return silently
    if (options.silent) {
      return {
        error: {
          name: errorObj.name,
          message: errorMessage,
          stack: stackTrace
        },
        analysis,
        model: aiResponse.model,
        usage: aiResponse.usage
      };
    } else {
      logErrorAnalysis(errorObj, analysis);
      return null;
    }

  } catch (analysisError) {
    // Handle failures gracefully
    const errorObj = normalizeError(error);
    
    if (options.silent) {
      return {
        error: {
          name: errorObj.name,
          message: errorObj.message,
          stack: errorObj.stack
        },
        analysis: null,
        analysisError: analysisError.message
      };
    } else {
      logAnalysisFailure(errorObj, analysisError.message);
      return null;
    }
  }
}

/**
 * Normalize error input to Error object
 * @private
 */
function normalizeError(error) {
  // Already an Error object
  if (error instanceof Error) {
    return error;
  }

  // String message
  if (typeof error === 'string') {
    const err = new Error(error);
    err.name = 'Error';
    return err;
  }

  // Object with message property
  if (error && typeof error === 'object' && error.message) {
    const err = new Error(error.message);
    err.name = error.name || 'Error';
    err.stack = error.stack || err.stack;
    return err;
  }

  // Fallback
  const err = new Error(String(error));
  err.name = 'Error';
  return err;
}

/**
 * Sleep utility for retry delays
 * @private
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrap a function with automatic error handling
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function
 */
export function wrapWithErrorHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      await fixError(error);
      throw error; // Re-throw after analysis
    }
  };
}

/**
 * Create a global error handler for uncaught exceptions
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.exitOnError=false] - Exit process after handling
 */
export function setupGlobalHandler(options = {}) {
  const { exitOnError = false } = options;

  process.on('uncaughtException', async (error) => {
    console.error('\n🚨 Uncaught Exception:');
    await fixError(error);
    
    if (exitOnError) {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('\n🚨 Unhandled Promise Rejection:');
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await fixError(error);
    
    if (exitOnError) {
      process.exit(1);
    }
  });

  console.log('✅ Global error handlers registered');
}


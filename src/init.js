/**
 * Global configuration storage for ai-error-solution
 * Stores API key and model settings after initialization
 */

// Global configuration object
let config = {
  apiKey: null,
  model: 'gpt-4o-mini',
  timeout: 30000, // 30 seconds default timeout
  maxRetries: 1,
  initialized: false
};

/**
 * Initialize the ai-error-solution package with OpenAI credentials
 * @param {Object} options - Configuration options
 * @param {string} options.apiKey - OpenAI API key (required)
 * @param {string} [options.model='gpt-4o-mini'] - OpenAI model to use
 * @param {number} [options.timeout=30000] - API request timeout in milliseconds
 * @param {number} [options.maxRetries=1] - Maximum number of retry attempts
 * @throws {Error} If apiKey is not provided
 */
export function initAutoErrorSolution(options = {}) {
  if (!options.apiKey) {
    throw new Error('ai-error-solution: API key is required. Please provide your OpenAI API key.');
  }

  config.apiKey = options.apiKey;
  config.model = options.model || 'gpt-4o-mini';
  config.timeout = options.timeout || 30000;
  config.maxRetries = options.maxRetries !== undefined ? options.maxRetries : 1;
  config.initialized = true;

  console.log('✅ ai-error-solution initialized successfully');
}

/**
 * Get the current configuration
 * @returns {Object} Current configuration
 * @throws {Error} If package is not initialized
 */
export function getConfig() {
  if (!config.initialized) {
    throw new Error(
      'ai-error-solution: Package not initialized. Please call initAutoErrorSolution() first with your API key.'
    );
  }
  return { ...config };
}

/**
 * Check if package is initialized
 * @returns {boolean}
 */
export function isInitialized() {
  return config.initialized;
}

/**
 * Reset configuration (useful for testing)
 * @private
 */
export function resetConfig() {
  config = {
    apiKey: null,
    model: 'gpt-4o-mini',
    timeout: 30000,
    maxRetries: 1,
    initialized: false
  };
}


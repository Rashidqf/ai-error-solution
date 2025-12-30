/**
 * ai-error-solution - Lightweight error analysis using OpenAI
 * 
 * A minimal, production-ready package that captures JavaScript/Node.js runtime errors
 * and provides AI-powered explanations, causes, fixes, and documentation links.
 * 
 * @module ai-error-solution
 * @version 1.0.0
 */

export { initAutoErrorSolution, isInitialized } from './init.js';
export { fixError, wrapWithErrorHandler, setupGlobalHandler } from './fixError.js';
export { log } from './logger.js';

// Package metadata
export const version = '1.0.0';
export const name = 'ai-error-solution';


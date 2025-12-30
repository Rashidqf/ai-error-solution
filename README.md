# 🤖 ai-error-solution

**Lightweight, AI-powered error analysis for Node.js**

Automatically capture runtime errors and get instant AI-generated explanations, causes, fixes, and documentation links—all in your console.

[![npm version](https://img.shields.io/npm/v/ai-error-solution.svg)](https://www.npmjs.com/package/ai-error-solution)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## ✨ Features

- 🎯 **Zero Dependencies** - Uses native `curl` via `child_process` (no heavy HTTP libraries)
- 🚀 **Lightweight** - Minimal package size, maximum efficiency
- 🧠 **AI-Powered Analysis** - Leverages OpenAI to explain errors in plain English
- 🔐 **Privacy-First** - No telemetry, no data storage, direct API calls only
- ⚡ **ESM Native** - Modern ES Module support
- 🎨 **Beautiful Output** - Clean, colorized console logging
- 🛠️ **Production-Ready** - Timeout handling, retries, graceful failures

---

## 📦 Installation

```bash
npm install ai-error-solution
```

**Requirements:**
- Node.js 18 or higher
- `curl` installed on your system (usually pre-installed on macOS/Linux, available on Windows)
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

---

## 🚀 Quick Start

### 1. Initialize Once

Set up the package with your OpenAI API key in your main application file:

```javascript
import { initAutoErrorSolution, fixError } from 'ai-error-solution';

// Initialize with your API key (do this once at app startup)
initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini' // Optional: defaults to gpt-4o-mini
});
```

### 2. Use Anywhere

Wrap your error handling with `fixError()`:

```javascript
try {
  // Your code that might throw errors
  const result = riskyFunction();
} catch (err) {
  // Get AI-powered analysis
  await fixError(err);
}
```

### 3. Enjoy AI-Powered Debugging! 🎉

You'll see beautiful, formatted output like this:

```
================================================================================
❌ Error Detected: TypeError
Cannot read property 'map' of undefined

🧠 AI Explanation:
  This error occurs when you try to call the .map() method on a variable
  that is undefined. The JavaScript engine expected an array but received
  undefined instead.

⚠️  Likely Causes:
  - The variable was never initialized
  - An async function hasn't resolved yet
  - The API response didn't include expected data

🔧 Suggested Fixes:
  - Add optional chaining: data?.map(...)
  - Provide a default value: (data || []).map(...)
  - Check existence first: if (data) { data.map(...) }

📚 References:
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors
  - https://javascript.info/optional-chaining

💡 Note: AI suggestions may not be 100% accurate. Always verify fixes before applying.
================================================================================
```

---

## 📖 API Reference

### `initAutoErrorSolution(options)`

Initialize the package with your OpenAI credentials. **Must be called before using `fixError()`.**

**Parameters:**
- `options.apiKey` (string, **required**) - Your OpenAI API key
- `options.model` (string, optional) - OpenAI model to use (default: `'gpt-4o-mini'`)
- `options.timeout` (number, optional) - API request timeout in milliseconds (default: `30000`)
- `options.maxRetries` (number, optional) - Maximum retry attempts (default: `1`)

**Example:**
```javascript
initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  timeout: 30000,
  maxRetries: 2
});
```

---

### `fixError(error, options)`

Analyze an error using OpenAI and display formatted results.

**Parameters:**
- `error` (Error | string, **required**) - Error object or error message
- `options.silent` (boolean, optional) - Return analysis without logging (default: `false`)

**Returns:**
- `Promise<null>` - When logging to console (default)
- `Promise<Object>` - When `silent: true`, returns analysis object

**Example:**
```javascript
// Standard usage (logs to console)
try {
  dangerousCode();
} catch (err) {
  await fixError(err);
}

// Silent mode (returns data)
const analysis = await fixError(err, { silent: true });
console.log(analysis.analysis.explanation);
```

---

### `wrapWithErrorHandler(fn)`

Wrap a function with automatic error handling.

**Parameters:**
- `fn` (Function) - Function to wrap

**Returns:**
- `Function` - Wrapped function that automatically calls `fixError()` on errors

**Example:**
```javascript
const safeFunction = wrapWithErrorHandler(async () => {
  // Code that might throw
  return await riskyOperation();
});

await safeFunction(); // Errors automatically analyzed
```

---

### `setupGlobalHandler(options)`

Register global handlers for uncaught exceptions and unhandled promise rejections.

**Parameters:**
- `options.exitOnError` (boolean, optional) - Exit process after handling error (default: `false`)

**Example:**
```javascript
setupGlobalHandler({ exitOnError: true });

// Now all uncaught errors will be automatically analyzed
throw new Error('This will be caught and analyzed');
```

---

## 🔐 Environment Setup

### Using .env file (Recommended)

1. Install dotenv:
```bash
npm install dotenv
```

2. Create `.env`:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

3. Load in your app:
```javascript
import 'dotenv/config';
import { initAutoErrorSolution } from 'ai-error-solution';

initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY
});
```

### Using environment variables directly

```bash
# Linux/macOS
export OPENAI_API_KEY=sk-your-api-key-here
node app.js

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-api-key-here"
node app.js

# Windows (CMD)
set OPENAI_API_KEY=sk-your-api-key-here
node app.js
```

---

## 🎯 Use Cases

### Express.js Error Middleware

```javascript
import express from 'express';
import { initAutoErrorSolution, fixError } from 'ai-error-solution';

const app = express();

initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY
});

// Error handling middleware
app.use(async (err, req, res, next) => {
  await fixError(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### Async Function Wrapper

```javascript
const fetchUserData = wrapWithErrorHandler(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Automatically analyzes errors
await fetchUserData(123);
```

### Global Error Catching

```javascript
import { initAutoErrorSolution, setupGlobalHandler } from 'ai-error-solution';

initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY
});

setupGlobalHandler({ exitOnError: false });

// All uncaught errors are now automatically analyzed
```

---

## ⚠️ Important Notes

### Disclaimers

- **AI Accuracy**: AI-generated suggestions may not always be correct. Always verify fixes before applying them to production code.
- **API Costs**: Each error analysis makes an API call to OpenAI, which incurs costs based on your OpenAI plan.
- **Privacy**: Error messages and stack traces are sent to OpenAI for analysis. Do not use in production if your errors may contain sensitive data.
- **curl Dependency**: This package requires `curl` to be installed and accessible in your system PATH.

### Best Practices

- ✅ Use in **development** and **debugging** environments
- ✅ Store API keys in environment variables (never commit them)
- ✅ Set reasonable timeout values for production environments
- ✅ Review AI suggestions before implementing fixes

---

## 🏗️ Architecture

This package is built with **zero dependencies** and uses:

- **ESM** - Modern ES Module system
- **Native curl** - No heavy HTTP libraries (axios, node-fetch, etc.)
- **child_process** - Native Node.js process execution
- **Middleware pattern** - One-time API key initialization

**Why curl?**
- Minimal package size
- No dependency vulnerabilities
- Universal availability across platforms
- Direct OpenAI API communication

---

## 🛠️ Troubleshooting

### "curl is not installed or not in PATH"

**Solution**: Install curl on your system.

```bash
# macOS (via Homebrew)
brew install curl

# Ubuntu/Debian
sudo apt-get install curl

# Windows (via Chocolatey)
choco install curl

# Windows (built-in on Windows 10+)
# curl should already be available
```

### "Package not initialized"

**Solution**: Make sure you call `initAutoErrorSolution()` before using `fixError()`.

### "OpenAI API request timed out"

**Solution**: Increase timeout or check your internet connection.

```javascript
initAutoErrorSolution({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000 // 60 seconds
});
```

### "OpenAI API error: Invalid API key"

**Solution**: Verify your API key is correct and has sufficient credits.

---

## 📄 License

MIT © [Your Name]

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/ai-error-solution)
- [GitHub Repository](https://github.com/Rashidqf/ai-error-solution)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Report Issues](https://github.com/Rashidqf/ai-error-solution/issues)

---


## 🌟 Why This Package?

Most error analysis tools either:
- Require heavy dependencies (bloated package size)
- Send data to third-party services (privacy concerns)
- Auto-modify code (risky in production)

**ai-error-solution** is different:
- ✅ **Lightweight** - No dependencies, tiny package size
- ✅ **Private** - Direct API calls, no intermediaries
- ✅ **Safe** - Never modifies your code
- ✅ **Transparent** - Open source, audit the code yourself

---

**Made with ❤️ for developers who value simplicity and privacy**

*Star ⭐ this project if you find it helpful!*


# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-12-31

### Fixed
- Removed self-dependency issue in package.json
- Cleaned up unnecessary documentation files
- Package optimization

### Changed
- Streamlined package structure for npm distribution
- Added author information to package.json

---

## [1.0.0] - 2025-12-31

### Added
- Initial release of ai-error-solution
- Core error handling with `fixError()` function
- OpenAI integration using native curl (zero dependencies)
- Middleware pattern with `initAutoErrorSolution()` for one-time API key setup
- Beautiful console logging with colors and emojis
- Support for ESM (ES Modules)
- Error analysis with AI-powered:
  - Plain-English explanations
  - Likely causes identification
  - Suggested fixes with code snippets
  - Relevant documentation links
- Timeout handling and retry mechanism
- Silent mode for programmatic access to analysis results
- Function wrapper utility `wrapWithErrorHandler()`
- Global error handler setup with `setupGlobalHandler()`
- Graceful failure handling when API calls fail
- Comprehensive README with examples
- MIT License
- Publishing guide

### Technical Details
- Node.js 18+ support
- Zero npm dependencies
- Uses native `child_process` with curl
- ESM-first architecture
- Production-ready error handling
- Privacy-focused (no telemetry, no data storage)

### Documentation
- Complete API reference
- Usage examples
- Environment setup guide
- Troubleshooting section
- Best practices and disclaimers

---

## [Unreleased]

### Planned Features
- TypeScript type definitions (.d.ts files)
- Support for custom AI prompts
- Batch error analysis
- Local caching of similar errors
- Support for other LLM providers (Anthropic, etc.)
- Configuration file support (.autoerrorrc)

---

## Version History

- **1.1.1** (2025-12-31) - Bug fixes and optimization
- **1.0.0** (2025-12-31) - Initial release

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Support

For issues and questions, please visit:
- GitHub Issues: https://github.com/Rashidqf/ai-error-solution/issues
- npm Page: https://www.npmjs.com/package/ai-error-solution


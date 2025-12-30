# 📦 Publishing Guide - Dual Registry Setup

Your package is configured to publish to **both npm and GitHub Packages**!

---

## 🚀 Quick Publish (Both Registries)

Run this single command to publish to both npm AND GitHub Packages:

```powershell
.\publish-both.ps1
```

This will:
1. ✅ Publish to npm as: `ai-error-solution`
2. ✅ Publish to GitHub Packages as: `@rashidqf/ai-error-solution`
3. ✅ Automatically restore original package.json

---

## 📋 Individual Publishing

### Publish to npm only:
```powershell
npm run publish:npm
```
or
```powershell
npm publish --registry=https://registry.npmjs.org/
```

### Publish to GitHub Packages only:
```powershell
.\publish-github.ps1
```

---

## ⚙️ How It Works

### npm (Main Registry)
- **Package name**: `ai-error-solution` (unscoped)
- **Install**: `npm install ai-error-solution`
- **Registry**: https://registry.npmjs.org/

### GitHub Packages
- **Package name**: `@rashidqf/ai-error-solution` (scoped - required by GitHub)
- **Install**: `npm install @rashidqf/ai-error-solution --registry=https://npm.pkg.github.com`
- **Registry**: https://npm.pkg.github.com

**Why different names?**
- npm allows unscoped names (ai-error-solution)
- GitHub Packages REQUIRES scoped names (@rashidqf/ai-error-solution)
- Both packages are identical, just in different registries!

---

## 🔑 Authentication

### For npm:
```powershell
npm login --registry=https://registry.npmjs.org/
```

### For GitHub Packages:
```powershell
npm login --registry=https://npm.pkg.github.com/
```
- Username: `rashidqf`
- Password: Your GitHub Personal Access Token (with `write:packages` permission)
- Email: Your email

---

## 📊 After Publishing

### Check Your Packages:

**npm:**
- View at: https://www.npmjs.com/package/ai-error-solution
- Users install: `npm install ai-error-solution`

**GitHub Packages:**
- View at: https://github.com/Rashidqf?tab=packages
- Users install: `npm install @rashidqf/ai-error-solution --registry=https://npm.pkg.github.com`

---

## 🔄 Workflow for Updates

1. **Make your changes**
2. **Update version**: 
   ```powershell
   npm version patch  # or minor/major
   ```
3. **Update CHANGELOG.md**
4. **Publish to both**:
   ```powershell
   .\publish-both.ps1
   ```

Done! 🎉

---

## ⚠️ Important Notes

1. **Version must be unique** - Can't republish same version
2. **Always commit before publishing** - Recommended for safety
3. **GitHub token** - Must have `write:packages`, `read:packages`, `delete:packages` permissions
4. **Package names are preserved** - Scripts handle naming automatically

---

## 🛠️ Troubleshooting

### "403 Forbidden - You cannot publish over previously published version"
**Solution**: Bump the version number first
```powershell
npm version patch
```

### "404 Not Found" on GitHub Packages
**Solution**: Make sure you're logged in to GitHub registry
```powershell
npm login --registry=https://npm.pkg.github.com/
```

### Script execution error
**Solution**: Enable script execution in PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📁 Files Added

- `publish-both.ps1` - Publishes to both registries
- `publish-github.ps1` - Publishes to GitHub Packages only
- `.npmrc` - Registry configuration
- `PUBLISH_GUIDE.md` - This file

---

**Happy Publishing! 🚀**


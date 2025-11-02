#!/bin/bash
# Clear Angular, Node, and project build caches

echo "🧹 Clearing Angular cache..."
npx ng cache clean || rm -rf .angular/cache

echo "🧹 Removing dist/ build output..."
rm -rf dist/

echo "🧹 Removing Node modules and lock files..."
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml

echo "🧹 Cleaning npm cache..."
npm cache clean --force

echo "✅ Cache cleared successfully."
echo "⚡ Run 'npm install' to reinstall dependencies."



# 🔧 Usage

# Save this script in your project root as clear-cache.sh.

# Make it executable:

# chmod +x clear-cache.sh


# Run it:

# ./clear-cache.sh

#!/bin/bash

# Script to deploy the Personal Finance Course application to Cloudflare Pages
# Created: April 5, 2025

echo "Preparing to deploy Personal Finance Course Application to Cloudflare Pages..."
echo "----------------------------------------------"

# Navigate to project directory
cd /home/ubuntu/finance_app

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Build the application
echo "Building the application for production..."
pnpm build

# Check if Wrangler is installed
if ! command -v wrangler &> /dev/null; then
  echo "Installing Wrangler CLI..."
  npm install -g wrangler
fi

echo "----------------------------------------------"
echo "To deploy to Cloudflare Pages, run the following command:"
echo "wrangler pages deploy dist"
echo ""
echo "You will be prompted to log in to your Cloudflare account if not already logged in."
echo "This will create a new deployment on Cloudflare Pages."
echo "----------------------------------------------"

# Provide instructions for setting up GitHub integration
echo "Alternative: GitHub Integration Setup"
echo "1. Push this code to a GitHub repository"
echo "2. Log in to Cloudflare Dashboard"
echo "3. Navigate to Pages"
echo "4. Click 'Create a project'"
echo "5. Select 'Connect to Git'"
echo "6. Select your repository"
echo "7. Configure build settings:"
echo "   - Build command: pnpm build"
echo "   - Build output directory: dist"
echo "8. Click 'Save and Deploy'"
echo "----------------------------------------------"

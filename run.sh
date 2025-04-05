#!/bin/bash

# Script to run the Personal Finance Course application
# Created: April 5, 2025

echo "Starting Personal Finance Course Application..."
echo "----------------------------------------------"

# Navigate to project directory
cd /home/ubuntu/finance_app

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! "$(ls -A node_modules)" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Start the development server
echo "Starting development server..."
echo "The application will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------------"

# Run the development server
pnpm dev

# Cloudflare Pages Deployment Guide

This guide provides detailed instructions for deploying the Personal Finance Course application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Git installed on your local machine (for GitHub integration option)
- Node.js and pnpm installed

## Option 1: Direct Deployment with Wrangler CLI

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 2: Authenticate with Cloudflare
```bash
wrangler login
```
This will open a browser window where you can log in to your Cloudflare account.

### Step 3: Build the Application
```bash
cd /home/ubuntu/finance_app
pnpm build
```

### Step 4: Deploy to Cloudflare Pages
```bash
wrangler pages deploy dist
```

During the deployment process, you'll be prompted to:
1. Name your project (e.g., "finance-course")
2. Select a production branch (default is "main")

### Step 5: Configure Custom Domain (Optional)
1. Go to the Cloudflare Dashboard
2. Navigate to Pages > Your Project
3. Click on "Custom domains"
4. Follow the instructions to add your domain

## Option 2: GitHub Integration

### Step 1: Create a GitHub Repository
1. Create a new repository on GitHub
2. Push the code to your repository:
```bash
cd /home/ubuntu/finance_app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/finance-course.git
git push -u origin main
```

### Step 2: Connect to Cloudflare Pages
1. Log in to your Cloudflare Dashboard
2. Navigate to Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Authorize Cloudflare to access your GitHub account
6. Select your repository

### Step 3: Configure Build Settings
Configure the following settings:
- **Project name**: finance-course (or your preferred name)
- **Production branch**: main
- **Build command**: pnpm build
- **Build output directory**: dist
- **Environment variables**: (none required for basic deployment)

### Step 4: Deploy
Click "Save and Deploy" to start the deployment process.

## Monitoring and Updates

### Viewing Deployment Status
1. Go to the Cloudflare Dashboard
2. Navigate to Pages > Your Project
3. Click on "Deployments" to see the status of your deployments

### Updating Your Application
For direct deployment with Wrangler:
1. Make changes to your code
2. Run `pnpm build`
3. Run `wrangler pages deploy dist`

For GitHub integration:
1. Push changes to your GitHub repository
2. Cloudflare will automatically deploy the updates

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in the Cloudflare Dashboard
   - Ensure all dependencies are correctly specified in package.json
   - Verify the build command is correct

2. **Deployment Timeouts**
   - Large applications may time out during deployment
   - Try reducing the build size or optimizing assets

3. **Authentication Issues**
   - Run `wrangler logout` and then `wrangler login` to refresh authentication
   - Check your Cloudflare account permissions

For additional help, refer to the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).

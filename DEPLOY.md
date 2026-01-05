# Quick Deployment Guide for Cloudflare Pages

## Prerequisites
- A Cloudflare account (free tier works)
- Your code in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Cloudflare Dashboard (Easiest)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare**
   - Go to https://dash.cloudflare.com/
   - Select "Pages" from the sidebar
   - Click "Create a project"
   - Click "Connect to Git"
   - Select your repository

3. **Configure Build**
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave as default)

4. **Environment Variables** (Optional)
   - Add `NODE_VERSION` = `18` if needed

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment (usually 1-2 minutes)
   - Get your `.pages.dev` URL

### Option 2: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login**
   ```bash
   wrangler login
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   wrangler pages deploy dist --project-name=set-trainer
   ```

### Option 3: Direct Upload (No Git Required)

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to Cloudflare**
   - Go to https://dash.cloudflare.com/
   - Select "Pages"
   - Click "Create a project"
   - Choose "Upload assets"
   - Drag the `dist/` folder
   - Name your project
   - Click "Deploy"

## Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to add your domain

## Automatic Deployments

Once connected to Git, Cloudflare Pages will automatically:
- Deploy every push to your main branch
- Create preview deployments for pull requests
- Show deployment logs and status

## Troubleshooting

If build fails:
- Check build logs in Cloudflare dashboard
- Ensure `NODE_VERSION` is set to 18 or higher
- Verify build command is `npm run build`
- Confirm output directory is `dist`

## Features Enabled

✅ Free SSL certificate
✅ CDN (Cloudflare global network)
✅ Automatic HTTPS redirect
✅ Unlimited bandwidth (within fair use)
✅ Preview deployments for branches
✅ Rollback to previous deployments

## Cost

**FREE** - Cloudflare Pages free tier includes:
- Unlimited sites
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month

Enjoy your SET Game Trainer! 🎮

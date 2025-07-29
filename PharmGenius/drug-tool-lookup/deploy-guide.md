# Deploy to Vercel

## Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd d:\microservices\drug-tool-lookup
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: **drug-tool-lookup**
   - Directory: **.**
   - Override settings? **N**

## Alternative: GitHub Deploy

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to vercel.com
   - Import from GitHub
   - Select your repository
   - Deploy

## URLs after deployment:
- Your app will be available at: `https://drug-tool-lookup.vercel.app`
- API endpoints: `https://drug-tool-lookup.vercel.app/api/...`
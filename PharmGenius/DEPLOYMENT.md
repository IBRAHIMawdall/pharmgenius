# PharmGenius Deployment Guide

## Quick Deployment to Vercel

### Prerequisites
- Node.js installed
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free)

### Steps

1. **Prepare the code**
   ```bash
   cd PharmGenius
   npm install
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/pharmgenius.git
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your PharmGenius repository
   - Click "Deploy"

4. **Configuration**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Environment Variables (if needed)
No environment variables are required for the basic setup.

### Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features Included

- ✅ Daman Insurance Coverage Lookup
- ✅ ICD-10 Code Finder
- ✅ Drug Interaction Checker
- ✅ Pregnancy Safety Categories
- ✅ Modern Responsive UI
- ✅ Dark/Light Mode
- ✅ Vercel Serverless Functions

## API Endpoints

- `/api/daman-formulary` - Insurance coverage data
- `/api/icd10` - ICD-10 codes for medications
- `/api/drug-interactions` - Drug interaction checker
- `/api/pregnancy-categories` - Pregnancy safety information

## Support

For technical support or questions, contact the development team at Burjeel Hospital, Abu Dhabi.
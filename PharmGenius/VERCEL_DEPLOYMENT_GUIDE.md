# Vercel Deployment Guide for PharmGenius

## ✅ Current Configuration Status

Your project is now optimized for Vercel deployment with the following improvements:

### 1. **vercel.json** ✅
- Serverless function configuration
- Extended timeout (30 seconds) for large file processing
- Proper environment variable mapping
- All routes directed to server.js

### 2. **server.js** ✅
- Better error handling for missing files
- Graceful degradation when data files aren't available
- Health check endpoint (`/api/health`)
- Improved Cosmos DB initialization
- File existence checks before reading

### 3. **package.json** ✅
- Proper build scripts
- Node.js engine specification
- All dependencies included

## 🚀 Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "Optimize for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your PharmGenius repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables:
```
COSMOS_DB_ENDPOINT = your-actual-endpoint
COSMOS_DB_KEY = your-actual-key
COSMOS_DB_DATABASE = pharmgenius
COSMOS_DB_CONTAINER = drugs
```

### Step 4: Deploy
Click "Deploy" and monitor the build logs.

## 🔧 Troubleshooting Common Errors

### Error 1: "Function timeout"
**Solution**: The `vercel.json` now includes a 30-second timeout for large file processing.

### Error 2: "File not found"
**Solution**: The server now gracefully handles missing files and continues with empty datasets.

### Error 3: "Build failed"
**Check**:
- All dependencies are in `package.json`
- Build command is correct: `npm run vercel-build`
- Node.js version is compatible (18.x)

### Error 4: "Environment variables not found"
**Solution**: Ensure all environment variables are set in Vercel dashboard.

## 🧪 Testing Your Deployment

### Health Check
Visit: `https://your-app.vercel.app/api/health`
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "dataLoaded": {
    "uaeDrugs": 0,
    "icd10Codes": 0,
    "damanFormulary": 0,
    "cosmosDb": true
  }
}
```

### API Endpoints
- `/api/daman-service/coverage?drug=aspirin`
- `/api/drug-service/search?query=paracetamol`
- `/api/icd10/search?q=diabetes`

## 📊 Expected Behavior

### Data Loading
- **UAE Drugs**: Will load if `UAE drug list.csv` is available
- **Daman Formulary**: Will load if `public/daman-formulary.json` is available
- **ICD-10 Codes**: Will load if `public/icd10-data.json` is available
- **Cosmos DB**: Will connect if environment variables are set

### Fallback Behavior
If data files are missing, the app will:
- Continue running with empty datasets
- Log warnings but not crash
- Return appropriate "not found" responses

## 🎯 Next Steps

1. **Deploy and test** the health endpoint
2. **Monitor logs** in Vercel dashboard
3. **Test API endpoints** with sample queries
4. **Verify frontend** loads correctly

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Test the health endpoint
3. Verify environment variables
4. Check file paths and permissions

Your application is now ready for Vercel deployment! 🚀 
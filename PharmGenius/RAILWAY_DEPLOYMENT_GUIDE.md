# Railway Deployment Guide for PharmGenius

## 🚂 **Railway Deployment - Simple & Reliable**

Railway is an excellent alternative to Vercel that's perfect for full-stack Node.js applications like PharmGenius.

## ✅ **Current Configuration Status**

Your project is now configured for Railway deployment:

### 1. **railway.json** ✅
- Automatic build configuration
- Health check endpoint
- Restart policy for reliability

### 2. **Procfile** ✅
- Tells Railway to run `npm start`

### 3. **package.json** ✅
- `postinstall` script builds the frontend
- All dependencies moved to main dependencies
- Node.js 18.x engine specification

### 4. **server.js** ✅
- Health check endpoint at `/api/health`
- Proper error handling
- Static file serving

## 🚀 **Deployment Steps**

### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway

#### Option A: Using Railway CLI (Recommended)
1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy**:
   ```bash
   railway up
   ```

#### Option B: Using Railway Dashboard
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your PharmGenius repository
5. Railway will automatically detect the configuration

### Step 3: Configure Environment Variables
In Railway dashboard:
1. Go to your project
2. Click on "Variables" tab
3. Add these environment variables:
   ```
   COSMOS_DB_ENDPOINT = your-actual-endpoint
   COSMOS_DB_KEY = your-actual-key
   COSMOS_DB_DATABASE = pharmgenius
   COSMOS_DB_CONTAINER = drugs
   NODE_ENV = production
   ```

### Step 4: Deploy
Railway will automatically:
- Install dependencies
- Run `npm run build` (via postinstall)
- Start your server with `npm start`
- Provide you with a public URL

## 🔧 **What Happens During Deployment**

1. **Build Phase**: Railway runs `npm install` which triggers `postinstall` script
2. **Frontend Build**: Vite builds your React app to `dist/` folder
3. **Server Start**: `npm start` runs your Express server
4. **Health Check**: Railway monitors `/api/health` endpoint
5. **Auto-restart**: If the app fails, Railway restarts it automatically

## 🧪 **Testing Your Deployment**

### Health Check
Visit: `https://your-app.railway.app/api/health`
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

## 💰 **Railway Pricing**

- **Free Tier**: $5 credit monthly (enough for small projects)
- **Pro Plan**: Pay-as-you-go starting at $5/month
- **Team Plan**: $20/month per user

## 🎯 **Advantages of Railway over Vercel**

1. **Full-stack friendly**: Better for Node.js apps with large files
2. **Persistent storage**: Can handle large data files better
3. **Custom domains**: Free custom domains
4. **Database integration**: Easy to add databases
5. **Better for APIs**: Optimized for backend services

## 🔧 **Troubleshooting**

### Issue 1: Build fails
**Solution**: Check Railway logs for dependency issues

### Issue 2: Environment variables not found
**Solution**: Ensure all variables are set in Railway dashboard

### Issue 3: Health check fails
**Solution**: Check if `/api/health` endpoint is working

### Issue 4: Large files not loading
**Solution**: Railway handles large files better than Vercel

## 📊 **Monitoring**

Railway provides:
- Real-time logs
- Performance metrics
- Automatic scaling
- Health monitoring

## 🎉 **Next Steps**

1. **Deploy to Railway** using the steps above
2. **Test all endpoints** to ensure functionality
3. **Set up custom domain** (optional)
4. **Monitor performance** in Railway dashboard

Your PharmGenius application will be live and reliable on Railway! 🚂✨ 
# Deploy to Render

## Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your PharmGenius repository
   - Render will auto-detect settings from `render.yaml`

3. **Add Environment Variables**
   In Render dashboard → Environment:
   - `COSMOS_DB_ENDPOINT` = your-cosmos-endpoint
   - `COSMOS_DB_KEY` = your-cosmos-key
   - `COSMOS_DB_DATABASE` = pharmgenius
   - `COSMOS_DB_CONTAINER` = drugs

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your app will be live at: `https://pharmgenius.onrender.com`

## Build Settings (Auto-detected):
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Node Version: 18.x
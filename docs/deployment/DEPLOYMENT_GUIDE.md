# 🚀 Inventory Management System - Railway Deployment Guide

## Quick Deployment to Railway (Recommended)

### Step 1: Prepare Your Repository
1. **Push your code to GitHub** (if not already done)
2. **Ensure all dependencies are properly installed**

### Step 2: Deploy to Railway

#### Option A: Using Railway Web Interface (Easiest)
1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your inventory-management-system repository**

#### Option B: Using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Step 3: Add PostgreSQL Database
1. **In Railway dashboard, click "New Service"**
2. **Select "Database" → "PostgreSQL"**
3. **Railway will automatically provision a PostgreSQL database**

### Step 4: Configure Environment Variables
In Railway dashboard, add these environment variables:

#### Backend Environment Variables:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://[railway-provided-url]
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-url.railway.app
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

#### Frontend Environment Variables:
```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
NODE_ENV=production
```

### Step 5: Deploy Services

#### Deploy Backend:
1. **Create new service for backend**
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository**
4. **Set root directory to `/backend`**
5. **Add environment variables**
6. **Deploy**

#### Deploy Frontend:
1. **Create new service for frontend**
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository**
4. **Set root directory to `/frontend`**
5. **Add environment variables**
6. **Deploy**

### Step 6: Access Your Application
1. **Railway will provide URLs for each service**
2. **Frontend URL**: `https://your-frontend-url.railway.app`
3. **Backend URL**: `https://your-backend-url.railway.app`

## 🔐 Default Login Credentials
- **Email**: `admin@inventory.com`
- **Password**: `admin123`

## 📊 Railway Dashboard Features
- **Automatic deployments** from GitHub
- **Built-in PostgreSQL database**
- **SSL certificates** included
- **Custom domains** support
- **Monitoring and logs**
- **Environment variable management**

## 🛠️ Troubleshooting

### If Backend Fails to Start:
1. **Check environment variables**
2. **Verify DATABASE_URL is correct**
3. **Check Railway logs**

### If Frontend Can't Connect to Backend:
1. **Update REACT_APP_API_URL in frontend environment**
2. **Ensure CORS_ORIGIN is set correctly**
3. **Check if backend is running**

### Database Connection Issues:
1. **Verify DATABASE_URL format**
2. **Check if PostgreSQL service is running**
3. **Ensure database migrations run**

## 🎉 Success!
Your Inventory Management System is now deployed and accessible worldwide!

### Next Steps:
1. **Test all features**
2. **Add custom domain (optional)**
3. **Set up monitoring**
4. **Configure backups**

## 📞 Support
- **Railway Documentation**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: Create issue in your repository 
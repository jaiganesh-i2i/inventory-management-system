# 🚀 Inventory Management System - Railway Deployment

## Quick Start (5 Minutes)

### 1. Go to Railway
- Visit: https://railway.app
- Sign up/Login with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `inventory-management-system` repository

### 3. Add PostgreSQL Database
- Click "New Service"
- Select "Database" → "PostgreSQL"
- Railway will auto-provision the database

### 4. Deploy Backend
- Click "New Service"
- Select "Deploy from GitHub repo"
- Choose your repository
- Set **Root Directory** to: `backend`
- Add these environment variables:

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

### 5. Deploy Frontend
- Click "New Service"
- Select "Deploy from GitHub repo"
- Choose your repository
- Set **Root Directory** to: `frontend`
- Add these environment variables:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
NODE_ENV=production
```

### 6. Access Your App
- Railway will provide URLs for each service
- Frontend: `https://your-frontend-url.railway.app`
- Backend: `https://your-backend-url.railway.app`

## 🔐 Login Credentials
- **Email**: `admin@inventory.com`
- **Password**: `admin123`

## ✅ What You Get
- ✅ Full-stack application deployed
- ✅ PostgreSQL database included
- ✅ SSL certificates
- ✅ Automatic deployments
- ✅ Monitoring and logs
- ✅ Custom domains (optional)

## 🎉 Success!
Your Inventory Management System is now live and accessible worldwide!

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway 
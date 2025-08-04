# 🚀 Complete Railway Deployment Guide

## 📋 Overview

This guide will help you deploy both the **Backend API** and **Frontend React App** to Railway.com as separate services.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Database      │
│   Port: 80      │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to [Railway.com](https://railway.com)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Deploy Backend Service

1. **In your Railway project dashboard:**
   - Click "New Service"
   - Select "GitHub Repo"
   - Choose your repository
   - Set **Root Directory** to `/backend`

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=inventory_management
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   JWT_SECRET=<your-super-secret-jwt-key>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=<your-frontend-url>
   LOG_LEVEL=info
   BCRYPT_ROUNDS=12
   ```

3. **Railway will automatically:**
   - Detect `backend/Dockerfile.railway`
   - Build the backend service
   - Deploy it

### Step 3: Add PostgreSQL Database

1. **In your Railway project:**
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will create a PostgreSQL instance

2. **Copy Database Variables:**
   - Go to the PostgreSQL service
   - Click "Connect" → "Variables"
   - Copy the connection details to your backend service environment variables

### Step 4: Deploy Frontend Service

1. **In your Railway project:**
   - Click "New Service"
   - Select "GitHub Repo"
   - Choose your repository
   - Set **Root Directory** to `/frontend`

2. **Configure Environment Variables:**
   ```
   VITE_API_URL=<your-backend-url>
   NODE_ENV=production
   ```

3. **Railway will automatically:**
   - Detect `frontend/Dockerfile`
   - Build the frontend service
   - Deploy it with Nginx

### Step 5: Configure CORS

1. **Get your frontend URL** from the Railway dashboard
2. **Update backend CORS_ORIGIN** with your frontend URL
3. **Redeploy backend** if needed

## 🔧 Configuration Files

### Backend Configuration
- `backend/Dockerfile.railway` - Backend Docker build
- `backend/.dockerignore` - Excludes frontend files
- `backend/railway.json` - Backend Railway config

### Frontend Configuration
- `frontend/Dockerfile` - Frontend Docker build with Nginx
- `frontend/.dockerignore` - Excludes backend files
- `frontend/railway.json` - Frontend Railway config
- `frontend/nginx.conf` - Nginx configuration

## 🌐 URLs and Domains

### Default Railway URLs
- **Backend**: `https://your-backend-service.railway.app`
- **Frontend**: `https://your-frontend-service.railway.app`

### Custom Domains (Optional)
1. Go to your service settings
2. Click "Domains"
3. Add your custom domain
4. Update CORS settings accordingly

## 🔍 Verification Checklist

### Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Frontend Health Check
```bash
curl https://your-frontend-url.railway.app/
# Should return the React app HTML
```

### API Test
```bash
curl -X POST https://your-backend-url.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Railway logs for specific errors
   - Verify all dependencies are in package.json
   - Ensure Dockerfile paths are correct

2. **Database Connection**
   - Verify database environment variables
   - Check PostgreSQL service is running
   - Ensure SSL configuration is correct

3. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend URL
   - Check that both services are accessible

4. **Frontend Can't Connect to Backend**
   - Verify VITE_API_URL is set correctly
   - Check backend is running and accessible
   - Ensure CORS is configured properly

### Logs and Monitoring

- **Railway Dashboard**: View real-time logs for each service
- **Health Checks**: Monitor service health automatically
- **Metrics**: Track performance and usage

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data
   - Use Railway's environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **Application Security**
   - Use HTTPS in production
   - Implement proper CORS policies
   - Validate all inputs

## 📊 Monitoring and Maintenance

### Health Monitoring
- Railway provides built-in health checks
- Monitor application logs regularly
- Set up alerts for service failures

### Updates and Deployments
- Railway automatically deploys on git push
- Use feature branches for testing
- Monitor deployment logs for issues

## 🎯 Success Criteria

✅ **Deployment Successful When:**
- Both services build and deploy without errors
- Health checks pass for both services
- Database connection established
- Frontend can connect to backend API
- Admin login works (admin/admin123)
- All pages load without errors
- No critical errors in logs

## 📞 Support

- **Railway Documentation**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: For application-specific issues

---

## 🚀 Quick Deploy Commands

```bash
# Push to GitHub (triggers Railway deployment)
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# Check deployment status
# Go to Railway dashboard and monitor the deployment
```

**Your inventory management system will be live at your Railway URLs!** 🎉 
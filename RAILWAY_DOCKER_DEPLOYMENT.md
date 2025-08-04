# 🐳 Complete Docker Stack Deployment to Railway

## 📋 Overview

This guide will help you deploy your **complete inventory management system** to Railway.com using Docker containers for all three components:

- 🗄️ **PostgreSQL Database** (Railway managed)
- 🔧 **Backend API** (Node.js + Docker)
- 🎨 **Frontend App** (React + Nginx + Docker)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (React +      │◄──►│   (Node.js +    │◄──►│   Database      │
│   Nginx)        │    │   Docker)       │    │   (Railway)     │
│   Port: 80      │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to [Railway.com](https://railway.com)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### Step 2: Add PostgreSQL Database (First Service)

1. **In your Railway project dashboard:**
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will create a PostgreSQL instance automatically

2. **Note the database connection details:**
   - Go to the PostgreSQL service
   - Click "Connect" → "Variables"
   - Copy these values for later use:
     - `DB_HOST`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_PORT` (usually 5432)

### Step 3: Deploy Backend Service

1. **In your Railway project dashboard:**
   - Click "New Service"
   - Select "GitHub Repo"
   - Choose your repository
   - Set **Root Directory** to `/backend`

2. **Configure Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<from-postgres-service>
   DB_PORT=5432
   DB_NAME=inventory_management
   DB_USER=<from-postgres-service>
   DB_PASSWORD=<from-postgres-service>
   JWT_SECRET=<your-super-secret-jwt-key>
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=<will-update-after-frontend>
   LOG_LEVEL=info
   BCRYPT_ROUNDS=12
   ```

3. **Railway will automatically:**
   - Detect `backend/Dockerfile.railway`
   - Build the backend Docker container
   - Deploy it

### Step 4: Deploy Frontend Service

1. **In your Railway project dashboard:**
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
   - Build the frontend Docker container with Nginx
   - Deploy it

### Step 5: Configure CORS and API URL

1. **Get your service URLs from Railway dashboard**
2. **Update Backend CORS_ORIGIN:**
   - Go to your backend service settings
   - Update `CORS_ORIGIN` with your frontend URL
   - Redeploy if needed

3. **Update Frontend API URL:**
   - Go to your frontend service settings
   - Update `VITE_API_URL` with your backend URL
   - Redeploy if needed

## 🔧 Configuration Files

### Backend Configuration
- `backend/Dockerfile.railway` - Backend Docker build
- `backend/.dockerignore` - Excludes frontend files
- `railway.toml` - Root Railway configuration

### Frontend Configuration
- `frontend/Dockerfile` - Frontend Docker build with Nginx
- `frontend/.dockerignore` - Excludes backend files
- `frontend/railway.toml` - Frontend Railway configuration
- `frontend/nginx.conf` - Nginx configuration

## 🌐 Service URLs

### Default Railway URLs
- **Backend**: `https://your-backend-service.railway.app`
- **Frontend**: `https://your-frontend-service.railway.app`
- **Database**: Internal Railway network

### Custom Domains (Optional)
1. Go to your service settings
2. Click "Domains"
3. Add your custom domain
4. Update CORS settings accordingly

## 🔍 Verification Checklist

### 1. Database Connection
```bash
# Check backend logs for database connection
# Should see: "Database connected successfully"
```

### 2. Backend Health Check
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 3. Frontend Health Check
```bash
curl https://your-frontend-url.railway.app/
# Should return the React app HTML
```

### 4. API Authentication Test
```bash
curl -X POST https://your-backend-url.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# Should return JWT tokens
```

### 5. Frontend-Backend Integration
- Open your frontend URL in browser
- Try to log in with admin/admin123
- Check if dashboard loads with data

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failures**
   - Verify database environment variables are correct
   - Check PostgreSQL service is running
   - Ensure SSL configuration is correct

2. **Build Failures**
   - Check Railway logs for specific errors
   - Verify all dependencies are in package.json
   - Ensure Dockerfile paths are correct

3. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend URL
   - Check that both services are accessible
   - Verify CORS configuration in backend

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
- All three services build and deploy without errors
- Health checks pass for all services
- Database connection established
- Frontend can connect to backend API
- Admin login works (admin/admin123)
- All pages load without errors
- No critical errors in logs

## 🚀 Quick Deploy Commands

```bash
# Push to GitHub (triggers Railway deployment)
git add .
git commit -m "Complete Docker stack ready for Railway deployment"
git push origin main

# Check deployment status
# Go to Railway dashboard and monitor the deployment
```

## 📞 Support

- **Railway Documentation**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: For application-specific issues

---

## 🎉 Final Result

After successful deployment, you'll have:
- ✅ **Complete Docker-based application** running on Railway
- ✅ **Scalable architecture** with separate services
- ✅ **Production-ready setup** with health checks and monitoring
- ✅ **Secure database** with Railway-managed PostgreSQL
- ✅ **Modern web application** accessible from anywhere

**Your inventory management system will be live and fully functional!** 🚀 
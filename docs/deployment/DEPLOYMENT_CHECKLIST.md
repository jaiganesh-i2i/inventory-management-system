# Railway Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Docker Configuration
- [x] `backend/Dockerfile.railway` - Simplified Railway Dockerfile
- [x] `backend/Dockerfile.prod` - Production-ready Dockerfile (backup)
- [x] `frontend/Dockerfile` - Production frontend with Nginx
- [x] `railway.json` - Root-level Railway configuration
- [x] `backend/railway.json` - Backend-specific configuration

### 2. Build Configuration
- [x] `backend/package.json` - All dependencies included
- [x] `backend/tsconfig.json` - TypeScript configuration
- [x] `backend/src/index.ts` - Health endpoint at `/health`
- [x] Build scripts: `npm run build` and `npm start`

### 3. Environment Variables
- [x] `backend/env.railway` - Environment variable template
- [x] Database configuration with SSL support
- [x] CORS configuration for production
- [x] JWT configuration

### 4. Database Setup
- [x] `backend/src/config/initDatabase.ts` - Database initialization
- [x] Migration files in `database/migrations/`
- [x] Graceful handling of database connection failures
- [x] SSL configuration for production

### 5. Application Health
- [x] Health check endpoint at `/health`
- [x] Graceful shutdown handling
- [x] Error handling middleware
- [x] Request logging

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 2: Railway Setup
1. Go to [Railway.com](https://railway.com)
2. Create new project from GitHub repo
3. Railway will automatically detect the configuration

### Step 3: Environment Variables
Set these in Railway dashboard:
```
NODE_ENV=production
PORT=5000
DB_HOST=<from-railway-postgres>
DB_PORT=5432
DB_NAME=inventory_management
DB_USER=<from-railway-postgres>
DB_PASSWORD=<from-railway-postgres>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=<your-frontend-url>
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

### Step 4: Add PostgreSQL Service
1. In Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Copy connection details to environment variables

### Step 5: Deploy Frontend (Optional)
1. Create new service for frontend
2. Set root directory to `/frontend`
3. Add environment variables:
   ```
   VITE_API_URL=<your-backend-url>
   NODE_ENV=production
   ```

## 🔍 Verification Points

### Build Process
- [ ] Docker build completes successfully
- [ ] TypeScript compilation succeeds
- [ ] Dependencies install correctly
- [ ] Production build creates `dist/` folder

### Application Startup
- [ ] Server starts on port 5000
- [ ] Health endpoint responds at `/health`
- [ ] Database connection established
- [ ] Migrations run successfully

### API Functionality
- [ ] Authentication endpoints work
- [ ] CORS configured correctly
- [ ] JWT tokens generated properly
- [ ] Database queries execute

### Monitoring
- [ ] Railway logs show successful startup
- [ ] Health checks pass
- [ ] No critical errors in logs
- [ ] Application responds to requests

## 🛠️ Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies in package.json
   - Ensure TypeScript compilation works

2. **Database Connection**
   - Verify environment variables
   - Check PostgreSQL service is running
   - Ensure SSL configuration is correct

3. **Health Check Failures**
   - Verify health endpoint exists
   - Check application is listening on correct port
   - Ensure database connection is working

4. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend URL
   - Check CORS configuration in index.ts

## 📋 Post-Deployment Checklist

- [ ] Application is accessible via Railway URL
- [ ] Health endpoint returns 200 status
- [ ] Database migrations completed
- [ ] Admin user can log in (admin/admin123)
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to backend (if deployed)
- [ ] Logs show no critical errors
- [ ] Performance is acceptable

## 🎯 Success Criteria

✅ **Deployment Successful When:**
- Railway build completes without errors
- Application starts and health check passes
- Database connection established
- API endpoints respond correctly
- Admin login works
- No critical errors in logs

## 📞 Support

If deployment fails:
1. Check Railway logs for specific errors
2. Verify environment variables are set correctly
3. Ensure PostgreSQL service is running
4. Check Dockerfile syntax and dependencies
5. Review this checklist for missed items 
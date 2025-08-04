# 🚀 Railway Deployment Guide

## 📋 **Prerequisites**

Before starting Railway deployment, ensure you have:

1. **GitHub Repository Access** - Either:
   - Access to the current repository (`jaiganesh-i2i/inventory-management-system`)
   - Or create a fork under your account
   - Or create a new repository

2. **Railway Account** - Sign up at [Railway.com](https://railway.com)

3. **Docker Files Ready** - ✅ Already prepared:
   - `backend/Dockerfile` - Backend API
   - `frontend/Dockerfile` - Frontend App
   - `docker-compose.yml` - Local development

## 🚀 **Step-by-Step Railway Deployment**

### **Step 1: Prepare GitHub Repository**

#### **Option A: Get Repository Access**
- Contact `jaiganesh-i2i` to get collaborator access
- Or ask them to add you as a collaborator

#### **Option B: Fork the Repository**
1. Go to: `https://github.com/jaiganesh-i2i/inventory-management-system`
2. Click "Fork" button
3. Fork to your account (`kathiresh-i2i`)

#### **Option C: Create New Repository**
```bash
# Create new repository on GitHub
# Then push your code:
git remote set-url origin https://github.com/kathiresh-i2i/inventory-management-system.git
git push -u origin main
```

### **Step 2: Railway Project Setup**

1. **Go to Railway.com**
   - Visit [https://railway.com](https://railway.com)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository (either original or forked)

3. **Railway will automatically detect:**
   - Your Dockerfiles
   - Project structure
   - Service requirements

### **Step 3: Configure Services**

Railway will create 3 services automatically:

#### **Service 1: PostgreSQL Database**
- **Type**: Database → PostgreSQL
- **Railway manages**: Connection details, SSL, backups
- **No configuration needed**

#### **Service 2: Backend API**
- **Type**: Web Service
- **Root Directory**: `/backend`
- **Dockerfile**: `backend/Dockerfile` (auto-detected)
- **Port**: 5000 (from Dockerfile)

#### **Service 3: Frontend App**
- **Type**: Web Service
- **Root Directory**: `/frontend`
- **Dockerfile**: `frontend/Dockerfile` (auto-detected)
- **Port**: 80 (from Dockerfile)

### **Step 4: Environment Variables**

#### **Backend Service Variables**
Add these to your Backend service:

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
CORS_ORIGIN=<your-frontend-url>
LOG_LEVEL=info
BCRYPT_ROUNDS=12

# Database Configuration (Railway will provide DATABASE_URL automatically)
# DATABASE_URL=postgresql://username:password@host:port/database
# No need to set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD manually
```

#### **Frontend Service Variables**
Add these to your Frontend service:

```bash
VITE_API_URL=<your-backend-url>
NODE_ENV=production
```

### **Step 5: Configure Environment Variables**

1. **Backend Service → Variables tab**
2. **Add these variables:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=https://your-frontend-url.railway.app
   LOG_LEVEL=info
   BCRYPT_ROUNDS=12
   ```
   **Note**: Railway automatically provides `DATABASE_URL` - no need to set it manually

3. **Frontend Service → Variables tab**
4. **Add these variables:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   NODE_ENV=production
   ```

### **Step 6: Deploy and Test**

1. **Railway will automatically deploy** when you:
   - Push changes to GitHub
   - Update environment variables
   - Make configuration changes

2. **Monitor Deployment**
   - Check "Deployments" tab
   - View build logs
   - Monitor service health

3. **Get Your URLs**
   - Backend: `https://your-backend-service.railway.app`
   - Frontend: `https://your-frontend-service.railway.app`

## 🔍 **Verification Steps**

### **1. Health Check**
```bash
# Test backend health
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

### **2. API Test**
```bash
# Test authentication
curl -X POST https://your-backend-url.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# Should return JWT tokens
```

### **3. Frontend Test**
1. Open frontend URL in browser
2. Should load the login page
3. Login with: `admin` / `admin123`
4. Navigate through all pages

## 🛠️ **Troubleshooting**

### **Build Failures**
- Check Railway build logs
- Verify Dockerfile syntax
- Ensure all dependencies are in package.json
- Check for TypeScript compilation errors

### **Database Connection Issues**
- **Railway automatically provides DATABASE_URL** - no need to set individual DB_* variables
- Check PostgreSQL service is running and healthy
- Ensure SSL configuration is correct (Railway requires SSL)
- Verify the backend can parse the DATABASE_URL correctly
- Check logs for connection details and errors
- Test database connection manually using Railway's connection details

### **CORS Errors**
- Update CORS_ORIGIN with correct frontend URL
- Check that both services are accessible
- Verify CORS configuration in backend

### **Frontend Can't Connect to Backend**
- Verify VITE_API_URL is set correctly
- Check backend is running and accessible
- Ensure CORS is configured properly

## 📊 **Railway Dashboard Features**

### **Monitoring**
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, network usage
- **Health**: Service health status
- **Deployments**: Deployment history

### **Management**
- **Variables**: Environment variable management
- **Domains**: Custom domain setup
- **Scaling**: Resource allocation
- **Backups**: Database backups

## 💰 **Cost Management**

### **Free Tier Limits**
- Limited compute hours
- Limited bandwidth
- Limited storage

### **Paid Plans**
- **Starter**: $5/month
- **Pro**: $20/month
- **Enterprise**: Custom pricing

## 🎯 **Success Criteria**

✅ **Deployment Successful When:**
- All 3 services build and deploy without errors
- Health checks pass for all services
- Database connection established
- Frontend can connect to backend API
- Admin login works (admin/admin123)
- All pages load without errors
- No critical errors in logs

## 🚀 **Next Steps After Deployment**

1. **Set up custom domains** (optional)
2. **Configure monitoring alerts**
3. **Set up CI/CD pipeline**
4. **Implement backup strategy**
5. **Performance optimization**
6. **Security hardening**

---

**🎉 Your inventory management system will be live on Railway!** 
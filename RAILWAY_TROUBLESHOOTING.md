# Railway Troubleshooting Guide

## 🚨 **Current Issues & Solutions**

### **Issue 1: Database Not Automatically Created**

**Problem**: Railway is not automatically creating PostgreSQL database service.

**Solution**:
1. **Manually add PostgreSQL database**:
   - Go to Railway project dashboard
   - Click "New Service"
   - Select "Database" → "PostgreSQL"
   - Wait for creation to complete

2. **Verify database connection**:
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy `DATABASE_URL` or individual connection details

### **Issue 2: CORS Errors on API Calls**

**Problem**: Preflight requests succeed but actual API calls fail with CORS errors.

**Solution**:
1. **Update CORS configuration** (already done in backend/src/index.ts)
2. **Set correct environment variables**:

**Backend Service Variables**:
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
LOG_LEVEL=info

# IMPORTANT: Use your actual frontend URL
CORS_ORIGIN=https://your-frontend-service-name.railway.app
```

**Frontend Service Variables**:
```bash
# IMPORTANT: Use your actual backend URL
VITE_API_URL=https://your-backend-service-name.railway.app
NODE_ENV=production
```

### **Issue 3: Database Connection Failures**

**Problem**: Backend can't connect to PostgreSQL.

**Solution**:
1. **Check environment variables**:
   - Railway automatically provides `DATABASE_URL`
   - No need to set individual DB_* variables

2. **Verify database service is running**:
   - Check PostgreSQL service status in Railway dashboard
   - Ensure it shows "Running" status

3. **Check backend logs**:
   - Go to Backend service → "Deployments" tab
   - Click on latest deployment
   - Check logs for connection errors

## 🔧 **Step-by-Step Fix Process**

### **Step 1: Add PostgreSQL Database**

1. **Railway Dashboard** → **Your Project**
2. **Click "New Service"**
3. **Select "Database" → "PostgreSQL"**
4. **Wait for creation** (usually 1-2 minutes)

### **Step 2: Get Your Service URLs**

1. **Backend Service**:
   - Click on your backend service
   - Copy the URL (e.g., `https://your-backend-name.railway.app`)

2. **Frontend Service**:
   - Click on your frontend service
   - Copy the URL (e.g., `https://your-frontend-name.railway.app`)

### **Step 3: Update Environment Variables**

**Backend Service Variables**:
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
LOG_LEVEL=info
CORS_ORIGIN=https://your-frontend-name.railway.app
```

**Frontend Service Variables**:
```bash
VITE_API_URL=https://your-backend-name.railway.app
NODE_ENV=production
```

### **Step 4: Test the Setup**

1. **Test Backend Health**:
   ```bash
   curl https://your-backend-name.railway.app/health
   ```

2. **Test Database Connection**:
   - Check backend logs for database connection success
   - Should see: "✅ PostgreSQL database connected successfully"

3. **Test Frontend**:
   - Open frontend URL in browser
   - Should load without CORS errors

## 🐛 **Common Error Messages & Solutions**

### **"Database connection failed"**
- **Cause**: PostgreSQL service not created or not running
- **Solution**: Manually add PostgreSQL database service

### **"CORS policy blocked"**
- **Cause**: Incorrect CORS_ORIGIN or VITE_API_URL
- **Solution**: Update environment variables with correct URLs

### **"Cannot read properties of undefined"**
- **Cause**: Frontend can't reach backend API
- **Solution**: Check VITE_API_URL and backend service status

### **"JWT malformed"**
- **Cause**: Authentication token issues
- **Solution**: Check JWT_SECRET is set correctly

## 📋 **Verification Checklist**

- [ ] PostgreSQL database service created and running
- [ ] Backend service environment variables set correctly
- [ ] Frontend service environment variables set correctly
- [ ] Backend health endpoint returns success
- [ ] Database connection logs show success
- [ ] Frontend loads without CORS errors
- [ ] Login functionality works
- [ ] All pages load correctly

## 🚀 **Quick Test Commands**

```bash
# Test backend health
curl https://your-backend-name.railway.app/health

# Test API endpoint
curl -X POST https://your-backend-name.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test CORS (should not fail)
curl -H "Origin: https://your-frontend-name.railway.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://your-backend-name.railway.app/api/v1/auth/login
```

## 📞 **If Issues Persist**

1. **Check Railway logs** for specific error messages
2. **Verify all environment variables** are set correctly
3. **Ensure service URLs** are correct and accessible
4. **Test locally** to isolate Railway-specific issues
5. **Check Railway status** at https://status.railway.app 
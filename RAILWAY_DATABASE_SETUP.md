# Railway Database Setup & CORS Fix Guide

## 🚨 **Current Issues:**
1. Railway is not automatically creating PostgreSQL database
2. CORS preflight succeeds but actual API calls fail
3. Backend can't connect to database

## 🔧 **Step-by-Step Solution**

### **Step 1: Manually Add PostgreSQL Database to Railway**

1. **Go to your Railway project dashboard**
2. **Click "New Service"**
3. **Select "Database" → "PostgreSQL"**
4. **Wait for the database to be created**

### **Step 2: Get Database Connection Details**

1. **Click on the PostgreSQL service**
2. **Go to "Connect" tab**
3. **Copy the connection details:**
   - `DATABASE_URL` (Railway provides this automatically)
   - Or individual values: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### **Step 3: Update Backend Environment Variables**

1. **Go to your Backend service**
2. **Click "Variables" tab**
3. **Add/Update these variables:**

```bash
# Database (Railway will provide DATABASE_URL automatically)
# DATABASE_URL=postgresql://username:password@host:port/database

# Application
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
LOG_LEVEL=info

# CORS - IMPORTANT: Use your actual frontend URL
CORS_ORIGIN=https://your-frontend-service-name.railway.app
```

### **Step 4: Update Frontend Environment Variables**

1. **Go to your Frontend service**
2. **Click "Variables" tab**
3. **Add/Update these variables:**

```bash
# Use your actual backend URL
VITE_API_URL=https://your-backend-service-name.railway.app
NODE_ENV=production
```

### **Step 5: Fix CORS Configuration**

The current CORS configuration needs to be updated. Let me create an improved version:
 
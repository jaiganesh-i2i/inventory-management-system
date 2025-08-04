# ✅ Render Deployment Checklist

## **Pre-Deployment Checklist**

### **Code Ready**
- [ ] `render.yaml` file in repository root
- [ ] All code pushed to GitHub
- [ ] Dockerfiles working locally
- [ ] Database migrations in place
- [ ] Environment variables documented

### **Account Setup**
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Repository accessible

---

## **Deployment Steps**

### **Step 1: Push Code**
- [ ] `git add render.yaml`
- [ ] `git commit -m "Add Render deployment blueprint"`
- [ ] `git push origin main`

### **Step 2: Deploy on Render**
- [ ] Go to [render.com](https://render.com)
- [ ] Click "New +" → "Blueprint"
- [ ] Connect GitHub repository
- [ ] Select repository
- [ ] Click "Create Blueprint"
- [ ] Wait for deployment (5-10 minutes)

### **Step 3: Configure Environment Variables**
- [ ] Set `CORS_ORIGIN` in backend service
- [ ] Set `VITE_API_URL` in frontend service
- [ ] Verify `DATABASE_URL` is auto-linked

---

## **Post-Deployment Testing**

### **Backend Tests**
- [ ] Health check endpoint works
- [ ] Database connection successful
- [ ] API endpoints responding
- [ ] Authentication working

### **Frontend Tests**
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] All pages load correctly
- [ ] CRUD operations working

### **Integration Tests**
- [ ] Frontend can connect to backend
- [ ] No CORS errors
- [ ] Data persistence working
- [ ] All features functional

---

## **Environment Variables**

### **Backend Service**
```bash
NODE_ENV=production
PORT=10000
JWT_SECRET=auto-generated
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
LOG_LEVEL=info
DATABASE_URL=postgresql://... # Auto-linked
CORS_ORIGIN=https://your-frontend-name.onrender.com
```

### **Frontend Service**
```bash
NODE_ENV=production
VITE_API_URL=https://your-backend-name.onrender.com
```

---

## **Service URLs**

### **After Deployment**
- **Backend**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Database**: Managed by Render

### **Test Commands**
```bash
# Health check
curl https://your-backend-name.onrender.com/health

# Login test
curl -X POST https://your-backend-name.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## **Troubleshooting**

### **Common Issues**
- [ ] Database connection failed → Check `DATABASE_URL`
- [ ] CORS errors → Verify `CORS_ORIGIN` and `VITE_API_URL`
- [ ] Build failed → Check build logs and dependencies
- [ ] Port issues → Ensure backend uses `process.env.PORT`

### **Support Resources**
- [ ] Render documentation: [docs.render.com](https://docs.render.com)
- [ ] Render status: [status.render.com](https://status.render.com)
- [ ] Render Discord: [discord.gg/render](https://discord.gg/render)

---

## **✅ Deployment Complete**

When all items are checked:
- [ ] All services running
- [ ] Database connected
- [ ] Frontend accessible
- [ ] Backend API working
- [ ] Authentication functional
- [ ] All features tested

**🎉 Your inventory management system is live on Render!** 
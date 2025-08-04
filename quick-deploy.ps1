# Quick Railway Deployment Script
Write-Host "🚀 Inventory Management System - Quick Railway Deployment" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Prerequisites:" -ForegroundColor Yellow
Write-Host "   1. GitHub repository with your code" -ForegroundColor White
Write-Host "   2. Railway account (free)" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Deployment Steps:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Prepare Repository" -ForegroundColor Green
Write-Host "   • Ensure your code is pushed to GitHub" -ForegroundColor White
Write-Host "   • Verify all dependencies are in package.json" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Deploy to Railway" -ForegroundColor Green
Write-Host "   • Go to: https://railway.app" -ForegroundColor Blue
Write-Host "   • Sign up/Login with GitHub" -ForegroundColor White
Write-Host "   • Click 'New Project'" -ForegroundColor White
Write-Host "   • Select 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "   • Choose your inventory-management-system repository" -ForegroundColor White
Write-Host ""

Write-Host "Step 3: Add PostgreSQL Database" -ForegroundColor Green
Write-Host "   • In Railway dashboard, click 'New Service'" -ForegroundColor White
Write-Host "   • Select 'Database' → 'PostgreSQL'" -ForegroundColor White
Write-Host "   • Railway will auto-provision the database" -ForegroundColor White
Write-Host ""

Write-Host "Step 4: Deploy Backend" -ForegroundColor Green
Write-Host "   • Create new service for backend" -ForegroundColor White
Write-Host "   • Set root directory to '/backend'" -ForegroundColor White
Write-Host "   • Add environment variables (see below)" -ForegroundColor White
Write-Host ""

Write-Host "Step 5: Deploy Frontend" -ForegroundColor Green
Write-Host "   • Create new service for frontend" -ForegroundColor White
Write-Host "   • Set root directory to '/frontend'" -ForegroundColor White
Write-Host "   • Add environment variables (see below)" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Environment Variables:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Backend Variables:" -ForegroundColor Green
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host "   PORT=5000" -ForegroundColor Gray
Write-Host "   DATABASE_URL=postgresql://[railway-provided-url]" -ForegroundColor Gray
Write-Host "   JWT_SECRET=your-super-secret-jwt-key-change-in-production" -ForegroundColor Gray
Write-Host "   JWT_EXPIRES_IN=24h" -ForegroundColor Gray
Write-Host "   CORS_ORIGIN=https://your-frontend-url.railway.app" -ForegroundColor Gray
Write-Host "   LOG_LEVEL=info" -ForegroundColor Gray
Write-Host "   BCRYPT_ROUNDS=12" -ForegroundColor Gray
Write-Host ""

Write-Host "Frontend Variables:" -ForegroundColor Green
Write-Host "   REACT_APP_API_URL=https://your-backend-url.railway.app/api" -ForegroundColor Gray
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host ""

Write-Host "🔐 Default Login:" -ForegroundColor Yellow
Write-Host "   Email: admin@inventory.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "📊 Railway Features:" -ForegroundColor Yellow
Write-Host "   ✅ Automatic deployments from GitHub" -ForegroundColor Green
Write-Host "   ✅ Built-in PostgreSQL database" -ForegroundColor Green
Write-Host "   ✅ SSL certificates included" -ForegroundColor Green
Write-Host "   ✅ Custom domains support" -ForegroundColor Green
Write-Host "   ✅ Monitoring and logs" -ForegroundColor Green
Write-Host "   ✅ Environment variable management" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 After Deployment:" -ForegroundColor Yellow
Write-Host "   1. Test all features" -ForegroundColor White
Write-Host "   2. Add custom domain (optional)" -ForegroundColor White
Write-Host "   3. Set up monitoring" -ForegroundColor White
Write-Host "   4. Configure backups" -ForegroundColor White
Write-Host ""

Write-Host "📞 Need Help?" -ForegroundColor Yellow
Write-Host "   • Railway Docs: https://docs.railway.app" -ForegroundColor Blue
Write-Host "   • Railway Discord: https://discord.gg/railway" -ForegroundColor Blue
Write-Host ""

Write-Host "Press any key to open Railway in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open Railway in default browser
Start-Process "https://railway.app"

Write-Host ""
Write-Host "✅ Railway opened in your browser!" -ForegroundColor Green
Write-Host "Follow the steps above to deploy your application." -ForegroundColor White 
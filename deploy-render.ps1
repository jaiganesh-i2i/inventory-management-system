# Render Deployment Script
Write-Host "🚀 Inventory Management System - Render Deployment" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

Write-Host "`n📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "   • GitHub repository with code" -ForegroundColor White
Write-Host "   • render.yaml file in root directory" -ForegroundColor White
Write-Host "   • Render account (free)" -ForegroundColor White

Write-Host "`n✅ Current Setup:" -ForegroundColor Green
Write-Host "   • render.yaml blueprint created" -ForegroundColor White
Write-Host "   • Dockerfiles configured" -ForegroundColor White
Write-Host "   • Database migrations ready" -ForegroundColor White
Write-Host "   • CORS configuration updated" -ForegroundColor White

Write-Host "`n🚀 Deployment Steps:" -ForegroundColor Yellow

Write-Host "`nStep 1: Push to GitHub" -ForegroundColor Cyan
Write-Host "   git add render.yaml" -ForegroundColor Gray
Write-Host "   git commit -m 'Add Render deployment blueprint'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray

Write-Host "`nStep 2: Create Render Account" -ForegroundColor Cyan
Write-Host "   • Go to: https://render.com" -ForegroundColor White
Write-Host "   • Sign up with GitHub" -ForegroundColor White
Write-Host "   • Verify email" -ForegroundColor White

Write-Host "`nStep 3: Deploy Using Blueprint" -ForegroundColor Cyan
Write-Host "   • Click 'New +' → 'Blueprint'" -ForegroundColor White
Write-Host "   • Connect GitHub repository" -ForegroundColor White
Write-Host "   • Select your repository" -ForegroundColor White
Write-Host "   • Click 'Create Blueprint'" -ForegroundColor White
Write-Host "   • Wait 5-10 minutes" -ForegroundColor White

Write-Host "`nStep 4: Configure Environment Variables" -ForegroundColor Cyan
Write-Host "   Backend Service:" -ForegroundColor White
Write-Host "   CORS_ORIGIN=https://your-frontend-name.onrender.com" -ForegroundColor Gray
Write-Host "   " -ForegroundColor White
Write-Host "   Frontend Service:" -ForegroundColor White
Write-Host "   VITE_API_URL=https://your-backend-name.onrender.com" -ForegroundColor Gray

Write-Host "`n🎯 What Gets Created Automatically:" -ForegroundColor Yellow
Write-Host "   ✅ PostgreSQL Database (inventory-database)" -ForegroundColor Green
Write-Host "   ✅ Backend Service (inventory-backend)" -ForegroundColor Green
Write-Host "   ✅ Frontend Service (inventory-frontend)" -ForegroundColor Green
Write-Host "   ✅ DATABASE_URL environment variable" -ForegroundColor Green
Write-Host "   ✅ SSL certificates" -ForegroundColor Green

Write-Host "`n🧪 Testing Commands:" -ForegroundColor Yellow
Write-Host "   # Health check" -ForegroundColor Gray
Write-Host "   curl https://your-backend-name.onrender.com/health" -ForegroundColor Gray
Write-Host "   " -ForegroundColor White
Write-Host "   # Database test" -ForegroundColor Gray
Write-Host "   curl -X POST https://your-backend-name.onrender.com/api/v1/auth/login \" -ForegroundColor Gray
Write-Host "     -H \"Content-Type: application/json\" \" -ForegroundColor Gray
Write-Host "     -d '{\"username\":\"admin\",\"password\":\"admin123\"}'" -ForegroundColor Gray

Write-Host "`n📊 Render Features:" -ForegroundColor Yellow
Write-Host "   • Automatic database creation" -ForegroundColor White
Write-Host "   • Docker support" -ForegroundColor White
Write-Host "   • Free tier available" -ForegroundColor White
Write-Host "   • Auto SSL certificates" -ForegroundColor White
Write-Host "   • Automatic deployments" -ForegroundColor White
Write-Host "   • Service linking" -ForegroundColor White

Write-Host "`n🔗 Useful Links:" -ForegroundColor Yellow
Write-Host "   • Render: https://render.com" -ForegroundColor Blue
Write-Host "   • Documentation: https://docs.render.com" -ForegroundColor Blue
Write-Host "   • Status: https://status.render.com" -ForegroundColor Blue
Write-Host "   • Discord: https://discord.gg/render" -ForegroundColor Blue

Write-Host "`n📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Green

Write-Host "`nPress any key to open Render in your browser..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open Render in default browser
Start-Process "https://render.com"

Write-Host "`n✅ Render opened in your browser!" -ForegroundColor Green
Write-Host "🚀 Your project is ready for deployment!" -ForegroundColor Green 
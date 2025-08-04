# Railway Docker Stack Deployment Script
Write-Host "🐳 Railway Docker Stack Deployment" -ForegroundColor Green

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
railway login

# Link to existing project or create new one
Write-Host "📋 Linking to Railway project..." -ForegroundColor Yellow
railway link

Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Railway dashboard" -ForegroundColor White
Write-Host "2. Add PostgreSQL Database service" -ForegroundColor White
Write-Host "3. Add Backend service (Root Directory: /backend)" -ForegroundColor White
Write-Host "4. Add Frontend service (Root Directory: /frontend)" -ForegroundColor White
Write-Host "5. Configure environment variables" -ForegroundColor White
Write-Host "6. Deploy all services" -ForegroundColor White
Write-Host ""
Write-Host "📖 See RAILWAY_DOCKER_DEPLOYMENT.md for detailed instructions" -ForegroundColor Blue 
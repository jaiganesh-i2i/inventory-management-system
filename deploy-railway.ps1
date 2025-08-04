# Railway Deployment Script
Write-Host "🚀 Railway Deployment Script" -ForegroundColor Green

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
railway login

# Link to existing project or create new one
Write-Host "📋 Linking to Railway project..." -ForegroundColor Yellow
railway link

# Deploy the application
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
railway up

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Check your Railway dashboard for the deployment status" -ForegroundColor Cyan 
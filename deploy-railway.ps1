# Inventory Management System - Railway Deployment Script
Write-Host "🚀 Deploying Inventory Management System to Railway..." -ForegroundColor Green

# Check if Railway CLI is installed
function Test-RailwayCLI {
    try {
        railway --version | Out-Null
        Write-Host "✅ Railway CLI is installed" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
        try {
            npm install -g @railway/cli
            Write-Host "✅ Railway CLI installed successfully" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Failed to install Railway CLI" -ForegroundColor Red
            return $false
        }
    }
}

# Login to Railway
function Connect-Railway {
    Write-Host "🔐 Logging into Railway..." -ForegroundColor Yellow
    try {
        railway login
        Write-Host "✅ Successfully logged into Railway" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to login to Railway" -ForegroundColor Red
        return $false
    }
}

# Create Railway project
function New-RailwayProject {
    Write-Host "📦 Creating Railway project..." -ForegroundColor Yellow
    try {
        railway init --name "inventory-management-system"
        Write-Host "✅ Railway project created" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Project might already exist, continuing..." -ForegroundColor Yellow
        return $true
    }
}

# Add PostgreSQL service
function Add-PostgreSQLService {
    Write-Host "🗄️ Adding PostgreSQL service..." -ForegroundColor Yellow
    try {
        railway add --service postgres
        Write-Host "✅ PostgreSQL service added" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ PostgreSQL service might already exist" -ForegroundColor Yellow
        return $true
    }
}

# Deploy backend
function Deploy-Backend {
    Write-Host "🔧 Deploying backend to Railway..." -ForegroundColor Yellow
    try {
        cd backend
        railway up
        Write-Host "✅ Backend deployed successfully" -ForegroundColor Green
        cd ..
        return $true
    }
    catch {
        Write-Host "❌ Backend deployment failed" -ForegroundColor Red
        return $false
    }
}

# Deploy frontend
function Deploy-Frontend {
    Write-Host "📱 Deploying frontend to Railway..." -ForegroundColor Yellow
    try {
        cd frontend
        railway up
        Write-Host "✅ Frontend deployed successfully" -ForegroundColor Green
        cd ..
        return $true
    }
    catch {
        Write-Host "❌ Frontend deployment failed" -ForegroundColor Red
        return $false
    }
}

# Show deployment information
function Show-DeploymentInfo {
    Write-Host ""
    Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "📊 Check your Railway dashboard for URLs:" -ForegroundColor White
    Write-Host "   https://railway.app/dashboard" -ForegroundColor Blue
    Write-Host ""
    Write-Host "🔐 Default Login:" -ForegroundColor Yellow
    Write-Host "   Email: admin@inventory.com" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Check Railway dashboard for service URLs" -ForegroundColor White
    Write-Host "   2. Update frontend API URL if needed" -ForegroundColor White
    Write-Host "   3. Test the application" -ForegroundColor White
    Write-Host ""
}

# Main deployment process
function Main {
    if (-not (Test-RailwayCLI)) {
        exit 1
    }
    
    if (-not (Connect-Railway)) {
        exit 1
    }
    
    if (-not (New-RailwayProject)) {
        exit 1
    }
    
    if (-not (Add-PostgreSQLService)) {
        exit 1
    }
    
    if (-not (Deploy-Backend)) {
        exit 1
    }
    
    if (-not (Deploy-Frontend)) {
        exit 1
    }
    
    Show-DeploymentInfo
}

# Run main function
Main 
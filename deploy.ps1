# Inventory Management System Deployment Script (PowerShell)
Write-Host "🚀 Starting Inventory Management System Deployment..." -ForegroundColor Green

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        return $false
    }
}

# Function to check network connectivity
function Test-Network {
    Write-Host "🌐 Checking network connectivity..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "https://registry-1.docker.io" -TimeoutSec 5 -UseBasicParsing
        Write-Host "✅ Network connectivity is good" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "⚠️ Network connectivity issues detected" -ForegroundColor Yellow
        return $false
    }
}

# Function to build and start services
function Start-DockerServices {
    Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
    
    # Stop any existing containers
    Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
    docker-compose -f docker/docker-compose.simple.yml down
    
    # Build images
    Write-Host "📦 Building Docker images..." -ForegroundColor Yellow
    docker-compose -f docker/docker-compose.simple.yml build --no-cache
    
    # Start services
    Write-Host "🚀 Starting services..." -ForegroundColor Yellow
    docker-compose -f docker/docker-compose.simple.yml up -d
    
    # Wait for services to be ready
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Check service status
    Write-Host "🔍 Checking service status..." -ForegroundColor Yellow
    docker-compose -f docker/docker-compose.simple.yml ps
}

# Function to show access information
function Show-AccessInfo {
    Write-Host ""
    Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor White
    Write-Host "🗄️ Database: localhost:5432" -ForegroundColor White
    Write-Host "🔍 Health Check: http://localhost:5000/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Default Login:" -ForegroundColor Yellow
    Write-Host "   Email: admin@inventory.com" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 To view logs: docker-compose -f docker/docker-compose.simple.yml logs -f" -ForegroundColor Gray
    Write-Host "🛑 To stop: docker-compose -f docker/docker-compose.simple.yml down" -ForegroundColor Gray
    Write-Host ""
}

# Function to start local development
function Start-LocalDevelopment {
    Write-Host "⚠️ Using local development mode (no external images)" -ForegroundColor Yellow
    Write-Host "Starting local development servers..." -ForegroundColor Yellow
    
    # Start the development servers
    Start-Process powershell -ArgumentList "-Command", "npm run dev" -WindowStyle Minimized
    
    Start-Sleep -Seconds 10
    Write-Host "✅ Local development servers started" -ForegroundColor Green
    Write-Host "📱 Frontend: http://localhost:5175" -ForegroundColor White
    Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor White
}

# Main deployment process
function Main {
    if (-not (Test-Docker)) {
        exit 1
    }
    
    if (Test-Network) {
        Write-Host "✅ Using full Docker deployment" -ForegroundColor Green
        Start-DockerServices
    }
    else {
        Start-LocalDevelopment
    }
    
    Show-AccessInfo
}

# Run main function
Main 
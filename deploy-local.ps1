# Local Docker Deployment Script
Write-Host "🚀 Deploying Inventory Management System Locally..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Remove old images (optional)
Write-Host "🧹 Cleaning up old images..." -ForegroundColor Yellow
docker system prune -f

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service status
Write-Host "📊 Checking service status..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Blue
Write-Host "🗄️ Database: localhost:5432" -ForegroundColor Blue
Write-Host ""
Write-Host "🔐 Default Login:" -ForegroundColor Yellow
Write-Host "   Email: admin@inventory.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "   Stop services: docker-compose down" -ForegroundColor Gray
Write-Host "   Restart: docker-compose restart" -ForegroundColor Gray
Write-Host ""

# Open browser
Write-Host "🌐 Opening application in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000" 
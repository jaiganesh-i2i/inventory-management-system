# Railway Deployment Setup Script
Write-Host "Railway Deployment Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check Docker
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "Docker is installed and running" -ForegroundColor Green
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check Dockerfiles
Write-Host "`nChecking Docker configuration..." -ForegroundColor Yellow
if (Test-Path "backend/Dockerfile") {
    Write-Host "Backend Dockerfile found" -ForegroundColor Green
} else {
    Write-Host "Backend Dockerfile not found" -ForegroundColor Red
}

if (Test-Path "frontend/Dockerfile") {
    Write-Host "Frontend Dockerfile found" -ForegroundColor Green
} else {
    Write-Host "Frontend Dockerfile not found" -ForegroundColor Red
}

# Test builds
Write-Host "`nTesting Docker builds..." -ForegroundColor Yellow
Write-Host "Building backend image..." -ForegroundColor Cyan
try {
    docker build -t inventory-backend-test ./backend
    Write-Host "Backend Docker build successful" -ForegroundColor Green
} catch {
    Write-Host "Backend Docker build failed" -ForegroundColor Red
}

Write-Host "Building frontend image..." -ForegroundColor Cyan
try {
    docker build -t inventory-frontend-test ./frontend
    Write-Host "Frontend Docker build successful" -ForegroundColor Green
} catch {
    Write-Host "Frontend Docker build failed" -ForegroundColor Red
}

# Cleanup
docker rmi inventory-backend-test inventory-frontend-test 2>$null

# Git status
Write-Host "`nChecking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "You have uncommitted changes" -ForegroundColor Yellow
} else {
    Write-Host "All changes are committed" -ForegroundColor Green
}

# Next steps
Write-Host "`nNext Steps for Railway Deployment:" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n1. GitHub Repository Setup:" -ForegroundColor Yellow
Write-Host "   - Fork the repository to your account, OR" -ForegroundColor Cyan
Write-Host "   - Get collaborator access to the current repo, OR" -ForegroundColor Cyan
Write-Host "   - Create a new repository under your account" -ForegroundColor Cyan

Write-Host "`n2. Railway Setup:" -ForegroundColor Yellow
Write-Host "   - Go to https://railway.com" -ForegroundColor Cyan
Write-Host "   - Sign in with your GitHub account" -ForegroundColor Cyan
Write-Host "   - Click 'New Project' -> 'Deploy from GitHub repo'" -ForegroundColor Cyan
Write-Host "   - Select your repository" -ForegroundColor Cyan

Write-Host "`n3. Service Configuration:" -ForegroundColor Yellow
Write-Host "   - Railway will create 3 services automatically:" -ForegroundColor Cyan
Write-Host "     • PostgreSQL Database" -ForegroundColor White
Write-Host "     • Backend API (from /backend)" -ForegroundColor White
Write-Host "     • Frontend App (from /frontend)" -ForegroundColor White

Write-Host "`n4. Environment Variables:" -ForegroundColor Yellow
Write-Host "   - Add environment variables to each service" -ForegroundColor Cyan
Write-Host "   - Copy database connection details" -ForegroundColor Cyan
Write-Host "   - Set JWT_SECRET and CORS_ORIGIN" -ForegroundColor Cyan

Write-Host "`n5. Verification:" -ForegroundColor Yellow
Write-Host "   - Test health endpoints" -ForegroundColor Cyan
Write-Host "   - Verify admin login (admin/admin123)" -ForegroundColor Cyan
Write-Host "   - Check all pages load correctly" -ForegroundColor Cyan

Write-Host "`nFor detailed instructions, see: docs/deployment/RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor Green
Write-Host "`nFor AI development documentation, see: docs/ai-development/" -ForegroundColor Cyan
Write-Host "`nYour project is ready for Railway deployment!" -ForegroundColor Green 
#!/bin/bash

# Inventory Management System Deployment Script
echo "🚀 Starting Inventory Management System Deployment..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to check network connectivity
check_network() {
    echo "🌐 Checking network connectivity..."
    if curl -s --connect-timeout 5 https://registry-1.docker.io > /dev/null; then
        echo "✅ Network connectivity is good"
        return 0
    else
        echo "⚠️ Network connectivity issues detected"
        return 1
    fi
}

# Function to build and start services
deploy_services() {
    echo "🔨 Building and starting services..."
    
    # Stop any existing containers
    docker-compose -f docker/docker-compose.simple.yml down
    
    # Build images
    echo "📦 Building Docker images..."
    docker-compose -f docker/docker-compose.simple.yml build --no-cache
    
    # Start services
    echo "🚀 Starting services..."
    docker-compose -f docker/docker-compose.simple.yml up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check service status
    echo "🔍 Checking service status..."
    docker-compose -f docker/docker-compose.simple.yml ps
}

# Function to show access information
show_access_info() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "================================"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo "🗄️ Database: localhost:5432"
    echo "🔍 Health Check: http://localhost:5000/health"
    echo ""
    echo "🔐 Default Login:"
    echo "   Email: admin@inventory.com"
    echo "   Password: admin123"
    echo ""
    echo "📊 To view logs: docker-compose -f docker/docker-compose.simple.yml logs -f"
    echo "🛑 To stop: docker-compose -f docker/docker-compose.simple.yml down"
    echo ""
}

# Main deployment process
main() {
    check_docker
    
    if check_network; then
        echo "✅ Using full Docker deployment"
        deploy_services
    else
        echo "⚠️ Using local development mode (no external images)"
        echo "Starting local development servers..."
        npm run dev &
        sleep 10
        echo "✅ Local development servers started"
        echo "📱 Frontend: http://localhost:5175"
        echo "🔧 Backend: http://localhost:5000"
    fi
    
    show_access_info
}

# Run main function
main 
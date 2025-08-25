#!/bin/bash

echo "🚀 Starting Virunga Microservices Architecture..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
    echo "✅ .env file created. Please review and modify if needed."
fi

# Create log directory
echo "📁 Creating log directories..."
mkdir -p logs

# Start all services
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

# Wait for backend services to be ready
echo "⏳ Waiting for backend services to be ready..."
sleep 20

# Start frontend development server (optional)
echo "🎨 Frontend is available at: http://localhost:3000"
echo "💡 To start frontend in development mode, run: cd frontend && npm run dev"

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Show service URLs
echo ""
echo "🌐 Service URLs:"
echo "   Eureka Server:     http://localhost:8761"
echo "   API Gateway:       http://localhost:8765"
echo "   Users Service:     http://localhost:8081/api/v1/"
echo "   Product Service:   http://localhost:8080/api/v1/"
echo "   Prometheus:        http://localhost:9090"
echo "   Grafana:           http://localhost:3000 (admin/admin)"
echo ""

echo "✅ All services started successfully!"
echo "📊 Monitor services at: http://localhost:8761"

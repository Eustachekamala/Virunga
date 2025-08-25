#!/bin/bash

echo "🛑 Stopping Virunga Microservices Architecture..."

# Stop all services
echo "🐳 Stopping services with Docker Compose..."
docker-compose down

# Remove volumes if requested
if [ "$1" = "--clean" ]; then
    echo "🧹 Cleaning up volumes..."
    docker-compose down -v
    echo "✅ Volumes cleaned up."
fi

echo "✅ All services stopped successfully!"

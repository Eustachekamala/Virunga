#!/bin/bash

echo "🏥 Health Check for Virunga Microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "🔍 Checking $service_name... "
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy${NC}"
        return 1
    fi
}

# Check Docker containers
echo "🐳 Checking Docker containers..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker containers are running${NC}"
else
    echo -e "${RED}❌ Docker containers are not running${NC}"
    exit 1
fi

echo ""
echo "🌐 Checking service endpoints..."

# Check Eureka Server
check_service "Eureka Server" "http://localhost:8761" 200

# Check API Gateway
check_service "API Gateway" "http://localhost:8765/actuator/health" 200

# Check Users Service
check_service "Users Service" "http://localhost:8081/api/v1/actuator/health" 200

# Check Product Service
check_service "Product Service" "http://localhost:8080/api/v1/actuator/health" 200

# Check Prometheus
check_service "Prometheus" "http://localhost:9090" 200

# Check Grafana
check_service "Grafana" "http://localhost:3000" 200

echo ""
echo "📊 Service Discovery Status:"
if curl -s "http://localhost:8761" | grep -q "Instances currently registered"; then
    echo -e "${GREEN}✅ Eureka is showing registered services${NC}"
else
    echo -e "${YELLOW}⚠️  Eureka may not have registered services yet${NC}"
fi

echo ""
echo "🏥 Health check completed!"



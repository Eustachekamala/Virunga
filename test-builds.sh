#!/bin/bash

echo "🧪 Testing Docker builds for individual services..."

# Test Eureka Server build
echo "🔍 Testing Eureka Server build..."
cd eureka-server
if docker build -t test-eureka . ; then
    echo "✅ Eureka Server build successful"
else
    echo "❌ Eureka Server build failed"
    exit 1
fi
cd ..

# Test API Gateway build
echo "🔍 Testing API Gateway build..."
cd api-gateway-virunga-app
if docker build -t test-gateway . ; then
    echo "✅ API Gateway build successful"
else
    echo "❌ API Gateway build failed"
    exit 1
fi
cd ..

# Test Users Service build
echo "🔍 Testing Users Service build..."
cd users-service
if docker build -t test-users . ; then
    echo "✅ Users Service build successful"
else
    echo "❌ Users Service build failed"
    exit 1
fi
cd ..

# Test Product Service build
echo "🔍 Testing Product Service build..."
cd product-service
if docker build -t test-products . ; then
    echo "✅ Product Service build successful"
else
    echo "❌ Product Service build failed"
    exit 1
fi
cd ..

# Test Frontend build
echo "🔍 Testing Frontend build..."
cd frontend
if docker build -t test-frontend . ; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "🎉 All builds successful! You can now run the full docker-compose."
echo "🧹 Cleaning up test images..."
docker rmi test-eureka test-gateway test-users test-products test-frontend

echo "✅ Build testing completed successfully!"



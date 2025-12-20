# Stage 1: Build the application using Maven
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy pom.xml and download dependencies (this layer is cached)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ============================================
# Stage 2: Runtime image with Redis and Java
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /virungaApp

# Install Redis
RUN apk add --no-cache redis

# Copy the built jar from builder stage
COPY --from=builder /build/target/virunga-app.jar virunga-app.jar

# Create startup script that runs Redis first, then the app
RUN echo '#!/bin/sh' > /virungaApp/start.sh && \
    echo 'set -e' >> /virungaApp/start.sh && \
    echo 'echo "Starting Redis server..."' >> /virungaApp/start.sh && \
    echo 'redis-server --daemonize yes --port 6379 --bind 0.0.0.0 --maxmemory 256mb --maxmemory-policy allkeys-lru' >> /virungaApp/start.sh && \
    echo 'sleep 2' >> /virungaApp/start.sh && \
    echo 'echo "Redis started successfully"' >> /virungaApp/start.sh && \
    echo 'echo "Starting Spring Boot application..."' >> /virungaApp/start.sh && \
    echo 'exec java -Xmx512m -Xms256m -jar virunga-app.jar' >> /virungaApp/start.sh && \
    chmod +x /virungaApp/start.sh

# Expose ports (8080 for app, 6379 for Redis)
EXPOSE 8080 6379

# Health check to ensure app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD redis-cli ping && echo "OK" || exit 1

# Run the startup script
ENTRYPOINT ["/virungaApp/start.sh"]
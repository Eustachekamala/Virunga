# 🏔️ Virunga Microservices Architecture

A comprehensive microservices architecture built with Spring Boot, featuring service discovery, API gateway, security, monitoring, and centralized orchestration.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway  │    │  Users Service  │    │ Product Service │
│   (Port 8765)  │    │   (Port 8081)   │    │  (Port 8080)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Eureka Server   │
                    │  (Port 8761)    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │  (Ports 5433,   │
                    │         5434)   │
                    └─────────────────┘
```

## 🚀 Features

### ✅ **API Gateway Enhancement**
- **Routing Configuration**: Intelligent routing to microservices
- **Security Filters**: JWT-based authentication and authorization
- **CORS Support**: Cross-origin resource sharing configuration
- **Request/Response Headers**: Custom header injection and modification

### ✅ **Centralized Docker Compose**
- **Single Orchestration**: All services managed from one file
- **Service Dependencies**: Proper startup order management
- **Network Isolation**: Dedicated network for microservices
- **Volume Management**: Persistent data storage

### ✅ **Health Checks & Monitoring**
- **Spring Boot Actuator**: Comprehensive health endpoints
- **Prometheus Integration**: Metrics collection and export
- **Grafana Dashboards**: Visualization and alerting
- **Custom Health Indicators**: Service-specific health checks

### ✅ **Centralized Logging**
- **Structured Logging**: Consistent log format across services
- **File & Console Output**: Dual logging for development and production
- **Log Rotation**: Automatic log file management
- **Service-Specific Logging**: Tailored log levels per service

### ✅ **Security Configuration**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permission management
- **CORS Configuration**: Secure cross-origin requests
- **API Gateway Security**: Centralized security enforcement

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.5.x
- **Java Version**: 21
- **Spring Cloud**: 2025.0.0
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **Monitoring**: Prometheus + Grafana
- **Containerization**: Docker + Docker Compose
- **Build Tool**: Maven

## 📁 Project Structure

```
Virunga/
├── eureka-server/                 # Service Registry
├── api-gateway-virunga-app/       # API Gateway
├── users-service/                 # User Management Service
├── product-service/               # Product Management Service
├── frontend/                      # React Web Dashboard
├── monitoring/                    # Monitoring Configuration
├── docker-compose.yml            # Main orchestration file
├── start-services.sh             # Service startup script
├── stop-services.sh              # Service shutdown script
├── health-check.sh               # Health monitoring script
└── env.example                   # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 21 (for local development)
- Maven (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd Virunga
```

### 2. Environment Configuration
```bash
cp env.example .env
# Edit .env file with your configuration
```

### 3. Start All Services
```bash
./start-services.sh
```

### 4. Verify Services
```bash
./health-check.sh
```

## 🌐 Service Endpoints

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Dashboard** | http://localhost:3000 | Modern React Web Application |
| Eureka Server | http://localhost:8761 | Service Discovery Dashboard |
| API Gateway | http://localhost:8765 | Main API Entry Point |
| Users Service | http://localhost:8081/api/v1/ | User Management APIs |
| Product Service | http://localhost:8080/api/v1/ | Product Management APIs |
| Prometheus | http://localhost:9090 | Metrics Collection |
| Grafana | http://localhost:3001 | Monitoring Dashboard |

## 🔐 Security

### Authentication Flow
1. **Login**: POST `/api/v1/users/login`
2. **JWT Token**: Received upon successful authentication
3. **API Access**: Include token in `Authorization: Bearer <token>` header

### Protected Endpoints
- All endpoints except `/health/**`, `/actuator/**`, and `/api/v1/users/login`
- Role-based access control for admin operations

## 📊 Monitoring & Health

### Health Endpoints
- **Eureka**: `/actuator/health`
- **API Gateway**: `/actuator/health`
- **Users Service**: `/api/v1/actuator/health`
- **Product Service**: `/api/v1/actuator/health`

### Metrics
- **Prometheus**: `/actuator/prometheus`
- **Custom Metrics**: Business-specific metrics collection
- **Performance Monitoring**: Response times, throughput, error rates

## 🐳 Docker Management

### Start Services
```bash
./start-services.sh
```

### Stop Services
```bash
./stop-services.sh
```

### Clean Shutdown (with volume removal)
```bash
./stop-services.sh --clean
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f users-service
```

## 🔧 Development

### Local Development
```bash
# Start only databases
docker-compose up users-db products-db

# Run services locally with Maven
cd users-service && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd api-gateway-virunga-app && mvn spring-boot:run
cd eureka-server && mvn spring-boot:run
```

### Building Services
```bash
# Build all services
mvn clean package -DskipTests

# Build specific service
cd users-service && mvn clean package -DskipTests
```

## 📝 Configuration

### Environment Variables
- `USERNAME`: Database username
- `PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- Service ports and monitoring configuration

### Profiles
- **Default**: Local development configuration
- **Docker**: Containerized deployment configuration

## 🚨 Troubleshooting

### Common Issues
1. **Port Conflicts**: Ensure ports are not already in use
2. **Database Connection**: Check database container status
3. **Service Registration**: Verify Eureka server is running
4. **JWT Issues**: Ensure consistent JWT secret across services

### Debug Commands
```bash
# Check container status
docker-compose ps

# View service logs
docker-compose logs -f <service-name>

# Health check
./health-check.sh

# Restart specific service
docker-compose restart <service-name>
```

## 📈 Performance & Scaling

### Current Configuration
- **Memory**: Optimized for development
- **Database**: Connection pooling enabled
- **Caching**: Redis integration ready
- **Load Balancing**: Client-side load balancing via Eureka

### Scaling Considerations
- Horizontal scaling via Docker Swarm or Kubernetes
- Database read replicas
- API Gateway clustering
- Service mesh implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review service logs for error details

---

**Happy Coding! 🚀**
# Product Service — Virunga (product-service)

A lightweight Spring Boot microservice that manages the product catalog for the Virunga system.
Implements clean REST APIs, persistence with Postgres, Docker containerization, and CI/CD with Jenkins.

## Key Features

- Full REST API for product CRUD operations
- JPA & Hibernate persistence (H2 for dev, Postgres for production)
- DTOs, validation, and consistent error responses
- Spring Actuator for health and metrics monitoring
- OpenAPI/Swagger UI for live API documentation
- Dockerized for easy local and cloud deployment
- Jenkins Pipeline for automated build, test, and Docker push

## Prerequisites

- Java 17+ (Java 21 recommended)
- Maven 3.9+
- Docker (optional for container runs)
- PostgreSQL database (for production)

## Run Locally

Using Maven:

```bash
mvn spring-boot:run
```

Or build and run the JAR:

```bash
mvn clean package
java -jar target/product-service-*.jar
```

## Docker Build & Run

Build the Docker image:

```bash
docker build -t eustachekamala/virunga-product-app .
```

Run the container:

```bash
docker run -p 8080:8080 eustachekamala/virunga-product-app
```

## 🌐 API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/products | List all products (supports paging & filtering) |
| GET | /api/v1/products/{id} | Get product by ID |
| POST | /api/v1/products | Create a new product |
| PUT | /api/v1/products/{id} | Update existing product |
| DELETE | /api/v1/products/{id} | Delete product by ID |

## Swagger / API Documentation

👉 Deployed Swagger UI:  
[API Documentation](https://virunga-product-app.onrender.com/api/v1/swagger-ui/index.html#/)

This interface allows you to explore and test all REST endpoints interactively.

## CI/CD (Jenkins Pipeline)

- Checkout from GitHub using Jenkins credentials (jen-doc-git)
- Build & test using Maven (Maven 3.9.11, JDK 21)
- Build Docker image with Dockerfile
- Push image to Docker Hub using dockerhub_credentials
- Deploy automatically to Render

## Deployment

- Platform: Render
- App URL: [Virunga Product App](https://virunga-product-app.onrender.com)
- Swagger UI: [API Documentation](https://virunga-product-app.onrender.com/api/v1/swagger-ui/index.html#/)
- Docker Image: `eustachekamala/virunga-product-app`

## Low-stock email alerts (what was added)

This project includes a simple email notification feature in the `product-service` that sends an alert to the administrator when one or more products are below their configured stock threshold.

- EmailService: a small service that sends plain-text notification emails via Spring's `JavaMailSender` (used by the low-stock scheduler)

- LowStockScheduler: a scheduled task that runs every 12 hours to check for products below the stock threshold and sends email alerts using the EmailService.

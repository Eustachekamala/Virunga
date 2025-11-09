# 📦 Product Service — Virunga (product-service)

Lightweight Spring Boot microservice that manages the product catalog. Implements REST CRUD, persistence, and observability for local development and containerized deployment.

## Key features

- REST API for product CRUD (JSON)
- JPA-based persistence (H2 by default, replaceable with Postgres)
- DTOs, validation, and standard error responses
- Spring Actuator endpoints (health, metrics)
- OpenAPI/Swagger for API documentation
- Dockerized for local integration

## Project layout (inside product-service)

- src/main/java — application source
- src/main/resources — configuration (application.yml), static assets
- src/test — unit & integration tests
- Dockerfile — container image definition
- pom.xml — Maven build file
- README.md — this file

## Prerequisites

- Java 17+
- Maven (or use included wrapper)
- Docker (optional, for container runs)

## Run locally

Using Maven:

- mvn spring-boot:run

Or build and run jar:

- mvn clean package
- java -jar target/product-service-*.jar

## API (summary)

- GET /api/v1/products — list products (supports paging & filtering)
- GET /api/v1/products/{id} — get product by id
- POST /api/v1/products — create product (JSON body)
- PUT /api/v1/products/{id} — update product
- DELETE /api/v1/products/{id} — delete product

OpenAPI UI (if enabled):

- /swagger-ui.html or /swagger-ui/index.html

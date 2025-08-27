package com.eustache.api_gateway_virunga_app.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Users Service Routes
                .route("users-service", r -> r
                        .path("/api/v1/users/**")
                        .filters(f -> f
                                .rewritePath("/api/v1/users/(?<segment>.*)", "/api/v1/users/${segment}")
                                .addRequestHeader("X-Response-Time", System.currentTimeMillis() + "")
                        )
                        .uri("lb://users-service-virunga"))
                
                // Product Service Routes
                .route("product-service", r -> r
                        .path("/api/v1/products/**")
                        .filters(f -> f
                                .rewritePath("/api/v1/products/(?<segment>.*)", "/api/v1/products/${segment}")
                                .addRequestHeader("X-Response-Time", System.currentTimeMillis() + "")
                        )
                        .uri("lb://product-service-virunga"))
                
                // Health Check Route
                .route("health-check", r -> r
                        .path("/health/**")
                        .uri("http://localhost:8761"))
                
                .build();
    }
}


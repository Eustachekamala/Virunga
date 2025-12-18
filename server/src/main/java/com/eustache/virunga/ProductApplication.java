package com.eustache.virunga;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(
        info = @Info(
                title = "Product Management API",
                version = "1.0",
                description = "API for managing products, including CRUD operations and inventory tracking."
        )
)
@SpringBootApplication
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
//@EnableCaching
public class ProductApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductApplication.class, args);
	}

}

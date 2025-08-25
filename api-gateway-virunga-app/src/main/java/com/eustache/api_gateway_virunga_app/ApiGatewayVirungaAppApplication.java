package com.eustache.api_gateway_virunga_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayVirungaAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayVirungaAppApplication.class, args);
	}

}

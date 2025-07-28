package com.eustache.virunga.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

//@Configuration
public class S3Config {
    @Value("${}")
    private String accessKey;
    @Value("${}")
    private String secretKey;
    @Value("${}")
    private String region;
//    @Bean
//    public S3Config s3Config() {
//        S3Client.builder()
//                .region(Region.of(region));
//
//    }
}

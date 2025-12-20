package com.eustache.virunga.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableCaching
@Slf4j
public class RedisConfig {
   
    /**
     * Try to create Redis connection factory.
     * If Redis is not available, the application will use in-memory caching instead.
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        try {
            // Test Redis connection
            redisConnectionFactory.getConnection().ping();
            log.info("✅ Redis connection established successfully");
            
            return createRedisCacheManager(redisConnectionFactory);
        } catch (Exception e) {
            log.warn("⚠️ Redis is not available ({}). Using in-memory caching instead.", e.getMessage());
            log.warn("⚠️ To enable Redis, ensure it is running on the configured host and port.");
            
            return createInMemoryCacheManager();
        }
    }

    /**
     * Creates Redis-based cache manager with custom TTL configurations
     */
    private RedisCacheManager createRedisCacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .entryTtl(Duration.ofMinutes(10))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();

        // Configure TTL for each cache
        cacheConfigurations.put("PRODUCT_BY_ID",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("PRODUCT_LIST",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(20)));
        cacheConfigurations.put("PRODUCT_BY_CATEGORY",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("PRODUCT_BY_TYPE",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(15)));
        cacheConfigurations.put("PRODUCT_BY_NAME",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(10)));
        cacheConfigurations.put("LOW_STOCK",
                defaultCacheConfig.entryTtl(Duration.ofMinutes(5)));

        log.info("✅ RedisCacheManager initialized with {} cache configurations", 
                 cacheConfigurations.size());
        
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultCacheConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }

    /**
     * Creates in-memory cache manager as fallback when Redis is unavailable
     */
    private CacheManager createInMemoryCacheManager() {
        log.info("📦 Using in-memory caching (ConcurrentMapCacheManager)");
        log.warn("⚠️ In-memory cache is NOT distributed and will be lost on application restart");
        
        return new ConcurrentMapCacheManager(
                "PRODUCT_BY_ID",
                "PRODUCT_LIST",
                "PRODUCT_BY_CATEGORY",
                "PRODUCT_BY_TYPE",
                "PRODUCT_BY_NAME",
                "LOW_STOCK"
        );
    }

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }
}

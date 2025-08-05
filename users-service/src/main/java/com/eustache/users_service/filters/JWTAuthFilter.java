package com.eustache.users_service.filters;

import com.eustache.users_service.services.CustomUserDetailsService;
import com.eustache.users_service.utils.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter {
    private final JWTUtil jWTUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            //Here we extract the username on the token
            try {
                username = jWTUtil.extractUsername(token);
            }catch (Exception e) {
                log.info("Jwt parsing failed: {}", e.getMessage());
            }
        }
        //We want to validate the token
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
           try {
                //Fetch user by username
               UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
               if (jWTUtil.validateToken(username,userDetails,token)){
                   UsernamePasswordAuthenticationToken authenticationToken =  new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                   authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                   SecurityContextHolder.getContext().setAuthentication(authenticationToken);
               }
           }catch (Exception e) {
               log.info("Failed to set username from token: {}", e.getMessage());
           }
        }
        filterChain.doFilter(request,response);
    }
}

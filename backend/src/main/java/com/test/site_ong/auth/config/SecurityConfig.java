package com.test.site_ong.auth.config;

import com.test.site_ong.auth.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(Arrays.asList(allowedOrigins.split("\\s*,\\s*")));
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("*"));
        cors.setExposedHeaders(List.of("Authorization"));
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(c -> c.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Change-password requires an authenticated admin
                .requestMatchers(HttpMethod.POST, "/api/auth/change-password").hasRole("ADMIN")

                // Login + token check are always reachable
                .requestMatchers("/api/auth/**").permitAll()

                // Static uploaded media (article/project images)
                .requestMatchers("/uploads/**").permitAll()

                // Health
                .requestMatchers(HttpMethod.GET, "/api/health/**").permitAll()

                // Public reads for the public site
                .requestMatchers(HttpMethod.GET, "/api/articles", "/api/articles/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/upcoming-projects", "/api/upcoming-projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/completed-projects", "/api/completed-projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/team", "/api/team/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()

                // Public form submissions
                .requestMatchers(HttpMethod.POST, "/api/volunteers").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/comments/**").permitAll()

                // Donation flow (the donor isn't authenticated)
                .requestMatchers(HttpMethod.POST, "/api/donators/add-donor").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/donators/create-checkout-session").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/donators/update-payment-status").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/donators/session-status").permitAll()
                .requestMatchers("/api/stripe/**").permitAll()

                // Always allow CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Anything else under /api/** requires admin
                .requestMatchers("/api/**").hasRole("ADMIN")

                .anyRequest().permitAll()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

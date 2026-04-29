package com.test.site_ong.auth.controller;

import com.test.site_ong.auth.dto.LoginRequest;
import com.test.site_ong.auth.dto.LoginResponse;
import com.test.site_ong.auth.dto.MeResponse;
import com.test.site_ong.auth.repo.AdminUserRepository;
import com.test.site_ong.auth.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            UserDetails user = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(user);

            adminUserRepository.findByUsername(user.getUsername()).ifPresent(u -> {
                u.setLastLoginAt(LocalDateTime.now());
                adminUserRepository.save(u);
            });

            return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), jwtService.getExpirationMs()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails user)) {
            return ResponseEntity.status(401).build();
        }
        String role = user.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");
        return ResponseEntity.ok(new MeResponse(user.getUsername(), role));
    }
}

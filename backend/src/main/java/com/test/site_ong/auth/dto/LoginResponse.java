package com.test.site_ong.auth.dto;

public record LoginResponse(
        String token,
        String username,
        long expiresInMs
) {
}

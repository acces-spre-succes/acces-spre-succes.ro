package com.test.site_ong.auth.service;

import com.test.site_ong.auth.repo.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminUserRepository.findByUsername(username)
                .map(u -> new User(
                        u.getUsername(),
                        u.getPasswordHash(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole()))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found: " + username));
    }
}

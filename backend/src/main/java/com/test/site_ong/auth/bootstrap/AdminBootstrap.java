package com.test.site_ong.auth.bootstrap;

import com.test.site_ong.auth.model.AdminUser;
import com.test.site_ong.auth.repo.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    @Value("${app.admin.bootstrap-username:}")
    private String bootstrapUsername;

    @Value("${app.admin.bootstrap-password:}")
    private String bootstrapPassword;

    /**
     * On the very first startup (no admin users in the DB), create one from the
     * ADMIN_BOOTSTRAP_USERNAME / ADMIN_BOOTSTRAP_PASSWORD env vars.
     * Once an admin exists this is a no-op, so changing the env vars later has no effect
     * (use the admin panel itself to add/remove users).
     */
    @Bean
    public ApplicationRunner seedInitialAdmin(AdminUserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (repo.count() > 0) {
                return;
            }
            if (bootstrapUsername == null || bootstrapUsername.isBlank()
                    || bootstrapPassword == null || bootstrapPassword.isBlank()) {
                log.warn("No admin user exists yet and ADMIN_BOOTSTRAP_USERNAME / ADMIN_BOOTSTRAP_PASSWORD are not set. "
                        + "The admin panel will be unusable until you create one.");
                return;
            }
            AdminUser admin = AdminUser.builder()
                    .username(bootstrapUsername)
                    .passwordHash(encoder.encode(bootstrapPassword))
                    .role("ADMIN")
                    .build();
            repo.save(admin);
            log.info("Seeded initial admin user '{}'. Rotate the password from the admin panel after first login.",
                    bootstrapUsername);
        };
    }
}

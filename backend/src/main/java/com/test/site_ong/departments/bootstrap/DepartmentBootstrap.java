package com.test.site_ong.departments.bootstrap;

import com.test.site_ong.departments.model.Department;
import com.test.site_ong.departments.repo.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Seeds the five default departments the first time the backend starts
 * against an empty {@code departments} table. Idempotent: once any rows
 * exist the runner is a no-op, so renaming or deleting a default in the
 * admin panel is preserved across restarts.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DepartmentBootstrap {

    private record Seed(String name, String description, int order) { }

    private static final List<Seed> DEFAULTS = List.of(
            new Seed("Consiliu director",
                    "Membrii consiliului de administrație al asociației — responsabili de viziune, strategie și reprezentare publică.",
                    0),
            new Seed("Evenimente",
                    "Echipa care organizează taberele sociale, campaniile de strângere de fonduri și activitățile cu copiii.",
                    1),
            new Seed("IT",
                    "Tehnologie, website, infrastructură digitală și suport pentru proiectele educaționale.",
                    2),
            new Seed("Social Media",
                    "Comunicare online, conținut pentru rețele sociale și relația cu comunitatea.",
                    3),
            new Seed("Sponsori",
                    "Relații cu sponsori, parteneri și donatori instituționali.",
                    4)
    );

    @Bean
    ApplicationRunner seedDepartments(DepartmentRepository repo) {
        return args -> {
            if (repo.count() > 0) {
                log.debug("Departments table already populated; skipping seed.");
                return;
            }
            for (Seed s : DEFAULTS) {
                Department d = new Department();
                d.setName(s.name());
                d.setDescription(s.description());
                d.setDisplayOrder(s.order());
                repo.save(d);
            }
            log.info("Seeded {} default departments. Rename/delete them from the admin panel as needed.",
                    DEFAULTS.size());
        };
    }
}

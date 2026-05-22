package com.test.site_ong.upcoming_project.controller;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.service.UpcomingProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Slug-based project lookup — powers the /projects/:slug public URLs.
 * Both upcoming and completed projects share the same endpoint.
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final UpcomingProjectService service;

    public ProjectController(UpcomingProjectService service) {
        this.service = service;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<UpcomingProject> getBySlug(@PathVariable String slug) {
        UpcomingProject p = service.getBySlug(slug);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }
}

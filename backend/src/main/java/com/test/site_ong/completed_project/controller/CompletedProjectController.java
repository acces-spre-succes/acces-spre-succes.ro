package com.test.site_ong.completed_project.controller;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.service.UpcomingProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Delegates to UpcomingProjectService so that projects with completed=true
 * appear at /api/completed-projects — the public site keeps working unchanged.
 */
@RestController
@RequestMapping("/api/completed-projects")
public class CompletedProjectController {

    private final UpcomingProjectService service;

    public CompletedProjectController(UpcomingProjectService service) {
        this.service = service;
    }

    @GetMapping
    public List<UpcomingProject> getAll() {
        return service.getCompleted();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpcomingProject> getById(@PathVariable Long id) {
        UpcomingProject p = service.getById(id);
        if (p == null || !Boolean.TRUE.equals(p.getCompleted())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}

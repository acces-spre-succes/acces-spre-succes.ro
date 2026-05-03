package com.test.site_ong.upcoming_project.controller;

import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.service.UpcomingProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/upcoming-projects")
public class UpcomingProjectController {

    private final UpcomingProjectService service;

    public UpcomingProjectController(UpcomingProjectService service) {
        this.service = service;
    }

    /** Public – returns only active (not-yet-completed) projects. */
    @GetMapping
    public List<UpcomingProject> getUpcoming() {
        return service.getUpcoming();
    }

    /** Admin – returns ALL projects regardless of status. */
    @GetMapping("/all")
    public List<UpcomingProject> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpcomingProject> getById(@PathVariable Long id) {
        UpcomingProject p = service.getById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UpcomingProject> add(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) {
        try {
            return ResponseEntity.ok(service.addProject(title, description, image));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpcomingProject> update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image) {
        try {
            return ResponseEntity.ok(service.updateProject(id, title, description, image));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /** Toggle completed ↔ active. Admin only (secured by default deny-all rule). */
    @PatchMapping("/{id}/status")
    public ResponseEntity<UpcomingProject> toggleStatus(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.toggleStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProject(id);
        return ResponseEntity.ok().build();
    }
}

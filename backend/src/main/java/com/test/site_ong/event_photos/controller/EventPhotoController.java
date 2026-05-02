package com.test.site_ong.event_photos.controller;

import com.test.site_ong.event_photos.model.EventPhoto;
import com.test.site_ong.event_photos.service.EventPhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/event-photos")
public class EventPhotoController {

    private final EventPhotoService service;

    public EventPhotoController(EventPhotoService service) {
        this.service = service;
    }

    /**
     * GET /api/event-photos?projectId=1&projectType=UPCOMING
     */
    @GetMapping
    public ResponseEntity<List<EventPhoto>> getByProject(
            @RequestParam Long projectId,
            @RequestParam String projectType) {
        return ResponseEntity.ok(service.getByProject(projectId, projectType));
    }

    @PostMapping
    public ResponseEntity<EventPhoto> add(
            @RequestParam Long projectId,
            @RequestParam String projectType,
            @RequestParam(required = false) String caption,
            @RequestParam MultipartFile photo) {
        try {
            return ResponseEntity.ok(service.add(projectId, projectType, caption, photo));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}

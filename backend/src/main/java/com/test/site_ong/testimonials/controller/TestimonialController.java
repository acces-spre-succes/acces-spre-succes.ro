package com.test.site_ong.testimonials.controller;

import com.test.site_ong.testimonials.model.Testimonial;
import com.test.site_ong.testimonials.service.TestimonialService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {

    private final TestimonialService service;

    public TestimonialController(TestimonialService service) {
        this.service = service;
    }

    @GetMapping
    public List<Testimonial> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getById(@PathVariable Long id) {
        Testimonial t = service.getById(id);
        return t == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(t);
    }

    @PostMapping
    public ResponseEntity<Testimonial> create(
            @RequestParam String authorName,
            @RequestParam(required = false) String role,
            @RequestParam String quote,
            @RequestParam(required = false) Integer displayOrder,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            return ResponseEntity.ok(service.create(authorName, role, quote, displayOrder, photo));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Testimonial> update(
            @PathVariable Long id,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String quote,
            @RequestParam(required = false) Integer displayOrder,
            @RequestParam(required = false) MultipartFile photo) {
        try {
            Testimonial t = service.update(id, authorName, role, quote, displayOrder, photo);
            return t == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(t);
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

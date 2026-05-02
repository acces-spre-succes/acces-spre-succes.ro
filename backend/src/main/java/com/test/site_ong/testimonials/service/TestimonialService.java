package com.test.site_ong.testimonials.service;

import com.test.site_ong.testimonials.model.Testimonial;
import com.test.site_ong.testimonials.repo.TestimonialRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class TestimonialService {

    private final TestimonialRepository repo;
    private final String uploadDir;

    public TestimonialService(TestimonialRepository repo,
                              @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repo = repo;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    public List<Testimonial> getAll() {
        return repo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    public Testimonial getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Testimonial create(String authorName, String role, String quote,
                              Integer displayOrder, MultipartFile photo) throws IOException {
        Testimonial t = new Testimonial();
        t.setAuthorName(authorName);
        t.setRole(role);
        t.setQuote(quote);
        t.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        if (photo != null && !photo.isEmpty()) {
            t.setPhotoPath(saveFile(photo));
        }
        return repo.save(t);
    }

    public Testimonial update(Long id, String authorName, String role, String quote,
                              Integer displayOrder, MultipartFile photo) throws IOException {
        Testimonial t = repo.findById(id).orElse(null);
        if (t == null) return null;
        if (authorName != null) t.setAuthorName(authorName);
        if (role != null) t.setRole(role);
        if (quote != null) t.setQuote(quote);
        if (displayOrder != null) t.setDisplayOrder(displayOrder);
        if (photo != null && !photo.isEmpty()) {
            t.setPhotoPath(saveFile(photo));
        }
        return repo.save(t);
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir + "/" + fileName);
        file.transferTo(dest);
        return "/uploads/" + fileName;
    }
}

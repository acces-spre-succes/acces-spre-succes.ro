package com.test.site_ong.event_photos.service;

import com.test.site_ong.event_photos.model.EventPhoto;
import com.test.site_ong.event_photos.model.ReorderItem;
import com.test.site_ong.event_photos.repo.EventPhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class EventPhotoService {

    private final EventPhotoRepository repo;
    private final String uploadDir;

    public EventPhotoService(EventPhotoRepository repo,
                             @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repo = repo;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
    }

    public List<EventPhoto> getByProject(Long projectId, String projectType) {
        return repo.findByProjectIdAndProjectTypeOrderByDisplayOrderAscUploadedAtAsc(
                projectId, projectType.toUpperCase());
    }

    public EventPhoto add(Long projectId, String projectType, String caption,
                          Integer displayOrder, MultipartFile photo) throws IOException {
        EventPhoto ep = new EventPhoto();
        ep.setProjectId(projectId);
        ep.setProjectType(projectType.toUpperCase());
        ep.setCaption(caption);
        ep.setDisplayOrder(displayOrder);
        ep.setPhotoPath(saveFile(photo));
        return repo.save(ep);
    }

    public void reorder(List<ReorderItem> items) {
        for (ReorderItem item : items) {
            repo.findById(item.getId()).ifPresent(ep -> {
                ep.setDisplayOrder(item.getDisplayOrder());
                repo.save(ep);
            });
        }
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

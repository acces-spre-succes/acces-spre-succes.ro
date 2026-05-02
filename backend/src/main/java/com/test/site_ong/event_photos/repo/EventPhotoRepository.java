package com.test.site_ong.event_photos.repo;

import com.test.site_ong.event_photos.model.EventPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventPhotoRepository extends JpaRepository<EventPhoto, Long> {
    List<EventPhoto> findByProjectIdAndProjectTypeOrderByDisplayOrderAscUploadedAtAsc(Long projectId, String projectType);
}

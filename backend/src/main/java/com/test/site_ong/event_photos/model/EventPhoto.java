package com.test.site_ong.event_photos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_photos")
public class EventPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID of the related project (UpcomingProject or CompletedProject) */
    @Column(nullable = false)
    private Long projectId;

    /** "UPCOMING" or "COMPLETED" */
    @Column(nullable = false, length = 20)
    private String projectType;

    @Column(nullable = false)
    private String photoPath;

    @Column(length = 300)
    private String caption;

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onUpload() {
        uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}

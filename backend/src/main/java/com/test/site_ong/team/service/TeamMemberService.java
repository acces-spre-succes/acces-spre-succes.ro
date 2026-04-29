package com.test.site_ong.team.service;

import com.test.site_ong.team.model.TeamMember;
import com.test.site_ong.team.repo.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class TeamMemberService {

    private final TeamMemberRepository repo;
    private final String uploadDir;

    public TeamMemberService(TeamMemberRepository repo,
                             @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repo = repo;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public List<TeamMember> getAll() {
        return repo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    public TeamMember getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public TeamMember create(String firstName,
                             String lastName,
                             String email,
                             String role,
                             String bio,
                             Integer displayOrder,
                             MultipartFile photo) throws IOException {
        TeamMember m = new TeamMember();
        m.setFirstName(firstName);
        m.setLastName(lastName);
        m.setEmail(email);
        m.setRole(role);
        m.setBio(bio);
        m.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        if (photo != null && !photo.isEmpty()) {
            m.setPhotoPath(savePhoto(photo));
        }
        return repo.save(m);
    }

    public TeamMember update(Long id,
                             String firstName,
                             String lastName,
                             String email,
                             String role,
                             String bio,
                             Integer displayOrder,
                             MultipartFile photo) throws IOException {
        TeamMember m = repo.findById(id).orElse(null);
        if (m == null) return null;
        if (firstName != null) m.setFirstName(firstName);
        if (lastName != null) m.setLastName(lastName);
        if (email != null) m.setEmail(email);
        m.setRole(role);
        m.setBio(bio);
        if (displayOrder != null) m.setDisplayOrder(displayOrder);
        if (photo != null && !photo.isEmpty()) {
            m.setPhotoPath(savePhoto(photo));
        }
        return repo.save(m);
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) return false;
        repo.deleteById(id);
        return true;
    }

    private String savePhoto(MultipartFile photo) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
        File dest = new File(uploadDir + "/" + fileName);
        photo.transferTo(dest);
        return "/uploads/" + fileName;
    }
}

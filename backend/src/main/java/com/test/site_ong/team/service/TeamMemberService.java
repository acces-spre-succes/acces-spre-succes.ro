package com.test.site_ong.team.service;

import com.test.site_ong.departments.model.Department;
import com.test.site_ong.departments.repo.DepartmentRepository;
import com.test.site_ong.team.model.TeamMember;
import com.test.site_ong.team.model.TeamReorderItem;
import com.test.site_ong.team.repo.TeamMemberRepository;
import com.test.site_ong.upcoming_project.model.UpcomingProject;
import com.test.site_ong.upcoming_project.repo.UpcomingProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeamMemberService {

    private final TeamMemberRepository repo;
    private final DepartmentRepository departmentRepo;
    private final UpcomingProjectRepository projectRepo;
    private final String uploadDir;

    public TeamMemberService(TeamMemberRepository repo,
                             DepartmentRepository departmentRepo,
                             UpcomingProjectRepository projectRepo,
                             @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.repo = repo;
        this.departmentRepo = departmentRepo;
        this.projectRepo = projectRepo;
        this.uploadDir = uploadDir;
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public List<TeamMember> getAll() {
        return repo.findAllByOrderByDisplayOrderAscIdAsc();
    }

    public List<TeamMember> getByDepartment(Long departmentId) {
        return repo.findByDepartments_IdOrderByDisplayOrderAscIdAsc(departmentId);
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
                             List<Long> departmentIds,
                             MultipartFile photo) throws IOException {
        TeamMember m = new TeamMember();
        m.setFirstName(firstName);
        m.setLastName(lastName);
        m.setEmail(email);
        m.setRole(role);
        m.setBio(bio);
        m.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        m.setDepartments(resolveDepartments(departmentIds));
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
                             List<Long> departmentIds,
                             MultipartFile photo) throws IOException {
        TeamMember m = repo.findById(id).orElse(null);
        if (m == null) return null;
        if (firstName != null) m.setFirstName(firstName);
        if (lastName != null) m.setLastName(lastName);
        if (email != null) m.setEmail(email);
        m.setRole(role);
        m.setBio(bio);
        if (displayOrder != null) m.setDisplayOrder(displayOrder);
        // The admin form always knows the full desired set, so a missing /
        // empty `departmentIds` param is treated as "clear all". Keep this in
        // sync if a partial-update API ever becomes necessary.
        m.setDepartments(resolveDepartments(departmentIds));
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

    /** Bulk-update displayOrder for a set of members (drag-and-drop reorder). */
    public void reorder(List<TeamReorderItem> items) {
        Map<Long, Integer> orderMap = items.stream()
                .collect(Collectors.toMap(TeamReorderItem::getId, TeamReorderItem::getDisplayOrder));
        List<TeamMember> affected = repo.findAllById(orderMap.keySet());
        affected.forEach(m -> m.setDisplayOrder(orderMap.get(m.getId())));
        repo.saveAll(affected);
    }

    /** Soft-archive: hide from public page but keep in DB. */
    public TeamMember setArchived(Long id, boolean archived) {
        TeamMember m = repo.findById(id).orElse(null);
        if (m == null) return null;
        m.setArchived(archived);
        return repo.save(m);
    }

    /** Replace the full set of project assignments for a member. */
    public TeamMember setProjects(Long memberId, List<Long> projectIds) {
        TeamMember m = repo.findById(memberId).orElse(null);
        if (m == null) return null;
        List<UpcomingProject> projects = projectIds == null ? new ArrayList<>()
                : new ArrayList<>(projectRepo.findAllById(projectIds));
        m.setProjects(projects);
        return repo.save(m);
    }

    private Set<Department> resolveDepartments(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        return new HashSet<>(departmentRepo.findAllById(ids));
    }

    private String savePhoto(MultipartFile photo) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
        File dest = new File(uploadDir + "/" + fileName);
        photo.transferTo(dest);
        return "/uploads/" + fileName;
    }
}

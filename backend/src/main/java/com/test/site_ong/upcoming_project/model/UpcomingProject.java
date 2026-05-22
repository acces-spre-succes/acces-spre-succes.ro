package com.test.site_ong.upcoming_project.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.test.site_ong.team.model.TeamMember;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = "volunteers")
@ToString(exclude = "volunteers")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "upcoming_projects")
public class UpcomingProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String imagePath;

    /** false = upcoming / active, true = completed / finished */
    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean completed = false;

    /**
     * URL-friendly slug derived from the title (e.g. "femeia-intre-suflet-si-putere").
     * Generated once on creation; not changed when the title is edited so existing
     * links never break.
     */
    @Column(unique = true)
    private String slug;

    /**
     * Team members who volunteered / participated in this project.
     * Mapped-by the join table declared on TeamMember.projects.
     */
    @ManyToMany(mappedBy = "projects", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("projects")
    private List<TeamMember> volunteers = new ArrayList<>();
}

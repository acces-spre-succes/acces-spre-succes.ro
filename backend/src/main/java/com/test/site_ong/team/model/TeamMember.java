package com.test.site_ong.team.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.test.site_ong.departments.model.Department;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * A curated team member shown publicly on the website (echipă page).
 * Different from {@code volunteerForm.Volunteer}, which stores private
 * application-form submissions and must NEVER be exposed publicly.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "team_members")
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    /** Public-facing contact email displayed on the team page. */
    @Column(nullable = false)
    private String email;

    /** Free-text role/title, e.g. "Voluntar", "Coordonator IT", "Membru consiliu". */
    @Column(length = 120)
    private String role;

    /** Short bio, optional. */
    @Column(length = 1000)
    private String bio;

    /** Path to the profile photo, e.g. "/uploads/1735468291231_jane.jpg". */
    @Column(name = "photo_path")
    private String photoPath;

    /**
     * Sort order on the public page; lower comes first. Defaults to 0 so
     * unset members fall together at the top in insertion order.
     */
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    /**
     * Departments the member belongs to. M:N because volunteers commonly
     * sit on multiple committees (e.g. someone in IT can also help with
     * Events). The join table is owned on this side; deleting a member
     * automatically removes their join rows. To delete a Department, the
     * service first clears it from each member's set (see
     * DepartmentService.delete).
     *
     * @JsonIgnoreProperties stops Jackson recursing back into the Set<TeamMember>
     * inverse side if we ever add it to Department.
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "team_member_departments",
            joinColumns = @JoinColumn(name = "team_member_id"),
            inverseJoinColumns = @JoinColumn(name = "department_id")
    )
    @JsonIgnoreProperties("members")
    private Set<Department> departments = new HashSet<>();
}

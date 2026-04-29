package com.test.site_ong.team.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
     * Department the member belongs to. Stored as a plain string so admins
     * can introduce new departments later without a backend deploy. Known
     * values today: BOARD, EVENTS, IT, SOCIAL_MEDIA, SPONSORS. NULL means
     * the member is shown on /echipa but not under any department heading.
     */
    @Column(length = 64)
    private String department;
}

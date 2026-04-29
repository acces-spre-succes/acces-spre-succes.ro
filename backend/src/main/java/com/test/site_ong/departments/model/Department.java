package com.test.site_ong.departments.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A department within the NGO (Board, Events, IT, Social Media, Sponsors, …).
 * Admins can rename, add and delete departments at runtime; team members
 * link to departments via a many-to-many relationship.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "departments", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(length = 2000)
    private String description;

    /** Lower comes first on the public carousel; ties broken by id. */
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}

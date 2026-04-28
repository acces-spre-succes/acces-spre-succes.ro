package com.test.site_ong.comments.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table (name = "comments")
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 100, message = "Username must have at least 2 characters and no more then 100")
    @Column(name = "username", nullable = false)
    private String username;

    @NotBlank(message = "Comment is required")
    @Size(min = 2, max = 500, message = "Comment must have at least 2 characters and no more then 500")
    @Column(name = "comment", nullable = false)
    private String comment;

    @CreationTimestamp
    @Column(name = "published_date", nullable = false)
    private LocalDateTime date;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}

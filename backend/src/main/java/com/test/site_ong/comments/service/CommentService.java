package com.test.site_ong.comments.service;

import com.test.site_ong.comments.model.Comment;
import com.test.site_ong.comments.repo.CommentRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    //dependency injection(we inject the repo)
    private final CommentRepo commentRepo;

    //adding a new comment to the database
    @Transactional
    public Comment saveComment(Comment comment) {
        return commentRepo.save(comment);
    }

    //getting a comment by id
    @Transactional
    public Optional<Comment> getCommentById(Integer id) {
        return commentRepo.findById(id);
    }

    @Transactional
    public List<Comment> getCommentsByDate(LocalDateTime start, LocalDateTime end) {
        return commentRepo.findByDate(start, end);
    }

    //deleting a comment by id
    @Transactional
    public void deleteCommentById(Integer id) {
        commentRepo.deleteById(id);
    }


}

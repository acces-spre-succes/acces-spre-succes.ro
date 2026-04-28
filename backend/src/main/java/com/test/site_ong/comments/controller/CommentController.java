package com.test.site_ong.comments.controller;

import com.test.site_ong.comments.model.Comment;
import com.test.site_ong.comments.service.CommentService;
import com.test.site_ong.dto.ErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    //dependency injection (we inject the service)
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        try{
            Comment savedComment = commentService.saveComment(comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        }catch (IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid submission", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable Integer id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        if (comment.isPresent()) {
            return ResponseEntity.ok(comment.get());
        }else{
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Comment not found", "No comment found with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getCommentsByDate(@RequestParam LocalDateTime start, @RequestParam LocalDateTime end) {
        List<Comment> comments = commentService.getCommentsByDate(start, end);
        if (!comments.isEmpty()){
            return ResponseEntity.ok(comments);
        }else{
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NO_CONTENT.value(), "No comments found", "No comments posted on this date");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorResponse);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommentById(@PathVariable Integer id) {
        try{
            commentService.deleteCommentById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }catch (IllegalArgumentException e){
            ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Volunteer not found", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}

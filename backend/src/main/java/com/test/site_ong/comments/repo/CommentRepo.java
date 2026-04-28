package com.test.site_ong.comments.repo;

import com.test.site_ong.comments.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Integer> {

    //find comment based on id
    Comment findById(int id);

    //find comments based on date
    List<Comment> findByDate(LocalDateTime start, LocalDateTime end);

    //delete comment based on id
    void deleteById(int id);


}

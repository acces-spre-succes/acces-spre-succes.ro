package com.test.site_ong.articles.controller;

import com.test.site_ong.articles.model.Article;
import com.test.site_ong.articles.service.ArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.io.IOException;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<Article> getAllArticles(){
        return articleService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id){
        Article article = articleService.getById(id);
        if(article != null){
            return ResponseEntity.ok(article);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Article> addArticle(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) MultipartFile image
    ){
        try{
            Article article = articleService.addArticle(title, description, image);
            return ResponseEntity.ok(article);
        }catch(IOException e){
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Article> deleteArticle(@PathVariable Long id){
        articleService.deleteArticle(id);
        return ResponseEntity.ok().build();
    }
}

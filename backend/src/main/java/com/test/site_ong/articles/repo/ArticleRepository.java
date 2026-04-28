package com.test.site_ong.articles.repo;

import com.test.site_ong.articles.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article,Long> {}

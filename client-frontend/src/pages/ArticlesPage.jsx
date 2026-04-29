import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/articles`);
      setArticles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchArticles}>
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="articles-page">
      <motion.section
        className="page-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">{t('articles.title')}</h1>
          <p className="page-subtitle">{t('articles.subtitle')}</p>
        </div>
      </motion.section>

      <section className="articles-section section">
        <div className="container">
          {articles.length === 0 ? (
            <motion.div
              className="no-articles"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <p>{t('articles.noArticles')}</p>
            </motion.div>
          ) : (
            <motion.div
              className="articles-grid"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {articles.map((article) => (
                <motion.article
                  key={article.id}
                  className="article-card"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  {article.imagePath && (
                    <div className="article-image-wrapper">
                      <img
                        src={`${BACKEND_URL}${article.imagePath}`}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Crect width="400" height="250" fill="%231d4771"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23ebbd3a"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-description">{article.description}</p>
                    <button
                      className="btn btn-read-more"
                      onClick={() => handleArticleClick(article.id)}
                    >
                      {t('articles.readMore')}
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesPage;

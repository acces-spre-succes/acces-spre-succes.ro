import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './DetailPage.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
      setArticle(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
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

  if (error || !article) {
    return (
      <div className="error-container">
        <p>{error || t('common.notFound')}</p>
        <button className="btn btn-primary" onClick={() => navigate('/articles')}>
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <motion.div
        className="detail-container"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <button className="btn-back" onClick={() => navigate('/articles')}>
          ← {t('common.back')}
        </button>

        <div className="detail-content">
          <div className="detail-header">
            <img
              src="/AccesSpreSuccesLogo.jpeg"
              alt="Acces Spre Succes"
              className="detail-logo"
            />
            <motion.h1
              className="detail-title"
              variants={fadeIn}
            >
              {article.title}
            </motion.h1>
          </div>

          {article.imagePath && (
            <motion.div
              className="detail-image-wrapper"
              variants={fadeIn}
            >
              <img
                src={`${BACKEND_URL}${article.imagePath}`}
                alt={article.title}
                className="detail-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          )}

          <motion.div
            className="detail-description"
            variants={fadeIn}
          >
            <p>{article.description}</p>
          </motion.div>

          <motion.div
            className="detail-actions"
            variants={fadeIn}
          >
            <button
              className="btn btn-primary"
              onClick={() => navigate('/donate')}
            >
              {t('common.support')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/articles')}
            >
              {t('common.viewMore')}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleDetailPage;

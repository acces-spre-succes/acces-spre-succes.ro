import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './DetailPage.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if it's upcoming or completed based on URL
  const isUpcoming = location.pathname.includes('upcoming');
  const endpoint = isUpcoming ? 'upcoming-projects' : 'completed-projects';
  const backPath = isUpcoming ? '/upcoming-projects' : '/completed-projects';

  useEffect(() => {
    fetchProject();
  }, [id, endpoint]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/${id}`);
      setProject(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
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

  if (error || !project) {
    return (
      <div className="error-container">
        <p>{error || t('common.notFound')}</p>
        <button className="btn btn-primary" onClick={() => navigate(backPath)}>
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
        <button className="btn-back" onClick={() => navigate(backPath)}>
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
              {project.title}
            </motion.h1>
          </div>

          {project.imagePath && (
            <motion.div
              className="detail-image-wrapper"
              variants={fadeIn}
            >
              <img
                src={`${BACKEND_URL}${project.imagePath}`}
                alt={project.title}
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
            <p>{project.description}</p>
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
              onClick={() => navigate(backPath)}
            >
              {t('common.viewMore')}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetailPage;

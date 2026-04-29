import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './ProjectsPage.css';

const CompletedProjectsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/completed-projects`);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching completed projects:', err);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/completed-projects/${projectId}`);
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
        <button className="btn btn-primary" onClick={fetchProjects}>
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <motion.section
        className="page-header completed-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">{t('projects.completed.title')}</h1>
          <p className="page-subtitle">{t('projects.completed.subtitle')}</p>
        </div>
      </motion.section>

      <section className="projects-section section">
        <div className="container">
          {projects.length === 0 ? (
            <motion.div
              className="no-projects"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <p>{t('projects.completed.noProjects')}</p>
            </motion.div>
          ) : (
            <motion.div
              className="projects-grid"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="project-card completed-card"
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  {project.imagePath && (
                    <div className="project-image-wrapper">
                      <div className="project-badge completed-badge">
                        {t('projects.completed.title').split(' ')[0]}
                      </div>
                      <img
                        src={`${BACKEND_URL}${project.imagePath}`}
                        alt={project.title}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%231d4771"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23ebbd3a"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  <div className="project-content">
                    <h2 className="project-title">{project.title}</h2>
                    <p className="project-description">{project.description}</p>
                    <button
                      className="btn btn-learn-more"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {t('common.learnMore')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompletedProjectsPage;

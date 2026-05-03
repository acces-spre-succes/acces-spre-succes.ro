import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './DetailPage.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [project, setProject] = useState(null);
  const [photos, setPhotos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Lightbox
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const isUpcoming = location.pathname.includes('upcoming');
  const endpoint   = isUpcoming ? 'upcoming-projects' : 'completed-projects';
  const backPath   = isUpcoming ? '/upcoming-projects' : '/completed-projects';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [projRes, upRes, compRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/${endpoint}/${id}`),
          axios.get(`${API_BASE_URL}/event-photos?projectId=${id}&projectType=UPCOMING`),
          axios.get(`${API_BASE_URL}/event-photos?projectId=${id}&projectType=COMPLETED`),
        ]);
        setProject(projRes.data);
        // Combine both types (a project may have photos from when it was either state)
        const combined = [...(upRes.data || []), ...(compRes.data || [])];
        combined.sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));
        setPhotos(combined);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, endpoint]);

  // Keyboard navigation for lightbox
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIdx(i => Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft')  setLightboxIdx(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, photos.length, closeLightbox]);

  const fadeIn = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
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
    <>
      <div className="detail-page">
        <motion.div className="detail-container" initial="hidden" animate="visible" variants={fadeIn}>
          <button className="btn-back" onClick={() => navigate(backPath)}>
            ← {t('common.back')}
          </button>

          <div className="detail-content">
            <div className="detail-header">
              <img src="/AccesSpreSuccesLogo.jpeg" alt="Acces Spre Succes" className="detail-logo"
                onError={e => { e.target.style.display = 'none'; }} />
              <motion.h1 className="detail-title" variants={fadeIn}>{project.title}</motion.h1>
            </div>

            {project.imagePath && (
              <motion.div className="detail-image-wrapper" variants={fadeIn}>
                <img
                  src={`${BACKEND_URL}${project.imagePath}`}
                  alt={project.title}
                  className="detail-image"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </motion.div>
            )}

            <motion.div className="detail-description" variants={fadeIn}>
              <p>{project.description}</p>
            </motion.div>

            {/* ── Event photo gallery ── */}
            {photos.length > 0 && (
              <motion.div className="detail-gallery" variants={fadeIn}>
                <h2 className="detail-gallery__title">📸 Galerie foto</h2>
                <div className="detail-gallery__grid">
                  {photos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      className="detail-gallery__item"
                      onClick={() => setLightboxIdx(idx)}
                      aria-label={photo.caption || `Fotografie ${idx + 1}`}
                    >
                      <img
                        src={`${BACKEND_URL}${photo.photoPath}`}
                        alt={photo.caption || `Fotografie ${idx + 1}`}
                        loading="lazy"
                      />
                      {photo.caption && (
                        <span className="detail-gallery__caption">{photo.caption}</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div className="detail-actions" variants={fadeIn}>
              <button className="btn btn-primary" onClick={() => navigate('/donate')}>
                {t('common.support')}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate(backPath)}>
                {t('common.viewMore')}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Prev */}
            {lightboxIdx > 0 && (
              <button className="lightbox-nav lightbox-nav--prev"
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => i - 1); }}>
                ‹
              </button>
            )}

            <motion.div
              className="lightbox-content"
              key={lightboxIdx}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={`${BACKEND_URL}${photos[lightboxIdx].photoPath}`}
                alt={photos[lightboxIdx].caption || `Fotografie ${lightboxIdx + 1}`}
              />
              {photos[lightboxIdx].caption && (
                <p className="lightbox-caption">{photos[lightboxIdx].caption}</p>
              )}
              <p className="lightbox-counter">{lightboxIdx + 1} / {photos.length}</p>
            </motion.div>

            {/* Next */}
            {lightboxIdx < photos.length - 1 && (
              <button className="lightbox-nav lightbox-nav--next"
                onClick={e => { e.stopPropagation(); setLightboxIdx(i => i + 1); }}>
                ›
              </button>
            )}

            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetailPage;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './TeamPage.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const placeholderAvatar =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231d4771"/%3E%3Ccircle cx="100" cy="80" r="32" fill="%23ebbd3a"/%3E%3Cpath d="M48 168c0-29 23-52 52-52s52 23 52 52" fill="%23ebbd3a"/%3E%3C/svg%3E';

const TeamPage = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/team`);
        // Only show non-archived members on the public page
        setMembers((res.data || []).filter((m) => !m.archived));
        setError(null);
      } catch (err) {
        console.error('Error fetching team:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [t]);

  // Close modal on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedMember(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedMember]);

  return (
    <div className="team-page">
      <motion.section
        className="page-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">{t('team.title')}</h1>
          <p className="page-subtitle">{t('team.subtitle')}</p>
        </div>
      </motion.section>

      <section className="team-section section">
        <div className="container">
          {loading ? (
            <div className="team-loading">
              <div className="spinner"></div>
              <p>{t('common.loading')}</p>
            </div>
          ) : error ? (
            <div className="team-error">
              <p>{error}</p>
            </div>
          ) : members.length === 0 ? (
            <motion.div
              className="no-team"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <p>{t('team.empty')}</p>
            </motion.div>
          ) : (
            <motion.div
              className="team-grid"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {members.map((m) => (
                <motion.article
                  key={m.id}
                  className="team-card"
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => setSelectedMember(m)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="team-photo-wrapper">
                    <img
                      src={m.photoPath ? `${BACKEND_URL}${m.photoPath}` : placeholderAvatar}
                      alt={`${m.firstName} ${m.lastName}`}
                      onError={(e) => { e.target.src = placeholderAvatar; }}
                    />
                  </div>
                  <div className="team-content">
                    <h2 className="team-name">{m.firstName} {m.lastName}</h2>
                    {m.role && <p className="team-role">{m.role}</p>}
                    {m.bio && <p className="team-bio">{m.bio}</p>}
                    {m.email && (
                      <a
                        className="team-email"
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {m.email}
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Member detail modal ── */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="team-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="team-modal"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="team-modal-close"
                onClick={() => setSelectedMember(null)}
                aria-label="Închide"
              >
                ✕
              </button>

              <div className="team-modal-header">
                <img
                  className="team-modal-photo"
                  src={
                    selectedMember.photoPath
                      ? `${BACKEND_URL}${selectedMember.photoPath}`
                      : placeholderAvatar
                  }
                  alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                  onError={(e) => { e.target.src = placeholderAvatar; }}
                />
                <div className="team-modal-identity">
                  <h2 className="team-modal-name">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h2>
                  {selectedMember.role && (
                    <p className="team-modal-role">{selectedMember.role}</p>
                  )}
                  {selectedMember.email && (
                    <a className="team-modal-email" href={`mailto:${selectedMember.email}`}>
                      {selectedMember.email}
                    </a>
                  )}
                  {selectedMember.departments && selectedMember.departments.length > 0 && (
                    <p className="team-modal-dept">
                      {selectedMember.departments.map((d) => d.name).join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              {selectedMember.bio && (
                <div className="team-modal-bio">
                  <p>{selectedMember.bio}</p>
                </div>
              )}

              {selectedMember.projects && selectedMember.projects.length > 0 && (
                <div className="team-modal-projects">
                  <h3 className="team-modal-projects-title">{t('team.modal.projects')}</h3>
                  <div className="team-modal-projects-grid">
                    {selectedMember.projects.map((proj) => (
                      <a
                        key={proj.id}
                        href={`/upcoming-projects/${proj.id}`}
                        className="team-modal-project-card"
                      >
                        <div className="team-modal-project-thumb">
                          {proj.imagePath ? (
                            <img
                              src={`${BACKEND_URL}${proj.imagePath}`}
                              alt={proj.title}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="team-modal-project-thumb-placeholder">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 7h18M3 7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M3 7l3-4h12l3 4" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="team-modal-project-title">{proj.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;

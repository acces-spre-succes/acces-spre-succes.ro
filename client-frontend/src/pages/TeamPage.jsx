import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/team`);
        setMembers(res.data || []);
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
      </div>
    );
  }

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
          {members.length === 0 ? (
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
                >
                  <div className="team-photo-wrapper">
                    <img
                      src={m.photoPath ? `${BACKEND_URL}${m.photoPath}` : placeholderAvatar}
                      alt={`${m.firstName} ${m.lastName}`}
                      onError={(e) => {
                        e.target.src = placeholderAvatar;
                      }}
                    />
                  </div>
                  <div className="team-content">
                    <h2 className="team-name">{m.firstName} {m.lastName}</h2>
                    {m.role && <p className="team-role">{m.role}</p>}
                    {m.bio && <p className="team-bio">{m.bio}</p>}
                    {m.email && (
                      <a className="team-email" href={`mailto:${m.email}`}>
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
    </div>
  );
};

export default TeamPage;

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ColorBends from '../components/ColorBends';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './HomePage.css';

const placeholderAvatar = (initial) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231d4771"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="%23ebbd3a"%3E${encodeURIComponent(initial || '?')}%3C/text%3E%3C/svg%3E`;

const HomePage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: '',
    description: '',
    interestedDepartment: '',
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Departments + members for the carousel
  const [departments, setDepartments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [activeDeptId, setActiveDeptId] = useState(null);

  // Pre-fill the volunteer form's "interestedDepartment" if the URL says so
  // (e.g. /?department=Evenimente#volunteer from the carousel button or other pages).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dept = params.get('department');
    if (dept) {
      setFormData((prev) => ({ ...prev, interestedDepartment: dept }));
    }
  }, [location.search]);

  // Fetch departments + members in parallel
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      axios.get(`${API_BASE_URL}/departments`).then((r) => r.data || []),
      axios.get(`${API_BASE_URL}/team`).then((r) => r.data || []),
    ])
      .then(([depts, members]) => {
        if (cancelled) return;
        setDepartments(depts);
        setAllMembers(members);
        // Default to the first department (lowest displayOrder, set in admin)
        if (depts.length > 0 && activeDeptId == null) {
          setActiveDeptId(depts[0].id);
        }
      })
      .catch((err) => {
        console.error('Error fetching team data:', err);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeDepartment = useMemo(
    () => departments.find((d) => d.id === activeDeptId) || null,
    [departments, activeDeptId]
  );

  const activeMembers = useMemo(() => {
    if (!activeDeptId) return [];
    return allMembers
      .filter((m) => (m.departments || []).some((d) => d.id === activeDeptId))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id);
  }, [allMembers, activeDeptId]);

  const goToDeptIndex = (delta) => {
    if (departments.length === 0) return;
    const idx = departments.findIndex((d) => d.id === activeDeptId);
    const next = (idx + delta + departments.length) % departments.length;
    setActiveDeptId(departments[next].id);
  };

  const applyToDepartment = (deptName) => {
    setFormData((prev) => ({ ...prev, interestedDepartment: deptName }));
    if (typeof window !== 'undefined') {
      const el = document.getElementById('volunteer');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      // Backend ignores empty strings for optional fields, but we'd rather send null
      const payload = { ...formData };
      if (!payload.interestedDepartment) delete payload.interestedDepartment;
      await axios.post(`${API_BASE_URL}/volunteers`, payload);
      setFormStatus({ type: 'success', message: t('home.volunteer.success') });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        description: '',
        interestedDepartment: '',
      });
    } catch (error) {
      setFormStatus({ type: 'error', message: t('home.volunteer.error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const logoAnimation = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: 'easeOut' } }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <ColorBends />
        <div className="hero-content container">
          <motion.div
            className="hero-logo"
            initial="hidden"
            animate="visible"
            variants={logoAnimation}
          >
            <motion.img
              src="/AccesSpreSuccesLogo.jpeg"
              alt="Acces spre Succes Logo"
              animate={floatingAnimation}
            />
          </motion.div>
          <motion.h1 className="hero-title" variants={fadeInUp}>
            {t('home.hero.title')}
          </motion.h1>
          <motion.p className="hero-subtitle" variants={fadeInUp}>
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div className="hero-buttons" variants={fadeInUp}>
            <a href="#volunteer" className="btn btn-primary">
              {t('home.hero.cta')}
            </a>
            <a href="/donate" className="btn btn-secondary">
              {t('home.hero.donateBtn')}
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="about-section section">
        <div className="container">
          <motion.div
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp}>
              {t('home.about.title')}
            </motion.h2>
            <motion.p className="about-description" variants={fadeInUp}>
              {t('home.about.description')}
            </motion.p>

            <div className="mission-vision">
              <motion.div className="mission-card" variants={fadeInUp}>
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>{t('home.about.mission')}</h3>
                <p>{t('home.about.missionText')}</p>
              </motion.div>

              <motion.div className="vision-card" variants={fadeInUp}>
                <div className="card-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <h3>{t('home.about.vision')}</h3>
                <p>{t('home.about.visionText')}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments Carousel */}
      {departments.length > 0 && (
        <section className="departments-section section bg-gray">
          <div className="container">
            <motion.div
              className="board-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="section-title">{t('home.departments.title')}</h2>
              <p className="section-subtitle">{t('home.departments.subtitle')}</p>
            </motion.div>

            {/* Tab strip */}
            <div className="departments-tabs">
              {departments.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`department-tab ${d.id === activeDeptId ? 'active' : ''}`}
                  onClick={() => setActiveDeptId(d.id)}
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Carousel viewport */}
            <div className="departments-carousel">
              <button
                type="button"
                className="carousel-arrow carousel-arrow--left"
                onClick={() => goToDeptIndex(-1)}
                aria-label={t('home.departments.previous')}
              >
                ‹
              </button>

              <div className="carousel-stage">
                <AnimatePresence mode="wait">
                  {activeDepartment && (
                    <motion.div
                      key={activeDepartment.id}
                      className="department-panel"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <div className="department-panel-header">
                        <h3 className="department-name">{activeDepartment.name}</h3>
                        {activeDepartment.description && (
                          <p className="department-description">{activeDepartment.description}</p>
                        )}
                        <button
                          type="button"
                          className="btn btn-primary department-apply-btn"
                          onClick={() => applyToDepartment(activeDepartment.name)}
                        >
                          {t('home.departments.apply')}
                        </button>
                      </div>

                      {activeMembers.length === 0 ? (
                        <p className="department-empty">{t('home.departments.empty')}</p>
                      ) : (
                        <div className="board-grid">
                          {activeMembers.map((member) => {
                            const fullName = `${member.firstName} ${member.lastName}`.trim();
                            const initial = (member.firstName || member.lastName || '?').charAt(0);
                            return (
                              <div key={member.id} className="board-card">
                                <div className="board-image-wrapper">
                                  <img
                                    src={member.photoPath ? `${BACKEND_URL}${member.photoPath}` : placeholderAvatar(initial)}
                                    alt={fullName}
                                    onError={(e) => {
                                      e.target.src = placeholderAvatar(initial);
                                    }}
                                  />
                                </div>
                                <div className="board-info">
                                  <h3 className="board-name">{fullName}</h3>
                                  {member.role && <p className="board-position">{member.role}</p>}
                                  {member.bio && <p className="board-bio">{member.bio}</p>}
                                  {member.email && (
                                    <a className="board-email" href={`mailto:${member.email}`}>
                                      {member.email}
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                className="carousel-arrow carousel-arrow--right"
                onClick={() => goToDeptIndex(1)}
                aria-label={t('home.departments.next')}
              >
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div className="departments-dots">
              {departments.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`carousel-dot ${d.id === activeDeptId ? 'active' : ''}`}
                  onClick={() => setActiveDeptId(d.id)}
                  aria-label={d.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Volunteer Section */}
      <section id="volunteer" className="volunteer-section section">
        <div className="container">
          <motion.div
            className="volunteer-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div className="volunteer-header" variants={fadeInUp}>
              <h2 className="section-title">{t('home.volunteer.title')}</h2>
              <p className="section-subtitle">{t('home.volunteer.subtitle')}</p>
            </motion.div>

            <motion.form
              className="volunteer-form"
              onSubmit={handleSubmit}
              variants={fadeInUp}
            >
              {formData.interestedDepartment && (
                <div className="volunteer-target">
                  <span>{t('home.volunteer.appliedFor')}</span>
                  <strong>{formData.interestedDepartment}</strong>
                  <button
                    type="button"
                    className="volunteer-target-clear"
                    onClick={() => setFormData({ ...formData, interestedDepartment: '' })}
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">{t('home.volunteer.firstName')}</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">{t('home.volunteer.lastName')}</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">{t('home.volunteer.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">{t('home.volunteer.phone')}</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="age">{t('home.volunteer.age')}</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="18"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">{t('home.volunteer.message')}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder={t('home.volunteer.messagePlaceholder')}
                  maxLength="500"
                ></textarea>
              </div>

              {formStatus.message && (
                <div className={`form-message ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.loading') : t('home.volunteer.submit')}
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

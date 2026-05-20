import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ColorBends from '../components/ColorBends';
import ContainerScroll from '../components/ContainerScroll';
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
  });
  // Names of departments the applicant ticked. Pre-populated when arriving
  // via "?department=Foo" or via the carousel's apply button.
  const [interestedDepartments, setInterestedDepartments] = useState([]);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Departments + members for the board section and volunteer form
  const [departments, setDepartments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  // Pre-tick the volunteer form's department checkbox(es) if the URL says so
  // (e.g. /?department=Evenimente#volunteer from the carousel button or other pages).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dept = params.get('department');
    if (dept) {
      setInterestedDepartments((prev) =>
        prev.includes(dept) ? prev : [...prev, dept]
      );
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
      })
      .catch((err) => {
        console.error('Error fetching team data:', err);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Master department members — the only ones shown on the home page board.
  // The "master" flag is set in the admin panel on the department itself.
  const boardMembers = useMemo(() => {
    const master = departments.find((d) => d.isMaster === true);
    if (!master) return [];
    return allMembers
      .filter((m) => (m.departments || []).some((d) => d.id === master.id))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id);
  }, [departments, allMembers]);

  // Board carousel (Consiliu Director members)
  const [volIdx, setVolIdx] = useState(0);
  const [needsNav, setNeedsNav] = useState(false);
  const volViewportRef = useRef(null);
  // Prevents the scroll listener from fighting with programmatic scrolls
  const scrollingProgrammatically = useRef(false);

  // Preload every member photo into the browser cache as soon as the
  // team data arrives — so switching departments shows images instantly.
  useEffect(() => {
    allMembers.forEach((m) => {
      if (m.photoPath) {
        const img = new Image();
        img.src = `${BACKEND_URL}${m.photoPath}`;
      }
    });
  }, [allMembers]);

  // Scroll viewport to the active card (desktop JS-driven scroll + dots/arrows)
  useEffect(() => {
    const viewport = volViewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector('.board-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(viewport).gap) || 0;
    scrollingProgrammatically.current = true;
    viewport.scrollTo({ left: volIdx * (card.offsetWidth + gap), behavior: 'smooth' });
    // Clear the flag after the smooth scroll settles (~500ms)
    const t = setTimeout(() => { scrollingProgrammatically.current = false; }, 600);
    return () => clearTimeout(t);
  }, [volIdx]);

  // Sync dots with the user's native swipe on mobile (scroll-snap)
  useEffect(() => {
    const viewport = volViewportRef.current;
    if (!viewport) return;
    const onScroll = () => {
      if (scrollingProgrammatically.current) return;
      const card = viewport.querySelector('.board-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(viewport).gap) || 0;
      const step = card.offsetWidth + gap;
      if (step > 0) setVolIdx(Math.round(viewport.scrollLeft / step));
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', onScroll);
  }, [boardMembers]);

  // Determine whether navigation (arrows/dots) is needed.
  // Reset immediately on dept change, then re-check after the
  // framer-motion panel animation (≈350ms) has fully settled.
  useEffect(() => {
    setNeedsNav(false); // hide nav instantly while animating
    const viewport = volViewportRef.current;
    if (!viewport) return;

    const check = () =>
      setNeedsNav(viewport.scrollWidth > viewport.clientWidth + 2);

    // Wait for exit+enter animation to finish before measuring
    const timer = setTimeout(check, 420);

    // Also re-check on resize
    window.addEventListener('resize', check);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', check);
    };
  }, [boardMembers]);

  const goVol = (delta) => {
    setVolIdx((i) => Math.max(0, Math.min(boardMembers.length - 1, i + delta)));
  };

  const toggleInterestedDepartment = (deptName) => {
    setInterestedDepartments((prev) =>
      prev.includes(deptName)
        ? prev.filter((n) => n !== deptName)
        : [...prev, deptName]
    );
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
      const payload = { ...formData };
      if (interestedDepartments.length > 0) {
        // Backend stores this as a single VARCHAR(500); CSV is the cheapest
        // representation that survives department renames/deletes.
        payload.interestedDepartment = interestedDepartments.join(', ');
      }
      await axios.post(`${API_BASE_URL}/volunteers`, payload);
      setFormStatus({ type: 'success', message: t('home.volunteer.success') });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        description: '',
      });
      setInterestedDepartments([]);
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

      {/* Scroll showcase */}
      <ContainerScroll
        titleComponent={
          <div>
            <p className="cscroll-eyebrow">{t('home.scroll.eyebrow')}</p>
            <h2 className="cscroll-title">{t('home.scroll.title')}</h2>
          </div>
        }
      >
        <div className="impact-preview">
          <img
            src="/AccesSpreSuccesLogo.jpeg"
            alt="Acces spre Succes"
            className="impact-logo"
          />
          <p className="impact-tagline">
            {t('home.scroll.tagline.a')}{' '}
            <span>{t('home.scroll.tagline.highlight')}</span>{' '}
            {t('home.scroll.tagline.b')}
          </p>
          <div className="impact-stats">
            <div className="impact-stat">
              <span className="impact-stat-number">1000+</span>
              <span className="impact-stat-label">{t('home.scroll.stats.children')}</span>
            </div>
            <div className="impact-stat">
              <span className="impact-stat-number">8</span>
              <span className="impact-stat-label">{t('home.scroll.stats.departments')}</span>
            </div>
            <div className="impact-stat">
              <span className="impact-stat-number">20+</span>
              <span className="impact-stat-label">{t('home.scroll.stats.volunteers')}</span>
            </div>
          </div>
        </div>
      </ContainerScroll>

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

      {/* Consiliu Director board */}
      {boardMembers.length > 0 && (
        <section className="board-section section">
          <div className="container">
            <motion.div
              className="board-header"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="section-title">{t('home.board.title')}</h2>
              <p className="section-subtitle">{t('home.board.subtitle')}</p>
            </motion.div>

            <div className="departments-carousel">
              {needsNav && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow--left"
                  onClick={() => goVol(-1)}
                  disabled={volIdx === 0}
                  aria-label="Anterior"
                >
                  ‹
                </button>
              )}

              <div className="carousel-stage">
                <div ref={volViewportRef} className="vol-carousel-viewport">
                  <div className={`board-grid${needsNav ? '' : ' board-grid--centered'}`}>
                    {boardMembers.map((member) => {
                      const fullName = `${member.firstName} ${member.lastName}`.trim();
                      const initial = (member.firstName || member.lastName || '?').charAt(0);
                      return (
                        <div key={member.id} className="board-card">
                          <div className="board-image-wrapper">
                            <img
                              src={member.photoPath ? `${BACKEND_URL}${member.photoPath}` : placeholderAvatar(initial)}
                              alt={fullName}
                              onError={(e) => { e.target.src = placeholderAvatar(initial); }}
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
                </div>

                {needsNav && boardMembers.length > 1 && (
                  <div className="departments-dots">
                    {boardMembers.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`carousel-dot ${i === volIdx ? 'active' : ''}`}
                        onClick={() => setVolIdx(i)}
                        aria-label={`${m.firstName} ${m.lastName}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {needsNav && (
                <button
                  type="button"
                  className="carousel-arrow carousel-arrow--right"
                  onClick={() => goVol(1)}
                  disabled={volIdx === boardMembers.length - 1}
                  aria-label="Următor"
                >
                  ›
                </button>
              )}
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
              {departments.length > 0 && (
                <div className="form-group volunteer-departments">
                  <label className="volunteer-departments-label">
                    {t('home.volunteer.departmentsLabel')}
                  </label>
                  <div className="volunteer-departments-grid">
                    {departments.filter((d) => d.name.toLowerCase() !== 'consiliu director').map((d) => {
                      const checked = interestedDepartments.includes(d.name);
                      return (
                        <label
                          key={d.id}
                          className={`volunteer-dept-pill ${checked ? 'checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInterestedDepartment(d.name)}
                          />
                          {d.name}
                        </label>
                      );
                    })}
                  </div>
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

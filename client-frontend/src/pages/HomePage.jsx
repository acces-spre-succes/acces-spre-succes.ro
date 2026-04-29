import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import ColorBends from '../components/ColorBends';
import { API_BASE_URL } from '../config';
import './HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    age: '',
    description: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const boardMembers = [
    {
      id: 1,
      name: 'Gina Bontaș',
      position: 'Președinte',
      image: '/images/board/member1.jpg'
    },
    {
      id: 2,
      name: 'Adrian Șorecău',
      position: 'Vicepreședinte',
      image: '/images/board/member2.jpg'
    },
    {
      id: 3,
      name: 'Laura Roman',
      position: 'Secretar',
      image: '/images/board/member3.jpg'
    },
    {
      id: 4,
      name: 'Adrian Tiniș',
      position: 'Membru',
      image: '/images/board/member4.jpg'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_BASE_URL}/volunteers`, formData);
      setFormStatus({
        type: 'success',
        message: t('home.volunteer.success')
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        description: ''
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: t('home.volunteer.error')
      });
    } finally {
      setIsSubmitting(false);
    }
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
        staggerChildren: 0.2
      }
    }
  };

  const logoAnimation = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
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
          <motion.h1
            className="hero-title"
            variants={fadeInUp}
          >
            {t('home.hero.title')}
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            variants={fadeInUp}
          >
            {t('home.hero.subtitle')}
          </motion.p>
          <motion.div
            className="hero-buttons"
            variants={fadeInUp}
          >
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

      {/* Board Members Section */}
      <section className="board-section section bg-gray">
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

          <motion.div
            className="board-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {boardMembers.map((member) => (
              <motion.div
                key={member.id}
                className="board-card"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="board-image-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231d4771"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="%23ebbd3a"%3E' + member.name.charAt(0) + '%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="board-info">
                  <h3 className="board-name">{member.name}</h3>
                  <p className="board-position">{member.position}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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

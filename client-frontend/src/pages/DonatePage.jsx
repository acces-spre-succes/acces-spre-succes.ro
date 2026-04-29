import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './DonatePage.css';

// EuPlătesc isn't integrated yet, so the donation form is intentionally
// disabled. The previous Stripe-based form lives in git history (see
// commits before 2026-04-29); restore it once the new payment provider
// is wired up. In the meantime visitors can still:
//   1) Redirect 3.5% of their income tax via formular230.ro (free, ~2 min)
//   2) Make a SEPA bank transfer in RON or EUR.

const FORMULAR_230_URL = 'https://formular230.ro/asociatia-acces-spre-succes';

const DonatePage = () => {
  const { t } = useTranslation();

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
      transition: { staggerChildren: 0.18 }
    }
  };

  return (
    <div className="donate-page">
      <motion.section
        className="page-header donate-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <motion.div className="heart-icon" variants={fadeInUp}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
            </svg>
          </motion.div>
          <h1 className="page-title">{t('donate.title')}</h1>
          <p className="page-subtitle">{t('donate.subtitle')}</p>
        </div>
      </motion.section>

      <section className="donate-section section">
        <div className="container">
          <motion.div
            className="donate-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {/* Online donations coming soon */}
            <motion.div className="donation_form_card donate-comingsoon" variants={fadeInUp}>
              <div className="donate-comingsoon-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h2 className="card-title">{t('donate.comingSoonTitle')}</h2>
              <p className="card-description">{t('donate.comingSoonText')}</p>
            </motion.div>

            {/* Formular 230 - the easiest way to support, costs the donor nothing */}
            <motion.div className="form230-card" variants={fadeInUp}>
              <div className="form230-badge">{t('donate.form230Badge')}</div>
              <h3 className="form230-title">{t('donate.form230Title')}</h3>
              <p className="form230-text">{t('donate.form230Text')}</p>
              <ul className="form230-bullets">
                <li>{t('donate.form230Bullet1')}</li>
                <li>{t('donate.form230Bullet2')}</li>
                <li>{t('donate.form230Bullet3')}</li>
              </ul>
              <a
                href={FORMULAR_230_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="form230-cta"
              >
                {t('donate.form230Cta')}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: 8 }}
                >
                  <path d="M7 17L17 7"></path>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </motion.div>

            {/* SEPA bank transfer (RON + EUR) */}
            <motion.div className="donation-methods" variants={fadeInUp}>
              <h3 className="methods-title">{t('donate.alternative')}</h3>

              <div className="method-card">
                <div className="method-icon">
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
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div className="method-content">
                  <h4 className="method-title">{t('donate.bank')}</h4>
                  <div className="bank-details">
                    <div className="bank-detail">
                      <strong>Beneficiar:</strong>
                      <span>Asociația Acces spre Succes</span>
                    </div>
                    <div className="bank-detail">
                      <strong>Banca:</strong>
                      <span>Banca Transilvania</span>
                    </div>
                    <div className="bank-detail">
                      <strong>IBAN (RON):</strong>
                      <span className="iban-value">RO49BTRLRONCRT0DB7965801</span>
                    </div>
                    <div className="bank-detail">
                      <strong>IBAN (EUR):</strong>
                      <span className="iban-value">RO93BTRLEURCRT0DB7965801</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="contact-info" variants={fadeInUp}>
              <div className="info-icon">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <p className="contact-text">{t('donate.contact')}</p>
              <a href="mailto:admin@acces-spre-succes.ro" className="contact-email">
                {t('donate.email')}
              </a>
            </motion.div>

            <motion.div className="impact-section" variants={fadeInUp}>
              <h3 className="impact-title">{t('donate.impactTitle')}</h3>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </div>
                  <h4>{t('donate.impactEducationTitle')}</h4>
                  <p>{t('donate.impactEducationText')}</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
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
                  <h4>{t('donate.impactMentoringTitle')}</h4>
                  <p>{t('donate.impactMentoringText')}</p>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <h4>{t('donate.impactFutureTitle')}</h4>
                  <p>{t('donate.impactFutureText')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;

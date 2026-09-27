import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CookieBanner.css';

const STORAGE_KEY = 'cookie_consent';

const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Private browsing or blocked storage — skip banner
    }
  }, []);

  const dismiss = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-banner"
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <span className="cookie-banner__icon">🍪</span>
              <p>
                {t('cookies.message')}{' '}
                <Link to="/termeni-si-conditii" className="cookie-banner__link">
                  {t('cookies.learnMore')}
                </Link>
              </p>
            </div>
            <div className="cookie-banner__actions">
              <button
                className="cookie-banner__btn cookie-banner__btn--secondary"
                onClick={() => dismiss('necessary')}
              >
                {t('cookies.necessaryOnly')}
              </button>
              <button
                className="cookie-banner__btn cookie-banner__btn--primary"
                onClick={() => dismiss('all')}
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;

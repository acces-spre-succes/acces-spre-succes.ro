import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ro' ? 'en' : 'ro';
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img
            src="/logo.svg"
            alt="Acces spre Succes Logo"
            className="logo-image"
          />
          <span className="logo-text">Acces spre Succes</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/')}`}
            onClick={closeMenu}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/articles"
            className={`nav-link ${isActive('/articles')}`}
            onClick={closeMenu}
          >
            {t('nav.articles')}
          </Link>
          <Link
            to="/echipa"
            className={`nav-link ${isActive('/echipa')}`}
            onClick={closeMenu}
          >
            {t('nav.team')}
          </Link>
          <Link
            to="/departamente"
            className={`nav-link ${isActive('/departamente')}`}
            onClick={closeMenu}
          >
            {t('nav.departments')}
          </Link>
          <div className="nav-dropdown">
            <span className="nav-link nav-link--dropdown">
              {t('nav.projects')}
              <svg className="dropdown-chevron" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                <path d="M0 0l5 6 5-6z" fill="currentColor"/>
              </svg>
            </span>
            <div className="dropdown-content">
              <Link to="/upcoming-projects" className="dropdown-link" onClick={closeMenu}>
                <span className="dropdown-link__icon">🚀</span>
                <span className="dropdown-link__body">
                  <strong>{t('nav.upcomingProjects')}</strong>
                  <small>{i18n.language === 'ro' ? 'Proiecte în desfășurare' : 'Ongoing initiatives'}</small>
                </span>
              </Link>
              <Link to="/completed-projects" className="dropdown-link" onClick={closeMenu}>
                <span className="dropdown-link__icon">✅</span>
                <span className="dropdown-link__body">
                  <strong>{t('nav.completedProjects')}</strong>
                  <small>{i18n.language === 'ro' ? 'Ce am realizat împreună' : 'What we achieved together'}</small>
                </span>
              </Link>
            </div>
          </div>
          <Link
            to="/achievements"
            className={`nav-link ${isActive('/achievements')}`}
            onClick={closeMenu}
          >
            {t('nav.achievements')}
          </Link>
          <Link
            to="/donate"
            className="nav-link nav-donate"
            onClick={closeMenu}
          >
            {t('nav.donate')}
          </Link>
        </div>

        <div className="navbar-actions">
          <button
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
          >
            {i18n.language === 'ro' ? 'EN' : 'RO'}
          </button>
          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

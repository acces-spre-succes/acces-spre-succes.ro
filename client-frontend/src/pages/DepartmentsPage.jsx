import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import './DepartmentsPage.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const placeholderAvatar = (initial) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231d4771"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="%23ebbd3a"%3E${encodeURIComponent(initial || '?')}%3C/text%3E%3C/svg%3E`;

const DepartmentsPage = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE_URL}/departments`).then((r) => r.data || []),
      axios.get(`${API_BASE_URL}/team`).then((r) => r.data || []),
    ])
      .then(([depts, members]) => {
        setDepartments(depts);
        setAllMembers(members);
        setError(null);
      })
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  // For each department, find sorted members and pick the "president" contact
  const presidentByDept = useMemo(() => {
    const map = {};
    departments.forEach((d) => {
      const members = allMembers
        .filter((m) => (m.departments || []).some((md) => md.id === d.id))
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id);
      // Prefer a member whose role contains "presedinte" / "președinte"
      const president =
        members.find((m) => m.role && /pre[șs]edinte/i.test(m.role)) ||
        members[0] ||
        null;
      map[d.id] = { members, president };
    });
    return map;
  }, [departments, allMembers]);

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
    <div className="departments-page">
      <motion.section
        className="page-header"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container">
          <h1 className="page-title">{t('departmentsPage.title')}</h1>
          <p className="page-subtitle">{t('departmentsPage.subtitle')}</p>
        </div>
      </motion.section>

      <section className="depts-list section">
        <div className="container">
          {departments.length === 0 ? (
            <motion.p
              className="depts-empty"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              {t('departmentsPage.empty')}
            </motion.p>
          ) : (
            departments.map((dept, i) => {
              const { president } = presidentByDept[dept.id] || {};
              const fullName = president
                ? `${president.firstName} ${president.lastName}`.trim()
                : null;
              const initial = president
                ? (president.firstName || president.lastName || '?').charAt(0)
                : '?';
              return (
                <motion.div
                  key={dept.id}
                  className="dept-block"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={stagger}
                >
                  <motion.div className="dept-block-header" variants={fadeInUp}>
                    <span className="dept-index">0{i + 1}</span>
                    <div>
                      <h2 className="dept-block-name">{dept.name}</h2>
                      {dept.description && (
                        <p className="dept-block-description">{dept.description}</p>
                      )}
                    </div>
                  </motion.div>

                  {president && (
                    <motion.div className="dept-contact" variants={fadeInUp}>
                      <div className="dept-contact-photo">
                        <img
                          src={president.photoPath ? `${BACKEND_URL}${president.photoPath}` : placeholderAvatar(initial)}
                          alt={fullName}
                          onError={(e) => { e.target.src = placeholderAvatar(initial); }}
                        />
                      </div>
                      <div className="dept-contact-info">
                        <p className="dept-contact-label">{t('departmentsPage.contact')}</p>
                        <h3 className="dept-contact-name">{fullName}</h3>
                        {president.role && <p className="dept-contact-role">{president.role}</p>}
                        {president.email && (
                          <a className="dept-contact-email" href={`mailto:${president.email}`}>
                            {president.email}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default DepartmentsPage;

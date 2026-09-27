import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './TermsPage.css';

const TermsPage = () => {
  const { t } = useTranslation();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="terms-page">
      <motion.section
        className="page-header"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <h1 className="page-title">{t('terms.title')}</h1>
          <p className="page-subtitle">{t('terms.subtitle')}</p>
        </div>
      </motion.section>

      <motion.section
        className="terms-content section"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="container">
          <div className="terms-body">
            <p className="terms-updated">{t('terms.lastUpdated')}: Septembrie 2026</p>

            <h2>1. Despre noi</h2>
            <p>
              Asociația „Acces spre Succes" este o organizație non-profit cu sediul în Bistrița, România,
              înregistrată conform legislației române. Site-ul web <strong>acces-spre-succes.ro</strong> este
              operat de asociație în scopul prezentării activităților, proiectelor și posibilităților de implicare.
            </p>

            <h2>2. Utilizarea site-ului</h2>
            <p>
              Accesul la acest site este gratuit și nu necesită înregistrare. Utilizatorii se angajează să
              folosească site-ul exclusiv în scopuri legale și să nu perturbeze funcționarea acestuia.
              Conținutul site-ului este protejat prin drepturile de autor ale asociației.
            </p>

            <h2>3. Cookie-uri</h2>
            <p>
              Site-ul nostru utilizează cookie-uri pentru a asigura funcționarea corectă a paginilor și pentru
              a îmbunătăți experiența utilizatorilor. Cookie-urile necesare sunt întotdeauna active. Cookie-urile
              opționale (analiză, marketing) sunt activate doar cu consimțământul explicit al utilizatorului,
              exprimat prin bannerul de cookie-uri.
            </p>
            <p>
              Poți gestiona preferințele de cookie-uri oricând prin setările browserului sau prin retragerea
              consimțământului în bannerul de cookie-uri.
            </p>

            <h2>4. Colectarea datelor personale</h2>
            <p>
              Prelucrăm date personale numai în scopuri specifice:
            </p>
            <ul>
              <li><strong>Formularul de voluntariat</strong> — nume, email, telefon, vârstă și mesaj sunt
              colectate exclusiv pentru a evalua cererile de voluntariat și a lua legătura cu candidații.</li>
              <li><strong>Donații</strong> — datele de plată sunt procesate de furnizori de plată autorizați
              (Stripe) și nu sunt stocate pe serverele noastre.</li>
            </ul>
            <p>
              Temeiul legal al prelucrării este consimțământul voluntar al utilizatorului (Art. 6 alin. (1)
              lit. a) GDPR). Datele nu vor fi vândute sau transmise terților fără consimțământul tău.
            </p>

            <h2>5. Drepturile tale (GDPR)</h2>
            <p>
              Conform Regulamentului General privind Protecția Datelor (GDPR), ai dreptul la:
            </p>
            <ul>
              <li>Acces la datele tale personale</li>
              <li>Rectificarea datelor incorecte</li>
              <li>Ștergerea datelor („dreptul de a fi uitat")</li>
              <li>Portabilitatea datelor</li>
              <li>Retragerea consimțământului în orice moment</li>
            </ul>
            <p>
              Pentru exercitarea acestor drepturi, contactează-ne la:{' '}
              <a href="mailto:admin@acces-spre-succes.ro">admin@acces-spre-succes.ro</a>
            </p>

            <h2>6. Securitatea datelor</h2>
            <p>
              Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele personale împotriva
              accesului neautorizat, pierderii sau distrugerii. Comunicațiile cu serverul sunt criptate prin HTTPS.
            </p>

            <h2>7. Linkuri externe</h2>
            <p>
              Site-ul poate conține linkuri către site-uri externe. Asociația nu este responsabilă pentru
              conținutul sau practicile de confidențialitate ale acestor site-uri.
            </p>

            <h2>8. Modificarea termenilor</h2>
            <p>
              Ne rezervăm dreptul de a modifica acești termeni în orice moment. Versiunea actualizată va fi
              publicată pe această pagină cu data ultimei modificări. Utilizarea continuă a site-ului după
              publicarea modificărilor constituie acceptarea noilor termeni.
            </p>

            <h2>9. Contact</h2>
            <p>
              Pentru întrebări legate de acești termeni sau de prelucrarea datelor personale:
            </p>
            <ul>
              <li>Email: <a href="mailto:admin@acces-spre-succes.ro">admin@acces-spre-succes.ro</a></li>
              <li>Organizație: Asociația „Acces spre Succes", Bistrița, România</li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsPage;

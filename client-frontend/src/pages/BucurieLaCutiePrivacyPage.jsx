import React from 'react';
import { motion } from 'framer-motion';
import './TermsPage.css';

const BucurieLaCutiePrivacyPage = () => {
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
          <h1 className="page-title">Politica de confidențialitate</h1>
          <p className="page-subtitle">Bucurie la Cutie – Asociația „Acces spre Succes"</p>
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
            <p className="terms-updated">Ultima actualizare: octombrie 2026</p>

            <h2>1. Cine suntem</h2>
            <p>
              Aplicația „Bucurie la Cutie" aparține <strong>Asociației „Acces spre Succes"</strong> (Bistrița-Năsăud,
              România), care este <strong>operatorul datelor</strong> și decide cum sunt folosite. Aplicația este
              furnizată de <strong>Akashic Dreams</strong>, care oferă doar platforma tehnică (persoană împuternicită).
              Contact pentru solicitări privind datele:{' '}
              <a href="mailto:admin@akashicdreams.dev">admin@akashicdreams.dev</a>.
            </p>

            <h2>2. Ce date colectăm</h2>
            <ul>
              <li>
                <strong>Conturi (donatori, profesori, administratori):</strong> adresă de email, nume afișat, număr
                de telefon (opțional), școala (pentru profesori), rolul și statusul contului.
              </li>
              <li>
                <strong>Copii înscriși în campanii</strong> (introduși de profesori sau administratori): nume,
                clasă, vârstă, gen, mărimi de haine și încălțăminte, dorințe, localitate și adresă.{' '}
                <strong>Donatorii văd doar inițialele, genul, vârsta, mărimile și dorințele</strong> copilului.
                Numele complet, adresa și localitatea sunt vizibile doar administratorilor asociației și profesorilor
                școlii copilului.
              </li>
              <li>
                <strong>Donații:</strong> copilul ales, statusul cadoului și anunțurile de donații materiale.
                Donațiile bănești se fac prin transfer bancar direct către asociație; aplicația nu procesează și
                nu stochează date de card sau de cont bancar.
              </li>
              <li><strong>Notificări</strong> din aplicație.</li>
            </ul>
            <p>Nu folosim publicitate, nu urmărim locația și nu vindem date.</p>

            <h2>3. De ce folosim datele</h2>
            <p>
              Pentru a gestiona campaniile de cadouri pentru copiii defavorizați, a conecta donatorii cu copiii,
              a organiza livrarea cadourilor și a comunica cu utilizatorii aplicației.
            </p>

            <h2>4. Cui sunt dezvăluite</h2>
            <p>
              Datele sunt stocate în Google Firebase (Authentication și Cloud Firestore), furnizor de servicii
              cloud. Nu le transmitem altor terți, cu excepția cazurilor în care legea o impune.
            </p>

            <h2>5. Cât timp păstrăm datele</h2>
            <p>
              Datele contului sunt păstrate cât timp contul există. Datele copiilor sunt păstrate pe durata
              campaniei și pentru evidența livrărilor, apoi șterse la cerere sau după încheierea activității
              asociației.
            </p>

            <h2>6. Drepturile tale</h2>
            <p>
              Ai dreptul de acces, rectificare, ștergere, restricționare și opoziție (GDPR). Îți poți{' '}
              <strong>șterge contul direct din aplicație</strong> (Profil → Șterge contul) sau ne poți scrie
              la <a href="mailto:admin@akashicdreams.dev">admin@akashicdreams.dev</a>. Ai dreptul de a depune
              plângere la ANSPDCP (<a href="https://www.dataprotection.ro" target="_blank" rel="noreferrer">dataprotection.ro</a>).
            </p>

            <h2>7. Copii</h2>
            <p>
              Aplicația este destinată adulților (donatori, profesori, administratori). Datele despre copii sunt
              introduse exclusiv de profesori și administratori, cu acordul reprezentanților legali.
            </p>

            <h2>8. Modificări</h2>
            <p>
              Putem actualiza această politică; versiunea curentă este mereu disponibilă la această adresă.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default BucurieLaCutiePrivacyPage;
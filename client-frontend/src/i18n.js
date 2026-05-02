import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ro: {
    translation: {
      // Navigation
      nav: {
        home: "Acasă",
        about: "Despre Noi",
        articles: "Articole",
        team: "Echipa",
        departments: "Departamente",
        projects: "Proiecte",
        upcomingProjects: "Proiecte Viitoare",
        completedProjects: "Proiecte Finalizate",
        achievements: "Realizări",
        volunteer: "Voluntariat",
        donate: "Donează"
      },
      // Home Page
      home: {
        hero: {
          title: "Acces spre Succes",
          subtitle: "Dezvoltarea și educația copiilor - Construim împreună viitorul!",
          cta: "Devino Voluntar",
          donateBtn: "Donează Acum"
        },
        about: {
          title: "Despre Noi",
          description: "Acces spre Succes este o organizație non-profit dedicată dezvoltării și educației copiilor din România. Misiunea noastră este de a oferi fiecărui copil șansa de a-și atinge potențialul maxim prin programe educaționale de calitate și suport constant.",
          mission: "Misiunea Noastră",
          missionText: "Creăm oportunități egale pentru toți copiii prin educație de calitate, mentorare și suport emoțional.",
          vision: "Viziunea Noastră",
          visionText: "O Românie în care fiecare copil are acces la educație de calitate și șanse egale de succes."
        },
        board: {
          title: "Echipa Noastră",
          subtitle: "Membrii Consiliului de Administrație",
          position: "Poziție"
        },
        departments: {
          title: "Departamentele Noastre",
          subtitle: "Cunoaște echipa fiecărui departament și alătură-te unde vrei să contribui",
          apply: "Devino voluntar la acest departament",
          empty: "Nu există încă membri afișați public pentru acest departament.",
          previous: "Departamentul anterior",
          next: "Departamentul următor"
        },
        scroll: {
          eyebrow: "Impactul nostru",
          title: "Construim viitorul împreună cu tine",
          tagline: {
            a: "Fiecare copil merită o",
            highlight: "șansă reală",
            b: "la succes."
          },
          stats: {
            children: "Copii ajutați",
            departments: "Departamente",
            volunteers: "Voluntari",
            years: "Ani de impact"
          }
        },
        volunteer: {
          title: "Devino Voluntar",
          subtitle: "Alătură-te echipei noastre și fă diferența!",
          formTitle: "Formular de Înregistrare",
          firstName: "Prenume",
          lastName: "Nume",
          email: "Email",
          phone: "Telefon",
          age: "Vârstă",
          message: "Mesaj (opțional)",
          messagePlaceholder: "Spune-ne de ce vrei să devii voluntar...",
          submit: "Trimite Cererea",
          departmentsLabel: "Departamente de interes (poți alege mai multe):",
          success: "Mulțumim! Cererea ta a fost trimisă cu succes!",
          error: "A apărut o eroare. Te rugăm să încerci din nou."
        }
      },
      // Articles Page
      articles: {
        title: "Articole și Noutăți",
        subtitle: "Ultimele știri și povești de la Acces spre Succes",
        readMore: "Citește Mai Mult",
        noArticles: "Nu există articole momentan."
      },
      // Team Page
      team: {
        title: "Echipa Noastră",
        subtitle: "Oamenii din spatele Acces spre Succes",
        empty: "Echipa va fi anunțată în curând."
      },
      // Departments Page
      departmentsPage: {
        title: "Departamentele Noastre",
        subtitle: "Descoperă ce face fiecare departament și cine face parte din el",
        empty: "Nu există departamente momentan.",
        noMembers: "Nu există încă membri afișați public pentru acest departament."
      },
      // Projects Pages
      projects: {
        upcoming: {
          title: "Proiecte Viitoare",
          subtitle: "Proiectele noastre în curs de desfășurare și planificate",
          noProjects: "Nu există proiecte viitoare momentan."
        },
        completed: {
          title: "Proiecte Finalizate",
          subtitle: "Proiectele pe care le-am finalizat cu succes",
          noProjects: "Nu există proiecte finalizate momentan."
        }
      },
      // Achievements Page
      achievements: {
        title: "Realizări",
        comingSoon: "În Curând...",
        description: "Pregătim ceva minunat! Revino curând pentru a vedea realizările noastre."
      },
      // Donate Page
      donate: {
        title: "Susține Cauza Noastră",
        subtitle: "Donația ta face diferența în viața copiilor",
        comingSoonTitle: "Donațiile online vor fi disponibile în curând",
        comingSoonText: "Lucrăm la integrarea unui sistem sigur de donații prin EuPlătesc. Până atunci, ai mai jos două modalități rapide prin care poți ajuta — fără niciun cost pentru tine în cazul redirecționării de 3,5%.",
        form230Badge: "Costă 0 lei",
        form230Title: "Redirecționează 3,5% din impozit",
        form230Text: "Statul îți permite să direcționezi 3,5% din impozitul pe venit către o organizație non-profit, fără să te coste nimic în plus. Completezi formularul 230 online în 2 minute, iar echipa formular230.ro îl depune la ANAF în locul tău.",
        form230Bullet1: "Nu costă absolut nimic în plus față de impozitul pe care oricum îl plătești",
        form230Bullet2: "Durează aproximativ 2 minute, totul online",
        form230Bullet3: "Te poți angaja pentru 1 sau 2 ani",
        form230Cta: "Completează formularul 230",
        alternative: "Transfer Bancar",
        bank: "Transfer Bancar",
        contact: "Pentru informații despre donații, contactează-ne la:",
        email: "admin@acces-spre-succes.ro",
        impactTitle: "Impactul Donației Tale",
        impactEducationTitle: "Educație",
        impactEducationText: "Susții programe educaționale pentru copii din medii defavorizate.",
        impactMentoringTitle: "Mentorare",
        impactMentoringText: "Permiți mentorilor să ghideze copiii către succes.",
        impactFutureTitle: "Viitor",
        impactFutureText: "Construiești un viitor mai bun pentru comunitate."
      },
      // Common
      common: {
        loading: "Se încarcă...",
        error: "Eroare",
        tryAgain: "Încearcă din nou",
        close: "Închide",
        learnMore: "Află Mai Multe",
        back: "Înapoi la Listă",
        support: "Susține Proiectul",
        viewMore: "Vezi Mai Multe"
      }
    }
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        about: "About Us",
        articles: "Articles",
        team: "Team",
        departments: "Departments",
        projects: "Projects",
        upcomingProjects: "Upcoming Projects",
        completedProjects: "Completed Projects",
        achievements: "Achievements",
        volunteer: "Volunteer",
        donate: "Donate"
      },
      // Home Page
      home: {
        hero: {
          title: "Acces spre Succes",
          subtitle: "Child Development and Education - Building the Future Together!",
          cta: "Become a Volunteer",
          donateBtn: "Donate Now"
        },
        about: {
          title: "About Us",
          description: "Acces spre Succes is a non-profit organization dedicated to the development and education of children in Romania. Our mission is to give every child the chance to reach their full potential through quality educational programs and constant support.",
          mission: "Our Mission",
          missionText: "We create equal opportunities for all children through quality education, mentoring and emotional support.",
          vision: "Our Vision",
          visionText: "A Romania where every child has access to quality education and equal chances of success."
        },
        board: {
          title: "Our Team",
          subtitle: "Board Members",
          position: "Position"
        },
        departments: {
          title: "Our Departments",
          subtitle: "Meet each department's team and join where you want to contribute",
          apply: "Volunteer for this department",
          empty: "No members are publicly listed for this department yet.",
          previous: "Previous department",
          next: "Next department"
        },
        scroll: {
          eyebrow: "Our impact",
          title: "Building the future together with you",
          tagline: {
            a: "Every child deserves a",
            highlight: "real chance",
            b: "at success."
          },
          stats: {
            children: "Children helped",
            departments: "Departments",
            volunteers: "Volunteers",
            years: "Years of impact"
          }
        },
        volunteer: {
          title: "Become a Volunteer",
          subtitle: "Join our team and make a difference!",
          formTitle: "Registration Form",
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          age: "Age",
          message: "Message (optional)",
          messagePlaceholder: "Tell us why you want to become a volunteer...",
          submit: "Submit Application",
          departmentsLabel: "Departments of interest (pick any that apply):",
          success: "Thank you! Your application has been submitted successfully!",
          error: "An error occurred. Please try again."
        }
      },
      // Articles Page
      articles: {
        title: "Articles and News",
        subtitle: "Latest news and stories from Acces spre Succes",
        readMore: "Read More",
        noArticles: "No articles available at the moment."
      },
      // Team Page
      team: {
        title: "Our Team",
        subtitle: "The people behind Acces spre Succes",
        empty: "Our team will be announced soon."
      },
      // Departments Page
      departmentsPage: {
        title: "Our Departments",
        subtitle: "Discover what each department does and who is part of it",
        empty: "No departments available at the moment.",
        noMembers: "No members are publicly listed for this department yet."
      },
      // Projects Pages
      projects: {
        upcoming: {
          title: "Upcoming Projects",
          subtitle: "Our ongoing and planned projects",
          noProjects: "No upcoming projects at the moment."
        },
        completed: {
          title: "Completed Projects",
          subtitle: "Projects we have successfully completed",
          noProjects: "No completed projects at the moment."
        }
      },
      // Achievements Page
      achievements: {
        title: "Achievements",
        comingSoon: "Coming Soon...",
        description: "We're preparing something wonderful! Come back soon to see our achievements."
      },
      // Donate Page
      donate: {
        title: "Support Our Cause",
        subtitle: "Your donation makes a difference in children's lives",
        comingSoonTitle: "Online donations are coming soon",
        comingSoonText: "We're integrating a secure donation system via EuPlătesc. Until then, you have two quick ways to help below — including one that costs you absolutely nothing.",
        form230Badge: "Costs 0 RON",
        form230Title: "Redirect 3.5% of your income tax",
        form230Text: "Romanian taxpayers can direct 3.5% of their income tax to a non-profit at no extra cost. You fill in form 230 online in about 2 minutes and the formular230.ro team submits it to ANAF on your behalf.",
        form230Bullet1: "Costs nothing on top of the tax you already pay",
        form230Bullet2: "Takes around 2 minutes, fully online",
        form230Bullet3: "You can commit for 1 or 2 years",
        form230Cta: "Fill in form 230",
        alternative: "Bank Transfer",
        bank: "Bank Transfer",
        contact: "For information about donations, contact us at:",
        email: "admin@acces-spre-succes.ro",
        impactTitle: "The Impact of Your Donation",
        impactEducationTitle: "Education",
        impactEducationText: "You support educational programs for children from disadvantaged backgrounds.",
        impactMentoringTitle: "Mentoring",
        impactMentoringText: "You enable mentors to guide children towards success.",
        impactFutureTitle: "Future",
        impactFutureText: "You help build a better future for the community."
      },
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        tryAgain: "Try Again",
        close: "Close",
        learnMore: "Learn More",
        back: "Back to List",
        support: "Support This Project",
        viewMore: "View More"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ro', // default language
    fallbackLng: 'ro',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import UpcomingProjectsPage from './pages/UpcomingProjectsPage';
import CompletedProjectsPage from './pages/CompletedProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AchievementsPage from './pages/AchievementsPage';
import DonatePage from './pages/DonatePage';
import TeamPage from './pages/TeamPage';
import DepartmentsPage from './pages/DepartmentsPage';
import './styles/GlobalStyles.css';
import './i18n';
import CheckoutPage from "./pages/CheckoutPage";
import ReturnPage from "./pages/ReturnPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/upcoming-projects" element={<UpcomingProjectsPage />} />
            <Route path="/completed-projects" element={<CompletedProjectsPage />} />
            {/* New slug-based project detail */}
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            {/* Legacy ID-based routes — kept so old bookmarks still work */}
            <Route path="/upcoming-projects/:id" element={<ProjectDetailPage />} />
            <Route path="/completed-projects/:id" element={<ProjectDetailPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/return" element={<ReturnPage />} />
            {/* Romanian-path redirects for old bookmarks */}
            <Route path="/echipa" element={<Navigate to="/team" replace />} />
            <Route path="/departamente" element={<Navigate to="/departments" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

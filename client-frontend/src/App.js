import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Route path="/upcoming-projects" element={<UpcomingProjectsPage />} />
            <Route path="/upcoming-projects/:id" element={<ProjectDetailPage />} />
            <Route path="/completed-projects" element={<CompletedProjectsPage />} />
            <Route path="/completed-projects/:id" element={<ProjectDetailPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/echipa" element={<TeamPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/departamente" element={<DepartmentsPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/return" element={<ReturnPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Articles from "./components/Articles";
import Volunteers from "./components/Volunteers";
import "./styles/style.css";
import UpcomingProjects from "./components/UpcomingProjects";
import CompletedProjects from "./components/CompletedProjects";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeSection, setActiveSection] = useState("articles");

    if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panou Administrare ONG</h1>
                <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Deconectare</button>
            </header>
            <div className="admin-content">
                <Sidebar active={activeSection} onSelect={setActiveSection} />
                <main className="main-content">
                    {activeSection === "articles" && <Articles />}
                    {activeSection === "volunteers" && <Volunteers />}
                    {activeSection === "upcomingProjects" && <UpcomingProjects />}
                    {activeSection === "completedProjects" && <CompletedProjects />}
                </main>
            </div>
        </div>
    );
}

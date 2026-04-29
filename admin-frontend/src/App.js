import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Articles from "./components/Articles";
import Volunteers from "./components/Volunteers";
import "./styles/style.css";
import UpcomingProjects from "./components/UpcomingProjects";
import CompletedProjects from "./components/CompletedProjects";
import { getUsername, isAuthenticated, logout, verifyToken } from "./services/auth";

export default function App() {
    const [authState, setAuthState] = useState(isAuthenticated() ? "checking" : "loggedOut");
    const [activeSection, setActiveSection] = useState("articles");
    const [username, setUsername] = useState(getUsername() || "");

    useEffect(() => {
        if (authState !== "checking") return;
        let cancelled = false;
        verifyToken().then((ok) => {
            if (cancelled) return;
            setAuthState(ok ? "loggedIn" : "loggedOut");
        });
        return () => { cancelled = true; };
    }, [authState]);

    const handleLogin = () => {
        setUsername(getUsername() || "");
        setAuthState("loggedIn");
    };

    const handleLogout = () => {
        logout();
        setUsername("");
        setAuthState("loggedOut");
    };

    if (authState === "checking") {
        return <div className="login-container"><p>Se verifica sesiunea...</p></div>;
    }

    if (authState !== "loggedIn") {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panou Administrare ONG</h1>
                <div className="admin-header__right">
                    {username && <span className="admin-header__user">Conectat ca {username}</span>}
                    <button className="logout-btn" onClick={handleLogout}>Deconectare</button>
                </div>
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

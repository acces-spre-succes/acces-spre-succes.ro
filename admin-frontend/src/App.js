import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Articles from "./components/Articles";
import Volunteers from "./components/Volunteers";
import TeamMembers from "./components/TeamMembers";
import Departments from "./components/Departments";
import Donators from "./components/Donators";
import Settings from "./components/Settings";
import Testimonials from "./components/Testimonials";
import EventPhotos from "./components/EventPhotos";
import "./styles/style.css";
import Projects from "./components/Projects";
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
                    {activeSection === "team" && <TeamMembers />}
                    {activeSection === "departments" && <Departments />}
                    {activeSection === "volunteers" && <Volunteers />}
                    {activeSection === "projects" && <Projects />}
                    {activeSection === "donators" && <Donators />}
                    {activeSection === "testimonials" && <Testimonials />}
                    {activeSection === "eventPhotos" && <EventPhotos />}
                    {activeSection === "settings" && <Settings />}
                </main>
            </div>
        </div>
    );
}

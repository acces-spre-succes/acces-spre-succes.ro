import React from "react";

export default function Sidebar({ active, onSelect }) {
    return (
        <div className="sidebar">
            <div
                className={`sidebar-item ${active === "articles" ? "active" : ""}`}
                onClick={() => onSelect("articles")}
            >
                Articole
            </div>
            <div
                className={`sidebar-item ${active === "volunteers" ? "active" : ""}`}
                onClick={() => onSelect("volunteers")}
            >
                Voluntari
            </div>
            <div
                className={`sidebar-item ${active === "upcomingProjects" ? "active" : ""}`}
                onClick={() => onSelect("upcomingProjects")}
            >
                Proiecte viitoare
            </div>
            <div
                className={`sidebar-item ${active === "completedProjects" ? "active" : ""}`}
                onClick={() => onSelect("completedProjects")}
            >
                Proiecte finalizate
            </div>
        </div>
    );
}

import React from "react";

const ITEMS = [
    { id: "articles", label: "Articole" },
    { id: "team", label: "Echipă" },
    { id: "volunteers", label: "Cereri voluntariat" },
    { id: "upcomingProjects", label: "Proiecte viitoare" },
    { id: "completedProjects", label: "Proiecte finalizate" },
    { id: "donators", label: "Donatori" },
];

export default function Sidebar({ active, onSelect }) {
    return (
        <div className="sidebar">
            {ITEMS.map((item) => (
                <div
                    key={item.id}
                    className={`sidebar-item ${active === item.id ? "active" : ""}`}
                    onClick={() => onSelect(item.id)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
}

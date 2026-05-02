import React from "react";

const ITEMS = [
    { id: "articles",          label: "Articole",            icon: "📰" },
    { id: "team",              label: "Echipă",               icon: "👥" },
    { id: "departments",       label: "Departamente",         icon: "🏢" },
    { id: "volunteers",        label: "Cereri voluntariat",   icon: "✋" },
    { id: "projects",          label: "Proiecte",             icon: "📋" },
    { id: "eventPhotos",       label: "Galerie foto",         icon: "📷" },
    { id: "testimonials",      label: "Testimoniale",         icon: "💬" },
    { id: "donators",          label: "Donatori",             icon: "💛" },
    { id: "settings",          label: "Setări",               icon: "⚙️" },
];

export default function Sidebar({ active, onSelect }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/logo.png" alt="logo" onError={e => { e.target.style.display = "none"; }} />
                <span>Admin</span>
            </div>
            <nav className="sidebar-nav">
                {ITEMS.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${active === item.id ? "active" : ""}`}
                        onClick={() => onSelect(item.id)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

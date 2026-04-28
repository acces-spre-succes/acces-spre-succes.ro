import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

export default function UpcomingProjects() {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ title: "", description: "", image: null });

    // 🔹 Preluam proiectele
    useEffect(() => {
        fetch(`${API_BASE_URL}/upcoming-projects`)
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error("Eroare la preluare proiecte:", err));
    }, []);

    // 🔹 Adaugam proiect nou
    const handleAddProject = async () => {
        if (!newProject.title || !newProject.description) {
            alert("Completeaza toate campurile!");
            return;
        }

        const formData = new FormData();
        formData.append("title", newProject.title);
        formData.append("description", newProject.description);
        if (newProject.image) formData.append("image", newProject.image);

        const res = await fetch(`${API_BASE_URL}/upcoming-projects`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const saved = await res.json();
            setProjects([...projects, saved]);
            setNewProject({ title: "", description: "", image: null });
        }
    };

    // 🔹 Stergem proiect
    const handleDeleteProject = async (id) => {
        await fetch(`${API_BASE_URL}/upcoming-projects/${id}`, { method: "DELETE" });
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="content-section active">
            <h2>Proiecte Viitoare</h2>

            <div className="project-form">
                <input
                    type="text"
                    placeholder="Titlu proiect"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
                <textarea
                    placeholder="Descriere"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <input
                    type="file"
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                />
                <button className="button-add" onClick={handleAddProject}>Adauga Proiect</button>
            </div>

            <div className="projects-list">
                {projects.length === 0 ? (
                    <p>Nu exista proiecte viitoare.</p>
                ) : (
                    projects.map(p => (
                        <div key={p.id} className="project-card">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            {p.imagePath && <img src={`${BACKEND_URL}${p.imagePath}`} alt={p.title} />}
                            <button className="button-delete" onClick={() => handleDeleteProject(p.id)}>Sterge</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

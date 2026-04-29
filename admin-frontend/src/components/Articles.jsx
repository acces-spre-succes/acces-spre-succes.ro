import React, { useState, useEffect } from "react";
import { API_BASE_URL, BACKEND_URL } from '../config';
import { authFetch } from '../services/auth';

const emptyForm = { title: "", description: "", image: null };

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = () => {
        authFetch(`${API_BASE_URL}/articles`)
            .then(res => res.json())
            .then(data => setArticles(data))
            .catch(err => console.error(err));
    };

    const startEdit = (a) => {
        setEditingId(a.id);
        setForm({ title: a.title || "", description: a.description || "", image: null });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            alert("Completează titlul și descrierea.");
            return;
        }

        setBusy(true);
        try {
            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("description", form.description);
            if (form.image) fd.append("image", form.image);

            const url = editingId
                ? `${API_BASE_URL}/articles/${editingId}`
                : `${API_BASE_URL}/articles`;
            const method = editingId ? "PUT" : "POST";

            const res = await authFetch(url, { method, body: fd });
            if (!res.ok) throw new Error("Salvare eșuată");
            cancelEdit();
            loadArticles();
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut salva articolul.");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ștergi acest articol?")) return;
        try {
            const res = await authFetch(`${API_BASE_URL}/articles/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Eroare la ștergere");
            setArticles(articles.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut șterge articolul.");
        }
    };

    return (
        <div className="content-section active">
            <h2>{editingId ? "Editează articol" : "Adaugă articol"}</h2>

            <div className="article-form">
                <input
                    type="text"
                    placeholder="Titlu articol"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                    placeholder="Descriere articol"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="button-add" onClick={handleSubmit} disabled={busy}>
                        {editingId ? "Salvează modificările" : "Adaugă articol"}
                    </button>
                    {editingId && (
                        <button className="button-delete" onClick={cancelEdit} disabled={busy}>
                            Anulează
                        </button>
                    )}
                </div>
                {editingId && (
                    <p style={{ fontSize: "13px", color: "#666" }}>
                        Lasă câmpul de imagine gol dacă nu vrei să schimbi poza existentă.
                    </p>
                )}
            </div>

            <h2 style={{ marginTop: "30px" }}>Articole existente</h2>
            <div className="articles-list">
                {articles.length === 0 ? (
                    <p>Nu există articole.</p>
                ) : (
                    articles.map(a => (
                        <div key={a.id} className="article-card">
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                            {a.imagePath && (
                                <img
                                    src={`${BACKEND_URL}${a.imagePath}`}
                                    alt={a.title}
                                    style={{ maxWidth: "200px", marginTop: "8px" }}
                                />
                            )}
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="button-add" onClick={() => startEdit(a)}>Editează</button>
                                <button className="button-delete" onClick={() => handleDelete(a.id)}>Șterge</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

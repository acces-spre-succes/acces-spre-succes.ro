import React, { useEffect, useRef, useState } from "react";
import { authFetch } from "../services/auth";
import { API_BASE_URL, BACKEND_URL } from "../config";

const EMPTY_FORM = { authorName: "", role: "", quote: "", displayOrder: "" };

export default function Testimonials() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editId, setEditId] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [formNonce, setFormNonce] = useState(0);
    const fileRef = useRef(null);

    const load = () =>
        authFetch(`${API_BASE_URL}/testimonials`)
            .then(r => r.json())
            .then(setItems)
            .catch(console.error);

    useEffect(() => { load(); }, []);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditId(null);
        setPhoto(null);
        setPhotoPreview(null);
        setFormNonce(n => n + 1);
    };

    const startEdit = (t) => {
        setEditId(t.id);
        setForm({
            authorName: t.authorName || "",
            role: t.role || "",
            quote: t.quote || "",
            displayOrder: t.displayOrder ?? "",
        });
        setPhoto(null);
        setPhotoPreview(t.photoPath ? `${BACKEND_URL}${t.photoPath}` : null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.authorName.trim() || !form.quote.trim()) {
            setMsg("Numele autorului și citatul sunt obligatorii.");
            return;
        }
        setLoading(true);
        setMsg("");
        const fd = new FormData();
        fd.append("authorName", form.authorName);
        fd.append("role", form.role);
        fd.append("quote", form.quote);
        if (form.displayOrder !== "") fd.append("displayOrder", form.displayOrder);
        if (photo) fd.append("photo", photo);

        const url = editId
            ? `${API_BASE_URL}/testimonials/${editId}`
            : `${API_BASE_URL}/testimonials`;
        const method = editId ? "PUT" : "POST";

        try {
            const res = await authFetch(url, { method, body: fd });
            if (!res.ok) throw new Error("Eroare server");
            setMsg(editId ? "Testimonial actualizat!" : "Testimonial adăugat!");
            resetForm();
            load();
        } catch {
            setMsg("A apărut o eroare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ștergi acest testimonial?")) return;
        await authFetch(`${API_BASE_URL}/testimonials/${id}`, { method: "DELETE" });
        load();
    };

    return (
        <div className="content-section">
            <h2>{editId ? "Editează Testimonial" : "Adaugă Testimonial"}</h2>

            {msg && <p className={msg.includes("eroare") || msg.includes("obligatorii") ? "error-message" : "success-message"}>{msg}</p>}

            <form className="article-form" onSubmit={handleSubmit} key={formNonce}>
                <input
                    placeholder="Numele autorului *"
                    value={form.authorName}
                    onChange={e => setForm({ ...form, authorName: e.target.value })}
                    required
                />
                <input
                    placeholder="Rol / Funcție (ex: Voluntar, Părinte)"
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                />
                <textarea
                    placeholder="Citatul / Testimonialul *"
                    value={form.quote}
                    onChange={e => setForm({ ...form, quote: e.target.value })}
                    rows={4}
                    required
                />
                <input
                    type="number"
                    placeholder="Ordine afișare (opțional)"
                    value={form.displayOrder}
                    onChange={e => setForm({ ...form, displayOrder: e.target.value })}
                />
                <div className="form-group">
                    <label>Fotografie (opțional)</label>
                    <input type="file" accept="image/*" onChange={handleFile} ref={fileRef} />
                    {photoPreview && (
                        <img src={photoPreview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%", marginTop: 8 }} />
                    )}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="button-add" type="submit" disabled={loading}>
                        {loading ? "Se salvează..." : editId ? "Actualizează" : "Adaugă"}
                    </button>
                    {editId && (
                        <button type="button" className="btn-secondary-action" onClick={resetForm}>
                            Anulează
                        </button>
                    )}
                </div>
            </form>

            <h2 style={{ marginTop: 32 }}>Testimoniale ({items.length})</h2>
            {items.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>Nu există testimoniale încă.</p>}
            <div className="articles-list">
                {items.map(t => (
                    <div key={t.id} className="article-card" style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
                        {t.photoPath && (
                            <img
                                src={`${BACKEND_URL}${t.photoPath}`}
                                alt={t.authorName}
                                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                            />
                        )}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: "0 0 4px 0" }}>{t.authorName}{t.role && <span style={{ fontWeight: 400, color: "var(--color-text-muted)", fontSize: "0.9rem" }}> — {t.role}</span>}</h3>
                            <p style={{ fontStyle: "italic", color: "var(--color-text-muted)" }}>"{t.quote}"</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--color-text-faint)" }}>Ordine: {t.displayOrder ?? 0}</p>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                            <button className="button-add" style={{ padding: "6px 12px" }} onClick={() => startEdit(t)}>Editează</button>
                            <button className="button-delete" style={{ padding: "6px 12px" }} onClick={() => handleDelete(t.id)}>Șterge</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

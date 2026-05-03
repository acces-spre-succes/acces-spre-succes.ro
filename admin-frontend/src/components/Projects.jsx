import React, { useEffect, useRef, useState } from "react";
import { authFetch } from "../services/auth";
import { API_BASE_URL, BACKEND_URL } from "../config";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [form, setForm]         = useState({ title: "", description: "" });
    const [imageFile, setImageFile]     = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving]     = useState(false);
    const [msg, setMsg]           = useState({ text: "", error: false });
    const fileRef = useRef(null);

    /* editing state */
    const [editId, setEditId]         = useState(null);
    const [editForm, setEditForm]     = useState({ title: "", description: "" });
    const [editImage, setEditImage]   = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [editSaving, setEditSaving] = useState(false);
    const editFileRef = useRef(null);

    /* ── Load all ── */
    useEffect(() => {
        authFetch(`${API_BASE_URL}/upcoming-projects/all`)
            .then(r => r.json())
            .then(data => setProjects(data || []))
            .catch(console.error);
    }, []);

    /* ── Create ── */
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            setMsg({ text: "Titlul și descrierea sunt obligatorii.", error: true });
            return;
        }
        setSaving(true);
        setMsg({ text: "", error: false });
        const fd = new FormData();
        fd.append("title", form.title.trim());
        fd.append("description", form.description.trim());
        if (imageFile) fd.append("image", imageFile);
        try {
            const res = await authFetch(`${API_BASE_URL}/upcoming-projects`, { method: "POST", body: fd });
            if (!res.ok) throw new Error();
            const saved = await res.json();
            setProjects(prev => [saved, ...prev]);
            setForm({ title: "", description: "" });
            setImageFile(null);
            setImagePreview(null);
            if (fileRef.current) fileRef.current.value = "";
            setMsg({ text: "Proiect adăugat cu succes!", error: false });
        } catch {
            setMsg({ text: "Eroare la salvare. Încearcă din nou.", error: true });
        } finally {
            setSaving(false);
        }
    };

    /* ── Start editing ── */
    const startEdit = (p) => {
        setEditId(p.id);
        setEditForm({ title: p.title, description: p.description });
        setEditImage(null);
        setEditPreview(p.imagePath ? `${BACKEND_URL}${p.imagePath}` : null);
    };
    const cancelEdit = () => { setEditId(null); setEditImage(null); setEditPreview(null); };

    /* ── Save edit ── */
    const handleEditSave = async (id) => {
        if (!editForm.title.trim() || !editForm.description.trim()) return;
        setEditSaving(true);
        const fd = new FormData();
        fd.append("title", editForm.title.trim());
        fd.append("description", editForm.description.trim());
        if (editImage) fd.append("image", editImage);
        try {
            const res = await authFetch(`${API_BASE_URL}/upcoming-projects/${id}`, { method: "PUT", body: fd });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setProjects(prev => prev.map(p => p.id === id ? updated : p));
            cancelEdit();
        } catch {
            alert("Eroare la actualizare.");
        } finally {
            setEditSaving(false);
        }
    };

    /* ── Toggle status ── */
    const handleToggle = async (id) => {
        try {
            const res = await authFetch(`${API_BASE_URL}/upcoming-projects/${id}/status`, { method: "PATCH" });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setProjects(prev => prev.map(p => p.id === id ? updated : p));
        } catch {
            alert("Eroare la schimbarea statusului.");
        }
    };

    /* ── Delete ── */
    const handleDelete = async (id) => {
        if (!window.confirm("Ștergi acest proiect? Operația nu poate fi anulată.")) return;
        await authFetch(`${API_BASE_URL}/upcoming-projects/${id}`, { method: "DELETE" });
        setProjects(prev => prev.filter(p => p.id !== id));
        if (editId === id) cancelEdit();
    };

    const upcoming  = projects.filter(p => !p.completed);
    const completed = projects.filter(p => p.completed);

    return (
        <div className="content-section">
            <h2>Proiecte</h2>

            {/* ── Add form ── */}
            <form className="article-form" onSubmit={handleAdd} style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "1rem", fontWeight: 600 }}>Proiect nou</h3>
                {msg.text && <p className={msg.error ? "error-message" : "success-message"}>{msg.text}</p>}
                <input
                    placeholder="Titlu proiect *"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required
                />
                <textarea
                    placeholder="Descriere *"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required
                />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <label style={{ cursor: "pointer" }}>
                        <span className="btn-secondary-action" style={{ display: "inline-block" }}>
                            📷 {imageFile ? "Schimbă imaginea" : "Adaugă imagine (opțional)"}
                        </span>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                setImageFile(f);
                                setImagePreview(URL.createObjectURL(f));
                            }}
                        />
                    </label>
                    {imagePreview && <img src={imagePreview} alt="preview" style={{ height: 56, borderRadius: 6, objectFit: "cover" }} />}
                    {imageFile && (
                        <button type="button" className="btn-secondary-action" style={{ padding: "6px 10px" }}
                            onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}>
                            ✕
                        </button>
                    )}
                </div>
                <button className="button-add" type="submit" disabled={saving} style={{ alignSelf: "flex-start" }}>
                    {saving ? "Se salvează…" : "Adaugă proiect"}
                </button>
            </form>

            {/* ── Active projects ── */}
            <ProjectSection
                title="Active" badge={upcoming.length} badgeColor="var(--color-primary)"
                projects={upcoming} editId={editId} editForm={editForm} setEditForm={setEditForm}
                editPreview={editPreview} setEditPreview={setEditPreview}
                editImage={editImage} setEditImage={setEditImage}
                editFileRef={editFileRef} editSaving={editSaving}
                onStartEdit={startEdit} onCancelEdit={cancelEdit} onSaveEdit={handleEditSave}
                onToggle={handleToggle} onDelete={handleDelete}
                toggleLabel="Marchează ca finalizat ✓" toggleClass="button-add"
                emptyText="Nu există proiecte active."
            />

            {/* ── Completed projects ── */}
            <ProjectSection
                title="Finalizate" badge={completed.length} badgeColor="var(--color-success)"
                projects={completed} editId={editId} editForm={editForm} setEditForm={setEditForm}
                editPreview={editPreview} setEditPreview={setEditPreview}
                editImage={editImage} setEditImage={setEditImage}
                editFileRef={editFileRef} editSaving={editSaving}
                onStartEdit={startEdit} onCancelEdit={cancelEdit} onSaveEdit={handleEditSave}
                onToggle={handleToggle} onDelete={handleDelete}
                toggleLabel="Reactivează ↩" toggleClass="btn-secondary-action"
                emptyText="Nu există proiecte finalizate."
            />
        </div>
    );
}

function ProjectSection({ title, badge, badgeColor, projects, emptyText, toggleLabel, toggleClass,
    editId, editForm, setEditForm, editPreview, setEditPreview, editImage, setEditImage,
    editFileRef, editSaving, onStartEdit, onCancelEdit, onSaveEdit, onToggle, onDelete }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
                <span style={{ background: badgeColor, color: "#fff", borderRadius: 20, padding: "1px 10px", fontSize: "0.8rem", fontWeight: 700 }}>
                    {badge}
                </span>
            </div>
            {projects.length === 0 ? (
                <p style={{ color: "var(--color-text-faint)", fontStyle: "italic" }}>{emptyText}</p>
            ) : (
                <div className="projects-list">
                    {projects.map(p => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            isEditing={editId === p.id}
                            editForm={editForm}
                            setEditForm={setEditForm}
                            editPreview={editPreview}
                            setEditPreview={setEditPreview}
                            editImage={editImage}
                            setEditImage={setEditImage}
                            editFileRef={editFileRef}
                            editSaving={editSaving}
                            onStartEdit={onStartEdit}
                            onCancelEdit={onCancelEdit}
                            onSaveEdit={onSaveEdit}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            toggleLabel={toggleLabel}
                            toggleClass={toggleClass}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ProjectCard({ project: p, isEditing, editForm, setEditForm, editPreview, setEditPreview,
    editImage, setEditImage, editFileRef, editSaving, onStartEdit, onCancelEdit, onSaveEdit,
    onToggle, onDelete, toggleLabel, toggleClass }) {

    if (isEditing) {
        return (
            <div className="project-card" style={{ border: "2px solid var(--color-primary)" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "0.95rem", color: "var(--color-primary)" }}>
                    ✏️ Editează proiect
                </h3>
                <input
                    value={editForm.title}
                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Titlu *"
                    style={{ marginBottom: 8 }}
                />
                <textarea
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Descriere *"
                    style={{ marginBottom: 8 }}
                />
                {/* Image picker */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <label style={{ cursor: "pointer" }}>
                        <span className="btn-secondary-action" style={{ display: "inline-block", fontSize: "0.82rem" }}>
                            📷 {editImage ? "Schimbă imaginea" : "Schimbă imaginea"}
                        </span>
                        <input
                            ref={editFileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                setEditImage(f);
                                setEditPreview(URL.createObjectURL(f));
                            }}
                        />
                    </label>
                    {editPreview && (
                        <img src={editPreview} alt="preview" style={{ height: 50, borderRadius: 6, objectFit: "cover" }} />
                    )}
                    {editImage && (
                        <button type="button" className="btn-secondary-action" style={{ padding: "5px 8px" }}
                            onClick={() => { setEditImage(null); setEditPreview(p.imagePath ? `${BACKEND_URL}${p.imagePath}` : null); if (editFileRef.current) editFileRef.current.value = ""; }}>
                            ✕
                        </button>
                    )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => onSaveEdit(p.id)} disabled={editSaving || !editForm.title.trim() || !editForm.description.trim()}>
                        {editSaving ? "Se salvează…" : "Salvează"}
                    </button>
                    <button className="btn-secondary-action" onClick={onCancelEdit} disabled={editSaving}>
                        Anulează
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-card">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {p.imagePath && (
                    <img src={`${BACKEND_URL}${p.imagePath}`} alt={p.title}
                        style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: "0 0 4px" }}>{p.title}</h3>
                    <p style={{ margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {p.description}
                    </p>
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button className="btn-secondary-action" onClick={() => onStartEdit(p)}>
                    ✏️ Editează
                </button>
                <button className={toggleClass} onClick={() => onToggle(p.id)}>
                    {toggleLabel}
                </button>
                <button className="button-delete" onClick={() => onDelete(p.id)}>
                    Șterge
                </button>
            </div>
        </div>
    );
}

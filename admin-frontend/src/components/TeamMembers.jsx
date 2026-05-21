import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL, BACKEND_URL } from "../config";
import { authFetch } from "../services/auth";
import CropperModal from "./CropperModal";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
    departmentIds: [],
    projectIds: [],
    photo: null,
};

export default function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [showArchived, setShowArchived] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);
    const [formNonce, setFormNonce] = useState(0);
    const [pendingFile, setPendingFile] = useState(null);

    // Drag-and-drop state
    const dragIdx = useRef(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const [reordering, setReordering] = useState(false);

    useEffect(() => {
        loadMembers();
        loadDepartments();
        loadProjects();
    }, []);

    const loadMembers = () => {
        authFetch(`${API_BASE_URL}/team`)
            .then((res) => res.json())
            .then(setMembers)
            .catch((err) => console.error("Eroare la preluare echipa:", err));
    };

    const loadDepartments = () => {
        authFetch(`${API_BASE_URL}/departments`)
            .then((res) => res.json())
            .then(setDepartments)
            .catch((err) => console.error("Eroare la preluare departamente:", err));
    };

    const loadProjects = () => {
        authFetch(`${API_BASE_URL}/upcoming-projects/all`)
            .then((res) => res.json())
            .then(setProjects)
            .catch((err) => console.error("Eroare la preluare proiecte:", err));
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setForm({
            firstName: m.firstName || "",
            lastName: m.lastName || "",
            email: m.email || "",
            role: m.role || "",
            bio: m.bio || "",
            departmentIds: (m.departments || []).map((d) => d.id),
            projectIds: (m.projects || []).map((p) => p.id),
            photo: null,
        });
        setFormNonce((n) => n + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormNonce((n) => n + 1);
    };

    const toggleDepartment = (id) => {
        setForm((prev) => {
            const has = prev.departmentIds.includes(id);
            return {
                ...prev,
                departmentIds: has
                    ? prev.departmentIds.filter((x) => x !== id)
                    : [...prev.departmentIds, id],
            };
        });
    };

    const toggleProject = (id) => {
        setForm((prev) => {
            const has = prev.projectIds.includes(id);
            return {
                ...prev,
                projectIds: has
                    ? prev.projectIds.filter((x) => x !== id)
                    : [...prev.projectIds, id],
            };
        });
    };

    const handleFilePicked = (file) => {
        if (file) setPendingFile(file);
    };

    const handleCropCancel = () => setPendingFile(null);

    const handleCropDone = (croppedFile) => {
        setForm((prev) => ({ ...prev, photo: croppedFile }));
        setPendingFile(null);
    };

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email) {
            alert("Completează prenumele, numele și emailul.");
            return;
        }
        setBusy(true);
        try {
            const fd = new FormData();
            fd.append("firstName", form.firstName);
            fd.append("lastName", form.lastName);
            fd.append("email", form.email);
            if (form.role) fd.append("role", form.role);
            if (form.bio) fd.append("bio", form.bio);
            form.departmentIds.forEach((id) => fd.append("departmentIds", String(id)));
            if (form.photo) fd.append("photo", form.photo);

            const url = editingId
                ? `${API_BASE_URL}/team/${editingId}`
                : `${API_BASE_URL}/team`;
            const method = editingId ? "PUT" : "POST";

            const res = await authFetch(url, { method, body: fd });
            if (!res.ok) {
                let detail = `${res.status} ${res.statusText}`;
                try {
                    const text = await res.text();
                    if (text) detail += `\n\n${text.slice(0, 400)}`;
                } catch (_) { /* ignore */ }
                throw new Error(detail);
            }
            const saved = await res.json();

            // Persist project assignments separately
            if (editingId || saved?.id) {
                const memberId = editingId || saved.id;
                await authFetch(`${API_BASE_URL}/team/${memberId}/projects`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form.projectIds),
                });
            }

            cancelEdit();
            loadMembers();
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut salva membrul echipei.\n\n" + (err.message || ""));
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Stergi acest membru din echipa? Aceasta actiune este permanenta.\n\nDaca vrei doar sa il ascunzi, foloseste butonul 'Arhiveaza'.")) return;
        const res = await authFetch(`${API_BASE_URL}/team/${id}`, { method: "DELETE" });
        if (res.ok) {
            setMembers((prev) => prev.filter((m) => m.id !== id));
        } else {
            alert("Nu s-a putut șterge.");
        }
    };

    const handleArchive = async (m) => {
        const newArchived = !m.archived;
        const label = newArchived ? "arhivat" : "restaurat";
        const res = await authFetch(`${API_BASE_URL}/team/${m.id}/archive`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ archived: newArchived }),
        });
        if (res.ok) {
            setMembers((prev) =>
                prev.map((x) => x.id === m.id ? { ...x, archived: newArchived } : x)
            );
        } else {
            alert(`Nu s-a putut ${label} membrul.`);
        }
    };

    // ── Drag-and-drop reorder ─────────────────────────────────────────────
    const handleDragStart = (e, idx) => {
        dragIdx.current = idx;
        e.dataTransfer.effectAllowed = "move";
        // Required for Firefox to initiate the drag
        e.dataTransfer.setData("text/plain", String(idx));
    };

    const handleDragEnter = (idx) => {
        if (dragIdx.current !== idx) setDragOverIdx(idx);
    };

    const handleDragEnd = async () => {
        const from = dragIdx.current;
        const to = dragOverIdx;
        dragIdx.current = null;
        setDragOverIdx(null);

        if (to === null || from === to) return;

        // Reorder the local visible list
        const list = [...activeVisible];
        const [moved] = list.splice(from, 1);
        list.splice(to, 0, moved);

        // Assign new displayOrder values (0-based)
        const updated = list.map((m, i) => ({ ...m, displayOrder: i }));

        // Update the full members array: apply new orders then re-sort
        setMembers((prev) => {
            const orderMap = {};
            updated.forEach((m) => { orderMap[m.id] = m.displayOrder; });
            return prev
                .map((m) => orderMap[m.id] !== undefined ? { ...m, displayOrder: orderMap[m.id] } : m)
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id);
        });

        // Persist to server
        setReordering(true);
        try {
            const payload = updated.map((m, i) => ({ id: m.id, displayOrder: i }));
            const res = await authFetch(`${API_BASE_URL}/team/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Reordonare eșuată");
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut salva ordinea. Reîncarcă pagina.");
            loadMembers(); // revert
        } finally {
            setReordering(false);
        }
    };
    // ─────────────────────────────────────────────────────────────────────

    const activeMembers = members.filter((m) => !m.archived);
    const archivedMembers = members.filter((m) => m.archived);

    const activeVisible =
        filter === "ALL"
            ? activeMembers
            : filter === "NONE"
                ? activeMembers.filter((m) => !m.departments || m.departments.length === 0)
                : activeMembers.filter((m) => (m.departments || []).some((d) => d.id === Number(filter)));

    const renderCard = (m, idx, draggable = false) => (
        <div
            key={m.id}
            className="article-card"
            draggable={draggable}
            onDragStart={draggable ? (e) => handleDragStart(e, idx) : undefined}
            onDragEnter={draggable ? () => handleDragEnter(idx) : undefined}
            onDragOver={draggable ? (e) => e.preventDefault() : undefined}
            onDragEnd={draggable ? handleDragEnd : undefined}
            style={{
                cursor: draggable ? "grab" : "default",
                opacity: draggable && dragOverIdx === idx ? 0.5 : 1,
                border: draggable && dragOverIdx === idx ? "2px dashed #1d4771" : undefined,
                transition: "opacity 0.15s, border 0.15s",
                userSelect: "none",
                ...(m.archived ? { background: "#f5f5f5" } : {}),
            }}
        >
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                {draggable && (
                    <div style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        color: "#aaa", fontSize: "20px", flexShrink: 0, paddingTop: "4px",
                        cursor: "grab", lineHeight: 1.2,
                    }}>
                        ⠿
                    </div>
                )}

                {m.photoPath && (
                    <img
                        src={`${BACKEND_URL}${m.photoPath}`}
                        alt={`${m.firstName} ${m.lastName}`}
                        draggable={false}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0, pointerEvents: "none" }}
                    />
                )}
                <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "2px" }}>
                        {m.firstName} {m.lastName}
                        {m.archived && (
                            <span style={{ marginLeft: "8px", fontSize: "11px", background: "#e5e7eb", color: "#6b7280", borderRadius: "4px", padding: "2px 6px" }}>
                                arhivat
                            </span>
                        )}
                    </h3>
                    {m.role && <p style={{ fontWeight: "bold", color: "#4c51bf", marginBottom: "2px" }}>{m.role}</p>}
                    <p style={{ marginBottom: "2px" }}>{m.email}</p>
                    <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                        {m.departments && m.departments.length > 0
                            ? m.departments.map((d) => d.name).join(", ")
                            : "(fără departament)"}
                        {draggable && ` · Poziție: #${idx + 1}`}
                    </p>
                    {m.projects && m.projects.length > 0 && (
                        <p style={{ fontSize: "12px", color: "#555", margin: "2px 0 0" }}>
                            Proiecte: {m.projects.map((p) => p.title).join(", ")}
                        </p>
                    )}
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                <button className="button-add" onClick={() => startEdit(m)}>Editează</button>
                <button
                    className={m.archived ? "button-add" : "button-delete"}
                    style={m.archived ? { background: "#16a34a" } : { background: "#78350f", borderColor: "#78350f" }}
                    onClick={() => handleArchive(m)}
                >
                    {m.archived ? "Restaurează" : "Arhivează"}
                </button>
                <button className="button-delete" onClick={() => handleDelete(m.id)}>Șterge</button>
            </div>
        </div>
    );

    return (
        <div className="content-section active">
            <h2>{editingId ? "Editează membru" : "Adaugă membru în echipă"}</h2>

            <div className="article-form">
                <input
                    type="text"
                    placeholder="Prenume"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Nume"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email (afișat public)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Rol (ex. Președinte, Coordonator IT)"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <textarea
                    placeholder="Scurtă descriere (opțional)"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />

                <div>
                    <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#1a202c" }}>
                        Departamente (poate fi membru în mai multe)
                    </p>
                    {departments.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "13px" }}>
                            Nu există departamente încă. Creează-le din secțiunea Departamente.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                            {departments.map((d) => (
                                <label
                                    key={d.id}
                                    style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{ width: "auto", margin: 0 }}
                                        checked={form.departmentIds.includes(d.id)}
                                        onChange={() => toggleDepartment(d.id)}
                                    />
                                    {d.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <p style={{ margin: "0 0 6px 0", fontWeight: 600, color: "#1a202c" }}>
                        Proiecte / evenimente în care a participat
                    </p>
                    {projects.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "13px" }}>
                            Nu există proiecte încă.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                            {projects.map((p) => (
                                <label
                                    key={p.id}
                                    style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "14px" }}
                                >
                                    <input
                                        type="checkbox"
                                        style={{ width: "auto", margin: 0 }}
                                        checked={form.projectIds.includes(p.id)}
                                        onChange={() => toggleProject(p.id)}
                                    />
                                    {p.title}
                                    {p.completed && (
                                        <span style={{ fontSize: "11px", color: "#888" }}>(finalizat)</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <input
                        key={formNonce}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFilePicked(e.target.files?.[0])}
                    />
                    {form.photo && (
                        <p style={{ fontSize: "13px", color: "#166534", marginTop: "4px" }}>
                            Imagine pregătită pentru upload ({Math.round(form.photo.size / 1024)} KB).
                        </p>
                    )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="button-add" onClick={handleSubmit} disabled={busy}>
                        {editingId ? "Salvează modificările" : "Adaugă membru"}
                    </button>
                    {editingId && (
                        <button className="button-delete" onClick={cancelEdit} disabled={busy}>
                            Anulează
                        </button>
                    )}
                </div>
            </div>

            {/* ── Active member list with drag-to-reorder ── */}
            <div style={{ marginTop: "30px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0 }}>Membri actuali</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: "auto", flex: "0 0 auto" }}
                >
                    <option value="ALL">Toate departamentele</option>
                    {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    <option value="NONE">Fără departament</option>
                </select>
                {reordering && (
                    <span style={{ fontSize: "13px", color: "#888" }}>Se salvează ordinea…</span>
                )}
            </div>

            <p style={{ fontSize: "13px", color: "#888", marginTop: "6px", marginBottom: "12px" }}>
                ☰ Trage cardurile pentru a schimba ordinea de afișare pe site.
            </p>

            <div className="articles-list" style={{ marginTop: "0" }}>
                {activeVisible.length === 0 ? (
                    <p>Nu există membri activi în această categorie.</p>
                ) : (
                    activeVisible.map((m, idx) => renderCard(m, idx, true))
                )}
            </div>

            {/* ── Archived members ── */}
            {archivedMembers.length > 0 && (
                <>
                    <div style={{ marginTop: "30px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <h2 style={{ margin: 0, color: "#6b7280" }}>Membri arhivați</h2>
                        <button
                            style={{ fontSize: "13px", background: "none", border: "1px solid #d1d5db", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", color: "#6b7280" }}
                            onClick={() => setShowArchived((v) => !v)}
                        >
                            {showArchived ? "Ascunde" : `Arată (${archivedMembers.length})`}
                        </button>
                    </div>
                    {showArchived && (
                        <div className="articles-list" style={{ marginTop: "12px" }}>
                            {archivedMembers.map((m, idx) => renderCard(m, idx, false))}
                        </div>
                    )}
                </>
            )}

            <CropperModal
                file={pendingFile}
                onCancel={handleCropCancel}
                onCropped={handleCropDone}
            />
        </div>
    );
}

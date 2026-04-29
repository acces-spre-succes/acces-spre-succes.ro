import React, { useEffect, useState } from "react";
import { API_BASE_URL, BACKEND_URL } from "../config";
import { authFetch } from "../services/auth";
import CropperModal from "./CropperModal";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
    displayOrder: "",
    departmentIds: [],
    photo: null,
};

export default function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);
    // bumped on every successful save / cancel — keying the file input on
    // it forces React to re-mount the <input>, which is the only reliable
    // way to clear the displayed filename for an uncontrolled file input.
    const [formNonce, setFormNonce] = useState(0);
    // Set when the user picks a file; opens the CropperModal.
    const [pendingFile, setPendingFile] = useState(null);

    useEffect(() => {
        loadMembers();
        loadDepartments();
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

    const startEdit = (m) => {
        setEditingId(m.id);
        setForm({
            firstName: m.firstName || "",
            lastName: m.lastName || "",
            email: m.email || "",
            role: m.role || "",
            bio: m.bio || "",
            displayOrder: m.displayOrder ?? "",
            departmentIds: (m.departments || []).map((d) => d.id),
            photo: null,
        });
        setFormNonce((n) => n + 1);
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

    const handleFilePicked = (file) => {
        if (file) setPendingFile(file);
    };

    const handleCropCancel = () => {
        setPendingFile(null);
    };

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
            if (form.displayOrder !== "") fd.append("displayOrder", form.displayOrder);
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
        if (!window.confirm("Ștergi acest membru din echipă?")) return;
        const res = await authFetch(`${API_BASE_URL}/team/${id}`, { method: "DELETE" });
        if (res.ok) {
            setMembers(members.filter((m) => m.id !== id));
        } else {
            alert("Nu s-a putut șterge.");
        }
    };

    const visibleMembers =
        filter === "ALL"
            ? members
            : filter === "NONE"
                ? members.filter((m) => !m.departments || m.departments.length === 0)
                : members.filter((m) => (m.departments || []).some((d) => d.id === Number(filter)));

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
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
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

                <input
                    type="number"
                    placeholder="Ordine afișare (0 = primul)"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                />

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
                            După salvare se va decupa automat la 1:1.
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
            </div>

            <div className="articles-list" style={{ marginTop: "16px" }}>
                {visibleMembers.length === 0 ? (
                    <p>Nu există membri în această categorie.</p>
                ) : (
                    visibleMembers.map((m) => (
                        <div key={m.id} className="article-card">
                            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                {m.photoPath && (
                                    <img
                                        src={`${BACKEND_URL}${m.photoPath}`}
                                        alt={`${m.firstName} ${m.lastName}`}
                                        style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <h3>{m.firstName} {m.lastName}</h3>
                                    {m.role && <p style={{ fontWeight: "bold", color: "#4c51bf" }}>{m.role}</p>}
                                    <p>{m.email}</p>
                                    {m.bio && <p style={{ color: "#555" }}>{m.bio}</p>}
                                    <p style={{ fontSize: "12px", color: "#888" }}>
                                        Departamente:{" "}
                                        {m.departments && m.departments.length > 0
                                            ? m.departments.map((d) => d.name).join(", ")
                                            : "(niciunul)"}
                                        {" "}· Ordine: {m.displayOrder ?? 0}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="button-add" onClick={() => startEdit(m)}>Editează</button>
                                <button className="button-delete" onClick={() => handleDelete(m.id)}>Șterge</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CropperModal
                file={pendingFile}
                onCancel={handleCropCancel}
                onCropped={handleCropDone}
            />
        </div>
    );
}

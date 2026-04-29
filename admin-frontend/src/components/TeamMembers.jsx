import React, { useEffect, useState } from "react";
import { API_BASE_URL, BACKEND_URL } from "../config";
import { authFetch } from "../services/auth";

export const DEPARTMENTS = [
    { value: "BOARD", label: "Consiliu director (afișat pe homepage)" },
    { value: "EVENTS", label: "Evenimente" },
    { value: "IT", label: "IT" },
    { value: "SOCIAL_MEDIA", label: "Social Media" },
    { value: "SPONSORS", label: "Sponsori" },
];

const labelOf = (value) =>
    DEPARTMENTS.find((d) => d.value === value)?.label || "Fără departament";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
    displayOrder: "",
    department: "",
    photo: null,
};

export default function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = () => {
        authFetch(`${API_BASE_URL}/team`)
            .then((res) => res.json())
            .then(setMembers)
            .catch((err) => console.error("Eroare la preluare echipa:", err));
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
            department: m.department || "",
            photo: null,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
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
            fd.append("department", form.department || "");
            if (form.photo) fd.append("photo", form.photo);

            const url = editingId
                ? `${API_BASE_URL}/team/${editingId}`
                : `${API_BASE_URL}/team`;
            const method = editingId ? "PUT" : "POST";

            const res = await authFetch(url, { method, body: fd });
            if (!res.ok) throw new Error("Salvare eșuată");
            cancelEdit();
            loadMembers();
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut salva membrul echipei.");
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
                ? members.filter((m) => !m.department)
                : members.filter((m) => m.department === filter);

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
                <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                >
                    <option value="">Fără departament</option>
                    {DEPARTMENTS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Ordine afișare (0 = primul)"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
                />
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
                <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: "auto", flex: "0 0 auto" }}>
                    <option value="ALL">Toate departamentele</option>
                    {DEPARTMENTS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
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
                                        Departament: <strong>{labelOf(m.department)}</strong> · Ordine: {m.displayOrder ?? 0}
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
        </div>
    );
}

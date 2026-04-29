import React, { useEffect, useState } from "react";
import { API_BASE_URL, BACKEND_URL } from "../config";
import { authFetch } from "../services/auth";

const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    bio: "",
    displayOrder: "",
    photo: null,
};

export default function TeamMembers() {
    const [members, setMembers] = useState([]);
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
                    placeholder="Rol (ex. Voluntar, Coordonator IT)"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
                <textarea
                    placeholder="Scurtă descriere (opțional)"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
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

            <h2 style={{ marginTop: "30px" }}>Membri actuali</h2>
            <div className="articles-list">
                {members.length === 0 ? (
                    <p>Nu există membri în echipă încă.</p>
                ) : (
                    members.map((m) => (
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
                                        Ordine: {m.displayOrder ?? 0}
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

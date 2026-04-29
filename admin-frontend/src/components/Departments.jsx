import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { authFetch } from "../services/auth";

const emptyForm = { name: "", description: "", displayOrder: "" };

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        authFetch(`${API_BASE_URL}/departments`)
            .then((res) => res.json())
            .then(setDepartments)
            .catch((err) => console.error("Eroare la preluare departamente:", err));
    };

    const startEdit = (d) => {
        setEditingId(d.id);
        setForm({
            name: d.name || "",
            description: d.description || "",
            displayOrder: d.displayOrder ?? "",
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.name.trim()) {
            alert("Departamentul trebuie să aibă un nume.");
            return;
        }
        setBusy(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description || null,
                displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
            };
            const url = editingId
                ? `${API_BASE_URL}/departments/${editingId}`
                : `${API_BASE_URL}/departments`;
            const method = editingId ? "PUT" : "POST";
            const res = await authFetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Salvare eșuată");
            cancelEdit();
            load();
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut salva departamentul. Asigură-te că numele este unic.");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Ștergi departamentul "${name}"?\n\nMembrii echipei nu vor fi șterși, doar legătura cu acest departament va dispărea.`)) {
            return;
        }
        const res = await authFetch(`${API_BASE_URL}/departments/${id}`, { method: "DELETE" });
        if (res.ok) {
            setDepartments(departments.filter((d) => d.id !== id));
        } else {
            alert("Nu s-a putut șterge departamentul.");
        }
    };

    return (
        <div className="content-section active">
            <h2>{editingId ? "Editează departament" : "Adaugă departament"}</h2>

            <div className="article-form">
                <input
                    type="text"
                    placeholder="Nume (ex. Consiliu director, Evenimente)"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                    placeholder="Descriere afișată pe pagina publică"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Ordine afișare (0 = primul în carusel)"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="button-add" onClick={handleSubmit} disabled={busy}>
                        {editingId ? "Salvează modificările" : "Adaugă departament"}
                    </button>
                    {editingId && (
                        <button className="button-delete" onClick={cancelEdit} disabled={busy}>
                            Anulează
                        </button>
                    )}
                </div>
            </div>

            <h2 style={{ marginTop: "30px" }}>Departamente existente</h2>
            <p style={{ color: "#666", marginBottom: "12px" }}>
                Primul din listă (ordonat după "Ordine afișare") este cel afișat implicit pe homepage când vizitatorul intră pe site.
            </p>
            <div className="articles-list">
                {departments.length === 0 ? (
                    <p>Nu există departamente. Adaugă primul de mai sus.</p>
                ) : (
                    departments.map((d) => (
                        <div key={d.id} className="article-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{d.name}</h3>
                                    {d.description && <p style={{ color: "#555" }}>{d.description}</p>}
                                    <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                                        Ordine afișare: <strong>{d.displayOrder ?? 0}</strong>
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="button-add" onClick={() => startEdit(d)}>Editează</button>
                                <button className="button-delete" onClick={() => handleDelete(d.id, d.name)}>Șterge</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

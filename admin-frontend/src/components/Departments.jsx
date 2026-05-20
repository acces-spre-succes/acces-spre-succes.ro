import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { authFetch } from "../services/auth";

const emptyForm = { name: "", description: "", displayOrder: "", isMaster: false, presidentId: "" };

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        load();
        authFetch(`${API_BASE_URL}/team`)
            .then((res) => res.json())
            .then((data) => setAllMembers(data || []))
            .catch((err) => console.error("Eroare la preluare membri:", err));
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
            isMaster: d.isMaster || false,
            presidentId: d.presidentId != null ? String(d.presidentId) : "",
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
                isMaster: form.isMaster,
                presidentId: form.presidentId !== "" ? Number(form.presidentId) : null,
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

    // Build a lookup map: memberId → full name
    const memberName = (id) => {
        const m = allMembers.find((x) => x.id === Number(id));
        return m ? `${m.firstName} ${m.lastName}`.trim() : `#${id}`;
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
                    placeholder="Ordine afișare (0 = primul)"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                />

                {/* President picker */}
                <label style={{ fontWeight: 600, marginTop: "4px" }}>
                    Persoană de contact / Președinte departament
                </label>
                <select
                    value={form.presidentId}
                    onChange={(e) => setForm({ ...form, presidentId: e.target.value })}
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px" }}
                >
                    <option value="">— Niciun contact specificat —</option>
                    {allMembers
                        .slice()
                        .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
                        .map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.firstName} {m.lastName}{m.role ? ` — ${m.role}` : ""}
                            </option>
                        ))}
                </select>

                {/* isMaster toggle */}
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "8px" }}>
                    <input
                        type="checkbox"
                        checked={form.isMaster}
                        onChange={(e) => setForm({ ...form, isMaster: e.target.checked })}
                        style={{ width: "18px", height: "18px", accentColor: "#1d4771", cursor: "pointer" }}
                    />
                    <span>
                        <strong>Departament principal (home screen)</strong>
                        <span style={{ display: "block", fontSize: "12px", color: "#666" }}>
                            Dacă este bifat, membrii acestui departament apar în secțiunea "Consiliu" de pe pagina principală și nu vor fi afișați pe pagina /departamente.
                        </span>
                    </span>
                </label>

                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
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
            <div className="articles-list">
                {departments.length === 0 ? (
                    <p>Nu există departamente. Adaugă primul de mai sus.</p>
                ) : (
                    departments.map((d) => (
                        <div key={d.id} className="article-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                        <h3 style={{ margin: 0 }}>{d.name}</h3>
                                        {d.isMaster && (
                                            <span style={{
                                                background: "#1d4771", color: "#fff",
                                                fontSize: "11px", fontWeight: 700,
                                                padding: "2px 8px", borderRadius: "999px",
                                                letterSpacing: "0.5px"
                                            }}>
                                                HOME
                                            </span>
                                        )}
                                    </div>
                                    {d.description && <p style={{ color: "#555", marginTop: "6px" }}>{d.description}</p>}
                                    <p style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                                        Ordine afișare: <strong>{d.displayOrder ?? 0}</strong>
                                        {d.presidentId && (
                                            <> &nbsp;·&nbsp; Contact: <strong>{memberName(d.presidentId)}</strong></>
                                        )}
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

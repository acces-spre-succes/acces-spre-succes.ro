import React, { useEffect, useRef, useState } from "react";
import { authFetch } from "../services/auth";
import { API_BASE_URL, BACKEND_URL } from "../config";

export default function EventPhotos() {
    const [projectType, setProjectType] = useState("UPCOMING");
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [photos, setPhotos] = useState([]);
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [formNonce, setFormNonce] = useState(0);
    const fileRef = useRef(null);

    // Load projects when type changes
    useEffect(() => {
        const endpoint = projectType === "UPCOMING" ? "upcoming-projects" : "completed-projects";
        authFetch(`${API_BASE_URL}/${endpoint}`)
            .then(r => r.json())
            .then(data => {
                setProjects(data || []);
                setProjectId("");
                setPhotos([]);
            })
            .catch(console.error);
    }, [projectType]);

    // Load photos when project changes
    useEffect(() => {
        if (!projectId) { setPhotos([]); return; }
        authFetch(`${API_BASE_URL}/event-photos?projectId=${projectId}&projectType=${projectType}`)
            .then(r => r.json())
            .then(setPhotos)
            .catch(console.error);
    }, [projectId, projectType]);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!projectId) { setMsg("Selectează un proiect."); return; }
        if (!file) { setMsg("Selectează o fotografie."); return; }
        setLoading(true);
        setMsg("");
        const fd = new FormData();
        fd.append("projectId", projectId);
        fd.append("projectType", projectType);
        if (caption.trim()) fd.append("caption", caption.trim());
        fd.append("photo", file);
        try {
            const res = await authFetch(`${API_BASE_URL}/event-photos`, { method: "POST", body: fd });
            if (!res.ok) throw new Error();
            setMsg("Fotografie adăugată!");
            setFile(null);
            setPreview(null);
            setCaption("");
            setFormNonce(n => n + 1);
            // Reload photos
            const updated = await authFetch(`${API_BASE_URL}/event-photos?projectId=${projectId}&projectType=${projectType}`);
            setPhotos(await updated.json());
        } catch {
            setMsg("Eroare la upload. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Ștergi această fotografie?")) return;
        await authFetch(`${API_BASE_URL}/event-photos/${id}`, { method: "DELETE" });
        setPhotos(photos.filter(p => p.id !== id));
    };

    const selectedProject = projects.find(p => String(p.id) === String(projectId));

    return (
        <div className="content-section">
            <h2>Galerie Foto Evenimente</h2>

            {/* Project selector */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    style={{ width: "auto", minWidth: 180 }}
                >
                    <option value="UPCOMING">Proiecte viitoare</option>
                    <option value="COMPLETED">Proiecte finalizate</option>
                </select>
                <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    style={{ width: "auto", minWidth: 240 }}
                    disabled={projects.length === 0}
                >
                    <option value="">— Selectează proiectul —</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
                {selectedProject && (
                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        {photos.length} foto
                    </span>
                )}
            </div>

            {/* Upload form */}
            {projectId && (
                <form className="article-form" onSubmit={handleUpload} key={formNonce} style={{ marginBottom: 32 }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem" }}>Adaugă fotografie</h3>
                    {msg && <p className={msg.startsWith("Eroare") || msg.startsWith("Selectează") ? "error-message" : "success-message"}>{msg}</p>}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        ref={fileRef}
                        required
                    />
                    {preview && (
                        <img src={preview} alt="preview" style={{ maxHeight: 140, borderRadius: 8, objectFit: "cover", marginTop: 4 }} />
                    )}
                    <input
                        placeholder="Legendă (opțional)"
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                    />
                    <button className="button-add" type="submit" disabled={loading} style={{ alignSelf: "flex-start" }}>
                        {loading ? "Se încarcă..." : "Adaugă fotografie"}
                    </button>
                </form>
            )}

            {/* Photo grid */}
            {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                    {photos.map(p => (
                        <div key={p.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                            <img
                                src={`${BACKEND_URL}${p.photoPath}`}
                                alt={p.caption || "event photo"}
                                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                            />
                            {p.caption && (
                                <p style={{ margin: 0, padding: "6px 10px", fontSize: "0.82rem", color: "var(--color-text-muted)", background: "#fafafa", borderTop: "1px solid var(--color-border)" }}>
                                    {p.caption}
                                </p>
                            )}
                            <button
                                onClick={() => handleDelete(p.id)}
                                style={{
                                    position: "absolute", top: 6, right: 6,
                                    background: "rgba(229,62,62,0.9)", color: "#fff",
                                    border: "none", borderRadius: 6, padding: "4px 8px",
                                    cursor: "pointer", fontSize: "0.78rem", fontWeight: 600
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {projectId && photos.length === 0 && (
                <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                    Nu există fotografii pentru acest eveniment.
                </p>
            )}
        </div>
    );
}

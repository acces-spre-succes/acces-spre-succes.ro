import React, { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "../services/auth";
import { API_BASE_URL, BACKEND_URL } from "../config";

function fileKey(file) {
    return `${file.name}_${file.size}_${file.lastModified}`;
}

export default function EventPhotos() {
    const [projectType, setProjectType] = useState("UPCOMING");
    const [projects, setProjects]       = useState([]);
    const [projectId, setProjectId]     = useState("");
    const [photos, setPhotos]           = useState([]);
    const [queue, setQueue]             = useState([]);
    const [uploading, setUploading]     = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");
    const [msg, setMsg]                 = useState({ text: "", error: false });
    const [dropActive, setDropActive]   = useState(false);
    const fileInputRef                  = useRef(null);
    const dragSrc                       = useRef(null);

    /* ── Load projects ── */
    useEffect(() => {
        const ep = projectType === "UPCOMING" ? "upcoming-projects" : "completed-projects";
        authFetch(`${API_BASE_URL}/${ep}`)
            .then(r => r.json())
            .then(data => { setProjects(data || []); setProjectId(""); setPhotos([]); setQueue([]); })
            .catch(console.error);
    }, [projectType]);

    /* ── Load photos ── */
    useEffect(() => {
        if (!projectId) { setPhotos([]); setQueue([]); return; }
        authFetch(`${API_BASE_URL}/event-photos?projectId=${projectId}&projectType=${projectType}`)
            .then(r => r.json())
            .then(data => setPhotos(data || []))
            .catch(console.error);
    }, [projectId, projectType]);

    /* ── Add files to queue ── */
    const addFiles = useCallback((fileList) => {
        const incoming = Array.from(fileList)
            .filter(f => f.type.startsWith("image/"))
            .map(f => ({ file: f, preview: URL.createObjectURL(f), caption: "", key: fileKey(f) }));
        setQueue(prev => {
            const existingKeys = new Set(prev.map(q => q.key));
            return [...prev, ...incoming.filter(i => !existingKeys.has(i.key))];
        });
    }, []);

    /* ── Drag-over drop zone ── */
    const onDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); setDropActive(true); };
    const onDragLeave = (e) => { e.stopPropagation(); setDropActive(false); };
    const onDrop      = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropActive(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };
    /* ── file <input> change ── */
    const onFileInput = (e) => {
        if (e.target.files?.length) addFiles(e.target.files);
        // keep value so onChange fires even if same files re-selected? No—reset:
        e.target.value = "";
    };

    const removeFromQueue = (key) => setQueue(prev => prev.filter(q => q.key !== key));
    const updateCaption   = (key, val) => setQueue(prev => prev.map(q => q.key === key ? { ...q, caption: val } : q));
    const clearQueue      = () => { setQueue([]); if (fileInputRef.current) fileInputRef.current.value = ""; };

    /* ── Upload all ── */
    const uploadAll = async () => {
        if (!projectId) { setMsg({ text: "Selectează un proiect mai întâi.", error: true }); return; }
        if (!queue.length) return;
        setUploading(true);
        setMsg({ text: "", error: false });
        const total = queue.length;
        let failed = 0;
        const uploaded = [];
        for (let i = 0; i < queue.length; i++) {
            setUploadProgress(`Se încarcă ${i + 1} din ${total}…`);
            const item = queue[i];
            const fd = new FormData();
            fd.append("projectId", projectId);
            fd.append("projectType", projectType);
            fd.append("displayOrder", photos.length + i);
            if (item.caption.trim()) fd.append("caption", item.caption.trim());
            fd.append("photo", item.file);
            try {
                const res = await authFetch(`${API_BASE_URL}/event-photos`, { method: "POST", body: fd });
                if (!res.ok) throw new Error();
                uploaded.push(await res.json());
            } catch { failed++; }
        }
        setUploading(false);
        setUploadProgress("");
        clearQueue();
        setPhotos(prev => [...prev, ...uploaded]);
        setMsg(failed === 0
            ? { text: `${total} fotografi${total === 1 ? "e" : "i"} adăugate cu succes!`, error: false }
            : { text: `Upload complet cu ${failed} erori.`, error: true }
        );
    };

    /* ── Delete ── */
    const handleDelete = async (id) => {
        if (!window.confirm("Ștergi această fotografie?")) return;
        await authFetch(`${API_BASE_URL}/event-photos/${id}`, { method: "DELETE" });
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    /* ── Drag-to-reorder existing photos ── */
    const onDragStart     = (e, idx) => { dragSrc.current = idx; e.dataTransfer.effectAllowed = "move"; };
    const onDragEnterPhoto = (e, idx) => {
        e.preventDefault();
        if (dragSrc.current === null || dragSrc.current === idx) return;
        setPhotos(prev => {
            const next = [...prev];
            const [moved] = next.splice(dragSrc.current, 1);
            next.splice(idx, 0, moved);
            dragSrc.current = idx;
            return next;
        });
    };
    const onDragEndPhoto  = async () => {
        dragSrc.current = null;
        const items = photos.map((p, i) => ({ id: p.id, displayOrder: i }));
        try {
            await authFetch(`${API_BASE_URL}/event-photos/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(items),
            });
        } catch { /* silent */ }
    };

    const selectedProject = projects.find(p => String(p.id) === String(projectId));

    /* ══════════════════ Render ══════════════════ */
    return (
        <div className="content-section">
            <h2>Galerie Foto Evenimente</h2>

            {/* Project selector */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
                <select value={projectType} onChange={e => setProjectType(e.target.value)} style={{ width: "auto", minWidth: 180 }}>
                    <option value="UPCOMING">Proiecte active</option>
                    <option value="COMPLETED">Proiecte finalizate</option>
                </select>
                <select value={projectId} onChange={e => setProjectId(e.target.value)} style={{ width: "auto", minWidth: 240 }} disabled={projects.length === 0}>
                    <option value="">— Selectează proiectul —</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
                {selectedProject && (
                    <span style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        {photos.length} foto{photos.length !== 1 ? "grafii" : "grafie"} salvate
                    </span>
                )}
            </div>

            {/* Upload zone */}
            {projectId && (
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: "1rem", fontWeight: 600 }}>Adaugă fotografii</h3>

                    {/* ── Drop zone – using <label> for reliable click-to-browse ── */}
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        style={{ position: "relative", marginBottom: 16 }}
                    >
                        <label
                            htmlFor="ep-file-input"
                            style={{
                                display: "block",
                                border: `2px dashed ${dropActive ? "var(--color-primary)" : "var(--color-border)"}`,
                                borderRadius: 10,
                                padding: "32px 20px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: dropActive ? "rgba(29,71,113,0.06)" : "var(--color-bg)",
                                transition: "border-color 0.15s, background 0.15s",
                                userSelect: "none",
                            }}
                        >
                            <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>📷</div>
                            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.93rem" }}>
                                Trage fotografiile aici sau{" "}
                                <strong style={{ color: "var(--color-primary)" }}>click pentru a selecta</strong>
                            </p>
                            <p style={{ margin: "6px 0 0", color: "var(--color-text-faint)", fontSize: "0.82rem" }}>
                                Poți selecta mai multe fotografii simultan (Ctrl + click sau Shift + click)
                            </p>
                        </label>
                        {/* Input is outside the label flow but connected via id */}
                        <input
                            id="ep-file-input"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={onFileInput}
                            style={{ position: "absolute", width: 1, height: 1, opacity: 0, top: 0, left: 0, overflow: "hidden" }}
                        />
                    </div>

                    {/* Queue preview */}
                    {queue.length > 0 && (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 14 }}>
                                {queue.map(item => (
                                    <div key={item.key} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid var(--color-border)", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}>
                                        <div style={{ position: "relative" }}>
                                            <img src={item.preview} alt="preview" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                                            <button onClick={() => removeFromQueue(item.key)} title="Elimină" style={{ position: "absolute", top: 5, right: 5, background: "rgba(229,62,62,0.9)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontWeight: 700, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                        </div>
                                        <input placeholder="Legendă (opțional)" value={item.caption} onChange={e => updateCaption(item.key, e.target.value)} style={{ border: "none", borderTop: "1px solid var(--color-border)", borderRadius: 0, fontSize: "0.82rem", padding: "6px 8px" }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                <button className="button-add" onClick={uploadAll} disabled={uploading}>
                                    {uploading ? uploadProgress : `Încarcă ${queue.length} fotografi${queue.length === 1 ? "e" : "i"}`}
                                </button>
                                <button className="btn-secondary-action" onClick={clearQueue} disabled={uploading}>
                                    Anulează selecția
                                </button>
                            </div>
                        </>
                    )}

                    {msg.text && (
                        <p className={msg.error ? "error-message" : "success-message"} style={{ marginTop: 12 }}>
                            {msg.text}
                        </p>
                    )}
                </div>
            )}

            {/* Saved photos – drag to reorder */}
            {photos.length > 0 && (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Fotografii salvate</h3>
                        <span style={{ fontSize: "0.82rem", color: "var(--color-text-faint)" }}>↕ Trage pentru a reordona</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                        {photos.map((p, idx) => (
                            <div key={p.id} draggable onDragStart={e => onDragStart(e, idx)} onDragEnter={e => onDragEnterPhoto(e, idx)} onDragEnd={onDragEndPhoto} onDragOver={e => e.preventDefault()} style={{ position: "relative", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", cursor: "grab", border: "1.5px solid var(--color-border)", background: "#fff", userSelect: "none" }}>
                                <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(15,41,66,0.75)", color: "#fff", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, padding: "2px 7px", lineHeight: 1.5 }}>
                                    {idx + 1}
                                </div>
                                <img src={`${BACKEND_URL}${p.photoPath}`} alt={p.caption || "event photo"} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} draggable={false} />
                                {p.caption && (
                                    <p style={{ margin: 0, padding: "6px 10px", fontSize: "0.82rem", color: "var(--color-text-muted)", background: "#fafafa", borderTop: "1px solid var(--color-border)" }}>
                                        {p.caption}
                                    </p>
                                )}
                                <button onClick={() => handleDelete(p.id)} title="Șterge" style={{ position: "absolute", top: 6, right: 6, background: "rgba(229,62,62,0.9)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>✕</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {projectId && photos.length === 0 && queue.length === 0 && (
                <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                    Nu există fotografii pentru acest proiect. Adaugă mai sus!
                </p>
            )}
        </div>
    );
}

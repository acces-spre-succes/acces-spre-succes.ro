import React, { useState } from "react";
import { changePassword, getUsername } from "../services/auth";

export default function Settings() {
    const username = getUsername() || "";
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState(null);

    const reset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ kind: "error", text: "Completează toate câmpurile." });
            return;
        }
        if (newPassword.length < 8) {
            setMessage({ kind: "error", text: "Parola nouă trebuie să aibă cel puțin 8 caractere." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ kind: "error", text: "Parolele noi nu coincid." });
            return;
        }
        if (newPassword === currentPassword) {
            setMessage({ kind: "error", text: "Parola nouă trebuie să fie diferită de cea curentă." });
            return;
        }

        setBusy(true);
        try {
            await changePassword(currentPassword, newPassword);
            reset();
            setMessage({ kind: "success", text: "Parolă schimbată cu succes." });
        } catch (err) {
            setMessage({ kind: "error", text: err.message || "Eroare la schimbarea parolei." });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="content-section active">
            <h2>Setări cont</h2>
            <p style={{ color: "#666", marginBottom: "16px" }}>
                Conectat ca <strong>{username}</strong>.
            </p>

            <h3 style={{ marginTop: "24px", marginBottom: "12px", color: "#1a202c" }}>
                Schimbă parola
            </h3>

            <form className="article-form" onSubmit={handleSubmit} style={{ borderBottom: "none", paddingBottom: 0 }}>
                <input
                    type="password"
                    placeholder="Parola curentă"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Parola nouă (minim 8 caractere)"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirmă parola nouă"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {message && (
                    <p
                        style={{
                            margin: 0,
                            padding: "10px 12px",
                            borderRadius: "6px",
                            background: message.kind === "success" ? "#f0fdf4" : "#fef2f2",
                            color: message.kind === "success" ? "#166534" : "#991b1b",
                            border: `1px solid ${message.kind === "success" ? "#bbf7d0" : "#fecaca"}`,
                        }}
                    >
                        {message.text}
                    </p>
                )}

                <button type="submit" className="button-add" disabled={busy}>
                    {busy ? "Se salvează..." : "Schimbă parola"}
                </button>
            </form>
        </div>
    );
}

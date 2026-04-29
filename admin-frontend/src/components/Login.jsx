import React, { useState } from "react";
import { login } from "../services/auth";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (submitting) return;
        setError("");
        setSubmitting(true);
        try {
            await login(username, password);
            onLogin();
        } catch (err) {
            setError(err.message || "Eroare la autentificare.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleLogin}>
                <h2>Autentificare Admin</h2>
                <div className="form-group">
                    <label>Utilizator</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoComplete="username"
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label>Parola</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>
                <button className="btn" type="submit" disabled={submitting}>
                    {submitting ? "Se conecteaza..." : "Autentificare"}
                </button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
}

import React, { useState } from "react";
import { login } from "../services/auth";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (submitting) return;
        setError("");
        setSubmitting(true);
        try {
            await login(username, password);
            onLogin();
        } catch (err) {
            setError(err.message || "Credențiale incorecte.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Branding */}
                <div className="login-brand">
                    <img
                        src="/AccesSpreSuccesLogo.jpeg"
                        alt="Acces spre Succes"
                        className="login-logo"
                        onError={e => { e.target.style.display = "none"; }}
                    />
                    <h1 className="login-org">Acces spre Succes</h1>
                    <p className="login-subtitle">Panou de administrare</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-field">
                        <label htmlFor="username">Utilizator</label>
                        <input
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                            autoFocus
                            placeholder="admin"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Parolă</label>
                        <div className="login-pass-wrap">
                            <input
                                id="password"
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="login-toggle-pass"
                                onClick={() => setShowPass(v => !v)}
                                aria-label={showPass ? "Ascunde parola" : "Arată parola"}
                            >
                                {showPass ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button className="login-btn" type="submit" disabled={submitting}>
                        {submitting ? (
                            <span className="login-spinner" />
                        ) : (
                            "Conectare"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

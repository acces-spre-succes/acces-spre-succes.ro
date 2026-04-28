import React, { useState } from "react";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (username === "admin" && password === "admin123") {
            onLogin();
        } else {
            setError("Utilizator sau parola incorecta!");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Autentificare Admin</h2>
                <div className="form-group">
                    <label>Utilizator</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Parola</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn" onClick={handleLogin}>Autentificare</button>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

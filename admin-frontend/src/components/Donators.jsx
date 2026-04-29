import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { authFetch } from "../services/auth";

const formatDate = (s) => {
    if (!s) return "—";
    try {
        return new Date(s).toLocaleString("ro-RO");
    } catch {
        return s;
    }
};

const formatAmount = (amount) => {
    if (amount == null) return "—";
    const n = typeof amount === "number" ? amount : Number(amount);
    if (Number.isNaN(n)) return amount;
    return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
};

export default function Donators() {
    const [donators, setDonators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authFetch(`${API_BASE_URL}/donators`)
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : [];
                list.sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));
                setDonators(list);
            })
            .catch((err) => console.error("Eroare la preluare donatori:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="content-section active"><p>Se încarcă...</p></div>;
    }

    return (
        <div className="content-section active">
            <h2>Donatori</h2>
            <p style={{ color: "#666", marginBottom: "16px" }}>
                Listă read-only a donațiilor procesate. Sortată descrescător după dată.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Nume</th>
                        <th>Email</th>
                        <th>Sumă</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {donators.length === 0 ? (
                        <tr>
                            <td colSpan="5">Nu există donatori înregistrați.</td>
                        </tr>
                    ) : (
                        donators.map((d) => (
                            <tr key={d.id}>
                                <td>{formatDate(d.submitDate)}</td>
                                <td>{d.firstName} {d.lastName}</td>
                                <td>{d.email}</td>
                                <td>{formatAmount(d.amount)}</td>
                                <td>{d.paymentStatus || "—"}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

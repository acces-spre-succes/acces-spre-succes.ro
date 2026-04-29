import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../config';
import { authFetch } from '../services/auth';

export default function Volunteers() {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        authFetch(`${API_BASE_URL}/volunteers`)
            .then(res => res.json())
            .then(data => setVolunteers(data))
            .catch(err => console.error("Eroare la preluare voluntari:", err));
    }, []);

    const handleDeleteVolunteer = async (id) => {
        if (window.confirm("Esti sigur ca vrei sa stergi acest voluntar?")) {
            await authFetch(`${API_BASE_URL}/volunteers/${id}`, {
                method: "DELETE",
            });
            setVolunteers(volunteers.filter(v => v.id !== id));
        }
    };

    return (
        <div className="content-section active">
            <h2>Voluntari</h2>
            <table>
                <thead>
                <tr>
                    <th>Nume</th>
                    <th>Vârstă</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Departament dorit</th>
                    <th>Descriere</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {volunteers.length === 0 ? (
                    <tr>
                        <td colSpan="7">Nu există voluntari.</td>
                    </tr>
                ) : (
                    volunteers.map(v => (
                        <tr key={v.id}>
                            <td>{v.firstName} {v.lastName}</td>
                            <td>{v.age}</td>
                            <td>{v.email}</td>
                            <td>{v.phoneNumber}</td>
                            <td>{v.interestedDepartment || "—"}</td>
                            <td>{v.description}</td>
                            <td>
                                <button className="button-delete" onClick={() => handleDeleteVolunteer(v.id)}>Șterge</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

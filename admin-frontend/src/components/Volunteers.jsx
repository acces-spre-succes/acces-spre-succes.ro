import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../config';

export default function Volunteers() {
    const [volunteers, setVolunteers] = useState([]);

    //Obtine lista de voluntari din backend
    useEffect(() => {
        fetch(`${API_BASE_URL}/volunteers`)
            .then(res => res.json())
            .then(data => setVolunteers(data))
            .catch(err => console.error("Eroare la preluare voluntari:", err));
    }, []);

    //Stergere voluntar
    const handleDeleteVolunteer = async (id) => {
        if (window.confirm("Esti sigur ca vrei sa stergi acest voluntar?")) {
            await fetch(`${API_BASE_URL}/volunteers/${id}`, {
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
                    <th>Varsta</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Descriere</th>
                    <th>Actiuni</th>
                </tr>
                </thead>
                <tbody>
                {volunteers.length === 0 ? (
                    <tr>
                        <td colSpan="6">Nu exista voluntari.</td>
                    </tr>
                ) : (
                    volunteers.map(v => (
                        <tr key={v.id}>
                            <td>{v.firstName} {v.lastName}</td>
                            <td>{v.age}</td>
                            <td>{v.email}</td>
                            <td>{v.phoneNumber}</td>
                            <td>{v.description}</td>
                            <td>
                                <button className="button-delete" onClick={() => handleDeleteVolunteer(v.id)}>Sterge</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

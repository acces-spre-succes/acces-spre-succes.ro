import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080';

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({ title: "", description: "", image: null });

    // Ia articolele din backend la mount
    useEffect(() => {
        fetch(`${API_BASE_URL}/articles`)
            .then(res => res.json())
            .then(data => setArticles(data))
            .catch(err => console.error(err));
    }, []);

    // Adauga articol
    const handleAddArticle = async () => {
        if (!newArticle.title || !newArticle.description) {
            alert("Completeaza toate campurile!");
            return;
        }

        const formData = new FormData();
        formData.append("title", newArticle.title);
        formData.append("description", newArticle.description);
        if (newArticle.image) formData.append("image", newArticle.image);

        try {
            const res = await fetch(`${API_BASE_URL}/articles`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Eroare la adaugarea articolului");

            const savedArticle = await res.json();
            setArticles([...articles, savedArticle]);
            setNewArticle({ title: "", description: "", image: null });
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut adauga articolul");
        }
    };

    // Sterge articol
    const handleDeleteArticle = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Eroare la stergere");

            setArticles(articles.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
            alert("Nu s-a putut sterge articolul");
        }
    };

    return (
        <div className="content-section active">
            <h2>Gestionare Articole</h2>

            <div className="article-form">
                <input
                    type="text"
                    placeholder="Titlu articol"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                />
                <textarea
                    placeholder="Descriere articol"
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                />
                <input
                    type="file"
                    onChange={(e) => setNewArticle({ ...newArticle, image: e.target.files[0] })}
                />
                <button className="button-add" onClick={handleAddArticle}>Adauga Articol</button>
            </div>

            <div className="articles-list">
                {articles.length === 0 ? (
                    <p>Nu exista articole.</p>
                ) : (
                    articles.map(a => (
                        <div key={a.id} className="article-card">
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                            {a.imagePath && (
                                <img
                                    src={`${BACKEND_URL}${a.imagePath}`}
                                    alt={a.title}
                                    style={{ maxWidth: "200px", marginTop: "8px" }}
                                />
                            )}
                            <button className="button-delete" onClick={() => handleDeleteArticle(a.id)}>Sterge</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { API_BASE_URL } from '../config';
import { authFetch } from './auth';

const ARTICLES_URL = `${API_BASE_URL}/articles`;

export async function getArticles() {
    const res = await authFetch(ARTICLES_URL);
    if (!res.ok) throw new Error("Eroare la preluarea articolelor");
    return res.json();
}

export async function addArticle(article) {
    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("description", article.description);
    if (article.image) {
        formData.append("image", article.image);
    }

    const res = await authFetch(ARTICLES_URL, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Eroare la adaugarea articolului");
    return res.json();
}

export async function deleteArticle(id) {
    const res = await authFetch(`${ARTICLES_URL}/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Eroare la stergerea articolului");
}

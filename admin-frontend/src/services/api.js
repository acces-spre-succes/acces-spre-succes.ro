import { API_BASE_URL } from '../config';

//URL corect pentru backend (Spring Boot)
const BASE_URL = `${API_BASE_URL}/articles`;

//Obtine toate articolele
export async function getArticles() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Eroare la preluarea articolelor");
    return res.json();
}

//Adauga un articol nou (cu suport pentru imagine)
export async function addArticle(article) {
    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("description", article.description);

    // daca articolul are imagine
    if (article.image) {
        formData.append("image", article.image);
    }

    const res = await fetch(BASE_URL, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Eroare la adaugarea articolului");
    return res.json();
}

//Sterge articolul dupa ID
export async function deleteArticle(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Eroare la stergerea articolului");
}

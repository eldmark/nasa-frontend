import * as api from '../api.js';

export const ApodPage = async (container) => {
    const res = await api.fetchApod();
    const data = res.data;
    
    container.innerHTML = `
        <div class="card">
            <img src="${data.url}" alt="${data.title}">
            <div class="card-content">
                <h2>${data.title}</h2>
                <p><strong>Date:</strong> ${data.date}</p>
                <p>${data.explanation}</p>
                <button class="btn-primary" id="save-apod">Save to Favorites</button>
            </div>
        </div>
    `;
    
    document.getElementById('save-apod').onclick = async () => {
        try {
            await api.saveFavorite('apod', {
                id: data.date,
                title: data.title,
                img: data.url,
                info: data.date
            });
            alert('Saved!');
        } catch (e) { alert(e.message); }
    };
};

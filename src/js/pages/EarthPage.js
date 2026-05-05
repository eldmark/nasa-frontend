import * as api from '../api.js';

export const EarthPage = async (container) => {
    const res = await api.fetchEarth();
    container.innerHTML = '<h1>Earth (EPIC)</h1><div class="grid"></div>';
    const grid = container.querySelector('.grid');
    res.data.forEach(img => {
        const date = img.date.split(' ')[0].replace(/-/g, '/');
        const url = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${url}" loading="lazy">
            <div class="card-content">
                <h3>${img.date}</h3>
                <button class="btn-primary btn-save-earth">Save</button>
            </div>
        `;
        card.querySelector('.btn-save-earth').onclick = () => api.saveFavorite('earth', { id: img.identifier, img: url, title: `Earth - ${img.date}` });
        grid.appendChild(card);
    });
};

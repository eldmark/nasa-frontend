import * as api from '../api.js';

export const AsteroidsPage = async (container) => {
    const res = await api.fetchAsteroids();
    const asteroids = Object.values(res.data.near_earth_objects).flat();
    container.innerHTML = '<h1>Asteroids Today</h1>';
    asteroids.forEach(neo => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${neo.name}</strong><br>
                Hazardous: ${neo.is_potentially_hazardous_asteroid ? '⚠️ YES' : 'No'}
            </div>
            <button class="btn-outline btn-save-ast">Save</button>
        `;
        div.querySelector('.btn-save-ast').onclick = () => api.saveFavorite('asteroids', { id: neo.id, title: neo.name, info: 'Near Earth Object' });
        container.appendChild(div);
    });
};

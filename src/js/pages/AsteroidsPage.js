import * as api from '../api.js';

export const AsteroidsPage = async (container) => {
    container.innerHTML = '<h1>Asteroids Today</h1><div id="ast-filters" style="margin-bottom:20px;"><input type="text" id="ast-search" placeholder="Filter asteroids by name..." style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text);"></div><div id="ast-list"></div>';
    
    const list = document.getElementById('ast-list');
    const searchInput = document.getElementById('ast-search');
    
    let allAsteroids = [];

    const render = (filter = '') => {
        list.innerHTML = '';
        const filtered = allAsteroids.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));
        
        if (filtered.length === 0) {
            list.innerHTML = '<p>No asteroids found.</p>';
            return;
        }

        filtered.forEach(neo => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div>
                    <strong>${neo.name}</strong><br>
                    Hazardous: ${neo.is_potentially_hazardous_asteroid ? '⚠️ YES' : 'No'}
                </div>
                <button class="btn-outline btn-save-ast">Save</button>
            `;
            div.querySelector('.btn-save-ast').onclick = async () => {
                await api.saveFavorite('asteroids', { id: neo.id, title: neo.name, info: 'Near Earth Object' });
                alert('Saved!');
            };
            list.appendChild(div);
        });
    };

    try {
        const res = await api.fetchAsteroids();
        allAsteroids = Object.values(res.data.near_earth_objects).flat();
        render();
    } catch (e) { list.innerHTML = `<p class="error">${e.message}</p>`; }

    searchInput.oninput = (e) => render(e.target.value);
};

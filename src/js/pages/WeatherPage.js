import * as api from '../api.js';

export const WeatherPage = async (container) => {
    const res = await api.fetchWeather();
    const data = res.data;
    const solKeys = data.sol_keys || [];
    
    container.innerHTML = '<h1>Mars Weather (Insight)</h1>';
    
    if (solKeys.length === 0) {
        container.innerHTML += '<p>No data available.</p>';
        return;
    }
    
    const list = document.createElement('div');
    solKeys.forEach(sol => {
        const info = data[sol];
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div>
                <strong>Sol ${sol}</strong><br>
                Temp: ${info.AT?.av || 'N/A'}°C | Wind: ${info.HWS?.av || 'N/A'} m/s
            </div>
            <button class="btn-outline btn-save-weather" data-sol="${sol}">Save</button>
        `;
        list.appendChild(item);
    });
    
    container.appendChild(list);
    
    container.querySelectorAll('.btn-save-weather').forEach(btn => {
        btn.onclick = async () => {
            const sol = btn.dataset.sol;
            const info = data[sol];
            try {
                await api.saveFavorite('weather', {
                    id: sol,
                    title: `Mars Weather - Sol ${sol}`,
                    info: `Temp: ${info.AT?.av}°C`
                });
                alert('Saved!');
            } catch (e) { alert(e.message); }
        };
    });
};

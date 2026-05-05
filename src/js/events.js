import * as api from './api.js';
import * as dom from './dom.js';

const containers = {
    apod: document.getElementById('apod-section'),
    weather: document.getElementById('weather-section'),
    earth: document.getElementById('earth-section'),
    exoplanets: document.getElementById('exoplanets-section'),
    asteroids: document.getElementById('asteroids-list'),
    tech: document.getElementById('tech-list'),
    favs: document.getElementById('favs-content')
};

// --- View Handlers ---

const handleApod = async () => {
    dom.switchView('apod-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchApod();
        dom.renderApod(res.data, containers.apod);
    } catch (e) { dom.showError('Failed to load APOD'); }
    finally { dom.showLoading(false); }
};

const handleWeather = async () => {
    dom.switchView('weather-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchWeather();
        dom.renderWeather(res.data, containers.weather);
    } catch (e) { dom.showError('Failed to load Mars weather'); }
    finally { dom.showLoading(false); }
};

const handleExoplanets = async () => {
    dom.switchView('exoplanets-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchExoplanets();
        dom.renderExoplanets(res.data, containers.exoplanets);
    } catch (e) { dom.showError('Failed to load exoplanets'); }
    finally { dom.showLoading(false); }
};

const handleEarth = async () => {
    dom.switchView('earth-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchEarth();
        dom.renderEarth(res.data, containers.earth);
    } catch (e) { dom.showError('Failed to load Earth images'); }
    finally { dom.showLoading(false); }
};

const handleAsteroids = async () => {
    dom.switchView('asteroids-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchAsteroids();
        dom.renderAsteroids(res.data, containers.asteroids);
    } catch (e) { dom.showError('Failed to load asteroids'); }
    finally { dom.showLoading(false); }
};

const handleTech = async () => {
    const q = document.getElementById('tech-input').value || 'satellite';
    dom.switchView('tech-section');
    dom.showLoading(true);
    try {
        const res = await api.fetchTech(q);
        dom.renderTech(res.data.results, containers.tech);
    } catch (e) { dom.showError('Failed to load tech'); }
    finally { dom.showLoading(false); }
};

const handleFavs = async (type = 'apod') => {
    dom.switchView('favs-section');
    dom.showLoading(true);
    try {
        const res = await api.getFavorites();
        dom.renderFavorites(type, res.data[type], containers.favs);
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
    } catch (e) { dom.showError('Failed to load favorites'); }
    finally { dom.showLoading(false); }
};

// --- CRUD Events ---

window.addEventListener('save-item', async (e) => {
    const { type, item } = e.detail;
    try {
        await api.saveFavorite(type, item);
        alert('Item saved to favorites!');
    } catch (err) { alert('Failed to save item'); }
});

window.addEventListener('edit-item', async (e) => {
    const { type, id, title } = e.detail;
    try {
        await api.updateFavorite(id, title);
        handleFavs(type);
    } catch (err) { alert('Failed to update title'); }
});

window.addEventListener('delete-item', async (e) => {
    const { type, id } = e.detail;
    try {
        await api.deleteFavorite(id);
        handleFavs(type);
    } catch (err) { alert('Failed to delete item'); }
});

// --- Listeners ---

document.getElementById('btn-apod').onclick = handleApod;
document.getElementById('btn-weather').onclick = handleWeather;
document.getElementById('btn-earth').onclick = handleEarth;
document.getElementById('btn-exoplanets').onclick = handleExoplanets;
document.getElementById('btn-asteroids').onclick = handleAsteroids;
document.getElementById('btn-tech').onclick = () => dom.switchView('tech-section');
document.getElementById('btn-tech-go').onclick = handleTech;
document.getElementById('btn-favs').onclick = () => handleFavs('apod');

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => handleFavs(btn.dataset.type);
});

// Init
handleApod();

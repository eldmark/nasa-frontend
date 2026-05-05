const BASE_URL = 'http://localhost:3001/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API Error' }));
        throw new Error(error.message || 'Something went wrong');
    }
    return await response.json();
};

export const fetchApod = () => fetch(`${BASE_URL}/apod`).then(handleResponse);
export const fetchWeather = () => fetch(`${BASE_URL}/weather`).then(handleResponse);
export const fetchExoplanets = () => fetch(`${BASE_URL}/exoplanets`).then(handleResponse);
export const fetchEarth = () => fetch(`${BASE_URL}/earth`).then(handleResponse);
export const fetchAsteroids = () => fetch(`${BASE_URL}/asteroids`).then(handleResponse);
export const fetchTech = () => fetch(`${BASE_URL}/projects`).then(handleResponse);

// --- Favorites (Postgres) ---
export const getFavorites = () => fetch(`${BASE_URL}/favorites`).then(handleResponse);

export const saveFavorite = (type, item) => fetch(`${BASE_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, item })
}).then(handleResponse);

export const updateFavorite = (id, data) => fetch(`${BASE_URL}/favorites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
}).then(handleResponse);

export const deleteFavorite = (id) => fetch(`${BASE_URL}/favorites/${id}`, {
    method: 'DELETE'
}).then(handleResponse);

// --- Custom Planets ---
export const fetchCustomPlanets = () => fetch(`${BASE_URL}/custom-planets`).then(handleResponse);

export const createCustomPlanet = (planet) => fetch(`${BASE_URL}/custom-planets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planet)
}).then(handleResponse);

export const deleteCustomPlanet = (id) => fetch(`${BASE_URL}/custom-planets/${id}`, {
    method: 'DELETE'
}).then(handleResponse);

import * as api from './api.js';

export const initRouter = (routes) => {
    const app = document.getElementById('app');
    
    const navigate = async () => {
        const hash = window.location.hash || '#apod';
        const route = routes[hash] || routes['#apod'];
        
        // Clear previous content
        app.innerHTML = '<div class="loader">Loading...</div>';
        
        try {
            await route(app);
        } catch (error) {
            app.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    };

    window.addEventListener('hashchange', navigate);
    window.addEventListener('load', navigate);
};

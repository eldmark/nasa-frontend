import { initRouter } from './router.js';
import { ApodPage } from './pages/ApodPage.js';
import { WeatherPage } from './pages/WeatherPage.js';
import { EarthPage } from './pages/EarthPage.js';
import { ExoplanetsPage } from './pages/ExoplanetsPage.js';
import { AsteroidsPage } from './pages/AsteroidsPage.js';
import { TechPage } from './pages/TechPage.js';
import { FavoritesPage } from './pages/FavoritesPage.js';

const routes = {
    '#apod': ApodPage,
    '#weather': WeatherPage,
    '#earth': EarthPage,
    '#exoplanets': ExoplanetsPage,
    '#asteroids': AsteroidsPage,
    '#tech': TechPage,
    '#favorites': FavoritesPage
};

// Initialize the SPA router
initRouter(routes);

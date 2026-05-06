# NASA Explorer Frontend (SPA)

A modern Single Page Application (SPA) to explore NASA data, maintain a learning journal of favorites, and create your own planetary discoveries. Built with vanilla JavaScript and Vite.

## Features

- **SPA Navigation**: Lightning-fast hash-based routing without page reloads.
- **NASA Archives**: Explore 6 data sources: APOD, Mars Weather, Earth imagery, Exoplanets, Asteroids, and Tech projects.
- **Learning Journal**: Save any NASA item and add personal learning notes.
- **Planet Creator**: Design and save your own fictional planets.
- **Advanced Filters**: Search, pagination, and sorting across all data.
- **Data Export**: Export favorites to CSV or Excel spreadsheet formats.
- **Responsive Design**: Mobile-first dark theme optimized for all screen sizes.
- **Accessible UI**: Keyboard-navigable with proper ARIA labels.

## Tech Stack

- **Framework**: Vanilla JavaScript (ES Modules)
- **Bundler**: Vite 8.x
- **Styling**: CSS Grid & Flexbox, CSS Variables
- **Dependencies**:
  - `xlsx`: Excel export functionality
- **API**: Communicates with NASA Explorer Backend API

## Prerequisites

- Node.js 18+ (for the xslx exportation)
- npm or yarn
- Backend API running (local or remote)

## Installation & Development

### Setup

1. **Clone and install**:
   ```bash
   cd nasa-frontend
   npm install
   ```

2. **Create `.env.local` for development** (optional):
   ```bash
   VITE_API_URL=http://localhost:3001/api
   ```
   If not set, defaults to `http://localhost:3001/api`

3. **Start dev server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```
   Creates optimized `dist/` folder

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001/api` | Backend API base URL |

### Local Development
- Use `.env.local` or set in terminal
- Vite reads via `import.meta.env.VITE_API_URL`

### Production (GitHub Pages)
- Set in `.env.production`
- Embedded during build time (no runtime changes)
- Current value: `https://nasa-backend-wenj.onrender.com/api`

## Project Structure

```
nasa-frontend/
├── index.html              # SPA entry point
├── package.json           # Dependencies & scripts
├── vite.config.js        # Vite configuration
├── .env.production       # Production API URL
├── src/
│   ├── main.js           # Router initialization
│   ├── router.js         # Hash-based routing logic
│   ├── api.js            # Centralized API client
│   ├── events.js         # Global event handlers
│   ├── dom.js            # DOM manipulation utilities
│   ├── css/
│   │   └── style.css     # Theme, layout, components
│   ├── assets/           # Images, icons
│   └── js/
│       ├── pages/        # Page components
│       │   ├── ApodPage.js
│       │   ├── WeatherPage.js
│       │   ├── EarthPage.js
│       │   ├── ExoplanetsPage.js
│       │   ├── AsteroidsPage.js
│       │   ├── TechPage.js
│       │   └── FavoritesPage.js
│       └── ...other modules
└── dist/                 # Built output (production)
```

## Pages & Features

### 🌌 APOD (Astronomy Picture of the Day)
- Displays NASA's daily featured image with description
- Save to favorites with learning notes
- Direct link to official APOD entry

**API Endpoint**: `GET /api/apod`

### 🔴 Mars Weather
- Real-time Insight rover weather data
- Temperature, pressure, season information
- Save observations to favorites

**API Endpoint**: `GET /api/weather`

### 🌍 Earth Imagery
- Recent satellite images from EPIC camera
- Date-based browsing
- Save and compare with learning notes

**API Endpoint**: `GET /api/earth`

### 🪐 Exoplanets
- Database of discovered exoplanets
- Star system information
- Discovery method and distance
- Compare and save discoveries

**API Endpoint**: `GET /api/exoplanets`

### ☄️ Asteroids
- Near-Earth Objects (NEOs) tracking
- Hazard assessment
- Velocity and size data
- Close approach predictions

**API Endpoint**: `GET /api/asteroids`

### 🚀 NASA Tech Projects
- TechPort research projects
- Project status and organization
- Search and discovery

**API Endpoints**: `GET /api/tech` or `GET /api/projects`

### ⭐ Saved Items (Favorites)
- Personal learning journal
- All saved items across all categories
- Edit titles and add learning notes
- Full-text search and pagination
- Filter by type (APOD, Weather, etc.)
- Sort by date (newest/oldest)

**Features**:
- Add personal learning comments
- Edit saved items
- Delete items
- Export all favorites to CSV
- Export all favorites to Excel

**API Endpoints**:
```
GET  /api/favorites          # List with filters
POST /api/favorites          # Save item
PUT  /api/favorites/:id      # Update title/note
DEL  /api/favorites/:id      # Remove
```

### 🪐 Planet Creator
- Create fictional planets
- Record discovery method and year
- Add detailed descriptions
- Manage custom planets
- Full CRUD operations

**API Endpoints**:
```
GET  /api/custom-planets     # List planets
POST /api/custom-planets     # Create new
DEL  /api/custom-planets/:id # Delete
```

## API Integration

### API Client (`src/js/api.js`)

All API calls go through centralized client:

```javascript
// NASA Data (Read-Only)
import * as api from './js/api.js';

const apod = await api.fetchApod();
const weather = await api.fetchWeather();
const exoplanets = await api.fetchExoplanets();
const earth = await api.fetchEarth();
const asteroids = await api.fetchAsteroids();
const tech = await api.fetchTech();

// Favorites (CRUD)
const favorites = await api.getFavorites({ type: 'apod', page: 1, limit: 10 });
await api.saveFavorite('apod', { title: '...', img: '...' });
await api.updateFavorite(1, { title: 'New title', learning_comment: 'My notes' });
await api.deleteFavorite(1);

// Custom Planets (CRUD)
const planets = await api.fetchCustomPlanets({ page: 1, limit: 10 });
await api.createCustomPlanet({ name: 'Pandora', hostname: '...' });
await api.deleteCustomPlanet(1);
```

### Error Handling

API client wraps all responses:

```javascript
try {
  const data = await api.fetchApod();
  // Use data
} catch (error) {
  console.error('API Error:', error.message);
  // Show error message to user
}
```

## Router & Navigation

### Hash-Based Routing

Navigation uses URL fragments (`#`), no server rewrite needed:

```
http://localhost:5173              → APOD page (default)
http://localhost:5173/#apod        → APOD
http://localhost:5173/#weather     → Mars Weather
http://localhost:5173/#earth       → Earth Imagery
http://localhost:5173/#exoplanets  → Exoplanets
http://localhost:5173/#asteroids   → Asteroids
http://localhost:5173/#tech        → Tech Projects
http://localhost:5173/#favorites   → Saved Items
```

### Adding a New Page

1. Create component in `src/js/pages/NewPage.js`:
   ```javascript
   import * as api from '../api.js';
   
   export const NewPage = async (container) => {
     const res = await api.fetchNewEndpoint();
     container.innerHTML = `<!-- HTML here -->`;
   };
   ```

2. Import in `src/js/main.js`:
   ```javascript
   import { NewPage } from './pages/NewPage.js';
   
   const routes = {
     '#newpage': NewPage,
     // ...
   };
   ```

3. Add navbar link in `index.html`:
   ```html
   <li><a href="#newpage">New Page</a></li>
   ```

## Data Export

### CSV Export
- Comma-separated values
- Opens in Excel, Google Sheets, LibreOffice
- Includes Title, Type, Info, Learning Notes, Saved Date

### Excel Export
- Native `.xlsx` format
- Formatted worksheet with headers
- Preserves data types

**Both features**:
- Export filtered results (by type)
- One-click download
- Filename includes type and timestamp

## Styling

### Theme Variables (`src/css/style.css`)

```css
:root {
  --primary: #0b3d91;       /* NASA Blue */
  --secondary: #fc3d21;     /* NASA Red */
  --dark: #0b0d17;          /* Background */
  --card-bg: #161b22;       /* Card background */
  --text: #c9d1d9;          /* Primary text */
  --text-bright: #ffffff;   /* Bright text */
  --border: #30363d;        /* Borders */
}
```

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Layouts use CSS Grid and Flexbox for responsive design.

## Deployment

### Local Development
```bash
npm run dev
```
Runs at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### GitHub Pages (Automated)

Deployment via GitHub Actions (see `.github/workflows/deploy.yml`):

1. Push to `master` branch
2. Actions automatically:
   - Installs dependencies
   - Builds with Vite
   - Uploads `dist/` to `gh-pages` branch
3. GitHub Pages serves the built site

**Result**: `https://username.github.io/nasa-frontend/`

### Manual GitHub Pages Deployment

If not using Actions:

```bash
npm run build
# Upload contents of dist/ to gh-pages branch manually
```

### Render/Other Platforms

Build the frontend, then serve `dist/` as static files:

```bash
npm run build
# Upload dist/ folder to your hosting
```

**Important**: Set `VITE_API_URL` before build to point to your backend:
```bash
VITE_API_URL=https://your-backend.com/api npm run build
```

## Performance

- **Lazy Loading**: Pages load only when needed
- **Code Splitting**: Vite automatically optimizes bundle
- **Minification**: Production build is fully minified
- **Gzip**: All assets compress well
- **CSS Variables**: Minimal CSS file size

**Bundle Size** (approximate):
- JS: ~100KB (gzipped)
- CSS: ~3KB (gzipped)
- Total: ~103KB (before images)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 90+)

## Development Tips

### Debug API Calls
```javascript
// In browser console:
import * as api from './src/js/api.js';
const data = await api.fetchApod();
console.log(data);
```

### Test Frontend Offline
```bash
npm run preview
# Works even with backend offline (shows cached errors)
```

### Hot Module Reload (HMR)
Vite automatically reloads on file changes during dev.

## Troubleshooting

### "API Error" appears

1. Check backend is running: `curl http://localhost:3001/api/apod`
2. Verify `VITE_API_URL` points to correct server
3. Check browser console for CORS errors
4. Ensure backend has CORS enabled

### Search/Filter not working

1. Clear browser cache: Ctrl+Shift+Delete
2. Rebuild: `npm run build`
3. Check database connection on backend

### Export buttons disabled

1. Save at least one favorite first
2. Check Excel/CSV export dependencies installed
3. Verify `xlsx` package: `npm list xlsx`

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally: `npm run dev`
4. Build prod: `npm run build && npm run preview`
5. Push and create PR

## License

MIT

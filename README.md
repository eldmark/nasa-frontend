# NASA Explorer Frontend (SPA)

A modern Single Page Application (SPA) to explore NASA data, maintain a learning journal of favorites, and document your own planetary discoveries.

## Features

- **SPA Navigation**: Fast, hash-based routing for a seamless experience.
- **NASA Archives**: Explore APOD, Asteroids, Earth images, Exoplanets, and Tech projects.
- **Learning Journal**: Save any NASA item to your favorites and add personal learning notes.
- **Planet Creator**: Document your own "discoveries" with a dedicated form.
- **Advanced Filters**: Search and paginate through your favorites and custom discoveries.
- **Data Export**: Export your saved items and notes to **CSV** or **Excel** formats.
- **Responsive UI**: Clean, dark-themed design optimized for various screen sizes.

## Tech Stack

- **Framework**: Vanilla JavaScript (ES Modules)
- **Bundler**: Vite
- **Styling**: CSS (Grid & Flexbox)
- **Libraries**:
  - `xlsx`: For Excel data export.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

- `src/js/api.js`: Centralized API client.
- `src/js/router.js`: Hash-based SPA router.
- `src/js/pages/`: Modular page components (APOD, Favorites, etc.).
- `src/style.css`: Global styles and theme variables.

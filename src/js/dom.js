export const showLoading = (show) => {
    const loader = document.getElementById('loading');
    if (show) loader.classList.remove('hidden');
    else loader.classList.add('hidden');
};

export const showError = (message) => {
    const errorDiv = document.getElementById('error');
    if (message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    } else {
        errorDiv.classList.add('hidden');
    }
};

export const switchView = (viewId) => {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    showError(null);
};

const createSaveBtn = (type, item) => {
    const btn = document.createElement('button');
    btn.className = 'btn-save';
    btn.textContent = 'Save';
    btn.onclick = () => window.dispatchEvent(new CustomEvent('save-item', { detail: { type, item } }));
    return btn;
};

export const renderApod = (data, container) => {
    container.innerHTML = `
        <div class="card">
            <img src="${data.url}" alt="${data.title}">
            <div class="card-content">
                <h2>${data.title}</h2>
                <p><strong>Date:</strong> ${data.date}</p>
                <p>${data.explanation}</p>
            </div>
            <div class="card-actions" id="apod-actions"></div>
        </div>
    `;
    document.getElementById('apod-actions').appendChild(createSaveBtn('apod', {
        id: data.date,
        title: data.title,
        img: data.url,
        info: data.date
    }));
};

export const renderWeather = (data, container) => {
    container.innerHTML = '<h2>Mars Insight Weather</h2>';
    const solKeys = data.sol_keys || [];
    if (solKeys.length === 0) {
        container.innerHTML += '<p>No weather data available right now.</p>';
        return;
    }

    solKeys.forEach(sol => {
        const info = data[sol];
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>Sol ${sol}</strong><br>
                Temp: ${info.AT?.av || 'N/A'}°C | Wind: ${info.HWS?.av || 'N/A'} m/s
            </div>
        `;
        div.appendChild(createSaveBtn('weather', {
            id: sol,
            title: `Mars Weather - Sol ${sol}`,
            info: `Temp: ${info.AT?.av}°C`
        }));
        container.appendChild(div);
    });
};

export const renderExoplanets = (data, container) => {
    container.innerHTML = '<h2>Confirmed Exoplanets</h2>';
    data.forEach(p => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${p.pl_name}</strong><br>
                Host: ${p.hostname} | Method: ${p.discoverymethod} (${p.disc_year})
            </div>
        `;
        div.appendChild(createSaveBtn('exoplanets', {
            id: p.pl_name,
            title: p.pl_name,
            info: `Host: ${p.hostname}`
        }));
        container.appendChild(div);
    });
};

export const renderEarth = (images, container) => {
    container.innerHTML = '<h2>Earth EPIC Images</h2>';
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    images.forEach(img => {
        const date = img.date.split(' ')[0].replace(/-/g, '/');
        const url = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${img.image}.png`;
        const div = document.createElement('div');
        div.className = 'photo-item';
        div.innerHTML = `<img src="${url}" alt="Earth" loading="lazy">`;
        div.appendChild(createSaveBtn('earth', { id: img.identifier, img: url, title: `Earth - ${img.date}` }));
        gallery.appendChild(div);
    });
    container.appendChild(gallery);
};

export const renderAsteroids = (data, container) => {
    const asteroids = Object.values(data.near_earth_objects).flat();
    container.innerHTML = '<h2>Today\'s Asteroids</h2>';
    asteroids.forEach(neo => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${neo.name}</strong><br>
                Size: ${neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)}m<br>
                Hazardous: ${neo.is_potentially_hazardous_asteroid ? '⚠️ YES' : 'No'}
            </div>
        `;
        div.appendChild(createSaveBtn('asteroids', { id: neo.id, title: neo.name, info: neo.close_approach_data[0].close_approach_date }));
        container.appendChild(div);
    });
};

export const renderTech = (patents, container) => {
    container.innerHTML = '<h2>Tech Transfer Patents</h2>';
    patents.forEach(patent => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${patent[2]}</strong><br>
                <small>${patent[1]}</small>
            </div>
        `;
        div.appendChild(createSaveBtn('tech', { id: patent[0], title: patent[2] }));
        container.appendChild(div);
    });
};

// --- Favorites Manager Rendering (with DB ID and Timestamps) ---

export const renderFavorites = (type, items, container) => {
    container.innerHTML = '';
    if (!items || items.length === 0) {
        container.innerHTML = '<p>No items saved in this category.</p>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'card';
        if (item.img_url) div.innerHTML += `<img src="${item.img_url}" style="height:150px; width:100%; object-fit:cover;">`;
        
        const date = new Date(item.created_at).toLocaleString();
        
        div.innerHTML += `
            <div class="card-content">
                <h3>${item.title}</h3>
                ${item.info ? `<p>${item.info}</p>` : ''}
                <p><small>Saved on: ${date}</small></p>
                <div class="actions">
                    <button class="btn-edit" data-id="${item.id}" data-type="${type}" data-title="${item.title}">Edit</button>
                    <button class="btn-delete" data-id="${item.id}" data-type="${type}">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    // Event listeners
    container.querySelectorAll('.btn-edit').forEach(btn => {
        btn.onclick = () => {
            const currentTitle = btn.getAttribute('data-title');
            const newTitle = prompt('New title:', currentTitle);
            if (newTitle && newTitle !== currentTitle) {
                window.dispatchEvent(new CustomEvent('edit-item', { 
                    detail: { type, id: btn.getAttribute('data-id'), title: newTitle } 
                }));
            }
        };
    });
    container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = () => {
            if (confirm('Delete this item?')) {
                window.dispatchEvent(new CustomEvent('delete-item', { 
                    detail: { type, id: btn.getAttribute('data-id') } 
                }));
            }
        };
    });
};

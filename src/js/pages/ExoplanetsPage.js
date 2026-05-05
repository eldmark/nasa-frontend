import * as api from '../api.js';

export const ExoplanetsPage = async (container) => {
    container.innerHTML = `
        <h1>Exoplanets</h1>
        
        <section class="card-content" style="background: var(--card-bg); border-radius: 12px; margin-bottom: 30px; border: 1px solid var(--border);">
            <h3>Add Custom Planet</h3>
            <form id="planet-form">
                <div class="form-group">
                    <input type="text" id="p-name" placeholder="Planet Name" required>
                </div>
                <div class="form-group">
                    <input type="text" id="p-host" placeholder="Host Star">
                </div>
                <div class="form-group">
                    <textarea id="p-desc" placeholder="Learning notes/Description"></textarea>
                </div>
                <button type="submit" class="btn-secondary">Create Planet</button>
            </form>
        </section>

        <div id="planets-tabs" class="tabs" style="display:flex; gap:10px; margin-bottom:20px;">
            <button class="btn-outline active" id="tab-nasa">NASA Archive</button>
            <button class="btn-outline" id="tab-custom">My Discoveries</button>
        </div>
        
        <div id="planets-list" class="grid"></div>
    `;
    
    const list = document.getElementById('planets-list');
    
    const renderNasa = async () => {
        list.innerHTML = 'Loading NASA data...';
        const res = await api.fetchExoplanets();
        list.innerHTML = '';
        res.data.forEach(p => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.innerHTML = `
                <strong>${p.pl_name}</strong>
                <small>Host: ${p.hostname} | ${p.discoverymethod}</small>
                <button class="btn-primary btn-save-p" style="margin-top:10px;">Save</button>
            `;
            div.querySelector('.btn-save-p').onclick = () => savePlanet(p);
            list.appendChild(div);
        });
    };

    const renderCustom = async () => {
        list.innerHTML = 'Loading custom planets...';
        const res = await api.fetchCustomPlanets();
        list.innerHTML = '';
        res.data.forEach(p => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div>
                    <strong>${p.name}</strong><br>
                    <small>Host: ${p.hostname || 'Unknown'} | ${p.disc_year || 'N/A'}</small>
                    <p>${p.description || ''}</p>
                </div>
                <button class="btn-secondary btn-del-custom" data-id="${p.id}">Delete</button>
            `;
            div.querySelector('.btn-del-custom').onclick = async () => {
                if(confirm('Delete?')) {
                    await api.deleteCustomPlanet(p.id);
                    renderCustom();
                }
            };
            list.appendChild(div);
        });
    };

    const savePlanet = async (p) => {
        try {
            await api.saveFavorite('exoplanets', {
                id: p.pl_name,
                title: p.pl_name,
                info: `Host: ${p.hostname}`
            });
            alert('Saved to favorites!');
        } catch (e) { alert(e.message); }
    };

    document.getElementById('planet-form').onsubmit = async (e) => {
        e.preventDefault();
        const planet = {
            name: document.getElementById('p-name').value,
            hostname: document.getElementById('p-host').value,
            description: document.getElementById('p-desc').value,
            disc_year: new Date().getFullYear(),
            discovery_method: 'Manual Entry'
        };
        try {
            await api.createCustomPlanet(planet);
            alert('Planet created!');
            e.target.reset();
            if (document.getElementById('tab-custom').classList.contains('active')) renderCustom();
        } catch (e) { alert(e.message); }
    };

    document.getElementById('tab-nasa').onclick = (e) => {
        e.target.classList.add('active');
        document.getElementById('tab-custom').classList.remove('active');
        renderNasa();
    };
    document.getElementById('tab-custom').onclick = (e) => {
        e.target.classList.add('active');
        document.getElementById('tab-nasa').classList.remove('active');
        renderCustom();
    };

    renderNasa();
};

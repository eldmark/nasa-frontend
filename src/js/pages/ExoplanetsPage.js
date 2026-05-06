import * as api from '../api.js';

export const ExoplanetsPage = async (container) => {
    let currentTab = 'nasa';
    let customSearch = '';
    let customPage = 1;

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

        <div id="custom-filters" style="display:none; margin-bottom:20px;">
            <input type="text" id="custom-search" placeholder="Search my discoveries..." style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text);">
        </div>
        
        <div id="planets-list" class="grid"></div>
        <div id="pagination" style="display:flex; justify-content:center; gap:10px; margin-top:30px;"></div>
    `;
    
    const list = document.getElementById('planets-list');
    const pagination = document.getElementById('pagination');
    const customFilters = document.getElementById('custom-filters');
    
    const renderNasa = async () => {
        list.innerHTML = 'Loading NASA data...';
        pagination.innerHTML = '';
        customFilters.style.display = 'none';
        
        try {
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
        } catch (e) { list.innerHTML = `<p class="error">${e.message}</p>`; }
    };

    const renderCustom = async () => {
        list.innerHTML = 'Loading custom planets...';
        pagination.innerHTML = '';
        customFilters.style.display = 'block';

        try {
            const res = await api.fetchCustomPlanets({ q: customSearch, page: customPage, limit: 5 });
            list.innerHTML = '';
            
            if (res.data.length === 0) {
                list.innerHTML = '<p>No discoveries found.</p>';
                return;
            }

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

            renderPagination(res.meta);
        } catch (e) { list.innerHTML = `<p class="error">${e.message}</p>`; }
    };

    const renderPagination = (meta) => {
        if (!meta || meta.totalPages <= 1) return;
        for (let i = 1; i <= meta.totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `btn-outline btn-sm ${i === meta.currentPage ? 'active' : ''}`;
            btn.innerText = i;
            btn.onclick = () => {
                customPage = i;
                renderCustom();
            };
            pagination.appendChild(btn);
        }
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
            if (currentTab === 'custom') renderCustom();
        } catch (e) { alert(e.message); }
    };

    document.getElementById('custom-search').oninput = (e) => {
        customSearch = e.target.value;
        customPage = 1;
        renderCustom();
    };

    document.getElementById('tab-nasa').onclick = (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = 'nasa';
        renderNasa();
    };
    document.getElementById('tab-custom').onclick = (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = 'custom';
        renderCustom();
    };

    const tabs = [document.getElementById('tab-nasa'), document.getElementById('tab-custom')];

    renderNasa();
};

import * as api from '../api.js';
import * as XLSX from 'xlsx';

export const FavoritesPage = async (container) => {
    let currentType = 'apod';
    let currentSearch = '';
    let currentPage = 1;

    container.innerHTML = `
        <h1>Saved Items</h1>
        
        <div class="filters-bar" style="display:flex; gap:15px; margin-bottom:20px; flex-wrap:wrap; align-items:center;">
            <input type="text" id="fav-search" placeholder="Search in favorites..." style="flex:1; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--card-bg); color:var(--text);">
            
            <div style="display:flex; gap:10px;">
                <button id="export-csv" class="btn-outline btn-sm">Export CSV</button>
                <button id="export-excel" class="btn-outline btn-sm">Export Excel</button>
            </div>
        </div>

        <div id="fav-tabs" class="tabs" style="display:flex; gap:10px; margin-bottom:20px;">
            <button class="btn-outline active" data-type="apod">APOD</button>
            <button class="btn-outline" data-type="weather">Weather</button>
            <button class="btn-outline" data-type="earth">Earth</button>
            <button class="btn-outline" data-type="exoplanets">Exoplanets</button>
            <button class="btn-outline" data-type="asteroids">Asteroids</button>
            <button class="btn-outline" data-type="tech">Tech</button>
        </div>

        <div id="fav-list" class="grid"></div>

        <div id="pagination" style="display:flex; justify-content:center; gap:10px; margin-top:30px;"></div>
    `;

    const list = document.getElementById('fav-list');
    const tabs = document.querySelectorAll('#fav-tabs button');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('fav-search');

    const render = async () => {
        list.innerHTML = 'Loading...';
        pagination.innerHTML = '';
        
        try {
            const res = await api.getFavorites({ 
                type: currentType, 
                q: currentSearch, 
                page: currentPage,
                limit: 6
            });
            
            const items = res.data || [];
            list.innerHTML = '';

            if (items.length === 0) {
                list.innerHTML = '<p>Nothing found here.</p>';
                return;
            }

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                if (item.img_url) card.innerHTML += `<img src="${item.img_url}">`;
                
                const date = new Date(item.created_at).toLocaleString();
                
                card.innerHTML += `
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p><small>${item.info || ''}</small></p>
                        <p><small>Saved on: ${date}</small></p>
                        
                        <div class="comment-section">
                            <strong>My Learning Notes:</strong>
                            <p class="learning-note">${item.learning_comment || 'No notes yet...'}</p>
                            <button class="btn-outline btn-sm btn-edit-comment" data-id="${item.id}" data-comment="${item.learning_comment || ''}">Edit Note</button>
                        </div>

                        <div style="margin-top:15px; display:flex; gap:10px;">
                            <button class="btn-primary btn-sm btn-edit-title" data-id="${item.id}" data-title="${item.title}">Edit Title</button>
                            <button class="btn-secondary btn-sm btn-delete-fav" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                `;
                list.appendChild(card);
            });

            renderPagination(res.meta);
            setupActions();
        } catch (error) {
            list.innerHTML = `<p class="error">${error.message}</p>`;
        }
    };

    const renderPagination = (meta) => {
        if (!meta || meta.totalPages <= 1) return;

        for (let i = 1; i <= meta.totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `btn-outline btn-sm ${i === meta.currentPage ? 'active' : ''}`;
            btn.innerText = i;
            btn.onclick = () => {
                currentPage = i;
                render();
            };
            pagination.appendChild(btn);
        }
    };

    const setupActions = () => {
        container.querySelectorAll('.btn-edit-title').forEach(btn => {
            btn.onclick = async () => {
                const newTitle = prompt('New title:', btn.dataset.title);
                if (newTitle) {
                    await api.updateFavorite(btn.dataset.id, { title: newTitle });
                    render();
                }
            };
        });

        container.querySelectorAll('.btn-edit-comment').forEach(btn => {
            btn.onclick = async () => {
                const newComment = prompt('What did you learn about this?', btn.dataset.comment);
                if (newComment !== null) {
                    await api.updateFavorite(btn.dataset.id, { learning_comment: newComment });
                    render();
                }
            };
        });

        container.querySelectorAll('.btn-delete-fav').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete from favorites?')) {
                    await api.deleteFavorite(btn.dataset.id);
                    render();
                }
            };
        });
    };

    const exportData = async (format) => {
        const res = await api.getFavorites({ type: currentType, limit: 1000 });
        const items = res.data || [];
        
        if (items.length === 0) return alert('No data to export');

        const dataToExport = items.map(i => ({
            Title: i.title,
            Type: i.type,
            Info: i.info,
            Note: i.learning_comment,
            SavedAt: i.created_at
        }));

        if (format === 'csv') {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Title,Type,Info,Note,SavedAt\n"
                + dataToExport.map(r => Object.values(r).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `favorites_${currentType}.csv`);
            document.body.appendChild(link);
            link.click();
        } else {
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Favorites");
            XLSX.writeFile(workbook, `favorites_${currentType}.xlsx`);
        }
    };

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentType = tab.dataset.type;
            currentPage = 1;
            render();
        };
    });

    searchInput.oninput = (e) => {
        currentSearch = e.target.value;
        currentPage = 1;
        render();
    };

    document.getElementById('export-csv').onclick = () => exportData('csv');
    document.getElementById('export-excel').onclick = () => exportData('excel');

    render();
};

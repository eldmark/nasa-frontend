import * as api from '../api.js';

export const FavoritesPage = async (container) => {
    container.innerHTML = `
        <h1>Saved Items</h1>
        <div id="fav-tabs" class="tabs" style="display:flex; gap:10px; margin-bottom:20px;">
            <button class="btn-outline active" data-type="apod">APOD</button>
            <button class="btn-outline" data-type="weather">Weather</button>
            <button class="btn-outline" data-type="earth">Earth</button>
            <button class="btn-outline" data-type="exoplanets">Exoplanets</button>
            <button class="btn-outline" data-type="asteroids">Asteroids</button>
            <button class="btn-outline" data-type="tech">Tech</button>
        </div>
        <div id="fav-list" class="grid"></div>
    `;

    const list = document.getElementById('fav-list');
    const tabs = document.querySelectorAll('#fav-tabs button');

    const render = async (type) => {
        list.innerHTML = 'Loading...';
        const res = await api.getFavorites();
        const items = res.data[type] || [];
        list.innerHTML = '';

        if (items.length === 0) {
            list.innerHTML = '<p>Nothing saved here yet.</p>';
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

        setupActions(type);
    };

    const setupActions = (type) => {
        container.querySelectorAll('.btn-edit-title').forEach(btn => {
            btn.onclick = async () => {
                const newTitle = prompt('New title:', btn.dataset.title);
                if (newTitle) {
                    await api.updateFavorite(btn.dataset.id, { title: newTitle });
                    render(type);
                }
            };
        });

        container.querySelectorAll('.btn-edit-comment').forEach(btn => {
            btn.onclick = async () => {
                const newComment = prompt('What did you learn about this?', btn.dataset.comment);
                if (newComment !== null) {
                    await api.updateFavorite(btn.dataset.id, { learning_comment: newComment });
                    render(type);
                }
            };
        });

        container.querySelectorAll('.btn-delete-fav').forEach(btn => {
            btn.onclick = async () => {
                if (confirm('Delete from favorites?')) {
                    await api.deleteFavorite(btn.dataset.id);
                    render(type);
                }
            };
        });
    };

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            render(tab.dataset.type);
        };
    });

    render('apod');
};

import * as api from '../api.js';

export const TechPage = async (container) => {
    container.innerHTML = `
        <h1>NASA TechPort Projects</h1>
        <p><small id="tech-summary">Fetching projects from the last 7 days...</small></p>
        <div id="tech-results" class="list-container"></div>
    `;
    
    const results = document.getElementById('tech-results');
    const summary = document.getElementById('tech-summary');
    
    const loadProjects = async () => {
        results.innerHTML = '<div class="loader">Loading detailed project information...</div>';
        try {
            const res = await api.fetchTech();
            results.innerHTML = '';
            
            const { projects, totalFound, showing } = res.data;
            summary.textContent = `Found ${totalFound} projects updated in the last week. Showing details for ${showing}.`;
            
            if (projects.length === 0) {
                results.innerHTML = '<p>No projects found for the last 7 days.</p>';
                return;
            }

            projects.forEach(project => {
                const div = document.createElement('div');
                div.className = 'card';
                div.style.padding = '20px';
                div.innerHTML = `
                    <div class="card-content">
                        <h3 style="margin-top:0;">${project.title || 'Untitled Project'}</h3>
                        <p style="font-size: 0.9rem; color: #8b949e;">ID: ${project.id} | Status: ${project.statusDescription || 'N/A'}</p>
                        <div style="margin: 10px 0; font-size: 0.95rem; line-height: 1.4;">
                            ${project.description ? project.description.substring(0, 300) + '...' : 'No description available.'}
                        </div>
                        <p><small><strong>Organizations:</strong> ${project.leadOrganization?.name || 'N/A'}</small></p>
                        <button class="btn-primary btn-save-tech" data-id="${project.id}">Save to Favorites</button>
                    </div>
                `;
                
                div.querySelector('.btn-save-tech').onclick = () => {
                    api.saveFavorite('tech', { 
                        id: project.id, 
                        title: project.title,
                        info: project.statusDescription || 'TechPort Project'
                    });
                    alert('Project saved with details!');
                };
                results.appendChild(div);
            });
        } catch (e) {
            results.innerHTML = `<div class="error">Error loading details: ${e.message}</div>`;
        }
    };
    
    loadProjects();
};

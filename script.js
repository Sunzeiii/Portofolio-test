// Supabase Configuration
const SUPABASE_URL = 'https://trokqkycaowhdsfbavmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb2txa3ljYW93aGRzZmJhdm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDk4ODMsImV4cCI6MjEwNTgyNTg4M30.TNFaZHpes5rbpMJe7IjR04itX_EXgRsE8sfjEZLnz1Y';

document.addEventListener('DOMContentLoaded', () => {

    if (typeof Typed !== 'undefined') {
        new Typed('#typed-name', {
            strings: [
                'Saya <span class="highlight">Nararya Putra</span>',
                'Saya <span class="highlight">Seorang Engineer</span>',
                'Saya <span class="highlight">Problem Solver</span>'
            ],
            typeSpeed: 100,
            backSpeed: 70,
            backDelay: 2500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    } else {
        const el = document.getElementById('typed-name');
        if (el) el.innerHTML = 'Saya <span class="highlight">Nararya Putra</span>';
    }

    loadProjectsFromSupabase();
});

async function loadProjectsFromSupabase() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Cek apakah library Supabase sudah ter-load
    if (typeof window.supabase === 'undefined') {
        projectsContainer.innerHTML = '<p style="text-align:center; color:#fca5a5; grid-column:1/-1;">Library Supabase gagal dimuat. Pastikan Anda terhubung ke internet.</p>';
        return;
    }

    try {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await client
            .from('Data')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error.message);
            projectsContainer.innerHTML = `<p style="text-align:center; color:#fca5a5; grid-column:1/-1;">Error: ${error.message}</p>`;
            return;
        }

        console.log('Data dari Supabase:', data);
        renderProjects(data);

    } catch (err) {
        console.error('Fetch error:', err);
        projectsContainer.innerHTML = '<p style="text-align:center; color:#fca5a5; grid-column:1/-1;">Gagal terhubung ke Supabase.</p>';
    }
}

function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';

    if (!projects || projects.length === 0) {
        projectsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1;">Belum ada proyek di tabel Data.</p>';
        return;
    }

    projects.forEach(project => {
        const rawStack = project.tect_stack || [];
        let techStackHTML = '';
        if (Array.isArray(rawStack)) {
            techStackHTML = rawStack.map(t => `<span class="tag">${t.trim()}</span>`).join('');
        } else if (rawStack) {
            techStackHTML = rawStack.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
        }

        const githubLink = project.github_url
            ? `<a href="${project.github_url}" target="_blank" class="github-link"><i class="fab fa-github"></i> GitHub</a>`
            : '';

        const featuredBadge = project.featured
            ? `<div class="featured-badge"><i class="fas fa-star"></i> Unggulan</div>`
            : '';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div style="position:relative;">
                <img src="${project.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${project.title}" class="project-img">
                ${featuredBadge}
            </div>
            <div class="project-content">
                <h3>${project.title || 'Untitled'}</h3>
                <p>${project.description || project.slug || ''}</p>
                <div class="project-tags">${techStackHTML}</div>
                <div style="margin-top:1.5rem;">${githubLink}</div>
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

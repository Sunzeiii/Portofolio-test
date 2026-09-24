// --- Supabase Integration ---
// TUAN ARYA: Silakan masukkan URL dan ANON KEY Supabase Anda di sini
const SUPABASE_URL = 'https://trokqkycaowhdsfbavmt.supabase.co'; // HANYA Base URL-nya saja
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb2txa3ljYW93aGRzZmJhdm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDk4ODMsImV4cCI6MjEwNTgyNTg4M30.TNFaZHpes5rbpMJe7IjR04itX_EXgRsE8sfjEZLnz1Y';

const projectsContainer = document.getElementById('projects-container');
const supabaseAlert = document.getElementById('supabase-alert');

async function fetchProjects() {
    // Kita cek kalau anon key-nya belum valid (masih pendek)
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.length < 50) {
        // Show alert if no credentials
        projectsContainer.innerHTML = '';
        supabaseAlert.style.display = 'block';
        return;
    }

    try {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Asumsi dari URL yang Tuan Arya masukkan, nama tabelnya adalah 'Data' (sebelumnya 'projects')
        const { data, error } = await supabase
            .from('Data')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderProjects(data);
    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-muted);">Gagal memuat project dari Supabase. Cek console log.</p>';
        supabaseAlert.style.display = 'block';
    }
}

function renderProjects(projects) {
    projectsContainer.innerHTML = ''; // Clear skeletons
    
    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p style="text-align:center; width:100%; color:var(--text-muted);">Belum ada project.</p>';
        return;
    }

    projects.forEach(project => {
        // Kolom Supabase: id, title, description, content, image_url, tect_stak, github_url, dll.
        const techStack = project.tect_stak 
            ? project.tect_stak.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('') 
            : '';

        const githubLink = project.github_url 
            ? `<a href="${project.github_url}" target="_blank" class="github-link"><i class="fab fa-github"></i> Repository</a>`
            : '';

        const card = document.createElement('div');
        card.classList.add('project-card');
        
        // Cek jika project di-featured
        const featuredBadge = project.featured ? `<div class="featured-badge"><i class="fas fa-star"></i> Unggulan</div>` : '';

        card.innerHTML = `
            <div style="position: relative;">
                <img src="${project.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="${project.title}" class="project-img">
                ${featuredBadge}
            </div>
            <div class="project-content">
                <h3>${project.title || 'Untitled Project'}</h3>
                <p>${project.description || 'Tidak ada deskripsi.'}</p>
                <div class="project-tags">
                    ${techStack}
                </div>
                <div style="margin-top: 1.5rem;">
                    ${githubLink}
                </div>
            </div>
        `;
        projectsContainer.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Typing Animation
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

    // Fetch projects
    fetchProjects();
});

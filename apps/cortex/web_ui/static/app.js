// API Base URL
const API_URL = '/api';

// State
let currentPaper = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadResearch();
    loadStats();
});

// View Switching
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show selected view
    document.getElementById(`${viewName}-view`).classList.add('active');
    event.target.classList.add('active');

    // Load data if needed
    if (viewName === 'research') {
        loadResearch();
    } else if (viewName === 'stats') {
        loadStats();
    }
}

// Load Research Papers
async function loadResearch() {
    const grid = document.getElementById('papers-grid');
    grid.innerHTML = '<div class="loading">Loading research papers...</div>';

    try {
        const response = await fetch(`${API_URL}/research`);
        const papers = await response.json();

        if (papers.length === 0) {
            grid.innerHTML = '<div class="loading">No papers yet. Run a simulation to generate research!</div>';
            return;
        }

        grid.innerHTML = papers.map(paper => {
            // Get summary or preview text
            const summary = paper.summary || paper.final_output || '';
            const summaryText = summary.includes('## Summary') 
                ? summary.split('## Summary')[1].substring(0, 150).trim()
                : truncate(summary, 150);
            
            // Generate brain icon SVG (large for header)
            const brainIcon = `
                <svg class="paper-card-image" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 64px; height: 64px;">
                    <path d="M12 2C8 2 5 5 5 9c0 2 1 3.5 2 4.5-1 2-1.5 4.5-1.5 6.5 0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-2-.5-4.5-1.5-6.5 1-1 2-2.5 2-4.5 0-4-3-7-7-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M9 9c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M8 13.5c1 1 2.5 1.5 4 1.5s3-.5 4-1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            `;
            
            // Small brain icon for bottom corner
            const smallBrainIcon = `
                <svg class="paper-card-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8 2 5 5 5 9c0 2 1 3.5 2 4.5-1 2-1.5 4.5-1.5 6.5 0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-2-.5-4.5-1.5-6.5 1-1 2-2.5 2-4.5 0-4-3-7-7-7z" fill="currentColor"/>
                </svg>
            `;
            
            return `
                <div class="paper-card" onclick="showPaper('${paper._id}')">
                    <div class="paper-card-header">
                        ${brainIcon}
                    </div>
                    <div class="paper-card-body">
                        ${smallBrainIcon}
                        <div class="paper-title">${escapeHtml(paper.topic)}</div>
                        <div class="paper-meta">
                            <span>📅 ${formatDate(paper._timestamp)}</span>
                        </div>
                        <div class="paper-preview">
                            ${summaryText ? escapeHtml(summaryText) : 'No summary available'}
                        </div>
                        <div class="agents-badge">
                            🤖 ${paper.agents ? paper.agents.join(' → ') : 'Cortex'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        grid.innerHTML = '<div class="loading">Error loading papers. Make sure the Flask server is running!</div>';
        console.error('Error:', error);
    }
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        // Update stat cards
        document.getElementById('total-papers').textContent = stats.total_papers;
        document.getElementById('total-agents').textContent = stats.total_agents;
        document.getElementById('recent-count').textContent = stats.recent_papers?.length || 0;

        // Render chart
        renderChart(stats.papers_by_date);

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Render Chart
function renderChart(data) {
    const chart = document.getElementById('papers-chart');

    if (!data || Object.keys(data).length === 0) {
        chart.innerHTML = '<div class="loading">No data yet</div>';
        return;
    }

    const max = Math.max(...Object.values(data));

    chart.innerHTML = Object.entries(data).map(([date, count]) => `
        <div class="chart-bar">
            <div class="chart-label">${date}</div>
            <div class="chart-bar-fill" style="width: ${(count / max) * 100}%"></div>
            <div class="chart-value">${count}</div>
        </div>
    `).join('');
}

// Show Paper Detail
async function showPaper(paperId) {
    const modal = document.getElementById('paper-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = '<div class="loading">Loading paper...</div>';
    modal.classList.add('active');

    try {
        const response = await fetch(`${API_URL}/research/${paperId}`);
        const paper = await response.json();

        body.innerHTML = `
            <h2>${paper.topic}</h2>
            <div style="color: #64748b; margin-bottom: 2rem;">
                Generated: ${formatDate(paper._timestamp)} | Agents: ${paper.agents.join(' → ')}
            </div>
            
            <div class="draft-section">
                <h3>📝 Draft v1 (Scientist)</h3>
                <div class="draft-content">${paper.draft_v1}</div>
            </div>
            
            <div class="draft-section">
                <h3>🔍 Peer Review (Reviewer)</h3>
                <div class="draft-content">${paper.critique}</div>
            </div>
            
            <div class="draft-section">
                <h3>✏️ Draft v2 (Scientist Revision)</h3>
                <div class="draft-content">${paper.draft_v2}</div>
            </div>
            
            <div class="draft-section" style="border-left-color: #14b8a6;">
                <h3>✨ Final Publication (Editor)</h3>
                <div class="draft-content">${paper.final_output}</div>
            </div>
        `;

    } catch (error) {
        body.innerHTML = '<div class="loading">Error loading paper</div>';
        console.error('Error:', error);
    }
}

// Close Modal
function closeModal() {
    document.getElementById('paper-modal').classList.remove('active');
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('paper-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Utility Functions
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function truncate(text, length) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

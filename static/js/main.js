document.addEventListener('DOMContentLoaded', () => {
    let allNotes = [];
    let currentCategory = 'all';
    
    // DOM Elements
    const refreshBtn = document.getElementById('refreshBtn');
    const refreshIcon = document.getElementById('refreshIcon');
    const searchInput = document.getElementById('searchInput');
    const categoryFilters = document.getElementById('categoryFilters');
    const notesCount = document.getElementById('notesCount');
    
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const emptyState = document.getElementById('emptyState');
    const notesList = document.getElementById('notesList');
    const retryBtn = document.getElementById('retryBtn');

    // Fetch Release Notes from API
    async function fetchReleaseNotes() {
        showState('loading');
        refreshIcon.classList.add('spin');
        refreshBtn.disabled = true;

        try {
            const response = await fetch('/api/release-notes');
            const data = await response.json();

            if (data.status === 'success') {
                allNotes = data.notes;
                renderCategoryChips(data.categories);
                renderNotes();
                showState('content');
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        } catch (err) {
            errorMessage.textContent = err.message || 'Could not fetch release feed.';
            showState('error');
        } finally {
            refreshIcon.classList.remove('spin');
            refreshBtn.disabled = false;
        }
    }

    // Toggle View States
    function showState(state) {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        notesList.classList.add('hidden');

        if (state === 'loading') loadingState.classList.remove('hidden');
        else if (state === 'error') errorState.classList.remove('hidden');
        else if (state === 'empty') emptyState.classList.remove('hidden');
        else if (state === 'content') notesList.classList.remove('hidden');
    }

    // Render Filter Chips
    function renderCategoryChips(categories) {
        categoryFilters.innerHTML = `
            <button class="filter-chip ${currentCategory === 'all' ? 'active' : ''}" data-category="all">All Updates</button>
        `;
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-chip ${currentCategory === cat ? 'active' : ''}`;
            btn.dataset.category = cat;
            btn.textContent = cat;
            categoryFilters.appendChild(btn);
        });

        // Add Event Listeners to dynamic chips
        document.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.category;
                renderNotes();
            });
        });
    }

    // Render Release Notes
    function renderNotes() {
        const query = searchInput.value.toLowerCase().trim();

        const filtered = allNotes.filter(note => {
            const matchesCategory = currentCategory === 'all' || note.category === currentCategory;
            const matchesSearch = !query || 
                note.date.toLowerCase().includes(query) ||
                note.category.toLowerCase().includes(query) ||
                note.text_content.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });

        notesCount.textContent = filtered.length;

        if (filtered.length === 0) {
            showState('empty');
            return;
        }

        showState('content');
        notesList.innerHTML = filtered.map(note => `
            <article class="note-card" id="card-${note.id}">
                <div class="card-header">
                    <div class="card-meta">
                        <span class="category-tag" data-cat="${escapeHtml(note.category)}">${escapeHtml(note.category)}</span>
                        <span class="note-date"><i class="fa-regular fa-calendar"></i> ${escapeHtml(note.date)}</span>
                    </div>
                </div>

                <div class="card-body">
                    ${note.html_content}
                </div>

                <div class="card-footer">
                    <a href="${escapeHtml(note.link)}" target="_blank" rel="noopener" class="card-link">
                        <span>View on Google Docs</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>

                    <button class="btn btn-tweet" onclick="tweetUpdate('${escapeHtml(note.date)}', '${escapeHtml(note.category)}', '${escapeJsString(note.text_content)}', '${escapeHtml(note.link)}')">
                        <i class="fa-brands fa-x-twitter"></i>
                        <span>Tweet Update</span>
                    </button>
                </div>
            </article>
        `).join('');
    }

    // Helper: Escape HTML
    function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[m]);
    }

    // Helper: Escape JS String for Onclick Attribute
    function escapeJsString(str) {
        return (str || '')
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '&quot;')
            .replace(/\n/g, ' ');
    }

    // Global Tweet Function
    window.tweetUpdate = function(date, category, textContent, link) {
        // Truncate summary text to fit Twitter 280 char limit
        const maxLen = 170;
        let summary = textContent;
        if (summary.length > maxLen) {
            summary = summary.substring(0, maxLen).trim() + '...';
        }

        const tweetText = `🚀 BigQuery Update (${date}) [${category}]:\n\n"${summary}"\n\n#BigQuery #GoogleCloud #DataEngineering`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(link)}`;

        window.open(tweetUrl, '_blank', 'width=550,height=420');
    };

    // Listeners
    refreshBtn.addEventListener('click', fetchReleaseNotes);
    retryBtn.addEventListener('click', fetchReleaseNotes);
    searchInput.addEventListener('input', renderNotes);

    // Initial Load
    fetchReleaseNotes();
});

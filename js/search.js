// This is AI-generated.
// I did not look through this at all.
// I will do no maintenance to this code.

let bugData = [];
let lookupTables = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    loadData();
});

function initializeUI() {
    const form = document.createElement('form');
    form.id = 'search-form';
    form.innerHTML = `
        <h1>GSC Bug Tracker Search</h1>
        <div>
            <input type="text" id="search-input" placeholder="Search term...">
            <button type="submit">Search</button>
        </div>
        <div>
            <label><input type="checkbox" id="search-description"> Search in descriptions</label>
            <label><input type="checkbox" id="search-comments"> Search in comments</label>
        </div>
        <div id="filters">
            <h3>Filters</h3>
            <div>
                <label>Category: <select id="filter-category"><option value="">All Categories</option></select></label>
            </div>
            <div>
                <label>Severity: <select id="filter-severity"><option value="">All Severities</option></select></label>
            </div>
            <div>
                <label>Author: <select id="filter-author"><option value="">All Authors</option></select></label>
            </div>
            <div>
                <label>Resolution: <select id="filter-resolution"><option value="">All Resolutions</option></select></label>
            </div>
        </div>
    `;
    document.body.appendChild(form);

    const results = document.createElement('div');
    results.id = 'search-results';
    document.body.appendChild(results);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });

    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.textContent = 'Loading data...';
    document.body.appendChild(loading);
}

function loadData() {
    fetch('/json/bug_data.json')
        .then(response => response.json())
        .then(data => {
            bugData = data;
            document.getElementById('loading').textContent = 'Loading lookup tables...';
            return fetch('/json/lookup_tables.json');
        })
        .then(response => response.json())
        .then(data => {
            lookupTables = data;
            populateFilters();
            document.getElementById('loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('loading').textContent = 'Error loading data. Please refresh the page.';
        });
}

function populateFilters() {
    const categorySelect = document.getElementById('filter-category');
    Object.entries(lookupTables.categories).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        categorySelect.appendChild(option);
    });

    const severitySelect = document.getElementById('filter-severity');
    Object.entries(lookupTables.severities).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        severitySelect.appendChild(option);
    });

    const authorSelect = document.getElementById('filter-author');
    Object.entries(lookupTables.users).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        authorSelect.appendChild(option);
    });

    const resolutionSelect = document.getElementById('filter-resolution');
    Object.entries(lookupTables.resolutions).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        resolutionSelect.appendChild(option);
    });
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchInDesc = document.getElementById('search-description').checked;
    const searchInComments = document.getElementById('search-comments').checked;
    const categoryFilter = document.getElementById('filter-category').value;
    const severityFilter = document.getElementById('filter-severity').value;
    const authorFilter = document.getElementById('filter-author').value;
    const resolutionFilter = document.getElementById('filter-resolution').value;

    const filteredBugs = bugData.filter(bug => {
        let matchesSearchTerm = bug.summary.toLowerCase().includes(searchTerm);
        
        if (searchInDesc && bug.description) {
            matchesSearchTerm = matchesSearchTerm || bug.description.toLowerCase().includes(searchTerm);
        }
        
        if (searchInComments && bug.comments) {
            matchesSearchTerm = matchesSearchTerm || bug.comments.some(comment => 
                comment.text.toLowerCase().includes(searchTerm)
            );
        }

        if (searchTerm === '') {
            matchesSearchTerm = true;
        }
        
        const matchesCategory = !categoryFilter || bug.category_id === parseInt(categoryFilter);
        const matchesSeverity = !severityFilter || bug.severity_id === parseInt(severityFilter);
        const matchesAuthor = !authorFilter || bug.reporter_id === parseInt(authorFilter);
        const matchesResolution = !resolutionFilter || bug.resolution_id === parseInt(resolutionFilter);
        
        return matchesSearchTerm && matchesCategory && matchesSeverity && matchesAuthor && matchesResolution;
    });

    displayResults(filteredBugs);
}

function displayResults(bugs) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (bugs.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Summary</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Author</th>
                <th>Status</th>
                <th>Resolution</th>
            </tr>
        </thead>
        <tbody id="results-body"></tbody>
    `;
    resultsContainer.appendChild(table);
    
    const tbody = document.getElementById('results-body');
    
    bugs.forEach(bug => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="${bug.id}.html">${bug.id}</a></td>
            <td>${bug.summary}</td>
            <td>${getCategoryName(bug.category_id)}</td>
            <td>${getSeverityName(bug.severity_id)}</td>
            <td>${getAuthorName(bug.reporter_id)}</td>
            <td>${getStatusName(bug.status_id)}</td>
            <td>${getResolutionName(bug.resolution_id)}</td>
        `;
        tbody.appendChild(row);
    });
    
    resultsContainer.appendChild(document.createElement('p')).textContent = `Found ${bugs.length} result(s).`;
}

function getCategoryName(id) {
    return lookupTables.categories[id] || 'Unknown';
}

function getSeverityName(id) {
    return lookupTables.severities[id] || 'Unknown';
}

function getAuthorName(id) {
    return lookupTables.users[id] || 'Unknown';
}

function getStatusName(id) {
    return lookupTables.statuses[id] || 'Unknown';
}

function getResolutionName(id) {
    return lookupTables.resolutions[id] || 'Unknown';
}
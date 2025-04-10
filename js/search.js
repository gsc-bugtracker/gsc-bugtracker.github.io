// This is AI-generated.
// I did not look through this at all.
// I will do no maintenance to this code.
// Enhanced Bug Tracker Search Script
let bugData = [];
let lookupTables = {};
let activeFilters = {};

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadData();
});

function setupEventListeners() {
    // Search button event
    document.getElementById('search-button').addEventListener('click', function() {
        performSearch();
    });
    
    // Enter key in search field
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter')
            performSearch();
    });

    // Apply filters button
    document.getElementById('apply-filters').addEventListener('click', function() {
        updateActiveFilters();
        performSearch();
    });

    // Clear filters button
    document.getElementById('clear-filters').addEventListener('click', function() {
        clearFilters();
    });
    
    // Set up change events for all filter elements
    const filterElements = [
        'filter-category',
        'filter-severity',
        'filter-author',
        'filter-participator',
        'filter-resolution',
        'date-added-min',
        'date-added-max',
        'date-modified-min',
        'date-modified-max'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', function() {
                // Auto-apply when a filter changes
                updateActiveFilters();
                performSearch();
            });
        }
    });
}

function updateActiveFilters() {
    activeFilters = {};
    const activeFiltersContainer = document.getElementById('active-filters');
    activeFiltersContainer.innerHTML = '';
    
    // Check for text search
    const searchText = document.getElementById('search-input').value.trim();
    if (searchText) {
        activeFilters.searchText = searchText;
        addFilterTag('Search', searchText, () => {
            document.getElementById('search-input').value = '';
            updateActiveFilters();
            performSearch();
        });
    }
    
    // Check search options
    const searchInDesc = document.getElementById('search-description').checked;
    const searchInComments = document.getElementById('search-comments').checked;
    if (searchInDesc) {
        activeFilters.searchInDesc = true;
        addFilterTag('Search in', 'Descriptions', () => {
            document.getElementById('search-description').checked = false;
            updateActiveFilters();
            performSearch();
        });
    }
    if (searchInComments) {
        activeFilters.searchInComments = true;
        addFilterTag('Search in', 'Comments', () => {
            document.getElementById('search-comments').checked = false;
            updateActiveFilters();
            performSearch();
        });
    }
    
    // Get category filters
    const categorySelect = document.getElementById('filter-category');
    const selectedCategories = getSelectedValues(categorySelect);
    if (selectedCategories.length > 0) {
        activeFilters.categories = selectedCategories;
        selectedCategories.forEach(categoryId => {
            addFilterTag('Category', lookupTables.categories[categoryId], () => {
                // Deselect this specific option
                for (let i = 0; i < categorySelect.options.length; i++) {
                    if (categorySelect.options[i].value === categoryId) {
                        categorySelect.options[i].selected = false;
                        break;
                    }
                }
                updateActiveFilters();
                performSearch();
            });
        });
    }
    
    // Get severity filters
    const severitySelect = document.getElementById('filter-severity');
    const selectedSeverities = getSelectedValues(severitySelect);
    if (selectedSeverities.length > 0) {
        activeFilters.severities = selectedSeverities;
        selectedSeverities.forEach(severityId => {
            addFilterTag('Severity', lookupTables.severities[severityId], () => {
                for (let i = 0; i < severitySelect.options.length; i++) {
                    if (severitySelect.options[i].value === severityId) {
                        severitySelect.options[i].selected = false;
                        break;
                    }
                }
                updateActiveFilters();
                performSearch();
            });
        });
    }
    
    // Get author filters
    const authorSelect = document.getElementById('filter-author');
    const selectedAuthors = getSelectedValues(authorSelect);
    if (selectedAuthors.length > 0) {
        activeFilters.authors = selectedAuthors;
        selectedAuthors.forEach(authorId => {
            addFilterTag('Author', lookupTables.users[authorId], () => {
                for (let i = 0; i < authorSelect.options.length; i++) {
                    if (authorSelect.options[i].value === authorId) {
                        authorSelect.options[i].selected = false;
                        break;
                    }
                }
                updateActiveFilters();
                performSearch();
            });
        });
    }
    
    // Get participator filters
    const participatorSelect = document.getElementById('filter-participator');
    const selectedParticipators = getSelectedValues(participatorSelect);
    if (selectedParticipators.length > 0) {
        activeFilters.participators = selectedParticipators;
        selectedParticipators.forEach(participatorId => {
            addFilterTag('Participator', lookupTables.users[participatorId], () => {
                for (let i = 0; i < participatorSelect.options.length; i++) {
                    if (participatorSelect.options[i].value === participatorId) {
                        participatorSelect.options[i].selected = false;
                        break;
                    }
                }
                updateActiveFilters();
                performSearch();
            });
        });
    }
    
    // Get resolution filters
    const resolutionSelect = document.getElementById('filter-resolution');
    const selectedResolutions = getSelectedValues(resolutionSelect);
    if (selectedResolutions.length > 0) {
        activeFilters.resolutions = selectedResolutions;
        selectedResolutions.forEach(resolutionId => {
            addFilterTag('Resolution', lookupTables.resolutions[resolutionId], () => {
                for (let i = 0; i < resolutionSelect.options.length; i++) {
                    if (resolutionSelect.options[i].value === resolutionId) {
                        resolutionSelect.options[i].selected = false;
                        break;
                    }
                }
                updateActiveFilters();
                performSearch();
            });
        });
    }
    
    // Check date filters
    const dateAddedMin = document.getElementById('date-added-min').value;
    const dateAddedMax = document.getElementById('date-added-max').value;
    const dateModifiedMin = document.getElementById('date-modified-min').value;
    const dateModifiedMax = document.getElementById('date-modified-max').value;
    
    if (dateAddedMin) {
        activeFilters.dateAddedMin = dateAddedMin;
        addFilterTag('Added after', formatDate(dateAddedMin), () => {
            document.getElementById('date-added-min').value = '';
            updateActiveFilters();
            performSearch();
        });
    }
    
    if (dateAddedMax) {
        activeFilters.dateAddedMax = dateAddedMax;
        addFilterTag('Added before', formatDate(dateAddedMax), () => {
            document.getElementById('date-added-max').value = '';
            updateActiveFilters();
            performSearch();
        });
    }
    
    if (dateModifiedMin) {
        activeFilters.dateModifiedMin = dateModifiedMin;
        addFilterTag('Modified after', formatDate(dateModifiedMin), () => {
            document.getElementById('date-modified-min').value = '';
            updateActiveFilters();
            performSearch();
        });
    }
    
    if (dateModifiedMax) {
        activeFilters.dateModifiedMax = dateModifiedMax;
        addFilterTag('Modified before', formatDate(dateModifiedMax), () => {
            document.getElementById('date-modified-max').value = '';
            updateActiveFilters();
            performSearch();
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function addFilterTag(type, value, removeCallback) {
    const activeFiltersContainer = document.getElementById('active-filters');
    
    const filterTag = document.createElement('div');
    filterTag.className = 'filter-tag';
    filterTag.innerHTML = `
        <span class="filter-type">${type}:</span>
        <span class="filter-value">${value}</span>
        <span class="remove">×</span>
    `;
    
    filterTag.querySelector('.remove').addEventListener('click', removeCallback);
    activeFiltersContainer.appendChild(filterTag);
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-description').checked = false;
    document.getElementById('search-comments').checked = false;
    
    // Reset all multi-select dropdowns
    document.getElementById('filter-category').selectedIndex = -1;
    document.getElementById('filter-severity').selectedIndex = -1;
    document.getElementById('filter-author').selectedIndex = -1;
    document.getElementById('filter-participator').selectedIndex = -1;
    document.getElementById('filter-resolution').selectedIndex = -1;
    
    // Reset date fields
    document.getElementById('date-added-min').value = '';
    document.getElementById('date-added-max').value = '';
    document.getElementById('date-modified-min').value = '';
    document.getElementById('date-modified-max').value = '';
    
    // Clear active filters
    activeFilters = {};
    document.getElementById('active-filters').innerHTML = '';
    
    // Show all results
    displayResults(bugData);
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
            displayResults(bugData);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('loading').textContent = 'Error loading data. Please refresh the page.';
        });
}

function populateFilters() {
    // Category filter
    const categorySelect = document.getElementById('filter-category');
    categorySelect.innerHTML = '';  // Clear default option
    Object.entries(lookupTables.categories).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        categorySelect.appendChild(option);
    });

    // Severity filter
    const severitySelect = document.getElementById('filter-severity');
    severitySelect.innerHTML = '';  // Clear default option
    Object.entries(lookupTables.severities).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        severitySelect.appendChild(option);
    });

    // Author filter
    const authorSelect = document.getElementById('filter-author');
    authorSelect.innerHTML = '';  // Clear default option
    Object.entries(lookupTables.users).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        authorSelect.appendChild(option);
    });

    // Participator filter (same as users)
    const participatorSelect = document.getElementById('filter-participator');
    participatorSelect.innerHTML = '';  // Clear default option
    Object.entries(lookupTables.users).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        participatorSelect.appendChild(option);
    });

    // Resolution filter
    const resolutionSelect = document.getElementById('filter-resolution');
    resolutionSelect.innerHTML = '';  // Clear default option
    Object.entries(lookupTables.resolutions).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        resolutionSelect.appendChild(option);
    });
}

function getSelectedValues(selectElement) {
    const result = [];
    const options = selectElement && selectElement.options;
    if (!options) return result;
    
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            result.push(options[i].value);
        }
    }
    return result;
}

function parseDate(dateString) {
    if (!dateString) return null;
    
    // If it's already a Date object
    if (dateString instanceof Date) return dateString;
    
    // Handle the format from the JSON: "2004-09-18 19:58"
    if (dateString.includes(' ')) {
        return new Date(dateString.replace(' ', 'T'));
    }
    
    // Handle input date format from HTML date picker
    return new Date(dateString);
}

function performSearch() {
    // Get current search values
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchInDesc = document.getElementById('search-description').checked;
    const searchInComments = document.getElementById('search-comments').checked;
    
    // Get selected filter values
    const categoryFilters = getSelectedValues(document.getElementById('filter-category'));
    const severityFilters = getSelectedValues(document.getElementById('filter-severity'));
    const authorFilters = getSelectedValues(document.getElementById('filter-author'));
    const participatorFilters = getSelectedValues(document.getElementById('filter-participator'));
    const resolutionFilters = getSelectedValues(document.getElementById('filter-resolution'));
    
    // Get date range values
    const dateAddedMin = parseDate(document.getElementById('date-added-min').value);
    const dateAddedMax = parseDate(document.getElementById('date-added-max').value);
    const dateModifiedMin = parseDate(document.getElementById('date-modified-min').value);
    const dateModifiedMax = parseDate(document.getElementById('date-modified-max').value);

    const filteredBugs = bugData.filter(bug => {
        // Search term matching
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
        
        // Multiple category matching
        const matchesCategory = categoryFilters.length === 0 || 
            categoryFilters.includes(bug.category_id.toString());
        
        // Multiple severity matching
        const matchesSeverity = severityFilters.length === 0 || 
            severityFilters.includes(bug.severity_id.toString());
        
        // Multiple author matching
        const matchesAuthor = authorFilters.length === 0 || 
            authorFilters.includes(bug.reporter_id.toString());
        
        // Multiple resolution matching
        const matchesResolution = resolutionFilters.length === 0 || 
            resolutionFilters.includes(bug.resolution_id.toString());
        
        // Participator matching (checks both reporter and comment authors)
        let matchesParticipator = participatorFilters.length === 0;
        if (!matchesParticipator) {
            // Check if the bug reporter is one of the selected participators
            if (participatorFilters.includes(bug.reporter_id.toString())) {
                matchesParticipator = true;
            }
            // Check if any comment author is one of the selected participators
            else if (bug.comments && bug.comments.length > 0) {
                matchesParticipator = bug.comments.some(comment => 
                    participatorFilters.includes(comment.author_id.toString())
                );
            }
        }
        
        // Date range matching
        let matchesDateAdded = true;
        if (dateAddedMin && bug.date_added) {
            const bugDateAdded = parseDate(bug.date_added);
            matchesDateAdded = matchesDateAdded && bugDateAdded >= dateAddedMin;
        }
        if (dateAddedMax && bug.date_added) {
            const bugDateAdded = parseDate(bug.date_added);
            // Add one day to include the end date in the range
            const maxDate = new Date(dateAddedMax);
            maxDate.setDate(maxDate.getDate() + 1);
            matchesDateAdded = matchesDateAdded && bugDateAdded < maxDate;
        }
        
        let matchesDateModified = true;
        if (dateModifiedMin && bug.date_modified) {
            const bugDateModified = parseDate(bug.date_modified);
            matchesDateModified = matchesDateModified && bugDateModified >= dateModifiedMin;
        }
        if (dateModifiedMax && bug.date_modified) {
            const bugDateModified = parseDate(bug.date_modified);
            // Add one day to include the end date in the range
            const maxDate = new Date(dateModifiedMax);
            maxDate.setDate(maxDate.getDate() + 1);
            matchesDateModified = matchesDateModified && bugDateModified < maxDate;
        }
        
        return matchesSearchTerm && 
               matchesCategory && 
               matchesSeverity && 
               matchesAuthor && 
               matchesResolution && 
               matchesParticipator && 
               matchesDateAdded && 
               matchesDateModified;
    });

    displayResults(filteredBugs);
    
    // Update active filters display
    updateActiveFilters();
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
                <th>Date Added</th>
                <th>Last Modified</th>
            </tr>
        </thead>
        <tbody id="results-body"></tbody>
    `;
    resultsContainer.appendChild(table);
    
    const tbody = document.getElementById('results-body');
    
    bugs.forEach(bug => {
        const row = document.createElement('tr');
        
        // Format dates for display
        const dateAdded = bug.date_added ? formatDateForDisplay(bug.date_added) : '';
        const dateModified = bug.date_modified ? formatDateForDisplay(bug.date_modified) : '';
        
        row.innerHTML = `
            <td><a href="${bug.id}.html">${bug.id}</a></td>
            <td>${escapeHTML(bug.summary)}</td>
            <td>${getCategoryName(bug.category_id)}</td>
            <td>${getSeverityName(bug.severity_id)}</td>
            <td>${getAuthorName(bug.reporter_id)}</td>
            <td>${getStatusName(bug.status_id)}</td>
            <td>${getResolutionName(bug.resolution_id)}</td>
            <td>${dateAdded}</td>
            <td>${dateModified}</td>
        `;
        tbody.appendChild(row);
    });
    
    resultsContainer.appendChild(document.createElement('p')).textContent = `Found ${bugs.length} result(s).`;
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleString();
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
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
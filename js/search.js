// This is AI-generated.
// I did not look through this at all.
// I will do no maintenance to this code.


// Global variables
let bugData = [];
let lookupTables = {};
let activeFilters = {
    categories: [],
    severities: [],
    authors: [],
    participators: [],
    resolutions: [],
    dateAddedMin: null,
    dateAddedMax: null,
    dateModifiedMin: null,
    dateModifiedMax: null,
    searchText: '',
    searchInDesc: false,
    searchInComments: false
};

// Options that have been removed from dropdowns and added to active filters
let removedOptions = {
    categories: [],
    severities: [],
    authors: [],
    participators: [],
    resolutions: []
};

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadData();
});

function setupEventListeners() {
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', e => { 
        if (e.key === 'Enter') performSearch(); 
    });
    
    document.getElementById('add-category').addEventListener('click', () => addFilter('category'));
    document.getElementById('add-severity').addEventListener('click', () => addFilter('severity'));
    document.getElementById('add-author').addEventListener('click', () => addFilter('author'));
    document.getElementById('add-participator').addEventListener('click', () => addFilter('participator'));
    document.getElementById('add-resolution').addEventListener('click', () => addFilter('resolution'));
    document.getElementById('add-date-added').addEventListener('click', addDateAddedFilter);
    document.getElementById('add-date-modified').addEventListener('click', addDateModifiedFilter);
    
    document.getElementById('apply-filters').addEventListener('click', performSearch);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    document.getElementById('search-description').addEventListener('change', function() {
        activeFilters.searchInDesc = this.checked;
        updateActiveFiltersDisplay();
    });
    
    document.getElementById('search-comments').addEventListener('change', function() {
        activeFilters.searchInComments = this.checked;
        updateActiveFiltersDisplay();
    });
    
    document.getElementById('search-input').addEventListener('input', function() {
        activeFilters.searchText = this.value.trim();
        updateActiveFiltersDisplay();
    });
}

function addFilter(filterType) {
    const select = document.getElementById(`filter-${filterType}`);
    const selectedValue = select.value;
    
    if (!selectedValue) return; // Nothing selected
    
    let filterArray;
    let optionsArray;
    let lookupTable;
    
    switch(filterType) {
        case 'category':
            filterArray = activeFilters.categories;
            optionsArray = removedOptions.categories;
            lookupTable = lookupTables.categories;
            break;
        case 'severity':
            filterArray = activeFilters.severities;
            optionsArray = removedOptions.severities;
            lookupTable = lookupTables.severities;
            break;
        case 'author':
            filterArray = activeFilters.authors;
            optionsArray = removedOptions.authors;
            lookupTable = lookupTables.users;
            break;
        case 'participator':
            filterArray = activeFilters.participators;
            optionsArray = removedOptions.participators;
            lookupTable = lookupTables.users;
            break;
        case 'resolution':
            filterArray = activeFilters.resolutions;
            optionsArray = removedOptions.resolutions;
            lookupTable = lookupTables.resolutions;
            break;
    }
    
    if (!filterArray.includes(selectedValue)) {
        filterArray.push(selectedValue);
        
        // Remove from dropdown
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === selectedValue) {
                optionsArray.push({
                    value: selectedValue,
                    text: select.options[i].text
                });
                select.remove(i);
                break;
            }
        }
        
        // Reset select to first option
        select.selectedIndex = 0;
        
        // Update display
        updateActiveFiltersDisplay();
        performSearch();
    }
}

function addDateAddedFilter() {
    const minDate = document.getElementById('date-added-min').value;
    const maxDate = document.getElementById('date-added-max').value;
    
    if (minDate) {
        activeFilters.dateAddedMin = minDate;
    }
    
    if (maxDate) {
        activeFilters.dateAddedMax = maxDate;
    }
    
    if (minDate || maxDate) {
        updateActiveFiltersDisplay();
        performSearch();
    }
}

function addDateModifiedFilter() {
    const minDate = document.getElementById('date-modified-min').value;
    const maxDate = document.getElementById('date-modified-max').value;
    
    if (minDate) {
        activeFilters.dateModifiedMin = minDate;
    }
    
    if (maxDate) {
        activeFilters.dateModifiedMax = maxDate;
    }
    
    if (minDate || maxDate) {
        updateActiveFiltersDisplay();
        performSearch();
    }
}

function removeFilter(filterType, value) {
    let filterArray;
    let optionsArray;
    let select;
    
    switch(filterType) {
        case 'category':
            filterArray = activeFilters.categories;
            optionsArray = removedOptions.categories;
            select = document.getElementById('filter-category');
            break;
        case 'severity':
            filterArray = activeFilters.severities;
            optionsArray = removedOptions.severities;
            select = document.getElementById('filter-severity');
            break;
        case 'author':
            filterArray = activeFilters.authors;
            optionsArray = removedOptions.authors;
            select = document.getElementById('filter-author');
            break;
        case 'participator':
            filterArray = activeFilters.participators;
            optionsArray = removedOptions.participators;
            select = document.getElementById('filter-participator');
            break;
        case 'resolution':
            filterArray = activeFilters.resolutions;
            optionsArray = removedOptions.resolutions;
            select = document.getElementById('filter-resolution');
            break;
        case 'dateAddedMin':
            activeFilters.dateAddedMin = null;
            document.getElementById('date-added-min').value = '';
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'dateAddedMax':
            activeFilters.dateAddedMax = null;
            document.getElementById('date-added-max').value = '';
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'dateModifiedMin':
            activeFilters.dateModifiedMin = null;
            document.getElementById('date-modified-min').value = '';
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'dateModifiedMax':
            activeFilters.dateModifiedMax = null;
            document.getElementById('date-modified-max').value = '';
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'searchText':
            activeFilters.searchText = '';
            document.getElementById('search-input').value = '';
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'searchInDesc':
            activeFilters.searchInDesc = false;
            document.getElementById('search-description').checked = false;
            updateActiveFiltersDisplay();
            performSearch();
            return;
        case 'searchInComments':
            activeFilters.searchInComments = false;
            document.getElementById('search-comments').checked = false;
            updateActiveFiltersDisplay();
            performSearch();
            return;
    }
    
    const index = filterArray.indexOf(value);
    if (index !== -1) {
        filterArray.splice(index, 1);
        
        // Find the option in removedOptions and add it back to the select
        for (let i = 0; i < optionsArray.length; i++) {
            if (optionsArray[i].value === value) {
                const option = document.createElement('option');
                option.value = optionsArray[i].value;
                option.text = optionsArray[i].text;
                select.add(option);
                optionsArray.splice(i, 1);
                break;
            }
        }
        
        // Update display
        updateActiveFiltersDisplay();
        performSearch();
    }
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('active-filters');
    container.innerHTML = '<span class="bold">Active Filters:</span> ';
    
    let hasFilters = false;
    
    if (activeFilters.searchText) {
        hasFilters = true;
        appendFilterTag(container, 'Search', activeFilters.searchText, () => removeFilter('searchText'));
    }
    
    if (activeFilters.searchInDesc) {
        hasFilters = true;
        appendFilterTag(container, 'Search in', 'Descriptions', () => removeFilter('searchInDesc'));
    }
    
    if (activeFilters.searchInComments) {
        hasFilters = true;
        appendFilterTag(container, 'Search in', 'Comments', () => removeFilter('searchInComments'));
    }
    
    activeFilters.categories.forEach(categoryId => {
        hasFilters = true;
        appendFilterTag(container, 'Category', lookupTables.categories[categoryId], 
                    () => removeFilter('category', categoryId));
    });
    
    activeFilters.severities.forEach(severityId => {
        hasFilters = true;
        appendFilterTag(container, 'Severity', lookupTables.severities[severityId], 
                    () => removeFilter('severity', severityId));
    });
    
    activeFilters.authors.forEach(authorId => {
        hasFilters = true;
        appendFilterTag(container, 'Author', lookupTables.users[authorId], 
                    () => removeFilter('author', authorId));
    });
    
    activeFilters.participators.forEach(participatorId => {
        hasFilters = true;
        appendFilterTag(container, 'Participator', lookupTables.users[participatorId], 
                    () => removeFilter('participator', participatorId));
    });
    
    activeFilters.resolutions.forEach(resolutionId => {
        hasFilters = true;
        appendFilterTag(container, 'Resolution', lookupTables.resolutions[resolutionId], 
                    () => removeFilter('resolution', resolutionId));
    });
    
    if (activeFilters.dateAddedMin) {
        hasFilters = true;
        appendFilterTag(container, 'Added after', formatDate(activeFilters.dateAddedMin), 
                    () => removeFilter('dateAddedMin'));
    }
    
    if (activeFilters.dateAddedMax) {
        hasFilters = true;
        appendFilterTag(container, 'Added before', formatDate(activeFilters.dateAddedMax), 
                    () => removeFilter('dateAddedMax'));
    }
    
    if (activeFilters.dateModifiedMin) {
        hasFilters = true;
        appendFilterTag(container, 'Modified after', formatDate(activeFilters.dateModifiedMin), 
                    () => removeFilter('dateModifiedMin'));
    }
    
    if (activeFilters.dateModifiedMax) {
        hasFilters = true;
        appendFilterTag(container, 'Modified before', formatDate(activeFilters.dateModifiedMax), 
                    () => removeFilter('dateModifiedMax'));
    }
    
    if (!hasFilters) {
        container.innerHTML += '<span class="italic small">No filters applied. Select filters below.</span>';
    }
}

function appendFilterTag(container, type, value, removeCallback) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.style.marginRight = '5px';
    tag.innerHTML = `
        <span class="bold small">${type}:</span>
        <span class="small">${value}</span>
        <a href="#" class="small bold" title="Remove this filter"> × </a>
    `;
    tag.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        removeCallback();
    });
    container.appendChild(tag);
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-description').checked = false;
    document.getElementById('search-comments').checked = false;
    
    document.getElementById('date-added-min').value = '';
    document.getElementById('date-added-max').value = '';
    document.getElementById('date-modified-min').value = '';
    document.getElementById('date-modified-max').value = '';
    
    activeFilters = {
        categories: [],
        severities: [],
        authors: [],
        participators: [],
        resolutions: [],
        dateAddedMin: null,
        dateAddedMax: null,
        dateModifiedMin: null,
        dateModifiedMax: null,
        searchText: '',
        searchInDesc: false,
        searchInComments: false
    };
    
    restoreRemovedOptions('category', removedOptions.categories);
    restoreRemovedOptions('severity', removedOptions.severities);
    restoreRemovedOptions('author', removedOptions.authors);
    restoreRemovedOptions('participator', removedOptions.participators);
    restoreRemovedOptions('resolution', removedOptions.resolutions);
    
    removedOptions = {
        categories: [],
        severities: [],
        authors: [],
        participators: [],
        resolutions: []
    };
    
    updateActiveFiltersDisplay();
    displayResults(bugData);
}

function restoreRemovedOptions(filterType, optionsArray) {
    const select = document.getElementById(`filter-${filterType}`);
    
    optionsArray.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.text = option.text;
        select.add(newOption);
    });
}

function loadData() {
    fetch('/json/bug_data.json')
        .then(response => response.json())
        .then(data => {
            bugData = data;
            document.getElementById('loading').innerHTML = '<tr class="row-2"><td class="center">Loading lookup tables...</td></tr>';
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
            document.getElementById('loading').innerHTML = '<tr class="row-2"><td class="center">Error loading data. Please refresh the page.</td></tr>';
        });
}

function populateFilters() {
    populateSelect('filter-category', lookupTables.categories);
    populateSelect('filter-severity', lookupTables.severities);
    populateSelect('filter-author', lookupTables.users);
    populateSelect('filter-participator', lookupTables.users);
    populateSelect('filter-resolution', lookupTables.resolutions);
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    Object.entries(options).forEach(([id, name]) => {
        const option = document.createElement('option');
        option.value = id;
        option.text = name;
        select.appendChild(option);
    });
}

function parseDate(dateString) {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;
    if (dateString.includes(' ')) return new Date(dateString.replace(' ', 'T'));
    return new Date(dateString);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function performSearch() {
    const searchTerm = activeFilters.searchText.toLowerCase();
    const searchInDesc = activeFilters.searchInDesc;
    const searchInComments = activeFilters.searchInComments;
    
    const filteredBugs = bugData.filter(bug => {
        // Text search
        let matchesSearchTerm = true;
        if (searchTerm) {
            matchesSearchTerm = bug.summary.toLowerCase().includes(searchTerm);
            
            if (!matchesSearchTerm && searchInDesc && bug.description) {
                matchesSearchTerm = bug.description.toLowerCase().includes(searchTerm);
            }
            
            if (!matchesSearchTerm && searchInComments && bug.comments) {
                matchesSearchTerm = bug.comments.some(comment => 
                    comment.text.toLowerCase().includes(searchTerm)
                );
            }
        }
        
        // Category filter
        const matchesCategory = activeFilters.categories.length === 0 || 
                               activeFilters.categories.includes(bug.category_id.toString());
        
        // Severity filter
        const matchesSeverity = activeFilters.severities.length === 0 || 
                               activeFilters.severities.includes(bug.severity_id.toString());
        
        // Author filter
        const matchesAuthor = activeFilters.authors.length === 0 || 
                             activeFilters.authors.includes(bug.author_id.toString());
        
        // Resolution filter
        const matchesResolution = activeFilters.resolutions.length === 0 || 
                                 activeFilters.resolutions.includes(bug.resolution_id.toString());
        
        // Participator filter
        let matchesParticipator = activeFilters.participators.length === 0;
        if (!matchesParticipator) {
            // Check if the bug reporter is one of the selected participators
            if (activeFilters.participators.includes(bug.author_id.toString())) {
                matchesParticipator = true;
            } else if (bug.comments && bug.comments.length > 0) {
                // Check if any comment author is one of the selected participators
                matchesParticipator = bug.comments.some(comment => 
                    activeFilters.participators.includes(comment.author_id.toString())
                );
            }
        }
        
        // Date Added filter
        let matchesDateAdded = true;
        if (activeFilters.dateAddedMin && bug.date_added) {
            const bugDateAdded = parseDate(bug.date_added);
            matchesDateAdded = matchesDateAdded && bugDateAdded >= parseDate(activeFilters.dateAddedMin);
        }
        if (activeFilters.dateAddedMax && bug.date_added) {
            const bugDateAdded = parseDate(bug.date_added);
            const maxDate = parseDate(activeFilters.dateAddedMax);
            maxDate.setDate(maxDate.getDate() + 1); // Include the end date
            matchesDateAdded = matchesDateAdded && bugDateAdded < maxDate;
        }
        
        // Date Modified filter
        let matchesDateModified = true;
        if (activeFilters.dateModifiedMin && bug.date_modified) {
            const bugDateModified = parseDate(bug.date_modified);
            matchesDateModified = matchesDateModified && bugDateModified >= parseDate(activeFilters.dateModifiedMin);
        }
        if (activeFilters.dateModifiedMax && bug.date_modified) {
            const bugDateModified = parseDate(bug.date_modified);
            const maxDate = parseDate(activeFilters.dateModifiedMax);
            maxDate.setDate(maxDate.getDate() + 1); // Include the end date
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
}

function displayResults(bugs) {
    const resultsContainer = document.getElementById('search-results');
    
    if (bugs.length === 0) {
        resultsContainer.innerHTML = '<table cellspacing="1" class="width100"><tr class="row-2"><td class="center">No results found.</td></tr></table>';
        return;
    }
    
    let html = `
      <table cellspacing="1" class="width100">
        <tr class="row-category">
          <td>Summary</td>
          <td>Category</td>
          <td>Severity</td>
          <td>Author</td>
          <td>Status</td>
          <td>Resolution</td>
          <td>Date Added</td>
          <td>Last Modified</td>
        </tr>`;
    
    bugs.forEach((bug, index) => {
      const rowClass = index % 2 === 0 ? 'row-1' : 'row-2';
      const dateAdded = bug.date_added ? formatDateForDisplay(bug.date_added) : '';
      const dateModified = bug.date_modified ? formatDateForDisplay(bug.date_modified) : '';
      
      html += `
        <tr class="${rowClass}">
          <td><a href="${bug.id}.html">${escapeHTML(bug.summary)}</a></td>
          <td>${getCategoryName(bug.category_id)}</td>
          <td>${getSeverityName(bug.severity_id)}</td>
          <td>${getAuthorName(bug.author_id)}</td>
          <td>${getStatusName(bug.status_id)}</td>
          <td>${getResolutionName(bug.resolution_id)}</td>
          <td class="small">${dateAdded}</td>
          <td class="small">${dateModified}</td>
        </tr>`;
    });
    
    html += `
      <tr class="spacer" height="5">
        <td colspan="9"></td>
      </tr>
      <tr class="row-1">
        <td colspan="9" class="center">Found ${bugs.length} result(s).</td>
      </tr>
    </table>`;
    
    resultsContainer.innerHTML = html;
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

function getCategoryName(id) { return lookupTables.categories[id] || 'Unknown'; }
function getSeverityName(id) { return lookupTables.severities[id] || 'Unknown'; }
function getAuthorName(id) { return lookupTables.users[id] || 'Unknown'; }
function getStatusName(id) { return lookupTables.statuses[id] || 'Unknown'; }
function getResolutionName(id) { return lookupTables.resolutions[id] || 'Unknown'; }
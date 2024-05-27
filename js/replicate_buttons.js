function handleClick(event) {
    event.preventDefault();

    let parentDiv = event.target.closest('div');
    if (!parentDiv) return;

    parentDiv.style.display = 'none';

    let parentDivId = parentDiv.id;
    if (!parentDivId) return;

    let counterpartId = parentDivId.replace('closed', 'open');
    if (parentDivId.endsWith('open')) {
        counterpartId = parentDivId.replace('open', 'closed');
    }

    let counterpartElement = document.querySelector('#' + counterpartId);
    if (counterpartElement) {
        counterpartElement.style.display = '';
    }
}


window.onload = function() {
	document.querySelectorAll('a > img').forEach(anchor => {
		anchor.addEventListener('click', handleClick);
	});
};
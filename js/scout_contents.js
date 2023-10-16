var link;

async function fetchPage(pageNumber) {
	try {
		const response = await fetch(`${pageNumber}.html`);
		if (!response.ok)
			return;
			
		link = document.createElement('a');
		link.href = `${pageNumber}.html`
		link.innerText = `${pageNumber}`;
		document.body.appendChild(link);
		document.body.appendChild(document.createElement('br'));
	} catch (error) {}
}

async function fetchPagesWithDelay() {
    for (let i = 0; i <= 16000; i += 500) {
        const promises = [];
		
		for (let pageNumber = i; pageNumber < i + 500; pageNumber++)
			promises.push(fetchPage(String(pageNumber).padStart(7, '0')));
		await Promise.all(promises);
    }
}

fetchPagesWithDelay();
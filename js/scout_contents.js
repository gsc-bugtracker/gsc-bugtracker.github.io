// Function to fetch a page and handle the response
async function fetchPage(pageNumber) {
	try {
		const response = await fetch(`${pageNumber}.html`);
		if (!response.ok)
			return;
			
		const link = document.createElement('a');
		link.href = `${pageNumber}.html`
		link.innerText = `${pageNumber}`;
		document.body.appendChild(link);
		document.body.appendChild(document.createElement('br'));
	} catch (error) {}
}

/*
// Loop through pages from 0 to 1000
for (let pageNumber = 0; pageNumber <= 1000; pageNumber++) {
	const formattedPageNumber = String(pageNumber).padStart(7, '0');
	fetchPage(formattedPageNumber);
	
}
*/

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPagesWithDelay() {
  for (let pageNumber = 11000; pageNumber <= 12000; pageNumber++)
    await fetchPage(String(pageNumber).padStart(7, '0'));
}

fetchPagesWithDelay();
function removeAllFollowingAddress() {
	let element = document.querySelectorAll('body address')[0];
    let nextNode = element.nextSibling;

    while (nextNode) {
        const toRemove = nextNode;
        nextNode = nextNode.nextSibling;
        toRemove.remove();
    }
}

function fixEstimates() {
	var elements = document.body.getElementsByTagName('*');
	
    for (var i = 0; i < elements.length; i++) {
        var matches = elements[i].innerHTML.match(/@(\d+)@/g);
        
        if (matches) {
            for (var j = 0; j < matches.length; j++) {
				
                var seconds = matches[j].replace(/@(\d+)@/, '$1');
                var date = new Date(parseInt(seconds) * 1000);
                
                day = new Intl.DateTimeFormat('ru-RU', {
                    timeZone: 'Europe/Kiev',
                    month: 'long',
                    day: '2-digit',
                }).format(date);
                
				year = new Intl.DateTimeFormat('en-GB', {
                    timeZone: 'Europe/Kiev',
                    year: 'numeric',
                }).format(date);
				
				time = new Intl.DateTimeFormat('ru-RU', {
                    timeZone: 'Europe/Kiev',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
				
                elements[i].innerHTML = elements[i].innerHTML.replace(matches[j], day + ' ' + year + ' ' + time );
            }
        }
		
    }
}

function fixAmericanMonths() {
	document.body.innerHTML = document.body.innerHTML.replace(/\b(\d{1,2})-(\d{1,2})-(\d{2})\b/g, 
	
	function(match, month, day, year) {
        const date = new Date(`20${year}-${month}-${day}`);
		
        day = new Intl.DateTimeFormat('ru-RU', {
            timeZone: 'Europe/Kiev',
            month: 'long',
            day: '2-digit',
        }).format(date);
                
		year = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Kiev',
            year: 'numeric',
        }).format(date);
		
        return day + ' ' + year;
    });
}
	
window.onload = function() {
	removeAllFollowingAddress();
	fixEstimates();
	fixAmericanMonths();
};
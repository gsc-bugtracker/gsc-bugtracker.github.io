# -*- coding: utf-8 -*-

import requests
import io
from bs4 import BeautifulSoup
import re
from datetime import datetime
from pytz import timezone
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

# Log in settings
login_cookie = {
    'MANTIS_STRING_COOKIE': '368c0700414e0b7e1906a6ea49234086c1b9fa3fa3f12664299685bb859969c'
}
    
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:78.0) Gecko/20100101 Firefox/78.0 Mypal/68.14.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'http://localhost/mantis/login_page.php?error=1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'http://localhost',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

data = {
    'username': 'Manowar',
    'password': 'vfyjdfh',
}

# Header replacement
new_header = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <script src="js/replicate_buttons.js"></script>
    <!--
    <link rel="stylesheet" type="text/css" href="css/override.css" />
    -->
'''

new_nav = '''
<tr>
	<td class="left" colspan="4">
        <a href="{}.html">< Прошлое обращение ({})</a>
    </td>

	<td class="right" colspan="2">
        <a href="{}.html">Следующее обращение ({}) > </a>
	</td>
</tr>
'''

def fix_etas(text):
    matches = re.findall(r'@(\d{10})@', text)
    
    for match in matches:
        dt = datetime.fromtimestamp(int(match), tz = timezone('Europe/Kiev'))
        date_str = dt.strftime('%m-%d-%y %H:%M')
        text = text.replace('@{}@'.format(match), date_str)
    
    return text


def fix_american_months(text):
    def replace_date(match):
        try:
            month, day, year = map(int, match.groups())
            naive_date = datetime(year + 2000, month, day)
            aware_date = timezone('Europe/Kiev').localize(naive_date)
            formatted_date = aware_date.strftime('%d %B %Y')
                
            russian_months = {
                'January': 'января',
                'February': 'февраля',
                'March': 'марта',
                'April': 'апреля',
                'May': 'мая',
                'June': 'июня',
                'July': 'июля',
                'August': 'августа',
                'September': 'сентября',
                'October': 'октября',
                'November': 'ноября',
                'December': 'декабря'
            }
            for en_month, ru_month in russian_months.items():
                formatted_date = formatted_date.replace(en_month, ru_month)
                
            return formatted_date
        except Exception as e:
            print(e)
            return match.group(0)
            
    return re.sub(r'\b(\d{1,2})-(\d{1,2})-(\d{2})\b', replace_date, text)
    
s = requests.session() 
    

for i in range(0, 18900):
    url = 'http://localhost/mantis/bug_view_advanced_page.php?bug_id=' + str(i)
    
    response = s.post(url, headers = headers, data = data, cookies = login_cookie) 
     
    if response.status_code != 200:
        print("Failed to retrieve the webpage" + str(i) + ". Status code: {}".format(response.status_code))
        continue
        
    soup = BeautifulSoup(response.content, 'html.parser')
        
    prev_bug_id = '{:07d}'.format(i - 1)
    bug_id = '{:07d}'.format(i)
    next_bug_id = '{:07d}'.format(i + 1)
    
    file_path = 'test/{}.html'.format(bug_id)

    with io.open(file_path, 'w', encoding='utf-8-sig') as file:
        file.write(soup.prettify())
    
    with io.open(file_path, 'r', encoding='utf-8-sig') as file:
        lines = file.readlines()

    new_content = new_header + ''.join(lines[13:])
    
    # Clean up useless pieces of HTML code.
    new_content = re.sub(r'<table class="hide">.*?</table>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<table cellspacing="0" class="width100">.*?</table>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<tr class="vcenter">.*?</tr>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<tr>.*?<!-- Labels -->', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<hr size="1"/>.*<br/>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<div id="upload_form_closed".*?</div>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<div id="upload_form_open".*?</div>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r'<tr class="row-1">\s*<td class="category">\s*..... .....\s*.*?<\/tr>', '', new_content, flags=re.DOTALL, count = 1)
    new_content = re.sub(r' <span class="small">\n     \[.*?</span>', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<script type="text/.ava.cript">.*?</script>', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'href="file_download.php.*?"', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\[\s*?<a class="small" href="bug_relationship_delete.*?\]', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<div id="bugnote_add_.*?</div>', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r' onclick=".*?"', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\[\s.*?\]', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<a (id|name)=".*?</a>', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<a >', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\n</a>\n \(', ' (', new_content, flags=re.DOTALL)
    
    try:
        # Move images automatically misplaced by BeautifulSoup to their needed position.
        img_end_pattern = re.compile(r"<img .*?>\s*<.a>")
        html_end_pattern = re.compile(r"</html>")
        tr_start_pattern = re.compile(r'<!-- Buttons -->')

        img_end_match = img_end_pattern.search(new_content)
        html_end_match = html_end_pattern.search(new_content)
        tr_start_match = tr_start_pattern.search(new_content)

        content_to_append = new_content[html_end_match.end():tr_start_match.start()]
        new_content = new_content[:html_end_match.end()] + new_content[tr_start_match.start():]
        new_content = new_content[:img_end_match.end()] + content_to_append + new_content[img_end_match.end():]
    except:
        print("Issue with bug no. " + str(i))
        
    # Fix broken links to other issues.
    def replace_function(match):
        return '<a href="{}.html">'.format(match.group(1).zfill(7))
    new_content = re.sub(r'<a href="view\.php\?id=(\d{1,7})">', replace_function, new_content)
    
    new_content = re.sub(r'<!--.*?-->', '', new_content, flags=re.DOTALL)
    
    # Fix localhost-dependent image links
    new_content = re.sub(r'http://localhost/mantis/', '', new_content, flags=re.DOTALL)

    # Replace american months with Russian-spelt
    new_content = fix_etas(new_content)
    new_content = fix_american_months(new_content)
    
    # Fix <a> buttons restarting the page.
    new_content = re.sub(r'href=""', 'href="#"', new_content, flags=re.DOTALL)
    
    new_content = re.sub(r'<\/a>\n(?=.*?\bbytes\b)', '', new_content, flags=re.DOTALL)
    
    # Move body end to the end of the doc.
    new_content = re.sub(r' </body>\s*</html>', '', new_content, flags=re.DOTALL)
    new_content += '</body></html>'
    
    # Add custom nav.
    nav_replacement = new_nav.format(prev_bug_id, prev_bug_id, next_bug_id, next_bug_id)
    new_content = re.sub(r'<table cellspacing="1" class="width100">\s*<tr class="row-category">', '<table cellspacing="1" class="width100">{}<tr class="row-category">'.format(nav_replacement), new_content, flags=re.DOTALL)
    new_content = re.sub(r'<div align="center">\s*<table cellspacing="1" class="width50">', '<div align="center">{}<table cellspacing="1" class="width50">'.format(nav_replacement), new_content, flags=re.DOTALL)
     

    # Remove empty relationships.
    #new_content = re.sub(r'<div id="relationships_open">\s*?<table[^>]*>\s*?<tr[^>]*?>\s*<td[^>]*?>(\s|.)*?(<td colspan="2"><.td>)(\s|.)*?<.div>', '', new_content, flags=re.DOTALL)

    soup2 = BeautifulSoup(new_content, 'html.parser')
    new_content = soup2.prettify()
    
    # Remove line breaks where not necessary.
    new_content = re.sub(r'<td class="(small-caption)">\s*', '<td class="small-caption">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td class="(bugnote-note-public)">\s*', '<td class="bugnote-note-public">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td class="(category)">\s*', '<td class="category">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td colspan="5">\s*', '<td colspan="5">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td width="15%">\s*', '<td width="15%">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td width="20%">\s*', '<td width="20%">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td bgcolor="#cceedd">\s*', '<td bgcolor="#cceedd">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<td>\s*', '<td>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\s*\n\s*</td>', '</td>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<span class="(small)">\s*', '<span class="small">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<span class="(italic)">\s*', '<span class="italic">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<span class="(pagetitle)">\s*', '<span class="pagetitle">', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\s*\n\s*</span>', '</span>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'</span></td>', '</span>\n    </td>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<nobr>\n          ', '<nobr>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\n         </nobr>', '</nobr>', new_content, flags=re.DOTALL)
    new_content = re.sub(r'\n\n', '\n', new_content, flags=re.DOTALL)

    # ????
    new_content = re.sub(r'</html>.*', '', new_content, flags=re.DOTALL)
    new_content = re.sub(r'<tr class="row-1">\s*<td class="category">\s*..... .....\s*.*?<\/tr>', '', new_content, flags=re.DOTALL, count = 1)

    with io.open(file_path, 'w', encoding='utf-8-sig') as file:
        file.write(new_content)
            
    print("HTML content saved to {}".format(file_path))
    

input()
import os
import re
import shutil

base_path = r'c:\Users\SURA\Desktop\data parse'

def get_body_content(filename):
    path = os.path.join(base_path, filename)
    if not os.path.exists(path):
        return ""
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Extract everything between </nav> (or Get Started button) and <footer>
    match = re.search(r'</nav>(.*?)<footer', html, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1)
    return ""

about_content = '<div id="about-us">' + get_body_content('about.html') + '</div>'
services_content = '<div id="services">' + get_body_content('services.html') + '</div>'
work_content = '<div id="our-work">' + get_body_content('work.html') + '</div>'

# Read index.html
with open(os.path.join(base_path, 'index.html'), 'r', encoding='utf-8') as f:
    index_html = f.read()

# Make a backup
shutil.copy(os.path.join(base_path, 'index.html'), os.path.join(base_path, 'index_backup.html'))

# Insert all content before <footer>
new_index = re.sub(r'(<footer)', lambda m: about_content + '\n' + services_content + '\n' + work_content + '\n' + m.group(1), index_html, count=1, flags=re.IGNORECASE)

# Update nav links iteratively
nav_replacements = {
    'href="index.html"': 'href="#"',
    'href="about.html"': 'href="#about-us"',
    'href="services.html"': 'href="#services"',
    'href="work.html"': 'href="#our-work"'
}
for old, new in nav_replacements.items():
    new_index = new_index.replace(old, new)
    
# Clean up duplicate <main> backgrounds if necessary, but <div> wrappers handle it fine.
with open(os.path.join(base_path, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Merged successfully!")

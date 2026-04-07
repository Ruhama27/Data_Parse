import os
import re

files_to_update = ['index.html', 'about.html', 'services.html', 'work.html']

replacements = {
    '>Home</a>': 'href="index.html"',
    '>About Us</a>': 'href="about.html"',
    '>Services</a>': 'href="services.html"',
    '>Our Work</a>': 'href="work.html"'
}

for file in files_to_update:
    path = os.path.join(r'c:\Users\SURA\Desktop\data parse', file)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    for text, href in replacements.items():
        # Replace href="#" that immediately precedes the text tag closure
        # example: href="#">Home</a>
        pattern = r'href="#"([^>]*)' + re.escape(text)
        replacement = href + r'\1' + text
        content = re.sub(pattern, replacement, content)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Links updated successfully.")

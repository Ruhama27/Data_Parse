import os
import re

file_path = r'c:\Users\SURA\Desktop\data parse\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add AOS CSS in <head>
aos_css = '\n    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n</head>'
html = html.replace('</head>', aos_css)

# 2. Add AOS JS and Init before </body>
aos_js = '''
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
            offset: 100
        });
        
        // Add smooth scrolling for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
'''
html = html.replace('</body>', aos_js)

# 3. Add data-aos="fade-up" to major headers
html = html.replace('<h2 class="font-headline', '<h2 data-aos="fade-up" class="font-headline')
html = html.replace('<h3 class="font-headline', '<h3 data-aos="fade-up" data-aos-delay="100" class="font-headline')

# 4. Add data-aos="fade-up" to glass cards
html = html.replace('class="glass-card', 'data-aos="fade-up" data-aos-delay="200" class="glass-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(56,189,248,0.2)]')

# 5. Add data-aos="zoom-in" to metrics containers (usually containing 5xl or 4xl text)
html = html.replace('class="font-headline text-5xl', 'data-aos="zoom-in" data-aos-delay="150" class="font-headline text-5xl')

# 6. Make buttons pop more on hover
html = html.replace('hover:scale-95', 'hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]')
html = html.replace('hover:scale-[0.98]', 'hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]')

# 7. Add data-aos="fade-right" to text blocks and paragraphs
html = html.replace('<p class="font-body', '<p data-aos="fade-up" data-aos-delay="100" class="font-body')

# Save updated HTML
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("AOS and animations injected successfully.")

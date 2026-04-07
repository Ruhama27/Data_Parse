import os
import re

base_path = r'c:\Users\SURA\Desktop\data parse'
target_path = os.path.join(base_path, 'index.html')

with open(target_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add AOS & Lenis CSS/JS
head_inject = '''
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-scrolling iframe { pointer-events: none; }
        
        /* Floating animation for images */
        @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(1deg); }
            66% { transform: translateY(10px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
            animation: float 8s ease-in-out infinite;
        }
    </style>
</head>
'''
html = html.replace('</head>', head_inject)

body_inject = '''
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
    <script>
        // Init AOS
        AOS.init({
            duration: 1200,
            once: true,
            easing: 'ease-out-quart',
            offset: 100
        });

        // Init Lenis for cinematic smooth scrolling
        const lenis = new Lenis({
            duration: 2.0, // Cinematic transitions between sections
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        // Bind nav clicks to Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'), { offset: -50, duration: 2.0 });
            });
        });
    </script>
</body>
'''
html = html.replace('</body>', body_inject)

# 2. Add properties to elements
# Images get stunning zoom & float
html = re.sub(r'(<img[^>]+class=")([^"]*)(")', r'\1\2 animate-float\3 data-aos="zoom-out-down" data-aos-duration="2000" data-aos-easing="ease-out-cubic"', html)

# Glass cards get 3D hover and fade-up
html = html.replace('class="glass-card', 'data-aos="fade-up" data-aos-duration="1000" class="glass-card transition-all duration-700 hover:-translate-y-6 hover:scale-[1.03] hover:shadow-[0_30px_80px_rgba(56,189,248,0.3)]')

# Buttons get pulse and glow
html = html.replace('hover:scale-95', 'hover:scale-110 hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] duration-500 ease-out')
html = html.replace('hover:scale-[0.98]', 'hover:scale-110 hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] duration-500 ease-out')

# Text zoom
html = html.replace('class="font-headline text-5xl', 'data-aos="zoom-in" data-aos-duration="1500" class="font-headline text-5xl')
html = html.replace('<h2 class="font-headline', '<h2 data-aos="fade-right" data-aos-duration="1200" class="font-headline')
html = html.replace('<h3 class="font-headline', '<h3 data-aos="fade-left" data-aos-duration="1200" class="font-headline')
html = html.replace('<p class="font-body', '<p data-aos="fade-up" data-aos-duration="1500" class="font-body')

# Icons rotating
html = html.replace('material-symbols-outlined', 'material-symbols-outlined transition-all hover:rotate-[360deg] hover:scale-125 duration-1000')

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Cinematic animations injected successfully.")

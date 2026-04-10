/* ================================================
   DATA PARSE — PREMIUM ENGINE
   Smooth Scroll (Lenis) + WebGL (Three.js) + GSAP
   ================================================ */

(function() {
    "use strict";

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. THREE.JS SCENE SETUP
    const canvas = document.querySelector('#canvas-3d');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x818cf8, 1);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // 3. THE DATA PRISM (Visual Anchor)
    // Core geometry
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95, // Glass effect
        thickness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        wireframe: false,
        transparent: true,
        opacity: 0.3
    });

    const prism = new THREE.Mesh(geometry, material);
    scene.add(prism);

    // Wireframe overlay
    const wireGeo = new THREE.IcosahedronGeometry(2.02, 0);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const wireprism = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireprism);

    // Floating particles around prism
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 4. SCROLL ANIMATIONS (GSAP + ScrollTrigger)
    
    // Initial entrance
    gsap.from(prism.scale, {
        x: 0, y: 0, z: 0,
        duration: 2,
        ease: "power4.out",
        delay: 0.5
    });

    // Scroll-bound rotation and scale
    gsap.to(prism.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    gsap.to(wireprism.rotation, {
        x: -Math.PI * 2,
        y: -Math.PI * 2,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });

    // Morph depth/position
    gsap.to(camera.position, {
        z: 8,
        scrollTrigger: {
            trigger: "section:nth-of-type(2)",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Side Nav active state
    const sections = ["hero", "solutions", "results", "work"];
    const sectionElements = document.querySelectorAll("section");
    const dots = document.querySelectorAll(".dot-nav-item");

    sectionElements.forEach((sec, i) => {
        if(i < dots.length) {
            ScrollTrigger.create({
                trigger: sec,
                start: "top center",
                end: "bottom center",
                onEnter: () => updateNav(i),
                onEnterBack: () => updateNav(i),
            });
        }
    });

    function updateNav(index) {
        dots.forEach(dot => dot.classList.remove("active"));
        if(dots[index]) dots[index].classList.add("active");
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Subtle constant rotation
        prism.rotation.y += 0.002;
        wireprism.rotation.y -= 0.002;
        
        particles.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }
    animate();

    // 5. TECHNICAL TYPOGRAPHY REVEAL
    // Split text effect (char by char) - excluding elements with typing animations
    document.querySelectorAll('h2, h3, .dp-premium-reveal').forEach(el => {
        if(el.closest('#hero')) return; // skip hero for now to preserve typing effect
        
        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            el.appendChild(span);
        });

        gsap.to(el.querySelectorAll('span'), {
            opacity: 1,
            y: 0,
            duration: 0.05,
            stagger: 0.01,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
            },
            startAt: { y: 10 }
        });
    });

    console.log("🚀 Premium Engine Synchronized.");

})();

/* ================================================
   DATA PARSE — PREMIUM ENGINE
   Smooth Scroll (Lenis) + WebGL (Three.js) + GSAP
   ================================================ */

(function() {
    "use strict";

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Lenis is initialized centrally in animations.js

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

    // 3. THE DATA PRISM -> PREMIUM TORUS NODE NETWORK
    // Core geometry
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x8aaee0,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9, // Glass effect
        thickness: 0.8,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        wireframe: false,
        transparent: true,
        opacity: 0.3
    });

    const prism = new THREE.Mesh(geometry, material);
    scene.add(prism);

    // Wireframe overlay
    const wireGeo = new THREE.TorusKnotGeometry(1.52, 0.42, 64, 16);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const wireprism = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireprism);

    // Floating particles around prism
    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        // distribute within a sphere
        const r = 8 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);
    
    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

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
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();

        // Mouse Parallax
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        prism.rotation.x += 0.05 * (targetY - prism.rotation.x);
        prism.rotation.y += 0.05 * (targetX - prism.rotation.y);
        
        // Subtle constant rotation
        prism.rotation.y += 0.002;
        wireprism.rotation.y -= 0.002;
        wireprism.rotation.x = prism.rotation.x;
        wireprism.rotation.y = prism.rotation.y;
        
        // Undulate Torus Knot
        const time = elapsedTime * 0.5;
        prism.scale.set(1 + Math.sin(time)*0.05, 1 + Math.cos(time)*0.05, 1);
        wireprism.scale.copy(prism.scale);

        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        renderer.render(scene, camera);
    }
    animate();

    // 5. TECHNICAL TYPOGRAPHY REVEAL (Scramble Effect)
    const chars = "!<>-_\\\\/[]{}—=+*^?#________";
    document.querySelectorAll('h2, h3, .dp-premium-reveal').forEach(el => {
        if(el.closest('#hero')) return; 
        
        const text = el.innerText;
        el.innerHTML = '';
        const spans = [];
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.dataset.char = char; // original chart
            el.appendChild(span);
            spans.push(span);
        });

        ScrollTrigger.create({
            trigger: el,
            start: "top 90%",
            onEnter: () => {
                spans.forEach((span, i) => {
                    const original = span.dataset.char;
                    if(original === ' ') {
                        gsap.to(span, { opacity: 1, duration: 0.1 });
                        return;
                    }
                    
                    // The dummy object prevents timeline conflicts
                    const dummy = { value: 0 };
                    gsap.to(dummy, {
                        value: 1,
                        duration: 0.6,
                        delay: i * 0.02,
                        ease: "power2.out",
                        onStart: () => {
                            span.style.opacity = '1';
                        },
                        onUpdate: () => {
                            if(dummy.value < 0.8) {
                                span.innerText = chars[Math.floor(Math.random() * chars.length)];
                            } else {
                                span.innerText = original;
                            }
                        },
                        onComplete: () => {
                            span.innerText = original; // Guarantee original
                        }
                    });
                });
            }
        });
    });

    console.log("🚀 Premium Engine Synchronized.");

})();

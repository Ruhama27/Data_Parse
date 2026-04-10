/* ================================================
   DATA PARSE — 3D ANIMATIONS ENGINE
   ================================================ */
(function () {
  "use strict";

  /* ── 1. CUSTOM CURSOR ── */
  const cursorDot = document.createElement("div");
  const cursorRing = document.createElement("div");
  cursorDot.id = "dp-cursor";
  cursorRing.id = "dp-cursor-ring";
  document.body.append(cursorDot, cursorRing);

  let mx = -200, my = -200, rx = -200, ry = -200;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top = my + "px";
  });
  // ring lerps to cursor
  (function ringLoop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top = ry + "px";
    requestAnimationFrame(ringLoop);
  })();
  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup", () => document.body.classList.remove("cursor-click"));
  document.querySelectorAll("a, button, .card-hover, .tilt-card, .mag-btn").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  /* ── 2. SCROLL PROGRESS BAR (Handled by Lenis below if present) ── */
  const bar = document.createElement("div");
  bar.id = "dp-progress";
  document.body.prepend(bar);
  if (typeof Lenis === 'undefined') { // Fallback if no lenis
    window.addEventListener("scroll", () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = Math.min(pct, 100) + "%";
    });
  }

  /* ── 3. GLOWING BACKGROUND ORBS (hero) ── */
  const hero = document.querySelector("section");
  if (hero) {
    hero.style.position = "relative";
    hero.style.overflow = "hidden";
    const orbData = [
      { size: 400, color: "rgba(98,142,203,.14)", top: "10%", left: "5%", dur: 12 },
      { size: 300, color: "rgba(56,189,248,.1)", top: "60%", left: "75%", dur: 8 },
      { size: 250, color: "rgba(177,201,239,.1)", top: "30%", left: "50%", dur: 14 },
    ];
    orbData.forEach(o => {
      const orb = document.createElement("div");
      orb.className = "dp-orb";
      Object.assign(orb.style, {
        width: o.size + "px", height: o.size + "px",
        background: o.color, top: o.top, left: o.left,
        animationDuration: o.dur + "s", animationDelay: Math.random() * 3 + "s",
      });
      hero.appendChild(orb);
    });
  }

  /* ── 4. 3D TILT CARDS ── */
  function makeTilt(el) {
    el.classList.add("tilt-card", "ripple-host");
    // inject shine layer
    const shine = document.createElement("div");
    shine.className = "tilt-shine";
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.appendChild(shine);

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
      const cy = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${cx * 16}deg) rotateX(${-cy * 10}deg) translateZ(10px)`;
      shine.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(255,255,255,.14) 0%, transparent 60%)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
      el.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)";
      setTimeout(() => el.style.transition = "", 500);
    });
    el.addEventListener("mousemove", () => { el.style.transition = ""; });
  }
  document.querySelectorAll(".glass-card, .card-hover, .member-card").forEach(makeTilt);

  /* ── 5. RIPPLE & TACTILE PRESS ── */
  document.querySelectorAll(".ripple-host, .btn-primary, a[href], .member-card").forEach(el => {
    el.addEventListener("mousedown", () => {
      el.style.transform += " scale(0.96)";
      el.style.transition = "transform 0.1s ease";
    });
    el.addEventListener("mouseup", () => {
      el.style.transform = el.style.transform.replace(" scale(0.96)", "");
      el.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = el.style.transform.replace(" scale(0.96)", "");
    });
    el.addEventListener("click", (e) => {
      const r = el.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "dp-ripple";
      const size = Math.max(r.width, r.height) * 1.5;
      Object.assign(ripple.style, {
        width: size + "px", height: size + "px",
        left: (e.clientX - r.left - size / 2) + "px",
        top: (e.clientY - r.top - size / 2) + "px",
      });
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.style.overflow = "hidden";
      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  /* ── 6. MAGNETIC BUTTONS ── */
  document.querySelectorAll(".btn-primary, nav a[href='join.html']").forEach(btn => {
    btn.classList.add("mag-btn");
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * .25}px, ${dy * .35}px) scale(1.06)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
      btn.style.transform = "translate(0,0) scale(1)";
      setTimeout(() => btn.style.transition = "", 500);
    });
    btn.addEventListener("mousemove", () => { btn.style.transition = ""; });
  });

  /* ── 7. HERO 3D PARALLAX ON MOUSE ── */
  const heroLeft = document.querySelector("#hero .md\\:max-w-\\[70\\%\\]");
  const heroRight = document.querySelector("#hero .md\\:max-w-md");
  
  if (heroLeft && heroRight) {
    document.addEventListener("mousemove", (e) => {
      const cx = (e.clientX / window.innerWidth - 0.5);
      const cy = (e.clientY / window.innerHeight - 0.5);
      
      gsap.to(heroLeft, {
        x: cx * 30,
        y: cy * 20,
        duration: 1.2,
        ease: "power2.out"
      });
      
      gsap.to(heroRight, {
        x: cx * -40,
        y: cy * -30,
        duration: 1.5,
        ease: "power2.out"
      });
    });
  }

  /* ── 8. ANIMATED STAT COUNTERS ── */
  const statEls = document.querySelectorAll(".count-up");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const targetNum = parseFloat(el.getAttribute("data-target"));
      if (isNaN(targetNum)) return;
      const hasDecimals = targetNum % 1 !== 0;
      let start = 0, dur = 2000, startTime = null;
      function animate(ts) {
        if (!startTime) startTime = ts;
        const pct = Math.min((ts - startTime) / dur, 1);
        const ease = 1 - Math.pow(1 - pct, 4); // Quartic ease out
        const current = ease * targetNum;
        el.textContent = hasDecimals ? current.toFixed(2) : Math.round(current);
        if (pct < 1) requestAnimationFrame(animate);
        else el.textContent = hasDecimals ? targetNum.toFixed(2) : targetNum;
      }
      requestAnimationFrame(animate);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ── 9. ICOMAT-STYLE SCROLL REVEALS & LENIS ── */
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // A. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out feeling
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // B. Link Scroll Progress Bar
    const pbar = document.getElementById("dp-progress");
    if (pbar) {
      lenis.on('scroll', ({ progress }) => {
        pbar.style.width = (progress * 100) + "%";
      });
    }

    // C. Masked Text Reveals
    gsap.utils.toArray('.dp-mask-reveal').forEach(el => {
      gsap.fromTo(el, 
        { y: "100%", opacity: 0 },
        {
          y: "0%", 
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // D. Progressive Text Highlights
    gsap.utils.toArray('.progressive-text').forEach(block => {
      // Split text into words dynamically
      const text = block.innerText;
      block.innerHTML = "";
      const words = text.split(/\s+/);
      words.forEach(w => {
        const span = document.createElement("span");
        span.className = "progressive-text-word";
        span.innerText = w + " ";
        block.appendChild(span);
      });

      const wordSpans = block.querySelectorAll('.progressive-text-word');
      const isLight = document.documentElement.classList.contains("light");
      const targetColor = isLight ? "#0f172a" : "#ffffff";
      
      gsap.to(wordSpans, {
        color: targetColor,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 0.5,
        }
      });
    });

    // E. Technical Line Drawings
    gsap.utils.toArray('.tech-line').forEach(line => {
      const isVertical = line.classList.contains('vertical');
      gsap.fromTo(line,
         { scaleX: isVertical ? 1 : 0, scaleY: isVertical ? 0 : 1 },
         {
           scaleX: 1, scaleY: 1,
           duration: 1.5,
           ease: "power3.inOut",
           scrollTrigger: {
             trigger: line,
             start: "top 95%",
           }
         }
      );
    });

    // F. Fallback element reveals
    gsap.utils.toArray('.dp-reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  } else {
    // Standard intersection observer fallback if GSAP/Lenis missing
    document.querySelectorAll("section > div > *:not([data-aos])").forEach(el => {
      el.classList.add("dp-reveal");
    });
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    document.querySelectorAll(".dp-reveal").forEach(el => revealObs.observe(el));
  }

  /* ── 10. GLITCH EFFECT ON LOGO / HERO TITLE ── */
  const glitchTargets = document.querySelectorAll(".text-glow, .font-headline.text-xl");
  glitchTargets.forEach(el => {
    el.classList.add("glitch-host");
    el.dataset.text = el.textContent;
    function triggerGlitch() {
      el.classList.add("glitching");
      setTimeout(() => el.classList.remove("glitching"), 450);
      setTimeout(triggerGlitch, 4000 + Math.random() * 5000);
    }
    setTimeout(triggerGlitch, 2000 + Math.random() * 3000);
  });

  /* ── 11. MOUSE SPARK TRAILS ── */
  const sparkColors = ["#8aaee0", "#38bdf8", "#628ecb", "#b1c9ef"];
  let lastSparkTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSparkTime < 60) return; // throttle
    lastSparkTime = now;
    const spark = document.createElement("div");
    spark.className = "dp-spark";
    spark.style.left = e.clientX + "px";
    spark.style.top = e.clientY + "px";
    spark.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    spark.style.width = (4 + Math.random() * 5) + "px";
    spark.style.height = spark.style.width;
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  });

  /* ── 12. LOGO SPIN CLASS ── */
  document.querySelectorAll("nav img, #page-loader img").forEach(img => {
    img.classList.add("logo-img");
  });

  /* ── 13. NAV LINKS UNDERLINE ANIMATION ── */
  document.querySelectorAll("#main-nav a").forEach(a => a.classList.add("nav-link"));

  /* ── 14. ANNOUNCEMENT CARDS SLIDE ── */
  document.querySelectorAll("section .glass-card").forEach(card => {
    if (card.querySelector(".announce-dot")) card.classList.add("announce-hover");
  });

  /* ── 15. CTA SECTION GLOW PULSE ── */
  const ctaBtn = document.querySelector("section:last-of-type a[href='join.html']");
  if (ctaBtn) ctaBtn.classList.add("cta-pulse");

  /* ── 16. TEAM CARDS FLIP ── */
  document.querySelectorAll(".grid-cols-2.md\\:grid-cols-4 .glass-card").forEach(card => {
    // wrap in flip container
    const name = card.querySelector("h4")?.textContent || "";
    const role = card.querySelector("div.text-\\[10px\\]")?.textContent || "";
    const initials = card.querySelector(".rounded-full")?.textContent?.trim() || "";
    const social = card.querySelector(".flex.justify-center")?.innerHTML || "";

    card.style.minHeight = "200px";

    // back panel
    const back = document.createElement("div");
    back.className = "team-flip-back text-center";
    back.innerHTML = `
      <p class="text-xs text-tertiary leading-relaxed px-2">Passionate about data & technology — building the future one project at a time.</p>
      <div class="flex justify-center gap-2 mt-3">${social}</div>`;
    card.classList.add("team-flip-front");

    const inner = document.createElement("div");
    inner.className = "team-flip-inner";
    const container = document.createElement("div");
    container.className = "team-flip-container h-full";
    card.parentNode.insertBefore(container, card);
    inner.appendChild(card.cloneNode(true));
    inner.appendChild(back);
    container.appendChild(inner);
    card.remove();
  });

  /* ── 17. FLOATING DATA NODES AROUND HERO CARD ── */
  const heroCard = document.querySelector(".animate-float");
  if (heroCard) {
    const nodeLabels = ["CSV", "ML", "API", "SQL", "JSON", "Py"];
    nodeLabels.forEach((label, i) => {
      const node = document.createElement("div");
      node.className = "data-node";
      node.style.setProperty("--orbit-r", (80 + i * 20) + "px");
      node.style.top = "50%";
      node.style.left = "50%";
      node.style.animationDuration = (8 + i * 2) + "s";
      node.style.animationDelay = (i * 1.3) + "s";
      node.innerHTML = `<span style="display:inline-block;padding:2px 7px;border-radius:100px;font-size:9px;font-weight:700;letter-spacing:.08em;color:#8aaee0;border:1px solid rgba(138,174,224,.3);background:rgba(18,39,74,.7);backdrop-filter:blur(6px)">${label}</span>`;
      heroCard.style.position = "relative";
      heroCard.appendChild(node);
    });
  }

  /* ── 18. ENHANCED PARTICLE INTERACTION (mouse repel) ── */
  // Patch existing particle system to react to mouse
  window.__dpMouse = { x: -9999, y: -9999 };
  document.addEventListener("mousemove", e => {
    window.__dpMouse.x = e.clientX;
    window.__dpMouse.y = e.clientY;
  });

  /* ── 19. SKILL ICON HOVER 3D ── */
  document.querySelectorAll(".w-14.h-14.rounded-2xl").forEach(el => {
    el.classList.add("skill-icon-wrap");
  });

  /* ── 20. SECTION ENTRANCE GRADIENT SWEEP ── */
  document.querySelectorAll("section").forEach(sec => {
    const sweep = document.createElement("div");
    Object.assign(sweep.style, {
      position: "absolute", inset: "0",
      background: "linear-gradient(180deg,rgba(138,174,224,.04) 0%,transparent 40%)",
      pointerEvents: "none", zIndex: "0",
    });
    if (getComputedStyle(sec).position === "static") sec.style.position = "relative";
    sec.prepend(sweep);
  });

  /* ── 21. LIVE DATA DEMO CHARTS ── */
  const throughputCanvas = document.getElementById("live-throughput-chart");
  const radarCanvas = document.getElementById("accuracy-radar-chart");

  if (window.Chart && throughputCanvas && radarCanvas) {
    // Theme colors
    const getColors = () => {
      const isLight = document.documentElement.classList.contains("light");
      return {
        text: isLight ? "#0d1b35" : "#dae2fd",
        grid: isLight ? "rgba(31,58,109,0.1)" : "rgba(138,174,224,0.1)",
        primary: isLight ? "rgba(42,91,168,1)" : "rgba(138,174,224,1)",
        primaryFill: isLight ? "rgba(42,91,168,0.2)" : "rgba(138,174,224,0.2)",
        secondary: isLight ? "rgba(21,64,107,1)" : "rgba(56,189,248,1)",
        secondaryFill: isLight ? "rgba(21,64,107,0.2)" : "rgba(56,189,248,0.2)"
      };
    };

    let colors = getColors();

    Chart.defaults.color = colors.text;
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Throughput Line Chart
    const tCtx = throughputCanvas.getContext("2d");
    const throughputData = Array.from({ length: 20 }, () => Math.floor(Math.random() * 500) + 200);
    const throughputLabels = Array.from({ length: 20 }, (_, i) => `-${20 - i}s`);

    const throughputChart = new Chart(tCtx, {
      type: "line",
      data: {
        labels: throughputLabels,
        datasets: [{
          label: "Requests / Sec",
          data: throughputData,
          borderColor: colors.primary,
          backgroundColor: colors.primaryFill,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHitRadius: 10,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'linear' },
        scales: {
          x: { grid: { color: colors.grid, borderColor: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid, borderColor: colors.grid }, ticks: { color: colors.text }, min: 0, max: 1000 }
        },
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }
      }
    });

    // 2. Accuracy Radar Chart
    const rCtx = radarCanvas.getContext("2d");
    const radarChart = new Chart(rCtx, {
      type: "radar",
      data: {
        labels: ["NLP", "Computer Vision", "Clustering", "Regression", "TimeSeries", "Anomaly"],
        datasets: [{
          label: "Confidence %",
          data: [85, 92, 78, 95, 88, 91],
          backgroundColor: colors.secondaryFill,
          borderColor: colors.secondary,
          pointBackgroundColor: colors.secondary,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: colors.grid },
            grid: { color: colors.grid },
            pointLabels: { color: colors.text, font: { size: 11, family: "'Inter', sans-serif" } },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: { legend: { display: false } }
      }
    });

    // Live update logic
    setInterval(() => {
      // Update line chart
      throughputData.shift();
      const base = throughputData[throughputData.length - 1];
      const variance = (Math.random() - 0.5) * 200;
      throughputData.push(Math.max(100, Math.min(900, base + variance)));
      throughputChart.update();

      // Update radar chart (subtle shifts)
      radarChart.data.datasets[0].data = radarChart.data.datasets[0].data.map(val => {
        const change = (Math.random() - 0.5) * 8;
        return Math.max(70, Math.min(99, val + change));
      });
      radarChart.update();
    }, 2000);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          colors = getColors();
          Chart.defaults.color = colors.text;

          throughputChart.data.datasets[0].borderColor = colors.primary;
          throughputChart.data.datasets[0].backgroundColor = colors.primaryFill;
          if (throughputChart.options.scales.x.grid) {
            throughputChart.options.scales.x.grid.color = colors.grid;
            throughputChart.options.scales.x.grid.borderColor = colors.grid;
          }
          if (throughputChart.options.scales.x.ticks) throughputChart.options.scales.x.ticks.color = colors.text;
          if (throughputChart.options.scales.y.grid) {
            throughputChart.options.scales.y.grid.color = colors.grid;
            throughputChart.options.scales.y.grid.borderColor = colors.grid;
          }
          if (throughputChart.options.scales.y.ticks) throughputChart.options.scales.y.ticks.color = colors.text;
          throughputChart.update('none');

          radarChart.data.datasets[0].backgroundColor = colors.secondaryFill;
          radarChart.data.datasets[0].borderColor = colors.secondary;
          radarChart.data.datasets[0].pointBackgroundColor = colors.secondary;
          if (radarChart.options.scales.r.angleLines) radarChart.options.scales.r.angleLines.color = colors.grid;
          if (radarChart.options.scales.r.grid) radarChart.options.scales.r.grid.color = colors.grid;
          if (radarChart.options.scales.r.pointLabels) radarChart.options.scales.r.pointLabels.color = colors.text;
          radarChart.update('none');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  console.log("✨ Data Parse 3D Animations loaded!");
})();

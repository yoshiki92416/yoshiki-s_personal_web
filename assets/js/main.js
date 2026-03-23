/* ============================================================
   MAIN.JS — Yoshiki Takeuchi Personal Website
   iOS 26 Dark Glass Theme
   ============================================================ */


/* ── Active nav highlight ── */
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-link").forEach(link => {
  link.classList.toggle("active", link.getAttribute("href") === currentPath);
});


/* ── Hamburger menu toggle ── */
const navToggle = document.getElementById("nav-toggle");
const mainNav   = document.getElementById("main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}


/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => revealObserver.observe(el));


/* ── Typed text effect (index.html only) ── */
const typedEl = document.getElementById("typed-text");
if (typedEl) {
  const words = [
    "Looking for an Electrical Engineer?",
    "Process Integration",
    "Advanced Packaging",
    "Material Science Engineer"
  ];
  let wordIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const current = words[wordIndex];
    typedEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);
    let delay = deleting ? 40 : 70;
    if (!deleting && charIndex === current.length + 1) { delay = 1800; deleting = true; }
    else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}


/* ── Contact form success + dirty warning ── */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function () {
    setTimeout(() => {
      const banner = document.getElementById("success-banner");
      if (banner) banner.style.display = "block";
    }, 500);
  });
  let formDirty = false;
  contactForm.addEventListener("input", () => formDirty = true);
  contactForm.addEventListener("submit", () => formDirty = false);
  window.addEventListener("beforeunload", (e) => { if (formDirty) e.preventDefault(); });
}


/* ── Copy email to clipboard (contact.html only) ── */
document.querySelectorAll(".contact-card").forEach(card => {
  if (card.href && card.href.includes("mailto")) {
    const spanEl = card.querySelector("span");
    const originalText = spanEl ? spanEl.textContent : "";
    card.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(originalText).then(() => {
        if (spanEl) {
          spanEl.textContent = "✅ Copied!";
          setTimeout(() => spanEl.textContent = originalText, 2000);
        }
        setTimeout(() => window.location.href = card.href, 500);
      }).catch(() => {
        // Fallback: just navigate if clipboard fails
        window.location.href = card.href;
      });
    });
  }
});


/* ── Reading progress bar ── */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0;
  height: 3px; width: 0%;
  background: linear-gradient(to right, #a78bfa, #818cf8);
  z-index: 99999; transition: width 0.1s ease; pointer-events: none;
`;
document.body.appendChild(progressBar);
window.addEventListener("scroll", () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = Math.min(pct, 100) + "%";
});


/* ── Navbar hide on scroll down, show on scroll up ── */
let lastScrollY = 0;
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current > lastScrollY && current > 80) {
      navbar.style.transform = "translateY(-100%)";
      if (mainNav) mainNav.classList.remove("open");
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScrollY = current;
  });
}


/* ── Scroll-to-top button ── */
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.style.cssText = `
  position: fixed; bottom: 2rem; right: 2rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(139,92,246,0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(167,139,250,0.4);
  color: white; font-size: 1.2rem; font-weight: 700;
  cursor: pointer; display: none;
  align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(107,70,193,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 999;
`;
document.body.appendChild(topBtn);
topBtn.addEventListener("mouseenter", () => {
  topBtn.style.transform = "translateY(-3px)";
  topBtn.style.boxShadow = "0 8px 28px rgba(107,70,193,0.7)";
});
topBtn.addEventListener("mouseleave", () => {
  topBtn.style.transform = "translateY(0)";
  topBtn.style.boxShadow = "0 4px 20px rgba(107,70,193,0.5)";
});
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "flex" : "none";
});


/* ── Smooth page transitions ── */
document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.3s ease";
window.addEventListener("load", () => { document.body.style.opacity = "1"; });
document.querySelectorAll("a[href]").forEach(link => {
  const href = link.getAttribute("href");
  if (href && !href.startsWith("http") && !href.startsWith("mailto") &&
      !href.startsWith("tel") && !href.startsWith("#") &&
      !href.startsWith("assets") && link.target !== "_blank") {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.style.opacity = "0";
      setTimeout(() => { window.location.href = href; }, 280);
    });
  }
});


/* ══════════════════════════════════════════════════════════
   FANCY FEATURES — updated for dark glass theme
   ══════════════════════════════════════════════════════════ */


/* ── 1. Mouse cursor spotlight ── */
const spotlight = document.createElement("div");
spotlight.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9998;
  width: 380px; height: 380px; border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.08s ease, top 0.08s ease;
`;
document.body.appendChild(spotlight);
window.addEventListener("mousemove", (e) => {
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top  = e.clientY + "px";
});
if ("ontouchstart" in window) spotlight.style.display = "none";


/* ── 2. Counter animation on numbers ── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    let count    = 0;
    const step   = target / 60;
    const timer  = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = prefix + Math.floor(count) + suffix;
      if (count >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));


/* ── 3. Card tilt effect — works with glass-card class ── */
document.querySelectorAll(".glass-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transition = "transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease";
    card.style.transform  = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease";
    card.style.transform  = "";
  });
});


/* ── 4. Typewriter effect on page banner titles ── */
const pageTitle = document.querySelector(".page-banner h1");
if (pageTitle && !typedEl) {
  const fullText = pageTitle.textContent;
  pageTitle.textContent = "";
  pageTitle.style.borderRight = "3px solid #a78bfa";
  pageTitle.style.animation   = "blink 0.75s step-end infinite";
  let i = 0;
  const titleTimer = setInterval(() => {
    pageTitle.textContent += fullText[i++];
    if (i >= fullText.length) {
      clearInterval(titleTimer);
      setTimeout(() => {
        pageTitle.style.borderRight = "none";
        pageTitle.style.animation   = "none";
      }, 600);
    }
  }, 55);
}


/* ── 5. Time-based greeting (contact.html only) ── */
const greetEl = document.getElementById("contact-greeting");
if (greetEl) {
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning ☀️"
                 : hour < 17 ? "Good afternoon 👋"
                 : hour < 21 ? "Good evening 🌆"
                 :             "Good night 🌙";
  greetEl.textContent = greeting + " — feel free to reach out!";
}


/* ── 6. Live visitor clock (contact.html only) ── */
const timeEl = document.getElementById("visitor-time");
if (timeEl) {
  function updateTime() {
    const now = new Date();
    timeEl.textContent = "Your local time: " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  updateTime();
  setInterval(updateTime, 1000);
}


/* ── 7. Konami code easter egg 🎮 ── */
const konamiCode = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a"
];
let konamiIndex = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      launchConfetti();
      setTimeout(() => showEasterEgg(), 300);
    }
  } else {
    konamiIndex = 0;
  }
});

function launchConfetti() {
  const colors = ["#a78bfa", "#818cf8", "#c4b5fd", "#6d28d9", "#ffffff"];
  for (let i = 0; i < 100; i++) {
    const dot = document.createElement("div");
    const size = Math.random() * 8 + 4;
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 99999;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      left: ${Math.random() * 100}vw;
      top: -10px; opacity: 1;
    `;
    document.body.appendChild(dot);
    const duration = Math.random() * 2000 + 1500;
    const xDrift   = (Math.random() - 0.5) * 200;
    dot.animate([
      { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(105vh) translateX(${xDrift}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration, easing: "ease-in" }).onfinish = () => dot.remove();
  }
}

function showEasterEgg() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99998;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
  `;
  overlay.innerHTML = `
    <div style="
      background: rgba(15,15,25,0.95);
      border: 1px solid rgba(167,139,250,0.3);
      border-radius: 24px; padding: 2.5rem 3rem;
      text-align: center; max-width: 420px; margin: 1rem;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(107,70,193,0.3);
      backdrop-filter: blur(20px);
    ">
      <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
      <h2 style="font-family:'DM Serif Display',serif; font-size:1.6rem; color:#c4b5fd; margin-bottom:0.75rem;">
        You found the Easter Egg!
      </h2>
      <p style="color:rgba(255,255,255,0.55); font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">
        Impressive! You know the Konami Code 🕹️<br>
        Thanks for exploring — you'd make a great teammate.
      </p>
      <button onclick="this.closest('div').parentElement.remove()" style="
        background: rgba(139,92,246,0.85);
        border: 1px solid rgba(167,139,250,0.4);
        color: white; padding: 0.75rem 2rem;
        border-radius: 100px; font-size: 0.95rem; font-weight: 600;
        cursor: pointer; font-family: 'DM Sans', sans-serif;
        box-shadow: 0 4px 20px rgba(107,70,193,0.4);
      ">Nice! Close ✕</button>
    </div>
  `;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}


/* ══════════════════════════════════════════════════════════
   ADDITIONAL FANCY FEATURES — iOS 26 Glass Theme
   ══════════════════════════════════════════════════════════ */


/* ── 1. Particle network background ── */
(function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
    opacity: 0.35;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext("2d");

  let W, H, particles;
  const COUNT  = 55;
  const RADIUS = 130;
  const COLORS = ["rgba(167,139,250,", "rgba(129,140,248,", "rgba(196,181,253,"];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.8 + 0.8,
      c:  COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const alpha = (1 - dist / RADIUS) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + "0.7)";
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();




/* ── 3. Magnetic buttons ── */
document.querySelectorAll(".btn-glass-primary, .btn-glass-outline, .submit-btn").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const pull   = 0.3;
    btn.style.transform   = `translate(${x * pull}px, ${y * pull}px)`;
    btn.style.transition  = "transform 0.1s ease";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform  = "";
    btn.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
  });
});


/* ── 4. Staggered card entrance ── */
(function staggerCards() {
  const cards = document.querySelectorAll(".glass-card");
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
})();


/* ── 5. Hire me floating CTA ── */
(function initHireCTA() {
  const cta = document.createElement("a");
  cta.href = "contact.html";
  cta.innerHTML = "💼 Open to opportunities →";
  cta.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: rgba(139,92,246,0.8);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(167,139,250,0.4);
    color: white; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    padding: 0.65rem 1.5rem; border-radius: 100px;
    text-decoration: none; white-space: nowrap;
    box-shadow: 0 8px 30px rgba(107,70,193,0.5);
    transition: transform 0.4s cubic-bezier(0.34,1.2,0.64,1),
                opacity 0.4s ease, box-shadow 0.2s ease;
    opacity: 0; z-index: 998;
    pointer-events: none;
  `;
  document.body.appendChild(cta);

  // Don't show on contact page
  if (currentPath === "contact.html") return;

  let shown = false;
  window.addEventListener("scroll", () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (pct > 0.35 && !shown) {
      shown = true;
      cta.style.opacity        = "1";
      cta.style.pointerEvents  = "auto";
      cta.style.transform      = "translateX(-50%) translateY(0)";
    } else if (pct <= 0.35 && shown) {
      shown = false;
      cta.style.opacity       = "0";
      cta.style.pointerEvents = "none";
      cta.style.transform     = "translateX(-50%) translateY(80px)";
    }
  });

  cta.addEventListener("mouseenter", () => {
    cta.style.boxShadow = "0 12px 40px rgba(107,70,193,0.7)";
    cta.style.transform = "translateX(-50%) translateY(-2px)";
  });
  cta.addEventListener("mouseleave", () => {
    cta.style.boxShadow = "0 8px 30px rgba(107,70,193,0.5)";
    cta.style.transform = "translateX(-50%) translateY(0)";
  });
})();


/* ── 6. Image blur-up lazy loading ── */
document.querySelectorAll("img").forEach(img => {
  if (img.complete) return; // already loaded
  img.style.filter     = "blur(8px)";
  img.style.transition = "filter 0.6s ease";
  img.addEventListener("load", () => {
    img.style.filter = "blur(0)";
  });
});


/* ── 7. "Welcome back" on return visits ── */
(function checkReturn() {
  const key   = "yt_visit_count";
  const count = parseInt(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, count);

  if (count > 1 && currentPath === "index.html") {
    const badge = document.createElement("div");
    badge.textContent = count === 2 ? "Welcome back 👋" : `Visit #${count} — thanks for returning! 🙌`;
    badge.style.cssText = `
      position: fixed; top: 5rem; right: 1.5rem;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.6);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem; font-weight: 500;
      padding: 0.5rem 1rem; border-radius: 100px;
      z-index: 500; opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    `;
    document.body.appendChild(badge);
    setTimeout(() => { badge.style.opacity = "1"; }, 1200);
    setTimeout(() => { badge.style.opacity = "0"; }, 5000);
    setTimeout(() => badge.remove(), 5600);
  }
})();



/* ── Photo strip lightbox ── */
(function initLightbox() {
  // Build the modal once and reuse it
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(16px);
    display: none; align-items: center; justify-content: center;
    cursor: zoom-out;
    padding: 1.5rem;
  `;

  const modalImg = document.createElement("img");
  modalImg.style.cssText = `
    max-width: 90vw; max-height: 85vh;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 30px 80px rgba(0,0,0,0.8),
                0 0 40px rgba(107,70,193,0.2);
    object-fit: contain;
    animation: lightboxIn 0.3s cubic-bezier(0.34,1.2,0.64,1);
  `;

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = `
    position: absolute; top: 1.25rem; right: 1.25rem;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
    width: 36px; height: 36px; border-radius: 50%;
    font-size: 0.9rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
  `;
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "rgba(255,255,255,0.15)";
    closeBtn.style.color = "#fff";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "rgba(255,255,255,0.08)";
    closeBtn.style.color = "rgba(255,255,255,0.7)";
  });

  // Caption
  const caption = document.createElement("p");
  caption.style.cssText = `
    position: absolute; bottom: 1.5rem; left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.4);
    font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  `;

  // Keyframe animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes lightboxIn {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  modal.appendChild(modalImg);
  modal.appendChild(closeBtn);
  modal.appendChild(caption);
  document.body.appendChild(modal);

  // Close on background or button click
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  closeBtn.addEventListener("click", closeModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Attach to all photo strip images
  function attachLightbox() {
    document.querySelectorAll(".photo-strip img").forEach(img => {
      if (img.dataset.lightbox) return; // already attached
      img.dataset.lightbox = "true";
      img.addEventListener("click", () => {
        modalImg.src = img.src;
        caption.textContent = img.alt || "";
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    });
  }

  // Run on load and after any dynamic content
  attachLightbox();
  window.addEventListener("load", attachLightbox);
})();
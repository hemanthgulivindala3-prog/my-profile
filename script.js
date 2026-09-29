/* ============================================================
   HEMANTH GULIVINDULA – PORTFOLIO JAVASCRIPT
   Animations, interactions, scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor  = document.getElementById('cursor');
  const trail   = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.transform = `translate(${trailX - 15}px, ${trailY - 15}px)`;
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .skill-card, .proj-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform += ' scale(2)'; trail.style.opacity = '0.2'; });
    el.addEventListener('mouseleave', () => { trail.style.opacity = '0.5'; });
  });

  /* ── NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  });

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  /* ── TYPED TEXT ── */
  const roles = [
    'Full Stack Applications',
    'React & Angular UIs',
    'Node.js / NestJS APIs',
    'AI / LLM Workflows',
    'Cloud CI/CD Pipelines',
    'Scalable Web Solutions'
  ];
  let ri = 0, ci = 0, deleting = false;
  const typedEl = document.getElementById('typedText');

  function type() {
    const role = roles[ri];
    if (!deleting) {
      typedEl.textContent = role.slice(0, ++ci);
      if (ci === role.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      typedEl.textContent = role.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particlesCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '139,92,246' : '20,184,166';
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 40);
  }

  /* ── SCROLL REVEAL + COUNTERS + SKILL BARS ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Counters
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);

      // Skill bars
      entry.target.querySelectorAll('.sk-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.style.getPropertyValue('--w'); }, 200);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Also observe hero stats for counter
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  /* ── SKILL TABS ── */
  document.querySelectorAll('.stab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) {
        panel.classList.add('active');
        // Animate skill bars in newly shown panel
        panel.querySelectorAll('.sk-fill').forEach(bar => {
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = bar.style.getPropertyValue('--w'); }, 100);
        });
      }
    });
  });

  /* ── PROJECT FILTERS ── */
  const filterBtns = document.querySelectorAll('.pf-btn');
  const projCards  = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── CONTACT FORM ── */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('cSubmit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        formMsg.textContent = '✅ Message sent! Hemanth will get back to you soon.';
        formMsg.className = 'form-msg success';
        form.reset();
        btn.textContent = 'Send Message 🚀';
        btn.disabled = false;
        setTimeout(() => { formMsg.className = 'form-msg'; }, 5000);
      }, 1500);
    });
  }

  /* ── BACK TO TOP ── */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── SMOOTH SCROLL for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── INITIAL SKILL BAR ANIMATION (first visible panel) ── */
  document.querySelectorAll('#panel-frontend .sk-fill').forEach(bar => {
    bar.style.width = bar.style.getPropertyValue('--w');
  });

  /* ── TILT EFFECT on project cards ── */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      card.style.transform = `perspective(800px) rotateY(${x / 30}deg) rotateX(${-y / 30}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});

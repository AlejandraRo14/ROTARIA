/* ROTARIA MUSIC FEST 2026 — interacciones y animaciones */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tactil = window.matchMedia('(hover: none)').matches;

  /* 1. Letras del logo entran una por una */
  document.querySelectorAll('[data-split]').forEach((linea, n) => {
    const texto = linea.textContent;
    linea.textContent = '';
    [...texto].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'letra';
      s.style.setProperty('--i', i + n * 7);
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.setAttribute('aria-hidden', 'true');
      linea.appendChild(s);
    });
  });

  /* 2. Ecualizador */
  const eq = document.querySelector('.eq');
  if (eq) {
    const barras = Math.min(64, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < barras; i++) {
      const b = document.createElement('span');
      // más alto en el centro, como una tarima
      const centro = 1 - Math.abs(i / (barras - 1) - 0.5) * 1.3;
      b.style.setProperty('--h', (0.25 + Math.random() * 0.75 * centro).toFixed(2));
      b.style.setProperty('--t', (0.45 + Math.random() * 0.8).toFixed(2) + 's');
      b.style.setProperty('--d', (-Math.random() * 2).toFixed(2) + 's');
      eq.appendChild(b);
    }
  }

  /* 3. Marcas del reloj (24 h) */
  const marcas = document.querySelector('.reloj-marcas');
  if (marcas) {
    for (let h = 0; h < 24; h++) {
      const a = (h / 24) * Math.PI * 2;
      const largo = h % 6 === 0 ? 8 : 4;
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', 60 + Math.sin(a) * 40);
      l.setAttribute('y1', 60 - Math.cos(a) * 40);
      l.setAttribute('x2', 60 + Math.sin(a) * (40 - largo));
      l.setAttribute('y2', 60 - Math.cos(a) * (40 - largo));
      marcas.appendChild(l);
    }
  }

  /* 4. Nav sólida y parallax con el scroll */
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.hero');
  let ticking = false;
  const alScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('solida', y > 40);
    if (!reducido && y < window.innerHeight * 1.2) hero.style.setProperty('--scroll', y);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(alScroll); ticking = true; }
  }, { passive: true });
  alScroll();

  /* 5. Mouse en el hero: foco de luz, estrellas en parallax, estrella inclinada */
  const stars = document.querySelector('.stars');
  const wrap = document.querySelector('.estrella-wrap');
  if (!reducido && !tactil) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      stars.style.setProperty('--tx', ((px - 0.5) * -40).toFixed(1));
      stars.style.setProperty('--ty', ((py - 0.5) * -40).toFixed(1));
      wrap.style.setProperty('--ry', ((px - 0.5) * 24).toFixed(1) + 'deg');
      wrap.style.setProperty('--rx', ((py - 0.5) * -24).toFixed(1) + 'deg');
    });
    hero.addEventListener('pointerleave', () => {
      ['--tx', '--ty'].forEach(p => stars.style.setProperty(p, 0));
      ['--rx', '--ry'].forEach(p => wrap.style.setProperty(p, '0deg'));
    });
  }

  /* 6. Lluvia de estrellas al hacer clic */
  const colores = ['var(--humo)', 'var(--gris)', 'var(--rojo-luz)', 'var(--humo)'];
  function chispas(x, y, cantidad = 18, fuerza = 1) {
    if (reducido) return;
    for (let i = 0; i < cantidad; i++) {
      const c = document.createElement('span');
      c.className = 'chispa';
      const s = 8 + Math.random() * 22;
      c.style.setProperty('--s', s + 'px');
      c.style.setProperty('--c', colores[i % colores.length]);
      document.body.appendChild(c);
      const ang = Math.random() * Math.PI * 2;
      const dist = (90 + Math.random() * 180) * fuerza;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const giro = (Math.random() - 0.5) * 720;
      c.animate([
        { transform: `translate(${x - s / 2}px, ${y - s / 2}px) scale(.3) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x + dx * .7 - s / 2}px, ${y + dy * .7 - s / 2}px) scale(1) rotate(${giro * .6}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${x + dx - s / 2}px, ${y + dy + 80 - s / 2}px) scale(.2) rotate(${giro}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(.22,1,.36,1)' })
       .onfinish = () => c.remove();
    }
  }

  const estrella = document.querySelector('.estrella');
  const activarEstrella = (e) => {
    const r = estrella.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    chispas(x, y, 36, 1.6);
  };
  estrella.addEventListener('click', activarEstrella);
  estrella.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activarEstrella({}); }
  });

  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      chispas(r.left + r.width / 2, r.top + r.height / 2, 14, .8);
      btn.classList.remove('gira'); void btn.offsetWidth; btn.classList.add('gira');
    });
    btn.addEventListener('animationend', (e) => {
      if (e.animationName === 'giroClick') btn.classList.remove('gira');
    });
  });

  /* 7. Luz que sigue al cursor dentro de las tarjetas del cartel */
  document.querySelectorAll('.day').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    });
  });

  /* 8. Revelado escalonado al hacer scroll */
  const grupos = ['.days', '.info-grid', '.manillas'];
  grupos.forEach(sel => {
    document.querySelectorAll(sel + ' > .revela').forEach((el, i) => el.style.setProperty('--i', i));
  });
  const revelables = document.querySelectorAll('.revela');
  if ('IntersectionObserver' in window && !reducido) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    revelables.forEach(el => io.observe(el));
  } else {
    revelables.forEach(el => el.classList.add('visible'));
  }
})();

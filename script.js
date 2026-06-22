// =========================================================
// Instituto do Olho Seco — interactions
// =========================================================
(() => {
  'use strict';

  // ---------- Year ----------
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ---------- Sticky header shadow on scroll ----------
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Mobile nav ----------
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      menu.classList.toggle('is-open', !open);
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      });
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    reveals.forEach((el) => {
      const d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--reveal-delay', `${d}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Carousel ----------
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const viewport = root.querySelector('[data-carousel-viewport]');
    const track = root.querySelector('[data-carousel-track]');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const progressBar = root.querySelector('[data-carousel-progress]');
    if (!viewport || !track) return;

    const cardWidth = () => {
      const first = track.children[0];
      if (!first) return 320;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '20');
      return first.getBoundingClientRect().width + gap;
    };

    const updateProgress = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const pct = max > 0 ? (viewport.scrollLeft / max) * 100 : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= max - 4;
    };

    prevBtn?.addEventListener('click', () => {
      viewport.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      viewport.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
    viewport.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  });

  // ---------- Contact form (placeholder) ----------
  const form = document.getElementById('contact-form');
  if (form) {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.querySelector('#nome').value.trim();
      const sobrenome = form.querySelector('#sobrenome').value.trim();
      const email = form.querySelector('#email').value.trim();
      const telefone = form.querySelector('#telefone').value.trim();
      const mensagem = form.querySelector('#mensagem').value.trim();
      const consent = form.querySelector('input[type=checkbox]').checked;

      if (!nome || !sobrenome || !email || !telefone || !mensagem || !consent) {
        if (status) {
          status.textContent = 'Por favor, preencha todos os campos obrigatórios.';
          status.setAttribute('data-state', 'error');
        }
        return;
      }
      if (status) {
        status.textContent = 'Recebemos sua mensagem! Em até 24h úteis entraremos em contato.';
        status.setAttribute('data-state', 'success');
      }
      form.reset();
    });
  }

  // ---------- Smooth scroll fix for sticky header ----------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight || 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  });
})();

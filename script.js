(function () {
  var TESTIMONIALS_DATA = [
    {
      name: "Ana Paula M.",
      rating: 5,
      source: "Google",
      text: "Convivia com olho seco há anos. Já testei vários colírios sem resultado duradouro. Após o tratamento IPL no Instituto, a melhora foi incrível desde a primeira sessão.",
      featured: true
    },
    {
      name: "Carlos R.",
      rating: 5,
      source: "Google",
      text: "O diagnóstico foi muito completo, com vários exames que outros lugares não fazem. Me explicaram exatamente a causa do meu problema e o tratamento foi certeiro."
    },
    {
      name: "Marina S.",
      rating: 5,
      source: "Google",
      text: "Trabalhando no computador o dia todo, meus olhos ficavam vermelhos e doíam muito. Depois do IPL, consigo trabalhar sem desconforto. Recomendo demais o Instituto."
    },
    {
      name: "Roberto F.",
      rating: 5,
      source: "Google",
      text: "Equipe muito atenciosa e profissional. O atendimento humanizado faz toda a diferença. Finalmente encontrei um lugar que trata o problema de verdade."
    },
    {
      name: "Patrícia L.",
      rating: 5,
      source: "Google",
      text: "Desde a primeira consulta fui muito bem atendida. O protocolo de tratamento é sério e os resultados aparecem. Meus olhos estão muito melhor!"
    },
    {
      name: "Eduardo B.",
      rating: 5,
      source: "Google",
      text: "Levei anos tentando tratar meu olho seco com colírios. O IPL mudou completamente minha qualidade de vida. Estrutura impecável e médicos excelentes."
    }
  ];

  function initials(name) {
    var parts = name.trim().split(/\s+/);
    return ((parts[0]||"")[0] + (parts.length > 1 ? parts[parts.length-1][0] : "")).toUpperCase();
  }

  function starsHTML(rating) {
    var h = "";
    for (var i = 0; i < 5; i++) {
      h += '<svg viewBox="0 0 24 24">' + (i < rating
        ? '<path d="M12 2l2.9 6.26 6.9.6-5.2 4.6 1.6 6.74L12 16.9 5.8 20.2l1.6-6.74-5.2-4.6 6.9-.6L12 2z"/>'
        : '<path d="M12 2l2.9 6.26 6.9.6-5.2 4.6 1.6 6.74L12 16.9 5.8 20.2l1.6-6.74-5.2-4.6 6.9-.6L12 2z" fill-opacity="0.2"/>') + '</svg>';
    }
    return h;
  }

  function esc(str) { var d = document.createElement("div"); d.textContent = str; return d.innerHTML; }

  var featuredData = TESTIMONIALS_DATA.find(function(t){ return t.featured; }) || TESTIMONIALS_DATA[0];
  document.getElementById("testiFeatured").innerHTML =
    '<blockquote>' + esc(featuredData.text) + '</blockquote>' +
    '<div class="testi-featured-footer">' +
      '<div class="testi-avatar">' + initials(featuredData.name) + '</div>' +
      '<div><div class="testi-featured-name">' + esc(featuredData.name) + '</div>' +
      '<div class="testi-stars">' + starsHTML(featuredData.rating) + '</div></div>' +
    '</div>';

  var track = document.getElementById("testiTrack");
  var dotsWrap = document.getElementById("testiDots");
  TESTIMONIALS_DATA.forEach(function(t) {
    var card = document.createElement("div");
    card.className = "testi-card";
    card.innerHTML =
      '<div class="testi-stars">' + starsHTML(t.rating) + '</div>' +
      '<p class="testi-card-text">' + esc(t.text) + '</p>' +
      '<div class="testi-card-footer">' +
        '<div class="testi-avatar">' + initials(t.name) + '</div>' +
        '<div><div class="testi-card-name">' + esc(t.name) + '</div>' +
        (t.source ? '<div class="testi-card-source">via ' + esc(t.source) + '</div>' : '') +
        '</div></div>';
    track.appendChild(card);
  });

  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  var cards = Array.prototype.slice.call(track.children);
  var currentIndex = 0;
  var perView = getPerView();
  var autoplayTimer = null;

  function getPerView() {
    var w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }
  function totalPages() { return Math.max(1, cards.length - perView + 1); }
  function buildDots() {
    dotsWrap.innerHTML = "";
    for (var i = 0; i < totalPages(); i++) {
      var dot = document.createElement("button");
      dot.className = "testi-dot" + (i === currentIndex ? " is-active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir para depoimento " + (i+1));
      dot.addEventListener("click", (function(idx){ return function(){ goTo(idx); restartAutoplay(); }; })(i));
      dotsWrap.appendChild(dot);
    }
  }
  function updateDots() {
    var dots = dotsWrap.children;
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("is-active", i === currentIndex);
  }
  function getGap() {
    var g = parseFloat(window.getComputedStyle(track).getPropertyValue("gap") || "20");
    return isNaN(g) ? 20 : g;
  }
  function goTo(index) {
    var max = totalPages() - 1;
    if (index < 0) index = max;
    if (index > max) index = 0;
    currentIndex = index;
    var w = cards[0].getBoundingClientRect().width;
    track.style.transform = "translateX(-" + currentIndex * (w + getGap()) + "px)";
    updateDots();
  }
  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }
  function startAutoplay() { autoplayTimer = setInterval(next, 5000); }
  function stopAutoplay() { clearInterval(autoplayTimer); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  prevBtn.addEventListener("click", function(){ prev(); restartAutoplay(); });
  nextBtn.addEventListener("click", function(){ next(); restartAutoplay(); });
  document.querySelector(".testi-section .testi-carousel").addEventListener("mouseenter", stopAutoplay);
  document.querySelector(".testi-section .testi-carousel").addEventListener("mouseleave", startAutoplay);

  var tx = 0, ty = 0, sw = false;
  track.addEventListener("touchstart", function(e){ tx = e.touches[0].clientX; ty = e.touches[0].clientY; sw = false; stopAutoplay(); }, {passive:true});
  track.addEventListener("touchmove", function(e){ var dx=e.touches[0].clientX-tx, dy=e.touches[0].clientY-ty; if(Math.abs(dx)>Math.abs(dy)) sw=true; }, {passive:true});
  track.addEventListener("touchend", function(e){ if(sw){ var d=e.changedTouches[0].clientX-tx; if(d>35)prev(); else if(d<-35)next(); } startAutoplay(); }, {passive:true});

  var rt;
  window.addEventListener("resize", function(){
    clearTimeout(rt);
    rt = setTimeout(function(){
      var nv = getPerView();
      if (nv !== perView){ perView = nv; currentIndex = 0; buildDots(); }
      goTo(currentIndex);
    }, 150);
  });

  buildDots();
  goTo(0);
  startAutoplay();
})();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  // Menu mobile
  function toggleMenu(btn) {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    const links = document.querySelector('.nav__links');
    const cta   = document.querySelector('.nav__cta');
    if (!expanded) {
      links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:rgba(25,41,56,.98);padding:24px;gap:20px;z-index:99;border-bottom:1px solid rgba(255,255,255,.08)';
      cta.style.cssText   = 'display:flex;justify-content:center;padding:0 24px 24px;position:absolute;top:calc(68px + ' + links.offsetHeight + 'px);left:0;right:0;background:rgba(25,41,56,.98);z-index:99';
    } else {
      links.removeAttribute('style');
      cta.removeAttribute('style');
    }
  }

  // Fechar menu ao clicar em link
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => {
      const btn = document.querySelector('.nav__hamburger');
      if (btn && btn.getAttribute('aria-expanded') === 'true') toggleMenu(btn);
    });
  });

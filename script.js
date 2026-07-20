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

  // ─────────────────────────────────────────────────────────────
  // FAQ (Perguntas frequentes) — acordeão
  // ─────────────────────────────────────────────────────────────
  (function () {
    var FAQ_DATA = [
      {
        question: "Como posso saber se tenho olho seco?",
        answer: "Os sintomas de olho seco incluem ressecamento, vermelhidão, ardência ou coceira nos olhos, e às vezes visão embaçada. No entanto, esses sinais também podem indicar outras condições. O ideal é agendar uma consulta com um especialista para um diagnóstico preciso."
      },
      {
        question: "Existe cura para o olho seco?",
        answer: "Os tratamentos para olho seco aliviam os sintomas e evitam que o quadro se agrave ou se torne crônico. Porém, como geralmente é causado por fatores externos, sempre existe a possibilidade de o problema retornar no futuro."
      },
      {
        question: "Quanto custa o tratamento de olho seco?",
        answer: "O valor varia de acordo com a gravidade do caso e os procedimentos ou produtos necessários para tratar os sintomas. Um especialista pode indicar as melhores opções de tratamento e os respectivos valores na consulta."
      },
      {
        question: "Como posso prevenir o olho seco?",
        answer: "Algumas medidas ajudam a reduzir o risco, como limpar e massagear regularmente a margem das pálpebras, usar umidificador de ar, fazer pausas durante o uso prolongado de telas, optar por óculos em vez de lentes de contato e evitar a exposição direta a correntes de ar."
      },
      {
        question: "O tratamento dói?",
        answer: "A maioria dos procedimentos é indolor ou causa apenas um leve desconforto temporário. Nossa equipe explica cada etapa antes de iniciar e ajusta o atendimento ao seu nível de conforto."
      },
      {
        question: "Qual o melhor tratamento para olho seco?",
        answer: "Não existe um único melhor tratamento para olho seco - o que funciona melhor depende da causa (se falta água na lágrima, se falta gordura, se há inflamação.etc) e da gravidade do caso, e por isso a avaliação com um oftalmologista especialista no assunto é muito importante."
      },
      {
        question: "Quais tecnologias são usadas para tratar olho seco?",
        answer: "Até pouco atrás, o tratamento do olho seco se resumia a pingar colírio. Hoje, contamos com equipamentos e exames de alta tecnologia que ajudam a tratar de forma mais direcionada - não apenas aliviar o sintoma. Tecnologia como Luz Intensa Pulsada - IPL, Termopulsação com radiofrequência, Lentes Esclerais, Tampões lacrimais, Soro Autológo e colírios de última geração estão disponíveis."
      },
      {
        question: "Como funciona o tratamento IPL para tratar olho seco?",
        answer: "O ponto chave é que o IPL funciona melhor quando o olho seco é causado por disfunções das glândulas de Meibômio - por isso a avaliação com exames específicos é o que garante que o tratamento vai realmente resolver a causa do problema, e não só aliviar o sintomo por um tempo."
      }
    ];

    function escapeHTML(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    var chevronSVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

    var list = document.getElementById("faqList");
    if (!list) return;

    FAQ_DATA.forEach(function (item, index) {
      var faqItem = document.createElement("div");
      faqItem.className = "faq-item";

      var qid = "faq-q-" + index;
      var aid = "faq-a-" + index;

      faqItem.innerHTML =
        '<button class="faq-question" id="' + qid + '" aria-expanded="false" aria-controls="' + aid + '" type="button">' +
          '<span>' + escapeHTML(item.question) + '</span>' +
          '<span class="faq-icon">' + chevronSVG + '</span>' +
        '</button>' +
        '<div class="faq-answer-wrap" id="' + aid + '" role="region" aria-labelledby="' + qid + '">' +
          '<div class="faq-answer"><p>' + escapeHTML(item.answer) + '</p></div>' +
        '</div>';

      list.appendChild(faqItem);
    });

    var items = Array.prototype.slice.call(list.children);

    function closeItem(item) {
      item.classList.remove("is-open");
      var btn = item.querySelector(".faq-question");
      var wrap = item.querySelector(".faq-answer-wrap");
      btn.setAttribute("aria-expanded", "false");
      wrap.style.maxHeight = "0px";
    }

    function openItem(item) {
      item.classList.add("is-open");
      var btn = item.querySelector(".faq-question");
      var wrap = item.querySelector(".faq-answer-wrap");
      btn.setAttribute("aria-expanded", "true");
      wrap.style.maxHeight = wrap.scrollHeight + "px";
    }

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          if (other !== item) closeItem(other);
        });
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });
    });

    var resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        var openItemEl = list.querySelector(".faq-item.is-open");
        if (openItemEl) {
          var wrap = openItemEl.querySelector(".faq-answer-wrap");
          wrap.style.maxHeight = wrap.scrollHeight + "px";
        }
      }, 150);
    });

    if (items.length > 0) {
      openItem(items[0]);
    }
  })();

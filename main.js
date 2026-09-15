/* MOTION FILMS v2 — main.js
   No custom cursor. No film-HUD. Editorial rail instead.
   GSAP + ScrollTrigger + Lenis.
*/
(function(){
  'use strict';

  // Force scroll to top on every page load — browser default restores position
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  var EASE = 'power3.out';
  var lenis = null;

  function $(s,c){ return (c||document).querySelector(s); }
  function $$(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
  function pad(n,l){ return String(n).padStart(l||2,'0'); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }


  /* ---------- SMOOTH SCROLL ---------- */
  function initScroll(){
    if (REDUCED || typeof window.Lenis === 'undefined') return;
    lenis = new Lenis({ duration:1.15, lerp:.085, smoothWheel:true, wheelMultiplier:1, touchMultiplier:1.6 });
    lenis.on('scroll', function(){ if (window.ScrollTrigger) ScrollTrigger.update(); });
    if (hasGSAP){
      gsap.ticker.add(function(t){ lenis.raf(t*1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(t){ lenis.raf(t); requestAnimationFrame(raf); });
    }
    $$('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href'); if (!id || id === '#') return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault(); closeMenu();
        lenis.scrollTo(t, { offset:0, duration:1.4 });
      });
    });
  }


  /* ---------- LOADER ---------- */
  function initLoader(onDone){
    var loader = $('#loader');
    if (!loader){ onDone(); return; }

    var seen = false;
    try { seen = sessionStorage.getItem('mf_seen') === '1'; } catch(e){}
    var skip = /[?&]noloader=1/.test(location.search);

    if (REDUCED || !hasGSAP || seen || skip){
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      onDone(); return;
    }

    try { sessionStorage.setItem('mf_seen','1'); } catch(e){}
    document.body.classList.add('is-loading');

    // fail-safe: never trap the site behind the loader
    var safety = setTimeout(function(){ finish(); }, 5000);

    var barEl = $('#loaderBar');
    var pctEl = $('#loaderPct');
    var markEl = $('.loader__mark img');
    var progress = { v:0 };
    var tl = gsap.timeline({ onComplete: finish });

    tl.to(markEl, { opacity:1, y:0, duration:.55, ease:EASE })
      .to(progress, {
        v:100, duration:1.6, ease:'power2.inOut',
        onUpdate: function(){
          if (barEl) barEl.style.width = progress.v + '%';
          if (pctEl) pctEl.textContent = pad(Math.round(progress.v));
        }
      }, '-=0.2')
      .to('.loader__pane--l', { xPercent:-100, duration:.85, ease:'expo.inOut' }, '+=0.1')
      .to('.loader__pane--r', { xPercent:100, duration:.85, ease:'expo.inOut' }, '<')
      .to('.loader__inner', { opacity:0, duration:.35, ease:'power2.in' }, '<0.15');

    var finished = false;
    function finish(){
      if (finished) return; finished = true;
      clearTimeout(safety);
      if (tl) tl.kill();
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      onDone();
    }
  }


  /* ---------- EDITORIAL RAIL ---------- */
  function initRail(){
    var rail = $('#rail');
    if (rail){
      if (REDUCED || !hasGSAP) rail.style.opacity = 1;
      else gsap.to(rail, { opacity:1, duration:1, delay:.25, ease:EASE });
    }

    var barEl = $('#railBar');
    var idxEl = $('#railIdx');
    var labelEl = $('#railLabel');
    var quoteEl = $('#railQuote');
    var yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

    function updateProgress(){
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      if (barEl) barEl.style.height = (p * 100).toFixed(1) + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive:true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    if (hasGSAP && window.ScrollTrigger){
      $$('[data-rail]').forEach(function(el){
        var idx = el.getAttribute('data-rail');
        var lbl = el.getAttribute('data-rail-label') || '';
        var q = el.getAttribute('data-rail-quote') || '';
        ScrollTrigger.create({
          trigger: el, start:'top 60%', end:'bottom 40%',
          onToggle: function(self){
            if (!self.isActive) return;
            if (idxEl) idxEl.textContent = idx;
            if (labelEl) labelEl.textContent = lbl;
            if (quoteEl) quoteEl.textContent = q;
          }
        });
      });
    }
  }


  /* ---------- SPLITTING + REVEALS ---------- */
  function splitWords(el){
    if (el.dataset.split === '1') return;
    var text = el.textContent.trim();
    el.textContent = '';
    text.split(/\s+/).forEach(function(w,i,arr){
      var o = document.createElement('span'); o.className='word';
      var s = document.createElement('span'); s.textContent = w + (i < arr.length-1 ? '\u00A0' : '');
      o.appendChild(s); el.appendChild(o);
    });
    el.dataset.split = '1';
  }

  function initReveals(){
    if (REDUCED || !hasGSAP || !window.ScrollTrigger) return;

    var heroLines = $$('#hero [data-reveal-lines] .line > span');
    gsap.set(heroLines, { yPercent:115 });

    $$('[data-reveal-words]').forEach(function(el){
      splitWords(el);
      var inners = $$('.word > span', el);
      gsap.set(inners, { yPercent:115 });
      ScrollTrigger.create({
        trigger:el, start:'top 82%', once:true,
        onEnter: function(){ gsap.to(inners, { yPercent:0, duration:1.05, ease:EASE, stagger:.045 }); }
      });
    });

    $$('[data-reveal-lines]').forEach(function(el){
      if (el.closest('#hero')) return;
      var inners = $$('.line > span', el);
      gsap.set(inners, { yPercent:115 });
      ScrollTrigger.create({
        trigger:el, start:'top 82%', once:true,
        onEnter: function(){ gsap.to(inners, { yPercent:0, duration:1.1, ease:EASE, stagger:.1 }); }
      });
    });

    $$('[data-reveal]').forEach(function(el){
      gsap.set(el, { y:22, opacity:0 });
      ScrollTrigger.create({
        trigger:el, start:'top 88%', once:true,
        onEnter: function(){ gsap.to(el, { y:0, opacity:1, duration:.9, ease:EASE }); }
      });
    });

    // stagger discipline rows
    var discs = $$('[data-disc]');
    if (discs.length){
      gsap.set(discs, { opacity:0, x:-18 });
      ScrollTrigger.create({
        trigger:'.disc-list', start:'top 82%', once:true,
        onEnter: function(){ gsap.to(discs, { opacity:1, x:0, duration:.75, ease:EASE, stagger:.07 }); }
      });
    }

    // stagger logo wall cells
    var lws = $$('[data-lw]');
    if (lws.length){
      gsap.set(lws, { opacity:0, scale:.9 });
      ScrollTrigger.create({
        trigger:'#logowall', start:'top 78%', once:true,
        onEnter: function(){ gsap.to(lws, { opacity:1, scale:1, duration:.7, ease:EASE, stagger:.04 }); }
      });
    }

    // hero plate parallax
    var plate = $('.hero__plate');
    if (plate){
      gsap.to(plate, { yPercent:14, ease:'none',
        scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
    }
  }

  function playHero(){
    if (REDUCED || !hasGSAP) return;
    var lines = $$('#hero [data-reveal-lines] .line > span');
    gsap.timeline()
      .to(lines, { yPercent:0, duration:1.15, ease:EASE, stagger:.12 })
      .to('#heroCue', { opacity:1, duration:.6, ease:EASE }, '-=0.5');
  }


  /* ---------- VIDEO THUMB GRID — real production stills ---------- */
  function initThumbGrid(){
    var grid = $('#thumbgrid'); if (!grid) return;

    var images = [
      // AL MAJHOOL — scene/shot stills (scene order)
      { src:'assets/almaj-s2s2.jpg',      label:'AL MAJHOOL · S02' },
      { src:'assets/almaj-s4s7.jpg',      label:'AL MAJHOOL · S04' },
      { src:'assets/almaj-s5s2.jpg',      label:'AL MAJHOOL · S05' },
      { src:'assets/almaj-s5s5.jpg',      label:'AL MAJHOOL · S05' },
      // AL MAJHOOL — sequential production stills (frame order)
      { src:'assets/almaj00086248.jpg',   label:'AL MAJHOOL · 248' },
      { src:'assets/almaj00086249.jpg',   label:'AL MAJHOOL · 249' },
      { src:'assets/almaj00086250.jpg',   label:'AL MAJHOOL · 250' },
      { src:'assets/almaj00086252.jpg',   label:'AL MAJHOOL · 252' },
      { src:'assets/almaj00086275.jpg',   label:'AL MAJHOOL · 275' },
      { src:'assets/almaj00086277.jpg',   label:'AL MAJHOOL · 277' },
      { src:'assets/almaj00086278.jpg',   label:'AL MAJHOOL · 278' },
      { src:'assets/almaj00086281.jpg',   label:'AL MAJHOOL · 281' },
      { src:'assets/almaj00086282.jpg',   label:'AL MAJHOOL · 282' },
      { src:'assets/almaj00086284.jpg',   label:'AL MAJHOOL · 284' },
      { src:'assets/almaj00086285.jpg',   label:'AL MAJHOOL · 285' },
      { src:'assets/almaj00086286.jpg',   label:'AL MAJHOOL · 286' },
      { src:'assets/almaj00086288.jpg',   label:'AL MAJHOOL · 288' },

      { src:'assets/almaj00086290.jpg',   label:'AL MAJHOOL · 290' },
      { src:'assets/almaj00086295.jpg',   label:'AL MAJHOOL · 295' },
      { src:'assets/almaj00086303.jpg',   label:'AL MAJHOOL · 303' },
      { src:'assets/almaj00086305.jpg',   label:'AL MAJHOOL · 305' },
      { src:'assets/almaj00086314.jpg',   label:'AL MAJHOOL · 314' },
      { src:'assets/almaj00086324.jpg',   label:'AL MAJHOOL · 324' },
      { src:'assets/almaj00086344.jpg',   label:'AL MAJHOOL · 344' },
      { src:'assets/almaj00086348.jpg',   label:'AL MAJHOOL · 348' },
      // INTERIOR — corporate/brand shoots (sequence order)
      { src:'assets/Int.jpg',             label:'INT · 00' },
      { src:'assets/Int1.jpg',            label:'INT · 01' },
      { src:'assets/Int2.jpg',            label:'INT · 02' },
      { src:'assets/Int3.jpg',            label:'INT · 03' },
      { src:'assets/Int4.jpg',            label:'INT · 04' },
      { src:'assets/Int5.jpg',            label:'INT · 05' },
      // NF PROJECT — selected shots (shot order)
      { src:'assets/NF1.jpg',             label:'NF · 01' },
      { src:'assets/NF2.jpg',             label:'NF · 02' },
      { src:'assets/NF7.jpg',             label:'NF · 07' },
      { src:'assets/NF8.jpg',             label:'NF · 08' },
      { src:'assets/NF9.jpg',             label:'NF · 09' },
    ];

    images.forEach(function(img){
      var d = document.createElement('div');
      d.className = 'tg';
      d.innerHTML =
        '<i></i><i></i><i></i><i></i>' +
        '<a href="' + img.src + '" class="glightbox" data-glightbox="title: ' + img.label + '" data-gallery="reel">' +
          '<img src="' + img.src + '" alt="' + img.label + '" loading="lazy">' +
        '</a>' +
        '<span>' + img.label + '</span>';
      grid.appendChild(d);
    });

    // init lightbox
    if (typeof GLightbox !== 'undefined'){
      GLightbox({ selector:'.glightbox', touchNavigation:true, loop:true, openEffect:'fade', closeEffect:'fade' });
    }

    if (REDUCED || !hasGSAP || !window.ScrollTrigger) return;
    var cells = $$('.tg', grid);
    gsap.set(cells, { opacity:0, y:24 });
    ScrollTrigger.create({
      trigger:grid, start:'top 82%', once:true,
      onEnter: function(){ gsap.to(cells, { opacity:1, y:0, duration:.7, ease:EASE, stagger:.03 }); }
    });
  }


  /* ---------- MENU (mobile) ---------- */
  var menuOpen = false;
  function openMenu(){
    var m = $('#menu'), b = $('#burger'); if (!m) return;
    menuOpen = true;
    m.classList.add('is-open'); m.setAttribute('aria-hidden','false');
    if (b){ b.classList.add('is-open'); b.setAttribute('aria-expanded','true'); }
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();
    if (REDUCED || !hasGSAP){ m.style.clipPath='inset(0 0 0% 0)'; return; }
    var items = $$('.menu__list li', m);
    gsap.timeline()
      .to(m, { clipPath:'inset(0 0 0% 0)', duration:.7, ease:'expo.inOut' })
      .fromTo(items, { y:40, opacity:0 }, { y:0, opacity:1, duration:.7, ease:EASE, stagger:.07 }, '-=0.3');
  }
  function closeMenu(){
    var m = $('#menu'), b = $('#burger'); if (!m || !menuOpen) return;
    menuOpen = false;
    if (b){ b.classList.remove('is-open'); b.setAttribute('aria-expanded','false'); }
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
    function done(){ m.classList.remove('is-open'); m.setAttribute('aria-hidden','true'); }
    if (REDUCED || !hasGSAP){ m.style.clipPath='inset(0 0 100% 0)'; done(); return; }
    gsap.to(m, { clipPath:'inset(0 0 100% 0)', duration:.55, ease:'expo.inOut', onComplete:done });
  }
  function initMenu(){
    var b = $('#burger'); if (b) b.addEventListener('click', function(){ menuOpen ? closeMenu() : openMenu(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && menuOpen) closeMenu(); });
  }


  /* ---------- HEADER auto-hide ---------- */
  function initHeader(){
    var h = $('#siteHeader'); if (!h || REDUCED || !hasGSAP) return;
    var last = 0;
    window.addEventListener('scroll', function(){
      if (menuOpen) return;
      var y = window.scrollY;
      if (y > 160 && y > last) gsap.to(h, { yPercent:-130, duration:.5, ease:'power2.out' });
      else gsap.to(h, { yPercent:0, duration:.5, ease:'power2.out' });
      last = y;
    }, { passive:true });
  }


  /* ---------- BACK TO TOP ---------- */
  function initBackTop(){
    var btn = document.getElementById('backTop'); if (!btn) return;
    window.addEventListener('scroll', function(){
      if (window.scrollY > window.innerHeight * 0.4) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }, { passive:true });
    btn.addEventListener('click', function(){
      if (lenis) lenis.scrollTo(0, { duration:1.4 });
      else window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  /* ---------- BOOT ---------- */
  function boot(){
    initScroll();
    initRail();
    initMenu();
    initHeader();
    initThumbGrid();
    initReveals();
    if (!REDUCED && hasGSAP) gsap.set('#heroCue', { opacity:0 });
    initBackTop();
  initLoader(function(){ playHero(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

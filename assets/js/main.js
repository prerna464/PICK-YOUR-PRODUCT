/**
 * main.js — Top 5 Best Blog
 * Fixed: mobile/tablet category tab scroll
 */

(function () {
  'use strict';

  /* ── Element references ── */
  const cards         = document.querySelectorAll('.blog-card');
  const mcats         = document.querySelectorAll('.mcat');
  const sbItems       = document.querySelectorAll('.sb-cat-item');
  const latestSection = document.querySelector('.latest-wrap');
  const allMenu       = document.querySelector('.all-menu');
  const dropdown      = document.querySelector('.dropdown');
  const header        = document.querySelector('header');

  /* ════════════════════════════════════
     UTILITY: cross-browser smooth scroll
     Uses pageYOffset (works on all mobile
     browsers including older iOS Safari)
  ════════════════════════════════════ */
  function scrollToEl(el, extraOffset) {
    if (!el) return;
    var offset = extraOffset || 80;
    var headerH = header ? header.offsetHeight : 68;
    var top = el.getBoundingClientRect().top + window.pageYOffset - headerH - offset;

    /* Try native smooth scroll first */
    try {
      window.scrollTo({ top: top, behavior: 'smooth' });
    } catch (e) {
      /* Fallback for very old browsers */
      window.scrollTo(0, top);
    }
  }

  /* ════════════════════════════════════
     CATEGORY FILTER
  ════════════════════════════════════ */
  function filterCat(cat) {
    cards.forEach(function(card, i) {
      var show = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.classList.remove('visible');
        setTimeout(function() { card.classList.add('visible'); }, i * 55);
      }
    });
    mcats.forEach(function(t) {
      t.classList.toggle('active', t.dataset.cat === cat);
    });
    sbItems.forEach(function(s) {
      s.classList.toggle('active', s.dataset.cat === cat);
    });
  }

  /* ════════════════════════════════════
     MASTHEAD TABS
     — uses touchend so mobile fires
       immediately without 300ms delay
  ════════════════════════════════════ */
  mcats.forEach(function(tab) {

    /* Shared handler for both click and touch */
    function handleTabAction(e) {
      /* Stop the 300ms ghost click on touch devices */
      e.preventDefault();
      e.stopPropagation();

      var cat = tab.dataset.cat;
      filterCat(cat);

      /* Scroll to articles section on every tap including All */
      if (latestSection) {
        /* Small timeout lets the DOM filter complete before measuring */
        setTimeout(function() {
          scrollToEl(latestSection, 16);
        }, 60);
      }
    }

    tab.addEventListener('click',    handleTabAction);
    tab.addEventListener('touchend', handleTabAction, { passive: false });
  });

  /* ════════════════════════════════════
     SIDEBAR CATEGORY ITEMS
  ════════════════════════════════════ */
  sbItems.forEach(function(s) {
    function handleSbAction(e) {
      e.preventDefault();
      filterCat(s.dataset.cat);
      if (latestSection) {
        setTimeout(function() {
          scrollToEl(latestSection, 16);
        }, 60);
      }
    }
    s.addEventListener('click',    handleSbAction);
    s.addEventListener('touchend', handleSbAction, { passive: false });
  });

  /* ════════════════════════════════════
     DROPDOWN TOGGLE
     click + touchend both handled
  ════════════════════════════════════ */
  if (allMenu && dropdown) {
    allMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });

    document.addEventListener('touchend', function() {
      dropdown.classList.remove('open');
    });

    dropdown.addEventListener('click',    function(e) { e.stopPropagation(); });
    dropdown.addEventListener('touchend', function(e) { e.stopPropagation(); });
  }

  /* ════════════════════════════════════
     SCROLL REVEAL
  ════════════════════════════════════ */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, i * 65);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    cards.forEach(function(card) { revealObserver.observe(card); });
  } else {
    /* Fallback for very old browsers — show all cards immediately */
    cards.forEach(function(card) { card.classList.add('visible'); });
  }

  /* ════════════════════════════════════
     HEADER SHADOW ON SCROLL
  ════════════════════════════════════ */
  if (header) {
    window.addEventListener('scroll', function() {
      header.style.boxShadow = window.pageYOffset > 10
        ? '0 4px 24px rgba(0,0,0,0.13)'
        : '0 2px 20px rgba(0,0,0,0.06)';
    }, { passive: true });
  }

})();

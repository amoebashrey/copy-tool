/* Chitra landing — theme toggle, scroll reveals, and demo loops.
   All demos ship their final state in the HTML; JS only animates
   when the visitor allows motion. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ---------- theme toggle ---------- */
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var toggle = document.getElementById('themeToggle');

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  }
  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('chitra-theme', next); } catch (e) {}
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  if (reduced) return; /* final states stay put; no loops */

  /* ---------- helpers ---------- */
  function typeInto(el, text, speed, done) {
    if (el._typer) clearInterval(el._typer);
    el.textContent = '';
    var i = 0;
    el._typer = setInterval(function () {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(el._typer);
        el._typer = null;
        if (done) done();
      }
    }, speed);
  }

  function runTimeline(steps, loopAfter, onReset) {
    var timers = [];
    function play() {
      if (onReset) onReset();
      steps.forEach(function (step) {
        timers.push(setTimeout(step[1], step[0]));
      });
      timers.push(setTimeout(play, loopAfter));
    }
    play();
    return timers;
  }

  /* ---------- hero demo (~8.4s loop) ---------- */
  var demo = document.getElementById('heroDemo');
  var demoLabel = document.getElementById('demoLabel');
  var demoCaption = document.getElementById('demoCaption');

  runTimeline([
    [600, function () { demo.dataset.phase = '1'; }], /* kalam glides in */
    [1900, function () { demo.dataset.phase = '2'; }], /* selection box */
    [2200, function () {
      typeInto(demoCaption, 'Unlinked copy detected in ‘Checkout_Modal’. Assign a token?', 26);
    }],
    [4700, function () { /* restore the approved token */
      demo.dataset.phase = '4';
      demoLabel.textContent = 'Get started';
      demoLabel.classList.add('swap');
    }],
    [5800, function () { /* order is restored */
      demo.dataset.phase = '5';
      typeInto(demoCaption, 'Order is restored. Every string is in its place.', 24);
    }]
  ], 8400, function () {
    demo.dataset.phase = '0';
    demoLabel.textContent = 'Get startd';
    demoLabel.classList.remove('swap');
    demoCaption.textContent = '';
  });

  /* ---------- card अ : scan loop (~4.6s) ---------- */
  var scan = document.getElementById('scanDemo');
  runTimeline([
    [60, function () {
      scan.classList.remove('reset');
      scan.classList.add('filling'); /* bar 0 → 100% */
    }],
    [1800, function () { scan.classList.remove('filling'); }] /* rows cascade in */
  ], 4600, function () {
    scan.classList.remove('filling');
    scan.classList.add('reset');
    void scan.offsetWidth; /* commit the un-animated reset */
  });

  /* ---------- card आ : status cycle ---------- */
  var pill = document.getElementById('statusPill');
  var pillText = pill.querySelector('.pill-text');
  var trackItems = document.getElementById('statusTrack').querySelectorAll('li');
  var states = [['none', 'None'], ['wip', 'WIP'], ['review', 'Review'], ['final', 'Final']];
  var stateIdx = states.length - 1;
  setInterval(function () {
    stateIdx = (stateIdx + 1) % states.length;
    pill.dataset.state = states[stateIdx][0];
    pillText.textContent = states[stateIdx][1];
    trackItems.forEach(function (li, i) {
      li.classList.toggle('active', i === stateIdx);
    });
  }, 1500);

  /* ---------- card इ : edit once, propagate to linked layers ---------- */
  var propMaster = document.getElementById('propMaster');
  var propRows = document.querySelectorAll('#propDemo .prop-rows li');
  var propTexts = ['Get started', 'Start free trial'];
  var propIdx = 0;
  setInterval(function () {
    propIdx = (propIdx + 1) % propTexts.length;
    propMaster.textContent = propTexts[propIdx];
    propRows.forEach(function (row, i) {
      setTimeout(function () {
        row.querySelector('.prop-text').textContent = propTexts[propIdx];
        row.classList.add('pulse');
        setTimeout(function () { row.classList.remove('pulse'); }, 700);
      }, 200 + i * 180);
    });
  }, 4200);

  /* ---------- card ई : inscribing copy.json ---------- */
  var jsonEl = document.getElementById('jsonType');
  var jsonText = jsonEl.textContent;
  (function inscribe() {
    typeInto(jsonEl, jsonText, 16, function () {
      setTimeout(inscribe, 3200);
    });
  })();
})();

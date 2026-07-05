/* Showcase: renders the course grid from COURSES (js/courses-data.js),
   drives the Tool/Category filters, and runs the lightbox course viewer.
   Filter chips are derived from the data, so new tools/tags added to a
   course object appear here automatically.

   Deep links (shareable URLs):
     showcase.html?course=<id>            opens a course in the lightbox
     showcase.html?by=tag&filter=Compliance  pre-applies a filter          */

(function () {
  'use strict';

  var renderThumb = window.PORTFOLIO.renderThumb;
  var embedSrc = window.PORTFOLIO.embedSrc;

  var grid = document.querySelector('[data-grid]');
  var chipRow = document.querySelector('[data-chips]');
  var countEl = document.querySelector('[data-result-count]');
  var emptyEl = document.querySelector('[data-empty]');
  var segButtons = Array.prototype.slice.call(document.querySelectorAll('.seg-btn'));

  var lightbox = document.querySelector('[data-lightbox]');
  var lbPanel = lightbox.querySelector('.lightbox-panel');
  var lbTitle = lightbox.querySelector('#lb-title');
  var lbSrc = lightbox.querySelector('[data-lb-src]');
  var lbFrame = lightbox.querySelector('[data-lb-frame]');
  var lbLoading = lightbox.querySelector('[data-lb-loading]');
  var lbLoadFill = lightbox.querySelector('[data-lb-loading-fill]');
  var lbHint = lightbox.querySelector('[data-lb-hint]');
  var lbHintLink = lightbox.querySelector('[data-lb-hint-link]');
  var lbNote = lightbox.querySelector('[data-lb-note]');
  var lbOpenTab = lightbox.querySelector('[data-lb-open]');
  var lbCloseBtn = lightbox.querySelector('.lb-close');

  var state = { mode: 'tool', filter: 'All' };
  var openerEl = null;   // element to restore focus to when the lightbox closes
  var hintTimer = null;

  /* ---------- filters ---------- */

  // Unique values across all courses, in the order they first appear.
  function valuesFor(mode) {
    var seen = [];
    COURSES.forEach(function (c) {
      (mode === 'tool' ? c.tools : c.tags).forEach(function (v) {
        if (seen.indexOf(v) === -1) seen.push(v);
      });
    });
    return ['All'].concat(seen);
  }

  function filteredCourses() {
    if (state.filter === 'All') return COURSES.slice();
    return COURSES.filter(function (c) {
      return (state.mode === 'tool' ? c.tools : c.tags).indexOf(state.filter) !== -1;
    });
  }

  function syncUrl() {
    var params = new URLSearchParams(window.location.search);
    if (state.filter === 'All') {
      params.delete('by');
      params.delete('filter');
    } else {
      params.set('by', state.mode);
      params.set('filter', state.filter);
    }
    var qs = params.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
  }

  function renderChips() {
    chipRow.innerHTML = '';
    valuesFor(state.mode).forEach(function (value) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = value;
      chip.setAttribute('aria-pressed', String(value === state.filter));
      chip.addEventListener('click', function () {
        state.filter = value;
        syncUrl();
        renderChips();
        renderGrid();
      });
      chipRow.appendChild(chip);
    });
  }

  function renderGrid() {
    var courses = filteredCourses();
    grid.innerHTML = '';
    courses.forEach(function (course) {
      grid.appendChild(buildCard(course));
    });
    countEl.textContent = courses.length + (courses.length === 1 ? ' course' : ' courses');
    emptyEl.hidden = courses.length !== 0;
  }

  function setMode(mode) {
    state.mode = mode;
    state.filter = 'All';
    segButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode));
    });
    syncUrl();
    renderChips();
    renderGrid();
  }

  segButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setMode(btn.dataset.mode); });
  });

  /* ---------- cards ---------- */

  function buildCard(course) {
    var card = document.createElement('article');
    card.className = 'course-card';

    var thumb = document.createElement('div');
    thumb.className = 'thumb card-thumb';
    renderThumb(thumb, course);

    var badge = document.createElement('span');
    badge.className = 'card-badge';
    badge.textContent = course.tools.join(' · ');
    thumb.appendChild(badge);

    var duration = document.createElement('span');
    duration.className = 'card-duration';
    duration.textContent = '◷ ' + course.duration;
    thumb.appendChild(duration);

    var body = document.createElement('div');
    body.className = 'card-body';

    var tags = document.createElement('div');
    tags.className = 'card-tags';
    course.tags.forEach(function (t) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tags.appendChild(tag);
    });

    var title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = course.title;

    var desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = course.description;

    var launch = document.createElement('button');
    launch.type = 'button';
    launch.className = 'btn-dark btn-launch';
    launch.textContent = '▶ Launch course';
    launch.setAttribute('aria-label', 'Launch course: ' + course.title);
    launch.addEventListener('click', function () { openLightbox(course, launch); });

    body.appendChild(tags);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(launch);
    card.appendChild(thumb);
    card.appendChild(body);
    return card;
  }

  /* ---------- lightbox ---------- */

  function openLightbox(course, opener) {
    openerEl = opener || null;
    var src = embedSrc(course);
    var external = course.source.type === 'external';

    lbTitle.textContent = course.title;
    lbSrc.textContent = src;
    lbOpenTab.href = src;
    lbHintLink.href = src;
    lbNote.innerHTML = external
      ? 'Hosted externally · <span class="src-external">external URL</span>'
      : 'Served from this repo · <span class="src-local">/courses subfolder</span>';

    // Loading state, tinted with the course accent, until the iframe loads.
    lbLoading.hidden = false;
    lbHint.hidden = true;
    lbLoadFill.style.background =
      'repeating-linear-gradient(135deg, ' + course.accent + '26 0 11px, ' + course.accent + '0d 11px 22px)';
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { lbHint.hidden = false; }, 6000);

    lbFrame.title = course.title;
    lbFrame.addEventListener('load', onFrameLoad);
    lbFrame.src = src;

    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKeydown);
    lbCloseBtn.focus();

    var params = new URLSearchParams(window.location.search);
    params.set('course', course.id);
    history.replaceState(null, '', window.location.pathname + '?' + params.toString());
  }

  function onFrameLoad() {
    lbLoading.hidden = true;
    clearTimeout(hintTimer);
    // Escape should close even while focus is inside the embedded course.
    // Same-origin (local) frames allow this; cross-origin ones throw, and
    // there the close button and backdrop still work.
    try {
      lbFrame.contentDocument.addEventListener('keydown', onKeydown);
    } catch (err) { /* cross-origin course */ }
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    lbFrame.removeEventListener('load', onFrameLoad);
    clearTimeout(hintTimer);
    lbFrame.src = 'about:blank'; // stop any audio/animation in the course

    var params = new URLSearchParams(window.location.search);
    params.delete('course');
    var qs = params.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));

    if (openerEl) openerEl.focus();
    openerEl = null;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep Tab focus inside the dialog while it is open.
    var focusables = lbPanel.querySelectorAll('a[href], button:not([disabled]), iframe');
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  Array.prototype.slice.call(lightbox.querySelectorAll('[data-lb-close]')).forEach(function (el) {
    el.addEventListener('click', closeLightbox);
  });

  /* ---------- init from URL ---------- */

  (function init() {
    var params = new URLSearchParams(window.location.search);

    var by = params.get('by');
    var filter = params.get('filter');
    if (by === 'tool' || by === 'tag') state.mode = by;
    if (filter && valuesFor(state.mode).indexOf(filter) !== -1) state.filter = filter;

    segButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode));
    });
    renderChips();
    renderGrid();

    var courseId = params.get('course');
    if (courseId) {
      var course = COURSES.filter(function (c) { return c.id === courseId; })[0];
      if (course) openLightbox(course, null);
    }
  })();
})();

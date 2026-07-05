/* Shared behaviour: thumbnail rendering helper, home-page course strip,
   and contact-form enhancement. Course content lives in js/courses-data.js. */

(function () {
  'use strict';

  /* ---- shared helpers (used here and by showcase.js) ---- */

  // Fills a .thumb container with either the course's real thumbnail image
  // or a striped placeholder tinted with its accent colour.
  function renderThumb(container, course) {
    if (course.thumbnail) {
      var img = document.createElement('img');
      img.className = 'thumb-img';
      img.src = course.thumbnail;
      img.alt = course.thumbAlt || 'Preview of “' + course.title + '”';
      img.loading = 'lazy';
      container.appendChild(img);
    } else {
      var fill = document.createElement('div');
      fill.className = 'thumb-fill';
      fill.style.background =
        'repeating-linear-gradient(135deg, ' + course.accent + '26 0 11px, ' + course.accent + '0d 11px 22px)';
      container.appendChild(fill);
    }
  }

  // Single reusable resolver — swap a course between a local /courses
  // subfolder and an external URL by editing its `source` only.
  function embedSrc(course) {
    return course.source.type === 'external' ? course.source.url : course.source.path;
  }

  window.PORTFOLIO = { renderThumb: renderThumb, embedSrc: embedSrc };

  /* ---- theme toggle (nav) ----
     The inline script in each page's <head> applies the saved theme before
     first paint; this only handles the click and persists the choice. */

  var themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    var syncThemeToggle = function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    themeToggle.addEventListener('click', function () {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (err) { /* storage blocked */ }
      syncThemeToggle();
    });
    syncThemeToggle();
  }

  /* ---- home: "Recent builds" strip ---- */

  var track = document.querySelector('[data-marquee-track]');
  if (track && typeof COURSES !== 'undefined') {
    // Duplicate the list once so the CSS translateX(-50%) loop is seamless.
    COURSES.concat(COURSES).forEach(function (course) {
      var card = document.createElement('div');
      card.className = 'marquee-card';

      var thumb = document.createElement('div');
      thumb.className = 'thumb marquee-thumb';
      renderThumb(thumb, course);

      var body = document.createElement('div');
      body.className = 'marquee-body';

      var badge = document.createElement('span');
      badge.className = 'tag';
      badge.textContent = course.tools[0];

      var title = document.createElement('div');
      title.className = 'marquee-title';
      title.textContent = course.title;

      body.appendChild(badge);
      body.appendChild(title);
      card.appendChild(thumb);
      card.appendChild(body);
      track.appendChild(card);
    });
  }

  /* ---- contact: submit via fetch with inline status, mailto fallback ---- */

  var form = document.querySelector('[data-contact-form]');
  if (form && window.fetch) {
    var status = form.querySelector('[data-form-status]');
    var submit = form.querySelector('[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      status.hidden = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Form endpoint returned ' + res.status);
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thanks — your message is on its way. I’ll get back to you soon.';
        })
        .catch(function () {
          status.className = 'form-status error';
          status.innerHTML =
            'Something went wrong sending the form. Please email me directly at ' +
            '<a href="mailto:hello@ayseinal.co.uk">hello@ayseinal.co.uk</a>.';
        })
        .then(function () {
          status.hidden = false;
          submit.disabled = false;
        });
    });
  }
})();

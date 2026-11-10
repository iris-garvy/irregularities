// Shared script for the irregularities pages.

// Entry pages: "All N sources" buttons, the Expand all / Collapse all button, and opening the part named in the
// address (for example #claim-a).
(function () {
  document.querySelectorAll('.more').forEach(function (b) {
    b.addEventListener('click', function () { b.previousElementSibling.hidden = false; b.remove(); });
  });
  var ex = document.getElementById('expand'), claims = [].slice.call(document.querySelectorAll('.claim'));
  function label() { if (ex) ex.textContent = claims.every(function (d) { return d.open; }) ? 'Collapse all' : 'Expand all'; }
  claims.forEach(function (d) { d.addEventListener('toggle', label); });
  if (ex) ex.addEventListener('click', function () {
    var open = !claims.every(function (d) { return d.open; });
    claims.forEach(function (d) { d.open = open; });
    label();
  });
  // Opens every closed part around the target (and the target itself if it opens), shows a hidden "All N sources"
  // list it sits in, scrolls to it and flashes it. Going Back or Forward to a part already shown only reopens it: the
  // browser puts the reader back where they were. A link to the part already named in the address (clicked again
  // after closing it) works like a new one.
  var flashing = null, flashTimer = null;
  function openFromHash(force) {
    var id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { }
    var el = id && document.getElementById(id);
    if (!el || !el.closest('main')) return;
    var seen = !force && history.state && history.state.shown;
    try { history.replaceState({ shown: 1 }, ''); } catch (e) { }
    for (var p = el; p; p = p.parentElement) {
      if (p.tagName === 'DETAILS') p.open = true;
      if (p.classList && p.classList.contains('rest') && p.hidden) {
        p.hidden = false;
        var more = p.nextElementSibling;
        if (more && more.classList.contains('more')) more.remove();
      }
    }
    label();
    if (seen) return;
    el.scrollIntoView({ block: 'start' });
    if (flashing) flashing.classList.remove('flash');
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    flashing = el;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove('flash'); }, 1900);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;  // new tab or window: as usual
    var h = a.getAttribute('href');
    if (e.altKey) {  // Option-click (how links are followed while editing the page) would download the page instead
      e.preventDefault();
      if (h !== location.hash) { location.hash = h; return; }
    }
    if (h === location.hash) {
      openFromHash(true);
      // The browser's own repeat of the same fragment can reset the entry's marker; set it again once it is done.
      setTimeout(function () { if (location.hash === h) { try { history.replaceState({ shown: 1 }, ''); } catch (err) { } } }, 0);
    }
  });
  window.addEventListener('hashchange', function () { openFromHash(); });
  openFromHash(true);
})();

function norm(s) { return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

// Catalog page (All phenomena): topic filters and a text filter.
(function () {
  var count = document.getElementById('count');
  if (!count) return;
  var buttons = [].slice.call(document.querySelectorAll('.filters button')), rows = [].slice.call(document.querySelectorAll('.cat li'));
  var filter = document.getElementById('filter'), topic = 'all';
  function show() {
    var words = norm(filter ? filter.value : '').split(/\s+/).filter(Boolean), shown = 0;
    rows.forEach(function (r) {
      var text = norm(r.textContent);
      var on = (topic === 'all' || r.dataset.topics.split(' ').indexOf(topic) >= 0) && words.every(function (w) { return text.indexOf(w) >= 0; });
      r.hidden = !on;
      if (on) shown++;
    });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.topic === topic)); });
    count.textContent = shown + (shown === 1 ? ' phenomenon' : ' phenomena');
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      topic = b.dataset.topic;
      try { history.replaceState(null, '', topic === 'all' ? location.pathname + location.search : '#' + topic); } catch (e) { }
      show();
    });
  });
  if (filter) filter.addEventListener('input', show);
  function fromHash() {
    var h = location.hash.slice(1);
    try { h = decodeURIComponent(h); } catch (e) { }
    if (buttons.some(function (b) { return b.dataset.topic === h; })) { topic = h; show(); }
  }
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('pageshow', show);
  fromHash();
})();

// Search page: searches phenomena, claim headings and papers (with their one-line findings) in search-index.js,
// which the site build writes. Every word typed must appear; results are grouped and ranked by where words match.
(function () {
  var box = document.getElementById('search-results'), input = document.getElementById('q');
  if (!box || !input) return;
  var status = document.getElementById('search-status'), root = box.getAttribute('data-root') || '../';
  var data = window.IRREGULARITIES_SEARCH, PAPERS_SHOWN = 40, timer = null;
  if (!data) { status.textContent = 'The search index did not load.'; return; }
  data.entries.forEach(function (e) { e._t = norm(e.title); e._all = norm([e.title, e.description, (e.tags || []).join(' ')].join(' ')); });
  data.claims.forEach(function (c) { c._t = norm(c.heading); c._all = norm(c.heading + ' ' + c.title); });
  data.papers.forEach(function (p) {
    p._t = norm([p.title, p.cite, p.id].concat(p.alt || []).join(' '));
    p.in.forEach(function (x) { x._b = norm(x.brief); });
    p._all = p._t + ' ' + p.in.map(function (x) { return x._b; }).join(' ');
  });
  var titles = {};
  data.entries.forEach(function (e) { titles[e.slug] = e.title; });
  function reEsc(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var tests = [];
  function every(hay, words) { return tests.every(function (t) { return t.test(hay); }); }
  function some(hay) { return tests.some(function (t) { return t.test(hay); }); }
  function mark(text, words) {
    var ws = words.filter(function (w) { return w.length >= 2; }).sort(function (a, b) { return b.length - a.length; }).map(reEsc);
    if (!ws.length) return esc(text);
    return String(text).split(new RegExp('(?<![A-Za-z0-9])(' + ws.join('|') + ')', 'i')).map(function (part, i) {
      return i % 2 ? '<mark>' + esc(part) + '</mark>' : esc(part);
    }).join('');
  }
  function group(title, items) { return items.length ? '<section class="block"><div class="bar"><h2>' + esc(title) + ' (' + items.length + ')</h2></div><ul class="hits">' : ''; }
  function run(all) {
    var q = input.value.trim(), words = norm(q).split(/\s+/).filter(Boolean);
    tests = words.map(function (w) { return new RegExp('(^|[^a-z0-9])' + reEsc(w)); });
    try { history.replaceState(null, '', q ? '?q=' + encodeURIComponent(q) : location.pathname); } catch (e) { }
    if (!words.length) { box.innerHTML = ''; status.textContent = ''; return; }
    var rank = function (x) { return (every(x._t, words) ? 2 : 0) + (x._t.indexOf(norm(q)) >= 0 ? 1 : 0); };
    var byRank = function (a, b) { return rank(b) - rank(a); };
    var entries = data.entries.filter(function (e) { return every(e._all, words); }).sort(byRank);
    var claims = data.claims.filter(function (c) { return every(c._all, words); }).sort(byRank);
    var papers = data.papers.filter(function (p) { return every(p._all, words); }).sort(byRank);
    var html = '';
    if (entries.length) {
      html += group('Phenomena', entries) + entries.map(function (e) {
        var t = e.published ? '<a class="hit-title" href="' + root + e.slug + '/">' + mark(e.title, words) + '</a>' : '<span class="hit-title">' + mark(e.title, words) + '</span>';
        return '<li>' + t + '<span class="hit-sub">' + mark(e.description, words) + (e.published ? '' : ' · In progress') + '</span></li>';
      }).join('') + '</ul></section>';
    }
    if (claims.length) {
      html += group('Claims', claims) + claims.map(function (c) {
        return '<li><a class="hit-title" href="' + root + c.slug + '/#' + c.anchor + '">' + mark(c.heading, words) + '</a><span class="hit-sub">' + esc(c.title) + ', claim ' + esc(c.v) + '</span></li>';
      }).join('') + '</ul></section>';
    }
    if (papers.length) {
      var shown = all ? papers : papers.slice(0, PAPERS_SHOWN);
      html += group('Papers and findings', papers) + shown.map(function (p) {
        var hits = p.in.filter(function (x) { return some(x._b); });
        var lines = (hits.length ? hits : p.in).slice(0, 3);
        var more = p.in.length - lines.length;
        var title = p.url ? '<a class="hit-title" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">' + mark(p.title, words) + ' ↗</a>' : '<span class="hit-title">' + mark(p.title, words) + '</span>';
        return '<li>' + title + '<span class="hit-sub">' + mark(p.cite, words) + (p.original ? ' · original paper' : '') + '</span><ul class="in">' + lines.map(function (x) {
          return '<li><a class="where" href="' + root + x.slug + '/#' + esc(x.id || 'claim-' + x.v.toLowerCase()) + '">' + esc(titles[x.slug] || x.slug) + ' · ' + esc(x.v) + ' · ' + esc(x.label) + '</a>' + mark(x.brief, words) + '</li>';
        }).join('') + (more > 0 ? '<li class="where">and ' + more + ' more finding' + (more === 1 ? '' : 's') + '</li>' : '') + '</ul></li>';
      }).join('') + '</ul>' + (shown.length < papers.length ? '<button type="button" class="hits-more" id="all-papers">Show all ' + papers.length + ' papers</button>' : '') + '</section>';
    }
    box.innerHTML = html;
    var n = entries.length + claims.length + papers.length;
    status.textContent = n ? n + ' result' + (n === 1 ? '' : 's') + ' for \u201c' + q + '\u201d' : 'Nothing matches \u201c' + q + '\u201d.';
    var more = document.getElementById('all-papers');
    if (more) more.addEventListener('click', function () { run(true); });
  }
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { run(false); }, 150); });
  var form = input.form;
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); run(false); });
  var q = new URLSearchParams(location.search).get('q');
  if (q) input.value = q;
  run(false);
})();

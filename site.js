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
  function openFromHash() {
    var id = location.hash.slice(1), el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView({ block: 'start' }); }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();

// Home page: topic filters.
(function () {
  var count = document.getElementById('count');
  if (!count) return;
  var buttons = [].slice.call(document.querySelectorAll('.filters button')), rows = [].slice.call(document.querySelectorAll('.cat li'));
  function show(topic) {
    var shown = 0;
    rows.forEach(function (r) {
      var on = topic === 'all' || r.dataset.topics.split(' ').indexOf(topic) >= 0;
      r.hidden = !on;
      if (on) shown++;
    });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.topic === topic)); });
    count.textContent = shown + (shown === 1 ? ' phenomenon' : ' phenomena');
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.topic); }); });
})();

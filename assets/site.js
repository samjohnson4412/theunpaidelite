/* Shared behaviour. No dependencies, no trackers, no cookies. */
(function () {
  "use strict";

  var money0 = function (n) {
    return "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  };
  var money2 = function (n) {
    return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  /* Mark the current page in the nav without hand-editing every file. */
  function markNav() {
    var here = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (here === "") here = "/";
    document.querySelectorAll(".nav a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var path = href.replace(/^\./, "").replace(/\.html$/, "").replace(/^\/?/, "/");
      if (path === "/index") path = "/";
      if (path === here) a.setAttribute("aria-current", "page");
    });
  }

  /* Fill [data-stat] elements from data/stats.json. */
  function fillStats() {
    var nodes = document.querySelectorAll("[data-stat]");
    if (!nodes.length) return Promise.resolve(null);
    return fetch("data/stats.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (s) {
        nodes.forEach(function (el) {
          var key = el.getAttribute("data-stat");
          var fmt = el.getAttribute("data-format");
          var v = s[key];
          if (v === undefined || v === null) return;
          if (fmt === "money") v = money2(v);
          else if (fmt === "pct") v = v + "%";
          else if (fmt === "money0") v = money0(v);
          else if (typeof v === "number") v = v.toLocaleString("en-US");
          el.textContent = v;
        });
        document.querySelectorAll("[data-updated]").forEach(function (el) {
          el.textContent = new Date(s.updated + "T12:00:00").toLocaleDateString("en-US",
            { year: "numeric", month: "long", day: "numeric" });
        });
        return s;
      })
      .catch(function () { return null; });
  }

  /* Anonymized quotes. */
  function fillQuotes() {
    var host = document.getElementById("quotes");
    if (!host) return;
    var limit = parseInt(host.getAttribute("data-limit") || "0", 10);
    fetch("data/quotes.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (list) {
        if (limit > 0) list = list.slice(0, limit);
        host.innerHTML = list.map(function (q) {
          return '<blockquote class="q"><p>' + esc(q.text) + "</p><cite>" +
                 esc(q.loc) + " &middot; " + money2(q.amount) + " unpaid &middot; work performed " +
                 q.year + "</cite></blockquote>";
        }).join("");
      })
      .catch(function () { host.remove(); });
  }

  /* Opt-in public roster. Empty until people consent — that is the expected state. */
  function fillClaims() {
    var host = document.getElementById("claims-table");
    if (!host) return;
    fetch("data/claims.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var rows = d.entries || [];
        if (!rows.length) {
          host.innerHTML =
            '<div class="empty"><p><strong>No public entries yet.</strong></p>' +
            "<p>Everyone listed here has asked to be listed. As people return their " +
            "permission forms, their claims will appear on this page.</p></div>";
          return;
        }
        rows.sort(function (a, b) { return (b.amount || 0) - (a.amount || 0); });
        var total = rows.reduce(function (t, r) { return t + (r.amount || 0); }, 0);
        host.innerHTML =
          '<div class="table-scroll"><table><caption class="sr-only">Contractors who consented to be listed publicly</caption>' +
          "<thead><tr><th>Name</th><th>Where they shopped</th><th>Work completed</th>" +
          '<th class="num">Unpaid</th></tr></thead><tbody>' +
          rows.map(function (r) {
            return "<tr><td>" + esc(r.name) + "</td><td>" + esc(r.shopped) + "</td><td>" +
                   esc(r.dates || "") + '</td><td class="num">' + money2(r.amount) + "</td></tr>";
          }).join("") +
          '</tbody><tfoot><tr><th colspan="3">' + rows.length + " listed publicly</th>" +
          '<td class="num"><strong>' + money2(total) + "</strong></td></tr></tfoot></table></div>";
      })
      .catch(function () { host.remove(); });
  }

  /* Tally embeds. Renders a visible setup panel while the form ID is still a placeholder,
     so a half-configured page can never look like a working form. */
  function mountTally() {
    document.querySelectorAll("[data-tally]").forEach(function (host) {
      var which = host.getAttribute("data-tally");
      var id = (window.SITE && window.SITE.tally && window.SITE.tally[which]) || "";
      var title = host.getAttribute("data-title") || "Form";
      if (!id || id.indexOf("REPLACE") === 0) {
        host.className = "setup-needed";
        host.innerHTML =
          "<h3>This form is not connected yet</h3>" +
          "<p>Create the <strong>" + esc(which) + "</strong> form in Tally, then put its form ID in " +
          "<code>assets/config.js</code> under <code>tally." + esc(which) + "</code>. " +
          "Step-by-step instructions are in <code>SETUP.md</code>.</p>";
        return;
      }
      host.className = "embed";
      host.innerHTML =
        '<iframe src="https://tally.so/embed/' + encodeURIComponent(id) +
        '?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" ' +
        'loading="lazy" title="' + esc(title) + '" ' +
        'referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '<noscript><p><a href="https://tally.so/r/' + encodeURIComponent(id) + '">Open the form</a></p></noscript>';
    });

    /* Tally posts its height as the form grows. */
    window.addEventListener("message", function (e) {
      if (typeof e.data !== "string" || e.origin.indexOf("tally.so") === -1) return;
      try {
        var msg = JSON.parse(e.data);
        if (msg.event === "Tally.FormLoaded" || msg.event === "Tally.FormPageChanged") {
          document.querySelectorAll(".embed iframe").forEach(function (f) {
            if (msg.payload && msg.payload.height) f.style.minHeight = msg.payload.height + "px";
          });
        }
      } catch (_) { /* not ours */ }
    });
  }

  /* Geographic and per-year breakdowns on the record page. */
  function fillBreakdown() {
    var stateHost = document.getElementById("by-state");
    var yearHost  = document.getElementById("by-year");
    if (!stateHost && !yearHost) return;
    fetch("data/stats.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (s) {
        if (stateHost) {
          var st = s.by_state || {};
          var names = Object.keys(st);
          var max = Math.max.apply(null, names.map(function (k) { return st[k]; }).concat([1]));
          stateHost.innerHTML =
            '<div class="table-scroll"><table><thead><tr><th>Where the work was done</th>' +
            '<th class="num">Contractors</th><th style="width:38%">&nbsp;</th></tr></thead><tbody>' +
            names.map(function (k) {
              var pct = Math.round((st[k] / max) * 100);
              return "<tr><td>" + esc(k) + '</td><td class="num">' + st[k] + "</td>" +
                     '<td><span style="display:block;height:9px;border-radius:5px;background:var(--brand);width:' +
                     pct + '%;min-width:8px"></span></td></tr>';
            }).join("") +
            "</tbody></table></div>" +
            "<p style=\"font-size:.88rem;color:var(--ink-3)\">Plus " +
            (s.intl || []).map(esc).join(" and ") + ". Where a claim form named only a city, " +
            "the contractor&rsquo;s home state was used.</p>";
        }
        if (yearHost) {
          var yr = s.by_year || {};
          var ys = Object.keys(yr);
          var ymax = Math.max.apply(null, ys.map(function (k) { return yr[k]; }).concat([1]));
          yearHost.innerHTML =
            '<div class="table-scroll"><table><thead><tr><th>Most recent work reported</th>' +
            '<th class="num">Contractors</th><th style="width:45%">&nbsp;</th></tr></thead><tbody>' +
            ys.map(function (k) {
              var pct = Math.round((yr[k] / ymax) * 100);
              return "<tr><td>" + esc(k) + '</td><td class="num">' + yr[k] + "</td>" +
                     '<td><span style="display:block;height:9px;border-radius:5px;background:var(--flag);width:' +
                     pct + '%;min-width:8px"></span></td></tr>';
            }).join("") + "</tbody></table></div>";
        }
      })
      .catch(function () {});
  }

  /* Copy-to-clipboard for the template letters. */
  function wireCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var src = document.getElementById(btn.getAttribute("data-copy"));
        if (!src) return;
        var text = src.textContent.trim();
        var done = function () {
          var was = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = was; }, 1800);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
        } else { fallback(text, done); }
      });
    });
  }
  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (_) {}
    document.body.removeChild(ta);
  }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init() {
    markNav(); fillStats(); fillQuotes(); fillClaims(); fillBreakdown(); mountTally(); wireCopy();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();

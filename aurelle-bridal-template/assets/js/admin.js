/* ==========================================================================
   AURELLE — admin.js
   Drives admin-dashboard.html: panel switching, bookings filtering, charts,
   modals, client directory, artist roster, and studio settings.

   Load AFTER main.js and charts.js.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var AU = window.AU || (window.AU = {});
  var $ = AU.$ || function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = AU.$$ || function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var inited = false;

  var PANEL_META = {
    overview: { title: "Executive Overview", sub: "Atelier bookings, revenue growth, and artist availability at a glance." },
    bookings: { title: "Bookings Manager", sub: "Manage and filter every bridal appointment across master artists." },
    clients: { title: "Client Directory", sub: "Every bride with active bookings, wedding dates, and total spend." },
    artists: { title: "Artist Roster", sub: "Master makeup and hair styling team availability and ratings." },
    financials: { title: "Invoices & Revenue", sub: "Track deposits, overdue balances, and official invoice ledger." },
    reviews: { title: "Client Reviews", sub: "Verified bride testimonials and website feature moderation." },
    settings: { title: "Studio Settings", sub: "Operating hours, deposit policy, and automated notification alerts." }
  };

  var DEFAULT_PANEL = "overview";

  /* ------------------------------------------------------------------------
     AUTH GUARD
     ------------------------------------------------------------------------ */
  function guardAuth() {
    if (!AU.auth || typeof AU.auth.require !== "function") return null;
    var session = AU.auth.require("admin", "admin-login.html");
    if (!session) return null;

    var fullName = (session.name || "Nadia Sethi").trim();
    var firstName = fullName.split(/\s+/)[0] || "Nadia";
    var parts = fullName.split(/\s+/);
    var initials = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase() || "NS";

    /* Populate admin session data into dashboard UI */
    $$("[data-session-name]").forEach(function (el) { el.textContent = fullName; });
    $$("[data-session-first-name]").forEach(function (el) { el.textContent = firstName; });
    $$("[data-session-email]").forEach(function (el) { el.textContent = session.email || ""; });
    $$("[data-user-avatar-initials]").forEach(function (el) { el.textContent = initials; });

    /* Update Executive Overview greeting */
    PANEL_META.overview.sub = "Welcome back, " + firstName + " — atelier bookings, revenue growth, and artist availability at a glance.";
    var subEl = $("#panelSub");
    if (subEl && ($(".dash-nav-link.is-active") ? $(".dash-nav-link.is-active").getAttribute("data-panel") === "overview" : true)) {
      subEl.textContent = PANEL_META.overview.sub;
    }

    return session;
  }

  /* ------------------------------------------------------------------------
     PANEL SWITCHING
     ------------------------------------------------------------------------ */
  function switchPanel(name, opts) {
    if (!name || !PANEL_META[name]) name = DEFAULT_PANEL;
    var options = opts || {};

    $$(".dash-nav-link[data-panel]").forEach(function (btn) {
      var active = btn.getAttribute("data-panel") === name;
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    $$("[data-panel-view]").forEach(function (view) {
      view.classList.toggle("is-active", view.getAttribute("data-panel-view") === name);
    });

    var titleEl = $("#panelTitle");
    var subEl = $("#panelSub");
    if (titleEl) titleEl.textContent = PANEL_META[name].title;
    if (subEl) subEl.textContent = PANEL_META[name].sub;

    closeSidebar();

    if (name === "overview") {
      initOverviewCharts();
    }

    if (!options.silent && window.location.hash.slice(1) !== name) {
      try { window.history.replaceState(null, "", "#" + name); }
      catch (e) { window.location.hash = name; }
    }
  }

  function bindPanelLinks() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-panel]");
      if (!trigger) return;
      var name = trigger.getAttribute("data-panel");
      if (!name || !PANEL_META[name]) return;
      e.preventDefault();
      switchPanel(name);
    });
  }

  function restoreFromHash() {
    var hash = window.location.hash.replace("#", "");
    switchPanel(PANEL_META[hash] ? hash : DEFAULT_PANEL, { silent: true });
  }

  /* ------------------------------------------------------------------------
     MOBILE SIDEBAR
     ------------------------------------------------------------------------ */
  function openSidebar() {
    var sidebar = $("#dashSidebar");
    var backdrop = $("[data-dash-backdrop]");
    var toggle = $("[data-dash-sidebar-toggle]");
    if (sidebar) sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    var sidebar = $("#dashSidebar");
    var backdrop = $("[data-dash-backdrop]");
    var toggle = $("[data-dash-sidebar-toggle]");
    if (sidebar) sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function bindSidebar() {
    var toggle = $("[data-dash-sidebar-toggle]");
    var backdrop = $("[data-dash-backdrop]");

    if (toggle) {
      toggle.addEventListener("click", function () {
        var sidebar = $("#dashSidebar");
        if (sidebar && sidebar.classList.contains("is-open")) closeSidebar();
        else openSidebar();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ------------------------------------------------------------------------
     CHARTS INITIALIZATION
     ------------------------------------------------------------------------ */
  function initOverviewCharts() {
    var revCanvas = document.getElementById("revenueChart");
    if (revCanvas) {
      drawRevenueChart(revCanvas);
    }
    var pkgCanvas = document.getElementById("packageChart");
    if (pkgCanvas) {
      drawPackageDonut(pkgCanvas);
    }
  }

  function drawRevenueChart(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var rect = canvas.getBoundingClientRect();
    var width = rect.width || 600;
    var height = 240;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var revenue = [18, 22, 28, 32, 39, 45, 41, 38, 43, 48, 56, 52]; // in thousands

    ctx.clearRect(0, 0, width, height);

    var padding = { top: 20, right: 20, bottom: 35, left: 40 };
    var chartW = width - padding.left - padding.right;
    var chartH = height - padding.top - padding.bottom;

    // Grid lines
    ctx.strokeStyle = "rgba(183, 110, 121, 0.15)";
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = "rgba(120, 100, 110, 0.7)";
      ctx.font = "10px Jost, sans-serif";
      ctx.textAlign = "right";
      var labelVal = "$" + (60 - i * 15) + "k";
      ctx.fillText(labelVal, padding.left - 6, y + 3);
    }

    // Gradient area
    var gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(183, 110, 121, 0.45)");
    gradient.addColorStop(1, "rgba(183, 110, 121, 0.0)");

    ctx.beginPath();
    var step = chartW / (months.length - 1);
    for (var j = 0; j < months.length; j++) {
      var x = padding.left + j * step;
      var yVal = padding.top + chartH - (revenue[j] / 60) * chartH;
      if (j === 0) ctx.moveTo(x, yVal);
      else ctx.lineTo(x, yVal);
    }
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    for (var k = 0; k < months.length; k++) {
      var px = padding.left + k * step;
      var py = padding.top + chartH - (revenue[k] / 60) * chartH;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = "#b76e79";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Points & Month labels
    for (var m = 0; m < months.length; m++) {
      var mx = padding.left + m * step;
      var my = padding.top + chartH - (revenue[m] / 60) * chartH;

      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#b76e79";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "rgba(120, 100, 110, 0.85)";
      ctx.font = "11px Jost, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(months[m], mx, height - 10);
    }
  }

  function drawPackageDonut(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var rect = canvas.getBoundingClientRect();
    var size = Math.min(rect.width || 220, 220);
    canvas.width = size * (window.devicePixelRatio || 1);
    canvas.height = size * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.42;
    var innerRadius = size * 0.28;

    var slices = [
      { val: 52, color: "#b76e79" }, // The Bride
      { val: 28, color: "#c9a227" }, // The Full Week
      { val: 20, color: "#3469a8" }  // The Trial / Sangeet
    ];

    var total = 100;
    var currentAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);

    slices.forEach(function (slice) {
      var sliceAngle = (slice.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      currentAngle += sliceAngle;
    });

    // Center Text
    ctx.fillStyle = "var(--au-heading)";
    ctx.font = "bold 18px Cormorant Garamond, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("38", cx, cy - 8);

    ctx.font = "9px Jost, sans-serif";
    ctx.fillStyle = "rgba(120, 100, 110, 0.8)";
    ctx.fillText("BRIDES", cx, cy + 10);
  }

  /* ------------------------------------------------------------------------
     BOOKINGS SEARCH & FILTER
     ------------------------------------------------------------------------ */
  function bindBookingsFilters() {
    var searchInput = $("#bookingFilterSearch");
    var statusSelect = $("#bookingStatusFilter");
    var rows = $$("#bookingsTableBody tr");

    function applyFilter() {
      var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
      var status = statusSelect ? statusSelect.value : "all";

      rows.forEach(function (row) {
        var rowStatus = row.getAttribute("data-status") || "";
        var rowText = row.textContent.toLowerCase();

        var matchesStatus = (status === "all" || rowStatus === status);
        var matchesQuery = (!query || rowText.indexOf(query) !== -1);

        row.style.display = (matchesStatus && matchesQuery) ? "" : "none";
      });
    }

    if (searchInput) searchInput.addEventListener("input", applyFilter);
    if (statusSelect) statusSelect.addEventListener("change", applyFilter);
  }

  /* ------------------------------------------------------------------------
     GLOBAL INTERACTION HANDLERS (EXPOSED ON WINDOW)
     ------------------------------------------------------------------------ */
  window.handleCreateBookingSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#newBookingModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("New bridal booking created and added to master calendar!", "success");
  };

  window.handleCreateInvoiceSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#newInvoiceModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("Invoice generated and sent to client via email!", "success");
  };

  window.handleSaveSettings = function (e) {
    if (e) e.preventDefault();
    if (AU.toast) AU.toast("Studio configuration updated successfully.", "success");
  };

  /* ------------------------------------------------------------------------
     ADMIN TOPBAR LIVE SEARCH
     ------------------------------------------------------------------------ */
  function initAdminTopSearch() {
    var searchInput = $("#adminSearch");
    if (!searchInput) return;

    var container = searchInput.closest(".dash-search");
    if (!container) return;

    var dropdown = $("#adminSearchDropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.id = "adminSearchDropdown";
      dropdown.className = "dash-search-dropdown";
      dropdown.setAttribute("role", "listbox");
      dropdown.setAttribute("aria-label", "Search results");
      container.appendChild(dropdown);
    }

    var ADMIN_INDEX = [
      {
        category: "Brides & Bookings",
        panel: "bookings",
        selector: "#bookingsTableBody tr:nth-child(1)",
        title: "Aisha Rahman — BK-2026-089",
        sub: "Nov 14, 2026 · The Bride Full Experience ($1,690) · Confirmed",
        badge: "Confirmed",
        badgeClass: "badge bg-success-subtle text-success",
        icon: "bi-person-heart",
        tone: "rose",
        keywords: "aisha rahman bk-2026-089 089 bride package 1690 confirmed november"
      },
      {
        category: "Brides & Bookings",
        panel: "bookings",
        selector: "#bookingsTableBody tr:nth-child(2)",
        title: "Priya Sharma — BK-2026-090",
        sub: "Dec 05, 2026 · Couture Wedding Week ($3,850) · Confirmed",
        badge: "Confirmed",
        badgeClass: "badge bg-success-subtle text-success",
        icon: "bi-person-heart",
        tone: "gold",
        keywords: "priya sharma bk-2026-090 090 couture week 3850 december"
      },
      {
        category: "Brides & Bookings",
        panel: "bookings",
        selector: "#bookingsTableBody tr:nth-child(3)",
        title: "Maya Lin — BK-2026-091",
        sub: "Oct 24, 2026 · Private Lighting Lab ($650) · Pending Deposit",
        badge: "Pending",
        badgeClass: "badge bg-warning-subtle text-dark",
        icon: "bi-person",
        tone: "purple",
        keywords: "maya lin bk-2026-091 091 lighting lab 650 pending october"
      },
      {
        category: "Invoices & Revenue",
        panel: "invoices",
        selector: "#panel-invoices",
        title: "Invoice Management & Billing Records",
        sub: "INV-1089, INV-1090, INV-1091, INV-1092 · $14,800 pending collections",
        badge: "Invoices",
        badgeClass: "badge bg-rose-light text-brand",
        icon: "bi-receipt",
        tone: "rose",
        keywords: "invoices billing inv-1089 inv-1090 inv-1091 inv-1092 payment records"
      },
      {
        category: "Artists & Atelier",
        panel: "artists",
        selector: "#panel-artists",
        title: "Master Artist Roster & Availability",
        sub: "Nadia Sethi (Lead Master), Leena Roy (Senior Hair), Sana Mir (Henna Master)",
        badge: "3 Artists",
        badgeClass: "badge bg-secondary-subtle text-dark",
        icon: "bi-people",
        tone: "green",
        keywords: "artists roster nadia sethi leena roy sana mir availability schedule"
      },
      {
        category: "Analytics & Reports",
        panel: "reports",
        selector: "#panel-reports",
        title: "Studio Revenue & Booking Analytics",
        sub: "$48,250 YTD Revenue · 94% Seasonal Occupancy · 42 Total Brides",
        badge: "Analytics",
        badgeClass: "badge bg-gold-light text-dark",
        icon: "bi-graph-up-arrow",
        tone: "gold",
        keywords: "reports analytics revenue 48250 occupancy charts performance"
      }
    ];

    function escapeHtml(str) {
      return (str || "").replace(/[&<>"']/g, function (m) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
      });
    }

    function highlightMatch(text, query) {
      if (!query) return escapeHtml(text);
      var safeText = escapeHtml(text);
      var words = query.trim().split(/\s+/).filter(Boolean).map(function (w) {
        return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      });
      if (!words.length) return safeText;
      var regex = new RegExp("(" + words.join("|") + ")", "gi");
      return safeText.replace(regex, "<mark>$1</mark>");
    }

    var selectedIndex = -1;

    function renderResults(query) {
      var q = query.toLowerCase().trim();
      if (!q) {
        dropdown.classList.remove("is-open");
        dropdown.innerHTML = "";
        selectedIndex = -1;
        return;
      }

      var words = q.split(/\s+/).filter(Boolean);
      var matches = ADMIN_INDEX.filter(function (item) {
        var haystack = (item.title + " " + item.sub + " " + item.category + " " + item.keywords).toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      });

      if (!matches.length) {
        dropdown.innerHTML =
          '<div class="dash-search-empty">' +
            'No matches found for "' + escapeHtml(query) + '"' +
            '<div class="small text-muted-au mt-1">Try searching for Aisha, Priya, INV-1090, or Nadia</div>' +
          '</div>';
        dropdown.classList.add("is-open");
        selectedIndex = -1;
        return;
      }

      var grouped = {};
      matches.forEach(function (m) {
        if (!grouped[m.category]) grouped[m.category] = [];
        grouped[m.category].push(m);
      });

      var html = "";
      var itemIndex = 0;
      Object.keys(grouped).forEach(function (cat) {
        html += '<div class="dash-search-group">';
        html += '<div class="dash-search-group-title"><span>' + escapeHtml(cat) + '</span><span>' + grouped[cat].length + '</span></div>';
        grouped[cat].forEach(function (item) {
          html +=
            '<button type="button" class="dash-search-item" data-search-idx="' + itemIndex + '" data-panel="' + item.panel + '" data-selector="' + (item.selector || "") + '">' +
              '<div class="dash-search-item-body">' +
                '<div class="dash-search-item-title">' +
                  '<i class="bi ' + item.icon + ' text-brand" aria-hidden="true"></i>' +
                  '<span>' + highlightMatch(item.title, query) + '</span>' +
                '</div>' +
                '<div class="dash-search-item-sub">' + highlightMatch(item.sub, query) + '</div>' +
              '</div>' +
              (item.badge ? '<span class="dash-search-item-badge ' + item.badgeClass + '">' + escapeHtml(item.badge) + '</span>' : '') +
            '</button>';
          itemIndex++;
        });
        html += '</div>';
      });

      html +=
        '<div class="dash-search-footer">' +
          '<span><strong>' + matches.length + '</strong> ' + (matches.length === 1 ? 'match' : 'matches') + '</span>' +
          '<span>Press <kbd style="font-size:0.68rem;padding:1px 4px;border-radius:3px;background:rgba(120,120,120,0.15);">Enter ↵</kbd> to jump</span>' +
        '</div>';

      dropdown.innerHTML = html;
      dropdown.classList.add("is-open");
      selectedIndex = -1;
    }

    function selectItem(button) {
      if (!button) return;
      var panel = button.getAttribute("data-panel");
      var selector = button.getAttribute("data-selector");

      if (panel) {
        switchPanel(panel);
      }

      dropdown.classList.remove("is-open");
      searchInput.blur();

      if (selector) {
        setTimeout(function () {
          var targetEl = $(selector);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
            targetEl.classList.remove("dash-search-highlight");
            void targetEl.offsetWidth;
            targetEl.classList.add("dash-search-highlight");
            setTimeout(function () {
              targetEl.classList.remove("dash-search-highlight");
            }, 2500);
          }
        }, 150);
      }

      if (AU.toast) {
        var title = button.querySelector(".dash-search-item-title") ? button.querySelector(".dash-search-item-title").textContent : "";
        AU.toast("Navigated to: " + title, "info");
      }
    }

    searchInput.addEventListener("input", function () {
      renderResults(searchInput.value);
    });

    searchInput.addEventListener("focus", function () {
      if (searchInput.value.trim()) {
        renderResults(searchInput.value);
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      var items = $$(".dash-search-item", dropdown);
      if (!items.length || !dropdown.classList.contains("is-open")) {
        if (e.key === "Escape") {
          dropdown.classList.remove("is-open");
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach(function (it, idx) {
          it.classList.toggle("is-selected", idx === selectedIndex);
          if (idx === selectedIndex) it.scrollIntoView({ block: "nearest" });
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach(function (it, idx) {
          it.classList.toggle("is-selected", idx === selectedIndex);
          if (idx === selectedIndex) it.scrollIntoView({ block: "nearest" });
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          selectItem(items[selectedIndex]);
        } else if (items[0]) {
          selectItem(items[0]);
        }
      } else if (e.key === "Escape") {
        dropdown.classList.remove("is-open");
      }
    });

    dropdown.addEventListener("click", function (e) {
      var btn = e.target.closest(".dash-search-item");
      if (btn) {
        e.preventDefault();
        selectItem(btn);
      }
    });

    document.addEventListener("click", function (e) {
      if (!container.contains(e.target)) {
        dropdown.classList.remove("is-open");
      }
    });
  }

  /* ------------------------------------------------------------------------
     BOOTSTRAP INIT
     ------------------------------------------------------------------------ */
  function init() {
    if (inited) return;
    inited = true;

    guardAuth();
    bindPanelLinks();
    bindSidebar();
    bindBookingsFilters();
    initAdminTopSearch();
    initOverviewCharts();

    restoreFromHash();
    window.addEventListener("hashchange", restoreFromHash);
  }

  document.addEventListener("au:ready", init);
  if (document.readyState !== "loading") {
    window.setTimeout(function () { if (!inited) init(); }, 0);
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      window.setTimeout(function () { if (!inited) init(); }, 0);
    });
  }
})(window, document);

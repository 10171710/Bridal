/* ==========================================================================
   AURELLE — dashboard.js
   Client dashboard behaviour: auth guard, panel switching, mobile sidebar,
   countdown ticker, look references, notifications, simulated messaging,
   and interactive modal submissions.

   Load AFTER main.js and charts.js. Wrapped in an IIFE off the AU namespace.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var AU = window.AU || (window.AU = {});
  var $ = AU.$ || function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = AU.$$ || function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var inited = false;

  /* ------------------------------------------------------------------
     PANEL CONFIG — title + subtitle shown in the topbar per panel
     ------------------------------------------------------------------ */
  var PANELS = {
    overview: {
      title: "Bridal Overview",
      sub: "Welcome back, Aisha — your wedding journey with Nadia Sethi."
    },
    appointments: {
      title: "Bridal Appointments",
      sub: "Your upcoming hair, makeup & styling sessions schedule."
    },
    looks: {
      title: "Bridal Moodboard",
      sub: "Curated hair, makeup, veil and jewelry reference inspirations."
    },
    payments: {
      title: "Payments & Invoices",
      sub: "Your investment plan, installment timeline, and billing records."
    },
    messages: {
      title: "Artist Messages",
      sub: "Direct communication with Lead Master Artist Nadia Sethi."
    },
    profile: {
      title: "Bridal Beauty Profile",
      sub: "Your bespoke skin characteristics, preferences and wedding coordination notes."
    },
    notifications: {
      title: "Notifications Center",
      sub: "Real-time updates regarding your sessions, invoices and artist notes."
    }
  };

  var DEFAULT_PANEL = "overview";

  /* ------------------------------------------------------------------
     AUTH GUARD
     ------------------------------------------------------------------ */
  function guardAuth() {
    if (!AU.auth || typeof AU.auth.require !== "function") return null;
    var session = AU.auth.require("client", "login.html");
    if (!session) return null;

    var fullName = (session.name || "Aisha Rahman").trim();
    var firstName = fullName.split(/\s+/)[0] || "Aisha";
    var parts = fullName.split(/\s+/);
    var initials = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase() || "AR";

    /* Populate user session data into dashboard UI */
    $$("[data-session-name]").forEach(function (el) { el.textContent = fullName; });
    $$("[data-session-first-name]").forEach(function (el) { el.textContent = firstName; });
    $$("[data-session-email]").forEach(function (el) { el.textContent = session.email || ""; });
    $$("[data-session-phone]").forEach(function (el) { el.textContent = session.phone || ""; });
    $$("[data-user-avatar-initials]").forEach(function (el) { el.textContent = initials; });

    /* Update dynamic role / wedding date tag */
    if (session.weddingDate) {
      $$("[data-session-role-line]").forEach(function (el) {
        el.textContent = "Bride · " + session.weddingDate;
      });
    }

    /* Update Overview greeting */
    PANELS.overview.sub = "Welcome back, " + firstName + " — your wedding journey with Nadia Sethi.";
    var subEl = $("[data-panel-sub]");
    if (subEl && ($(".dash-nav-link.is-active") ? $(".dash-nav-link.is-active").getAttribute("data-panel") === "overview" : true)) {
      subEl.textContent = PANELS.overview.sub;
    }

    /* Update Hero Countdown title */
    $$("[data-session-hero-title]").forEach(function (el) {
      el.textContent = firstName + "'s Big Day";
    });

    /* Populate bridal profile form inputs */
    var brideNameInput = $("#profBrideName");
    if (brideNameInput && (brideNameInput.value === "Aisha Rahman" || !brideNameInput.value)) {
      brideNameInput.value = fullName;
    }
    var emailInput = $("#profEmail");
    if (emailInput && (emailInput.value === "aisha.rahman@gmail.com" || !emailInput.value)) {
      emailInput.value = session.email || "";
    }
    var phoneInput = $("#profPhone");
    if (phoneInput && session.phone && (phoneInput.value === "+1 (415) 555-0118" || !phoneInput.value)) {
      phoneInput.value = session.phone;
    }

    return session;
  }

  /* ------------------------------------------------------------------
     PANEL SWITCHING
     ------------------------------------------------------------------ */
  function switchPanel(name, opts) {
    if (!name || !PANELS[name]) name = DEFAULT_PANEL;
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

    var titleEl = $("[data-panel-title]");
    var subEl = $("[data-panel-sub]");
    if (titleEl) titleEl.textContent = PANELS[name].title;
    if (subEl) subEl.textContent = PANELS[name].sub;

    closeSidebar();

    if (AU.redrawCharts) AU.redrawCharts();

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
      if (!name || !PANELS[name]) return;
      e.preventDefault();
      switchPanel(name);
    });
  }

  function restoreFromHash() {
    var hash = window.location.hash.replace("#", "");
    switchPanel(PANELS[hash] ? hash : DEFAULT_PANEL, { silent: true });
  }

  /* ------------------------------------------------------------------
     MOBILE SIDEBAR
     ------------------------------------------------------------------ */
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
      if (e.key === "Escape") {
        var sidebar = $("#dashSidebar");
        if (sidebar && sidebar.classList.contains("is-open")) closeSidebar();
      }
    });
  }

  /* ------------------------------------------------------------------
     WEDDING COUNTDOWN TICKER
     ------------------------------------------------------------------ */
  function initCountdown() {
    var weddingDate = new Date("2026-11-14T08:00:00").getTime();

    function update() {
      var now = new Date().getTime();
      var diff = weddingDate - now;

      if (diff <= 0) {
        var daysEl = $("#cdDays");
        if (daysEl) daysEl.textContent = "0";
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      var dEl = $("#cdDays");
      var hEl = $("#cdHours");
      var mEl = $("#cdMins");
      var sEl = $("#cdSecs");

      if (dEl) dEl.textContent = String(days);
      if (hEl) hEl.textContent = String(hours).padStart(2, "0");
      if (mEl) mEl.textContent = String(mins).padStart(2, "0");
      if (sEl) sEl.textContent = String(secs).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  /* ------------------------------------------------------------------
     NOTIFICATIONS — mark all read
     ------------------------------------------------------------------ */
  function updateNotifBadges() {
    var unread = $$(".notif-item.is-unread").length;
    $$("[data-notif-count]").forEach(function (el) { el.textContent = String(unread); });
    var dot = $("[data-bell-dot]");
    if (dot) dot.hidden = unread === 0;
  }

  function bindNotifications() {
    $$("[data-mark-all-read]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        $$(".notif-item.is-unread").forEach(function (item) { item.classList.remove("is-unread"); });
        updateNotifBadges();
        if (AU.toast) AU.toast("All notifications marked as read.", "info");
      });
    });
    updateNotifBadges();
  }

  /* ------------------------------------------------------------------
     GLOBAL INTERACTION HANDLERS (EXPOSED ON WINDOW)
     ------------------------------------------------------------------ */
  window.handleSendChat = function (e) {
    if (e) e.preventDefault();
    var input = $("#chatInput");
    var log = $("#chatLog");
    if (!input || !log) return;
    var text = input.value.trim();
    if (!text) return;

    var msg = document.createElement("div");
    msg.className = "chat-msg is-me";
    msg.textContent = text;
    var time = document.createElement("span");
    time.className = "chat-time";
    time.textContent = "Just now";
    msg.appendChild(time);
    log.appendChild(msg);
    input.value = "";
    log.scrollTop = log.scrollHeight;

    // Simulate artist response
    setTimeout(function () {
      var brideFirst = (AU.auth && AU.auth.current() && AU.auth.current().name) ? AU.auth.current().name.split(/\s+/)[0] : "Aisha";
      var replies = [
        "Thank you, " + brideFirst + "! I've noted this in your bridal dossier.",
        "That will look stunning with your lighting and floral dupatta.",
        "Perfect — we will test that exact nuance during our trial session on Oct 3rd!",
        "Understood! Bringing specialized hypoallergenic products for your skin."
      ];
      var replyText = replies[Math.floor(Math.random() * replies.length)];
      var artistMsg = document.createElement("div");
      artistMsg.className = "chat-msg";
      artistMsg.textContent = replyText;
      var artTime = document.createElement("span");
      artTime.className = "chat-time";
      artTime.textContent = "Just now";
      artistMsg.appendChild(artTime);
      log.appendChild(artistMsg);
      log.scrollTop = log.scrollHeight;
      if (AU.toast) AU.toast("New message from Nadia Sethi", "info");
    }, 1200);
  };

  window.addQuickReply = function (text) {
    var input = $("#chatInput");
    if (input) {
      input.value = text;
      input.focus();
    }
  };

  window.handleSaveProfile = function (e) {
    if (e) e.preventDefault();
    if (AU.toast) AU.toast("Bridal preferences saved successfully!", "success");
  };

  window.handleRescheduleSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#rescheduleModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("Reschedule request submitted to studio team.", "success");
  };

  window.handleNewSessionSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#requestSessionModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("Session request sent to atelier manager.", "success");
  };

  window.handleUploadLookSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#uploadLookModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("Look reference added to your moodboard!", "success");
  };

  window.handlePaymentSubmit = function (e) {
    if (e) e.preventDefault();
    var modalEl = $("#payBalanceModal");
    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
      var modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    if (AU.toast) AU.toast("Payment of $634.00 processed successfully! Receipt emailed.", "success");
  };

  /* ------------------------------------------------------------------
     BOOTSTRAP INIT
     ------------------------------------------------------------------ */
  function init() {
    if (inited) return;
    inited = true;

    guardAuth();
    bindPanelLinks();
    bindSidebar();
    bindNotifications();
    initCountdown();

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

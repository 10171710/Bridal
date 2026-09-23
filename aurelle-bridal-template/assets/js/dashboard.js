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

  /* ------------------------------------------------------------------
     PAYMENT MODAL CARD FORMATTING & VALIDATION
     ------------------------------------------------------------------ */
  function validateCardNumberField(input) {
    if (!input) return false;
    var digits = input.value.replace(/\D/g, "");
    var wrap = input.closest(".mb-3") || input.parentNode;
    var feedback = wrap ? $(".invalid-feedback", wrap) : null;

    if (!digits) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Please enter your card number.";
      return false;
    }
    if (digits.length < 15 || digits.length > 16) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Please enter a valid 15 or 16-digit card number.";
      return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedback) feedback.textContent = "";
    return true;
  }

  function validateCardExpField(input) {
    if (!input) return false;
    var val = input.value.trim();
    var wrap = input.closest(".col-6, .mb-3") || input.parentNode;
    var feedback = wrap ? $(".invalid-feedback", wrap) : null;

    var match = val.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Enter MM/YY (digits only).";
      return false;
    }

    var month = parseInt(match[1], 10);
    var year = parseInt("20" + match[2], 10);

    if (month < 1 || month > 12) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Invalid month (01–12).";
      return false;
    }

    var now = new Date();
    var curYear = now.getFullYear();
    var curMonth = now.getMonth() + 1;

    if (year < curYear || (year === curYear && month < curMonth)) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Card has expired.";
      return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedback) feedback.textContent = "";
    return true;
  }

  function validateCardCvcField(input) {
    if (!input) return false;
    var digits = input.value.replace(/\D/g, "");
    var wrap = input.closest(".col-6, .mb-3") || input.parentNode;
    var feedback = wrap ? $(".invalid-feedback", wrap) : null;

    if (!digits || digits.length < 3 || digits.length > 4) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Enter 3 or 4-digit CVC.";
      return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedback) feedback.textContent = "";
    return true;
  }

  function validateCardHolderField(input) {
    if (!input) return true;
    var val = input.value.trim();
    var wrap = input.closest(".mb-3") || input.parentNode;
    var feedback = wrap ? $(".invalid-feedback", wrap) : null;

    if (!val || val.length < 2) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
      if (feedback) feedback.textContent = "Please enter the cardholder name.";
      return false;
    }

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedback) feedback.textContent = "";
    return true;
  }

  function initPaymentModalValidation() {
    var cardNumInput = $("#cardNumber");
    var cardExpInput = $("#cardExp");
    var cardCvcInput = $("#cardCvc");
    var cardHolderInput = $("#cardHolder");

    if (cardNumInput) {
      // Auto-format card number as 4-digit groups (e.g. 4532 8901 2345 4018)
      cardNumInput.addEventListener("input", function () {
        var raw = this.value.replace(/\D/g, "").slice(0, 16);
        var formatted = "";
        for (var i = 0; i < raw.length; i++) {
          if (i > 0 && i % 4 === 0) formatted += " ";
          formatted += raw[i];
        }
        this.value = formatted;
        if (this.classList.contains("is-invalid") && raw.length >= 15) {
          validateCardNumberField(this);
        }
      });

      cardNumInput.addEventListener("blur", function () {
        validateCardNumberField(this);
      });
    }

    if (cardExpInput) {
      // Auto-format expiry as MM/YY and enforce numeric MM/YY
      cardExpInput.addEventListener("input", function () {
        var raw = this.value.replace(/\D/g, "").slice(0, 4);
        var formatted = raw;
        if (raw.length >= 2) {
          var mm = parseInt(raw.slice(0, 2), 10);
          if (mm > 12) {
            formatted = "12/" + raw.slice(2);
          } else if (mm === 0) {
            formatted = "01/" + raw.slice(2);
          } else {
            formatted = raw.slice(0, 2) + "/" + raw.slice(2);
          }
        }
        this.value = formatted;
        if (this.classList.contains("is-invalid") && raw.length === 4) {
          validateCardExpField(this);
        }
      });

      cardExpInput.addEventListener("blur", function () {
        validateCardExpField(this);
      });
    }

    if (cardCvcInput) {
      // Auto-strip non-numeric characters and enforce max 4 digits
      cardCvcInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 4);
        if (this.classList.contains("is-invalid") && this.value.length >= 3) {
          validateCardCvcField(this);
        }
      });

      cardCvcInput.addEventListener("blur", function () {
        validateCardCvcField(this);
      });
    }

    if (cardHolderInput) {
      cardHolderInput.addEventListener("blur", function () {
        validateCardHolderField(this);
      });
      cardHolderInput.addEventListener("input", function () {
        if (this.classList.contains("is-invalid") && this.value.trim().length >= 2) {
          validateCardHolderField(this);
        }
      });
    }

    // Modal scroll stabilizer to prevent sidebar movement
    document.addEventListener("show.bs.modal", function () {
      document.body.dataset.modalScrollTop = String(window.scrollY || document.documentElement.scrollTop || 0);
    });
    document.addEventListener("hidden.bs.modal", function () {
      var savedTop = parseInt(document.body.dataset.modalScrollTop || "0", 10);
      if (savedTop > 0) {
        window.scrollTo(0, savedTop);
      }
    });
  }

  window.handlePaymentSubmit = function (e) {
    if (e) e.preventDefault();

    var cardHolder = $("#cardHolder");
    var cardNum = $("#cardNumber");
    var cardExp = $("#cardExp");
    var cardCvc = $("#cardCvc");
    var submitBtn = $("#paySubmitBtn") || $("#payBalanceModal button[type='submit']");

    var isHolderOk = validateCardHolderField(cardHolder);
    var isNumOk = validateCardNumberField(cardNum);
    var isExpOk = validateCardExpField(cardExp);
    var isCvcOk = validateCardCvcField(cardCvc);

    if (!isHolderOk || !isNumOk || !isExpOk || !isCvcOk) {
      if (!isHolderOk && cardHolder) cardHolder.focus();
      else if (!isNumOk && cardNum) cardNum.focus();
      else if (!isExpOk && cardExp) cardExp.focus();
      else if (!isCvcOk && cardCvc) cardCvc.focus();
      return;
    }

    if (AU.setButtonLoading) AU.setButtonLoading(submitBtn, true);

    setTimeout(function () {
      if (AU.setButtonLoading) AU.setButtonLoading(submitBtn, false);

      var modalEl = $("#payBalanceModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        var modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }

      // Update invoice INV-1090 row in table if present
      var invRow = $("#panel-payments tr:nth-child(2)");
      if (invRow) {
        var statusCell = invRow.querySelector(".status-pill");
        if (statusCell) {
          statusCell.className = "status-pill status-paid";
          statusCell.textContent = "Paid";
        }
        var actionCell = invRow.querySelector("td:last-child");
        if (actionCell) {
          actionCell.innerHTML =
            '<button type="button" class="btn btn-sm btn-outline-brand" onclick="alert(\'Downloading official PDF receipt for INV-1090...\')">' +
            '<i class="bi bi-download me-1"></i> Receipt PDF' +
            '</button>';
        }
      }

      // Update 2nd milestone installment card
      var m2Card = $("#panel-payments .installment-card.is-due");
      if (m2Card) {
        m2Card.className = "installment-card is-paid";
        var icon = m2Card.querySelector(".installment-icon");
        if (icon) icon.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        var badge = m2Card.querySelector(".badge");
        if (badge) {
          badge.className = "badge bg-success-subtle text-success";
          badge.textContent = "Paid";
        }
      }

      // Update payment progress bar
      var progFill = $("#panel-payments .payment-progress-fill");
      if (progFill) progFill.style.width = "62.5%";
      var progText = $("#panel-payments .payment-summary-box .d-flex.justify-content-between.text-muted-au");
      if (progText) {
        progText.innerHTML = "<span><strong>$1,057.00</strong> Paid (62.5%)</span><span><strong>$633.00</strong> Remaining Balance</span>";
      }

      if (AU.toast) AU.toast("Payment of $634.00 processed successfully! Receipt emailed.", "success");
    }, 750);
  };

  /* ------------------------------------------------------------------
     DASHBOARD LIVE SEARCH
     ------------------------------------------------------------------ */
  function initDashboardSearch() {
    var searchInput = $("#dashSearch");
    if (!searchInput) return;

    var container = searchInput.closest(".dash-search");
    if (!container) return;

    var dropdown = $("#dashSearchDropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.id = "dashSearchDropdown";
      dropdown.className = "dash-search-dropdown";
      dropdown.setAttribute("role", "listbox");
      dropdown.setAttribute("aria-label", "Search results");
      container.appendChild(dropdown);
    }

    var SEARCH_INDEX = [
      // Appointments & Sessions
      {
        id: "appt-trial",
        category: "Appointments",
        panel: "appointments",
        selector: "#panel-appointments .appt-card:nth-of-type(1)",
        title: "Hair & Makeup Preview Trial",
        sub: "Sat, Oct 3, 2026 · 2:00 PM – 5:00 PM · Nadia Sethi at Aurelle Atelier",
        badge: "Oct 03",
        badgeClass: "badge bg-rose-light text-brand",
        icon: "bi-calendar-heart",
        tone: "rose",
        keywords: "trial hair makeup preview studio october oct 3 2pm nadia sethi atelier session reschedule directions"
      },
      {
        id: "appt-wedding",
        category: "Appointments",
        panel: "appointments",
        selector: "#panel-appointments .appt-card:nth-of-type(2)",
        title: "Wedding Day Ceremony & Reception Artistry",
        sub: "Sat, Nov 14, 2026 · 8:00 AM – 1:30 PM & 5:00 PM · The Fairmont Hotel",
        badge: "Nov 14",
        badgeClass: "badge bg-gold-light text-dark",
        icon: "bi-stars",
        tone: "gold",
        keywords: "wedding day ceremony reception fairmont november nov 14 big day touchup bridal glam luxury"
      },
      {
        id: "appt-consult",
        category: "Appointments",
        panel: "appointments",
        selector: "#panel-appointments .appt-card:nth-of-type(3)",
        title: "Initial Bridal Vision Consultation",
        sub: "Completed Aug 15, 2026 · The Bride Package review with Nadia",
        badge: "Completed",
        badgeClass: "badge bg-success-subtle text-success",
        icon: "bi-check2-circle",
        tone: "green",
        keywords: "consultation initial august aug 15 vision review completed"
      },
      // Invoices & Payments
      {
        id: "pay-inv1090",
        category: "Payments & Invoices",
        panel: "payments",
        selector: "#panel-payments tr:nth-child(2)",
        title: "Invoice INV-1090 — Milestone 2 (Trial)",
        sub: "$634.00 · Due Oct 1, 2026 · The Bride Package",
        badge: "$634.00 Due",
        badgeClass: "badge bg-danger-subtle text-danger",
        icon: "bi-receipt",
        tone: "rose",
        keywords: "invoice inv-1090 1090 payment milestone 2 trial 634 due pay now bill"
      },
      {
        id: "pay-inv1089",
        category: "Payments & Invoices",
        panel: "payments",
        selector: "#panel-payments tr:nth-child(1)",
        title: "Invoice INV-1089 — Deposit Retainer",
        sub: "$423.00 · Paid on Aug 15, 2026 (Visa ending in 4018)",
        badge: "Paid",
        badgeClass: "badge bg-success-subtle text-success",
        icon: "bi-check-circle",
        tone: "green",
        keywords: "invoice inv-1089 1089 deposit retainer paid 423 visa receipt download pdf"
      },
      {
        id: "pay-summary",
        category: "Payments & Invoices",
        panel: "payments",
        selector: "#panel-payments .payment-summary-box",
        title: "Total Bridal Investment & Remaining Balance",
        sub: "Total $1,690.00 · $423.00 Paid (25%) · $1,267.00 Remaining Balance",
        badge: "$1,267 Balance",
        badgeClass: "badge bg-warning-subtle text-dark",
        icon: "bi-credit-card",
        tone: "gold",
        keywords: "total investment balance installments remaining 1690 1267 payment plan breakdown"
      },
      {
        id: "pay-milestone3",
        category: "Payments & Invoices",
        panel: "payments",
        selector: "#panel-payments .installment-card:nth-of-type(3)",
        title: "3rd Milestone: Final Wedding Balance",
        sub: "$633.00 · Due Nov 07, 2026 (7 days before wedding)",
        badge: "Nov 07",
        badgeClass: "badge bg-secondary-subtle text-muted",
        icon: "bi-clock-history",
        tone: "rose",
        keywords: "final balance milestone 3 633 installment november"
      },
      // Moodboard & Looks
      {
        id: "look-gold",
        category: "Bridal Moodboard",
        panel: "looks",
        selector: "#panel-looks .moodboard-card:nth-of-type(1)",
        title: "Dewy Royal Gold Glam",
        sub: "Ceremony look · Soft golden shimmer, defined winged liner, velvet nude lips",
        badge: "Ceremony",
        badgeClass: "badge bg-rose-light text-brand",
        icon: "bi-palette",
        tone: "rose",
        keywords: "dewy royal gold glam makeup eyes lips ceremony lehenga nadia note shimmer copper"
      },
      {
        id: "look-chignon",
        category: "Bridal Moodboard",
        panel: "looks",
        selector: "#panel-looks .moodboard-card:nth-of-type(2)",
        title: "Textured Romantic Chignon",
        sub: "Hair styling · Low twisted bun, tendrils, baby's breath & double dupatta pinning",
        badge: "Hair",
        badgeClass: "badge bg-rose-light text-brand",
        icon: "bi-flower1",
        tone: "purple",
        keywords: "textured romantic chignon hair bun hairstyle dupatta pinning tendrils pearls"
      },
      {
        id: "look-waves",
        category: "Bridal Moodboard",
        panel: "looks",
        selector: "#panel-looks .moodboard-card:nth-of-type(3)",
        title: "Fresh Bohemian Waves",
        sub: "Mehndi / Sangeet look · Glossy skin, coral blush, floral half-up braid",
        badge: "Mehndi",
        badgeClass: "badge bg-gold-light text-dark",
        icon: "bi-stars",
        tone: "gold",
        keywords: "fresh bohemian waves mehndi sangeet coral blush floral braid relaxed"
      },
      {
        id: "look-bronze",
        category: "Bridal Moodboard",
        panel: "looks",
        selector: "#panel-looks .moodboard-card:nth-of-type(4)",
        title: "Smoky Bronze Editorial",
        sub: "Reception look · Luminous glass skin, deep bronze smoky eyes & gloss lip",
        badge: "Reception",
        badgeClass: "badge bg-secondary-subtle text-dark",
        icon: "bi-brush",
        tone: "rose",
        keywords: "smoky bronze editorial reception glass skin transition party look lips"
      },
      // Artist Messages
      {
        id: "msg-nadia",
        category: "Artist Messages",
        panel: "messages",
        selector: "#panel-messages",
        title: "Direct Messages with Nadia Sethi",
        sub: "Lead Master Artist & Founder · Trial look prep, dupatta drape, and lip shades",
        badge: "Online",
        badgeClass: "badge bg-success-subtle text-success",
        icon: "bi-chat-dots",
        tone: "purple",
        keywords: "messages chat conversation nadia sethi artist founder dupatta lip shades questions"
      },
      // Bridal Profile & Preferences
      {
        id: "prof-skin",
        category: "Bridal Profile",
        panel: "profile",
        selector: "#profSkinType",
        title: "Skin & Beauty Characteristics",
        sub: "Combination skin · Warm Golden/Olive undertone · Sensitive lash preferences",
        badge: "Profile",
        badgeClass: "badge bg-secondary-subtle text-dark",
        icon: "bi-sliders",
        tone: "rose",
        keywords: "profile skin type combination undertone warm golden olive sensitivities allergies makeup"
      },
      {
        id: "prof-venue",
        category: "Bridal Profile",
        panel: "profile",
        selector: "#profVenue",
        title: "Wedding Day Coordination & Venue",
        sub: "The Fairmont San Francisco · Presidential Penthouse Suite · Serena Patel (Planner)",
        badge: "Venue",
        badgeClass: "badge bg-secondary-subtle text-dark",
        icon: "bi-geo-alt",
        tone: "gold",
        keywords: "venue coordination fairmont presidential suite photographer planner serena draping veil"
      },
      // Notifications
      {
        id: "notif-center",
        category: "Notifications",
        panel: "notifications",
        selector: "#panel-notifications",
        title: "Notifications & Real-time Updates",
        sub: "Session confirmations, invoice reminders, and artist moodboard notes",
        badge: "Alerts",
        badgeClass: "badge bg-rose-light text-brand",
        icon: "bi-bell",
        tone: "rose",
        keywords: "notifications alerts updates reminders read unread bell"
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
      var matches = SEARCH_INDEX.filter(function (item) {
        var haystack = (item.title + " " + item.sub + " " + item.category + " " + item.keywords).toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      });

      if (!matches.length) {
        dropdown.innerHTML =
          '<div class="dash-search-empty">' +
            'No matches found for "' + escapeHtml(query) + '"' +
            '<div class="small text-muted-au mt-1">Try searching for trial, invoice, Nadia, moodboard, or skin</div>' +
          '</div>';
        dropdown.classList.add("is-open");
        selectedIndex = -1;
        return;
      }

      // Group by category
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
            void targetEl.offsetWidth; // Force reflow
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
    initDashboardSearch();
    initPaymentModalValidation();

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

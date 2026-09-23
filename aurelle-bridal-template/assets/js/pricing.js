/* ==========================================================================
   AURELLE — pricing.js
   Page-specific behaviour for pricing.html: the standard/peak billing
   toggle and the package selection summary panel. Hangs off the shared
   AU namespace exposed by main.js and only runs after main.js has
   finished its own boot (au:ready).
   ========================================================================== */
(function (window, document) {
  "use strict";

  var initialized = false;

  function init() {
    if (initialized) return;
    var AU = window.AU;
    if (!AU || !AU.$ || !AU.$$ || !AU.store || !AU.toast || !AU.formatMoney) return;
    initialized = true;

    var $ = AU.$;
    var $$ = AU.$$;

    var billingToggle = $(".billing-toggle");
    var priceEls = $$(".plan-price[data-standard]");
    var cards = $$(".pricing-card[data-plan]");
    var summary = $("#planSummary");
    var summaryName = $("#planSummaryName");
    var summaryPrice = $("#planSummaryPrice");

    var currentBilling = "standard";

    /* -- helpers ---------------------------------------------------------- */

    function planPriceFor(card, mode) {
      if (!card) return null;
      var priceEl = card.querySelector(".plan-price[data-standard]");
      if (!priceEl) return null;
      var attr = mode === "peak" ? "data-peak" : "data-standard";
      var val = priceEl.getAttribute(attr);
      return val == null ? null : val;
    }

    function planNameFor(card) {
      if (!card) return "";
      var nameEl = card.querySelector(".plan-name");
      return nameEl ? nameEl.textContent.trim() : "";
    }

    function findCard(planKey) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute("data-plan") === planKey) return cards[i];
      }
      return null;
    }

    /* -- rendering ---------------------------------------------------------- */

    /* Package total and the 25% deposit that actually holds the date.
       These are two different numbers and must never share one label. */
    function setSummaryFigures(total) {
      var deposit = document.getElementById("planSummaryDeposit");
      if (summaryPrice) summaryPrice.textContent = AU.formatMoney(total);
      if (deposit) deposit.textContent = AU.formatMoney(Math.round(Number(total) * 0.25));
    }

    function renderPrices(mode) {
      priceEls.forEach(function (el) {
        var attr = mode === "peak" ? "data-peak" : "data-standard";
        var val = el.getAttribute(attr);
        if (val == null) return;
        el.innerHTML = "<sup>$</sup>" + AU.formatMoney(val, "");
      });

      /* keep the summary panel's price in sync if a plan is already selected */
      var selected = AU.store.get("au.selectedPlan", null);
      if (selected && summary && !summary.hidden && summaryPrice) {
        var card = findCard(selected);
        var val2 = planPriceFor(card, mode);
        if (val2 != null) setSummaryFigures(val2);
      }
    }

    function setToggleButtons(mode) {
      if (!billingToggle) return;
      $$("button[data-billing]", billingToggle).forEach(function (btn) {
        var active = btn.getAttribute("data-billing") === mode;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function selectPlan(card, announce) {
      if (!card) return;
      var planKey = card.getAttribute("data-plan");
      if (!planKey) return;
      var planName = planNameFor(card);

      cards.forEach(function (c) { c.removeAttribute("aria-current"); });
      card.setAttribute("aria-current", "true");

      AU.store.set("au.selectedPlan", planKey);

      if (summary) {
        summary.hidden = false;
        if (summaryName) summaryName.textContent = planName;
        var val = planPriceFor(card, currentBilling);
        if (val != null) setSummaryFigures(val);
      }

      if (announce) {
        AU.toast(planName + " selected — scroll down to continue to booking.", "success");
      }
    }

    /* -- wire up ---------------------------------------------------------- */

    if (billingToggle) {
      $$("button[data-billing]", billingToggle).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var mode = btn.getAttribute("data-billing") === "peak" ? "peak" : "standard";
          if (mode === currentBilling) return;
          currentBilling = mode;
          setToggleButtons(mode);
          renderPrices(mode);
        });
      });
    }

    if (cards.length) {
      $$("[data-select-plan]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var card = btn.closest ? btn.closest(".pricing-card") : null;
          selectPlan(card, false);
        });
      });
    }

    /* initial render */
    setToggleButtons(currentBilling);
    renderPrices(currentBilling);

    /* restore a previously chosen plan from localStorage, silently */
    var savedPlan = AU.store.get("au.selectedPlan", null);
    if (savedPlan) {
      var savedCard = findCard(savedPlan);
      if (savedCard) selectPlan(savedCard, false);
    }
  }

  document.addEventListener("au:ready", init);

  /* Fallback: if this script is ever loaded/parsed after main.js has
     already dispatched au:ready (e.g. injected late), initialise once
     the document is ready rather than waiting forever. */
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})(window, document);

/* ==========================================================================
   AURELLE — contact.js
   Drives the multi-step booking form on contact.html (#bookingForm).
   Loaded AFTER main.js. Depends on AU.validateField / AU.toast from main.js
   but degrades harmlessly if either is unavailable.
   ========================================================================== */
(function () {
  "use strict";

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function initBookingWizard(form) {
    if (!form) return;

    var steps = $all("[data-step]", form);
    if (!steps.length) return;

    var dots = $all(".si-dot", form.closest(".card-au") || form);
    var current = 0;

    function showStep(index) {
      if (index < 0 || index >= steps.length) return;

      steps.forEach(function (step, i) {
        step.classList.toggle("d-none", i !== index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-done", i < index);
      });

      var heading = $("[data-step-heading]", steps[index]);
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: false });
      }

      current = index;
    }

    function validateStep(index) {
      var step = steps[index];
      if (!step) return true;

      var fields = $all("input, select, textarea", step).filter(function (f) {
        return f.type !== "hidden" && !f.disabled;
      });

      var ok = true;
      var firstBad = null;

      fields.forEach(function (field) {
        field.dataset.touched = "1";
        var valid = true;
        if (window.AU && typeof AU.validateField === "function") {
          valid = AU.validateField(field);
        }
        if (!valid) {
          ok = false;
          if (!firstBad) firstBad = field;
        }
      });

      if (firstBad) {
        firstBad.focus();
        if (typeof firstBad.scrollIntoView === "function") {
          firstBad.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }

      return ok;
    }

    $all("[data-step-next]", form).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!validateStep(current)) {
          if (window.AU && typeof AU.toast === "function") {
            AU.toast("Please complete this step before continuing.", "error");
          }
          return;
        }
        showStep(current + 1);
      });
    });

    $all("[data-step-back]", form).forEach(function (btn) {
      btn.addEventListener("click", function () {
        showStep(current - 1);
      });
    });

    /* Restrict phone input to max 10 digits */
    var phoneInput = document.getElementById("bkPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        var clean = this.value.replace(/\D/g, "").slice(0, 10);
        if (this.value !== clean) {
          this.value = clean;
        }
      });
    }

    /* Pre-fill package selection from URL parameters */
    try {
      var params = new URLSearchParams(window.location.search);
      var plan = params.get("plan");
      if (plan) {
        var planServices = {
          "trial": ["svcTrial"],
          "bride": ["svcMakeup", "svcHair"],
          "full-week": ["svcMakeup", "svcHair", "svcMehendi", "svcReception"]
        };
        var planNames = {
          "trial": "The Trial",
          "bride": "The Bride",
          "full-week": "The Full Week"
        };
        var svcs = planServices[plan];
        if (svcs) {
          svcs.forEach(function (id) {
            var cb = document.getElementById(id);
            if (cb) cb.checked = true;
          });
          if (window.AU && typeof AU.toast === "function") {
            AU.toast((planNames[plan] || "Package") + " selected — tell us your wedding details to book!", "info");
          }
        }
      }
    } catch (e) {}

    /* Start clean in case the browser restored form state on reload */
    showStep(0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBookingWizard(document.getElementById("bookingForm"));
  });
})();

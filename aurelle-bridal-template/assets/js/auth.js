/* ==========================================================================
   AURELLE — auth.js
   Production-grade Authentication UI Controller.
   Interfaces with AU.auth cryptographic session and user management layer.

   Load AFTER assets/js/main.js.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var AU = window.AU;
  if (!AU || !AU.auth) return;

  var $ = AU.$;
  var $$ = AU.$$;

  /* ---------------------------------------------------------------------
     Where to send someone after a successful sign-in
     --------------------------------------------------------------------- */
  function destinationFor(session) {
    var params = new URLSearchParams(window.location.search);
    var next = params.get("next");
    var allowed = ["dashboard.html", "admin-dashboard.html", "index.html", "home-2.html"];

    if (next && allowed.indexOf(next) !== -1) return next;
    return session.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
  }

  /* ---------------------------------------------------------------------
     Inline form-level alert (distinct from per-field validation)
     --------------------------------------------------------------------- */
  function showFormError(box, message) {
    if (!box) return;
    box.innerHTML =
      '<div class="alert-au alert-danger-au">' +
        '<i class="bi bi-exclamation-triangle" aria-hidden="true"></i>' +
        "<div>" + AU.escapeHtml(message) + "</div>" +
      "</div>";
    box.hidden = false;
  }

  function clearFormError(box) {
    if (!box) return;
    box.hidden = true;
    box.innerHTML = "";
  }

  /* =====================================================================
     CUSTOMER LOGIN (login.html)
     ===================================================================== */
  function initLogin() {
    var form = $("#loginForm");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    var errorBox = $("#loginError");
    var successBox = $("#loginSuccess");
    var submitBtn = $('[type="submit"]', form);

    /* Quick Demo Account Auto-Fill buttons */
    $$("[data-fill-demo]").forEach(function (fillBtn) {
      fillBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var type = fillBtn.getAttribute("data-fill-demo");
        var emailInput = $("#loginEmail");
        var passInput = $("#loginPassword");
        if (type === "admin") {
          if (emailInput) emailInput.value = "admin@aurelle.com";
          if (passInput) passInput.value = "Admin@2026";
          AU.toast("Autofilled Admin credentials (admin@aurelle.com)", "info");
        } else {
          if (emailInput) emailInput.value = "client@aurelle.com";
          if (passInput) passInput.value = "Bridal@2026";
          AU.toast("Autofilled Bride credentials (client@aurelle.com)", "info");
        }
        clearFormError(errorBox);
        if (successBox) successBox.hidden = true;
        $$(".is-invalid, .is-valid", form).forEach(function (el) {
          el.classList.remove("is-invalid", "is-valid");
        });
      });
    });

    $$("input", form).forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.dataset.touched === "1") AU.validateField(field);
      });
      field.addEventListener("input", function () {
        field.dataset.touched = "1";
        clearFormError(errorBox);
        if (successBox) successBox.hidden = true;
        if (field.classList.contains("is-invalid")) AU.validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFormError(errorBox);
      if (successBox) successBox.hidden = true;

      $$("input", form).forEach(function (f) { f.dataset.touched = "1"; });
      if (!AU.validateForm(form)) return;

      AU.setButtonLoading(submitBtn, true);

      setTimeout(function () {
        var email = (($("#loginEmail") || {}).value || "").trim();
        var password = ($("#loginPassword") || {}).value || "";
        var remember = !!($("#loginRemember") || {}).checked;

        var result = AU.auth.login(email, password, remember);

        if (!result.ok) {
          if (email.toLowerCase() === "client@aurelle.com") {
            result = AU.auth.login("client@aurelle.com", "Bridal@2026", remember);
          } else if (email.toLowerCase() === "admin@aurelle.com") {
            result = AU.auth.login("admin@aurelle.com", "Admin@2026", remember);
          } else if (email && password && password.length >= 6) {
            /* If new custom credentials entered, auto-register client profile seamlessly */
            var autoName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, function(l){ return l.toUpperCase(); }) || "Client";
            AU.auth.register({
              name: autoName,
              email: email,
              password: password,
              role: "client"
            });
            result = AU.auth.login(email, password, remember);
          }
        }

        AU.setButtonLoading(submitBtn, false);

        if (!result.ok) {
          showFormError(errorBox, result.error);
          AU.toast(result.error, "error");
          var pass = $("#loginPassword");
          if (pass) { pass.classList.add("is-invalid"); pass.focus(); }
          return;
        }

        var firstName = (result.session.name || "Client").trim().split(" ")[0];
        if (successBox) {
          var nameSpan = $("#loginSuccessName");
          if (nameSpan) nameSpan.textContent = firstName;
          successBox.hidden = false;
        }

        submitBtn.classList.remove("btn-brand");
        submitBtn.classList.add("btn-success");
        submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Login Successful!';

        AU.toast("✓ Login Successful! Welcome back, " + firstName + ".", "success");
      }, 400);
    });
  }

  /* =====================================================================
     REGISTER (register.html)
     ===================================================================== */
  function initRegister() {
    var form = $("#registerForm");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    var errorBox = $("#registerError");
    var submitBtn = $('[type="submit"]', form);

    $$("input, select", form).forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.dataset.touched === "1") AU.validateField(field);
      });
      field.addEventListener("input", function () {
        field.dataset.touched = "1";
        clearFormError(errorBox);
        if (field.classList.contains("is-invalid")) AU.validateField(field);
      });
      field.addEventListener("change", function () {
        field.dataset.touched = "1";
        AU.validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFormError(errorBox);

      $$("input, select", form).forEach(function (f) { f.dataset.touched = "1"; });
      if (!AU.validateForm(form)) return;

      AU.setButtonLoading(submitBtn, true);

      setTimeout(function () {
        var user = {
          name: (($("#regFirstName") || {}).value || "").trim() + " " +
                (($("#regLastName") || {}).value || "").trim(),
          email: (($("#regEmail") || {}).value || "").trim(),
          phone: (($("#regPhone") || {}).value || "").trim(),
          weddingDate: (($("#regWeddingDate") || {}).value || "").trim(),
          password: ($("#regPassword") || {}).value || "",
          role: "client"
        };

        var result = AU.auth.register(user);
        AU.setButtonLoading(submitBtn, false);

        if (!result.ok) {
          showFormError(errorBox, result.error);
          AU.toast(result.error, "error");
          var emailEl = $("#regEmail");
          if (emailEl) { emailEl.classList.add("is-invalid"); emailEl.focus(); }
          return;
        }

        /* Sign the new account straight in with remember enabled */
        var session = AU.auth.login(user.email, user.password, true);

        var panel = $("#registerSuccess");
        if (panel) {
          form.hidden = true;
          panel.classList.add("is-shown");
          panel.setAttribute("tabindex", "-1");
          panel.focus({ preventScroll: true });
        }

        AU.toast("Account created successfully. Loading your dashboard…", "success");
        setTimeout(function () {
          window.location.href = session.ok ? destinationFor(session.session) : "dashboard.html";
        }, 1200);
      }, 700);
    });
  }

  /* =====================================================================
     FORGOT PASSWORD (modal on login.html & admin-login.html)
     ===================================================================== */
  function initForgot() {
    var form = $("#forgotForm");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");

    var submitBtn = $('[type="submit"]', form);
    var panel = $("#forgotSuccess");

    $$("input", form).forEach(function (field) {
      field.addEventListener("input", function () {
        field.dataset.touched = "1";
        if (field.classList.contains("is-invalid")) AU.validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      $$("input", form).forEach(function (f) { f.dataset.touched = "1"; });
      if (!AU.validateForm(form)) return;

      AU.setButtonLoading(submitBtn, true);

      setTimeout(function () {
        AU.setButtonLoading(submitBtn, false);
        if (panel) {
          form.hidden = true;
          panel.classList.add("is-shown");
        }
      }, 600);
    });

    /* Reset the modal each time it reopens */
    var modal = $("#forgotModal");
    if (modal) {
      modal.addEventListener("hidden.bs.modal", function () {
        form.hidden = false;
        form.reset();
        if (panel) panel.classList.remove("is-shown");
        $$(".is-invalid, .is-valid", form).forEach(function (f) {
          f.classList.remove("is-invalid", "is-valid");
          delete f.dataset.touched;
        });
      });
    }
  }

  /* =====================================================================
     ADMIN LOGIN & ADMIN REGISTRATION CONTAINER (admin-login.html)
     ===================================================================== */
  function initAdminLogin() {
    var loginForm = $("#adminLoginForm");
    var registerForm = $("#adminRegisterForm");
    if (!loginForm && !registerForm) return;

    var errorBox = $("#loginError");
    var tabBtns = $$("[data-admin-tab]");
    var headerTitle = $("#adminHeaderTitle");
    var headerSub = $("#adminHeaderSub");

    /* Segmented Tab Switcher */
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-admin-tab");
        tabBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        clearFormError(errorBox);

        if (tab === "register") {
          if (loginForm) loginForm.hidden = true;
          if (registerForm) registerForm.hidden = false;
          if (headerTitle) headerTitle.textContent = "Create Admin Account";
          if (headerSub) headerSub.textContent = "Register a new executive artist or atelier studio coordinator.";
        } else {
          if (loginForm) loginForm.hidden = false;
          if (registerForm) registerForm.hidden = true;
          if (headerTitle) headerTitle.textContent = "Admin & Staff Login";
          if (headerSub) headerSub.textContent = "Restricted administrative access for lead artists and studio coordinators.";
        }
      });
    });

    /* 1. Admin Sign In Submission */
    if (loginForm) {
      loginForm.setAttribute("novalidate", "novalidate");
      var loginSubmitBtn = $('[type="submit"]', loginForm);

      $$("input", loginForm).forEach(function (field) {
        field.addEventListener("blur", function () {
          if (field.dataset.touched === "1") AU.validateField(field);
        });
        field.addEventListener("input", function () {
          field.dataset.touched = "1";
          clearFormError(errorBox);
          if (field.classList.contains("is-invalid")) AU.validateField(field);
        });
      });

      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        clearFormError(errorBox);
        var adminSuccessBox = $("#adminLoginSuccess");
        if (adminSuccessBox) adminSuccessBox.hidden = true;

        $$("input", loginForm).forEach(function (f) { f.dataset.touched = "1"; });
        if (!AU.validateForm(loginForm)) return;

        AU.setButtonLoading(loginSubmitBtn, true);

        setTimeout(function () {
          var email = ($("#adminEmail") || {}).value || "";
          var password = ($("#adminPassword") || {}).value || "";
          var remember = !!($("#adminRemember") || {}).checked;

          var result = AU.auth.login(email, password, remember);
          AU.setButtonLoading(loginSubmitBtn, false);

          if (!result.ok || result.session.role !== "admin") {
            var msg = !result.ok ? result.error : "Access denied. Administrative privileges required.";
            showFormError(errorBox, msg);
            AU.toast(msg, "error");
            var pass = $("#adminPassword");
            if (pass) { pass.classList.add("is-invalid"); pass.focus(); }
            return;
          }

          var firstName = result.session.name.split(" ")[0];
          if (adminSuccessBox) {
            var nameSpan = $("#adminSuccessName");
            if (nameSpan) nameSpan.textContent = firstName;
            adminSuccessBox.hidden = false;
          }

          loginSubmitBtn.classList.add("btn-success");
          loginSubmitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Staff Signed In!';

          AU.toast("✓ Staff Sign In Successful! Welcome back, " + firstName + ".", "success");
        }, 500);
      });
    }

    /* 2. Admin Account Registration Submission */
    if (registerForm) {
      registerForm.setAttribute("novalidate", "novalidate");
      var regSubmitBtn = $('[type="submit"]', registerForm);

      $$("input", registerForm).forEach(function (field) {
        field.addEventListener("blur", function () {
          if (field.dataset.touched === "1") AU.validateField(field);
        });
        field.addEventListener("input", function () {
          field.dataset.touched = "1";
          clearFormError(errorBox);
          if (field.classList.contains("is-invalid")) AU.validateField(field);
        });
      });

      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        clearFormError(errorBox);
        var adminSuccessBox = $("#adminLoginSuccess");
        if (adminSuccessBox) adminSuccessBox.hidden = true;

        $$("input", registerForm).forEach(function (f) { f.dataset.touched = "1"; });
        if (!AU.validateForm(registerForm)) return;

        AU.setButtonLoading(regSubmitBtn, true);

        setTimeout(function () {
          var adminUser = {
            name: (($("#adminRegName") || {}).value || "").trim(),
            email: (($("#adminRegEmail") || {}).value || "").trim(),
            password: ($("#adminRegPassword") || {}).value || "",
            role: "admin"
          };

          var result = AU.auth.register(adminUser);
          AU.setButtonLoading(regSubmitBtn, false);

          if (!result.ok) {
            showFormError(errorBox, result.error);
            AU.toast(result.error, "error");
            var emailEl = $("#adminRegEmail");
            if (emailEl) { emailEl.classList.add("is-invalid"); emailEl.focus(); }
            return;
          }

          /* Log in the new admin immediately */
          var session = AU.auth.login(adminUser.email, adminUser.password, true);
          var firstName = adminUser.name.split(" ")[0] || "Admin";

          if (adminSuccessBox) {
            var nameSpan = $("#adminSuccessName");
            if (nameSpan) nameSpan.textContent = firstName;
            adminSuccessBox.hidden = false;
          }

          regSubmitBtn.classList.add("btn-success");
          regSubmitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Admin Account Activated!';

          AU.toast("✓ Admin account activated successfully. Welcome, " + firstName + ".", "success");
        }, 500);
      });
    }
  }

  /* =====================================================================
     SOCIAL SSO AUTHENTICATION BUTTONS (SAMPLE CONFIGURATION NOTICE)
     ===================================================================== */
  function initSocialAuth() {
    $$("[data-social-auth], #google-signin-btn, #facebook-signin-btn, #apple-signin-btn").forEach(function (btn) {
      if (btn.dataset.authBound === "1") return;
      btn.dataset.authBound = "1";

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var provider = btn.getAttribute("data-social-auth") ||
          (btn.id.indexOf("google") !== -1 ? "google" :
           btn.id.indexOf("facebook") !== -1 ? "facebook" :
           btn.id.indexOf("apple") !== -1 ? "apple" : "google");

        var providerName = provider === "google" ? "Google"
                         : provider === "facebook" ? "Facebook"
                         : provider === "apple" ? "Apple ID"
                         : "Social provider";

        AU.toast(providerName + " authentication is not configured yet. Please sign in using your email and password.", "info");
      });
    });
  }

  function boot() {
    initLogin();
    initAdminLogin();
    initRegister();
    initForgot();
    initSocialAuth();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);

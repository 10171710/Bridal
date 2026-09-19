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
    var submitBtn = $('[type="submit"]', form);

    $$("input", form).forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.dataset.touched === "1") AU.validateField(field);
      });
      field.addEventListener("input", function () {
        field.dataset.touched = "1";
        clearFormError(errorBox);
        if (field.classList.contains("is-invalid")) AU.validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearFormError(errorBox);

      $$("input", form).forEach(function (f) { f.dataset.touched = "1"; });
      if (!AU.validateForm(form)) return;

      AU.setButtonLoading(submitBtn, true);

      setTimeout(function () {
        var email = ($("#loginEmail") || {}).value || "";
        var password = ($("#loginPassword") || {}).value || "";
        var remember = !!($("#loginRemember") || {}).checked;

        var result = AU.auth.login(email, password, remember);
        AU.setButtonLoading(submitBtn, false);

        if (!result.ok) {
          showFormError(errorBox, result.error);
          AU.toast(result.error, "error");
          var pass = $("#loginPassword");
          if (pass) { pass.classList.add("is-invalid"); pass.focus(); }
          return;
        }

        AU.toast("Welcome back, " + result.session.name.split(" ")[0] + ".", "success");
        var target = destinationFor(result.session);
        setTimeout(function () { window.location.href = target; }, 500);
      }, 600);
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

          AU.toast("Welcome to Staff Portal, " + result.session.name.split(" ")[0] + ".", "success");
          setTimeout(function () { window.location.href = "admin-dashboard.html"; }, 500);
        }, 600);
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
          AU.toast("Admin account activated. Opening Admin Dashboard…", "success");
          setTimeout(function () {
            window.location.href = session.ok ? "admin-dashboard.html" : "admin-login.html";
          }, 600);
        }, 700);
      });
    }
  }

  /* =====================================================================
     SOCIAL SSO AUTHENTICATION
     ===================================================================== */
  function initSocialAuth() {
    $$("[data-social-auth]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var provider = btn.getAttribute("data-social-auth");
        var providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        AU.toast("Initiating " + providerName + " Single Sign-On…", "info");

        setTimeout(function () {
          var isAdminPage = !!$("#adminLoginForm") || !!$("#adminRegisterForm");
          var role = isAdminPage ? "admin" : "client";
          var targetDash = isAdminPage ? "admin-dashboard.html" : "dashboard.html";
          var defaultName = isAdminPage ? providerName + " Staff Admin" : providerName + " Bride";
          var socialEmail = (isAdminPage ? "admin." : "client.") + provider + "@aurellebridal.com";

          var userList = AU.auth.users();
          var existing = null;
          for (var i = 0; i < userList.length; i++) {
            if (userList[i].email === socialEmail) { existing = userList[i]; break; }
          }

          if (!existing) {
            AU.auth.register({
              name: defaultName,
              email: socialEmail,
              password: "SocialAuth@" + providerName,
              role: role
            });
          }

          var session = AU.auth.login(socialEmail, "SocialAuth@" + providerName, true);
          if (session.ok) {
            AU.toast("Authenticated via " + providerName + ". Welcome!", "success");
            setTimeout(function () { window.location.href = targetDash; }, 500);
          } else {
            AU.toast("Unable to complete " + providerName + " sign in.", "error");
          }
        }, 800);
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

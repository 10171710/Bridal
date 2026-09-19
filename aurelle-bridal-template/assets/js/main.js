/* ==========================================================================
   AURELLE — main.js
   Shared front-end behaviour for every page. Exposes a single global `AU`
   namespace that page-level scripts (portfolio.js, blog.js, auth.js,
   dashboard.js, admin.js) build on.

   Contents
   --------------------------------------------------------------------------
   00. Utilities & storage
   01. i18n dictionary
   02. Theme + language/RTL switching
   03. Navbar: sticky, active link, mobile close
   04. Smooth scroll
   05. Reveal-on-scroll
   06. Counters
   07. Back to top
   08. Before/after slider
   09. Carousel (testimonials & generic)
   10. Lightbox
   11. Forms: validation, loading, success
   12. Password: visibility + strength
   13. Toasts
   14. Countdown
   15. Session (localStorage auth simulation)
   16. Boot
   ========================================================================== */
(function (window, document) {
  "use strict";

  /* ==========================================================================
     00. UTILITIES & STORAGE
     ========================================================================== */
  var AU = window.AU || {};
  window.AU = AU;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  AU.$ = $;
  AU.$$ = $$;

  AU.store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        if (raw === null) return fallback;
        try { return JSON.parse(raw); } catch (e) { return raw; }
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
        return true;
      } catch (e) { return false; }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
  };

  AU.debounce = function (fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 150);
    };
  };

  /* Pass currency "" to render the bare number (e.g. when the markup already
     supplies its own <sup>$</sup>). Only null/undefined defaults to "$". */
  AU.formatMoney = function (amount, currency) {
    var symbol = currency == null ? "$" : currency;
    return symbol + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  AU.escapeHtml = function (str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  AU.prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  /* ==========================================================================
     01. i18n DICTIONARY
     Text nodes marked with data-i18n="key" are swapped on language change.
     Attributes:  data-i18n-attr="placeholder:key, aria-label:key"
     Anything without a key keeps its authored English — the structure is
     language-ready, the dictionary covers the shared chrome.
     ========================================================================== */
  AU.i18n = {
    en: {
      "nav.home": "Home",
      "nav.home1": "Home 1 — Classic Atelier",
      "nav.home2": "Home 2 — Modern Editorial",
      "nav.home2.classic": "Home 2 — Modern Editorial",
      "nav.home2.studio": "Studio Showcase",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.pricing": "Pricing",
      "nav.portfolio": "Portfolio",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "nav.login": "Login",
      "nav.register": "Register",
      "nav.dashboard": "Dashboard",
      "cta.book": "Book a Trial",
      "cta.bookNow": "Book Now",
      "cta.viewAll": "View All",
      "cta.readMore": "Read More",
      "cta.getQuote": "Get a Quote",
      "cta.send": "Send Message",
      "cta.subscribe": "Subscribe",
      "footer.explore": "Explore",
      "footer.services": "Services",
      "footer.contact": "Get in Touch",
      "footer.newsletter": "Bridal Journal",
      "footer.rights": "All rights reserved.",
      "theme.toggle": "Toggle dark mode",
      "lang.toggle": "Change language",
      "search.placeholder": "Search articles…",
      "form.name": "Full Name",
      "form.email": "Email Address",
      "form.phone": "Phone Number",
      "form.message": "Message",
      "form.required": "This field is required.",
      "form.emailInvalid": "Please enter a valid email address.",
      "form.phoneInvalid": "Please enter a valid 10-digit phone number.",
      "form.success": "Thank you! We have received your request.",
      "toast.themeDark": "Dark mode enabled",
      "toast.themeLight": "Light mode enabled"
    },
    ar: {
      "nav.home": "الرئيسية",
      "nav.home1": "الرئيسية ١ — كلاسيك أتيليه",
      "nav.home2": "الرئيسية ٢ — تصميم عصري",
      "nav.home2.classic": "الرئيسية ٢ — تصميم عصري",
      "nav.home2.studio": "معرض الاستوديو",
      "nav.about": "من نحن",
      "nav.services": "الخدمات",
      "nav.pricing": "الأسعار",
      "nav.portfolio": "أعمالنا",
      "nav.blog": "المدونة",
      "nav.contact": "اتصل بنا",
      "nav.login": "تسجيل الدخول",
      "nav.register": "إنشاء حساب",
      "nav.dashboard": "لوحة التحكم",
      "cta.book": "احجزي جلسة تجريبية",
      "cta.bookNow": "احجزي الآن",
      "cta.viewAll": "عرض الكل",
      "cta.readMore": "اقرأ المزيد",
      "cta.getQuote": "اطلبي عرض سعر",
      "cta.send": "إرسال الرسالة",
      "cta.subscribe": "اشتراك",
      "footer.explore": "استكشف",
      "footer.services": "الخدمات",
      "footer.contact": "تواصلي معنا",
      "footer.newsletter": "مجلة العروس",
      "footer.rights": "جميع الحقوق محفوظة.",
      "theme.toggle": "تبديل الوضع الليلي",
      "lang.toggle": "تغيير اللغة",
      "search.placeholder": "ابحث في المقالات…",
      "form.name": "الاسم الكامل",
      "form.email": "البريد الإلكتروني",
      "form.phone": "رقم الهاتف",
      "form.message": "الرسالة",
      "form.required": "هذا الحقل مطلوب.",
      "form.emailInvalid": "يرجى إدخال بريد إلكتروني صحيح.",
      "form.phoneInvalid": "يرجى إدخال رقم هاتف صحيح.",
      "form.success": "شكراً لك! لقد استلمنا طلبك.",
      "toast.themeDark": "تم تفعيل الوضع الليلي",
      "toast.themeLight": "تم تفعيل الوضع النهاري"
    },
    he: {
      "nav.home": "בית",
      "nav.home1": "בית 1 — סטודיו קלאסי",
      "nav.home2": "בית 2 — עיצוב מודרני",
      "nav.home2.classic": "בית 2 — עיצוב מודרני",
      "nav.home2.studio": "תצוגת הסטודיו",
      "nav.about": "אודות",
      "nav.services": "שירותים",
      "nav.pricing": "מחירון",
      "nav.portfolio": "תיק עבודות",
      "nav.blog": "בלוג",
      "nav.contact": "צור קשר",
      "nav.login": "התחברות",
      "nav.register": "הרשמה",
      "nav.dashboard": "לוח בקרה",
      "cta.book": "קבעי פגישת ניסיון",
      "cta.bookNow": "להזמנה",
      "cta.viewAll": "הצג הכל",
      "cta.readMore": "קרא עוד",
      "cta.getQuote": "לקבלת הצעת מחיר",
      "cta.send": "שלח הודעה",
      "cta.subscribe": "הרשמה",
      "footer.explore": "ניווט",
      "footer.services": "שירותים",
      "footer.contact": "יצירת קשר",
      "footer.newsletter": "יומן הכלה",
      "footer.rights": "כל הזכויות שמורות.",
      "theme.toggle": "החלף מצב כהה",
      "lang.toggle": "שנה שפה",
      "search.placeholder": "חיפוש מאמרים…",
      "form.name": "שם מלא",
      "form.email": "כתובת אימייל",
      "form.phone": "מספר טלפון",
      "form.message": "הודעה",
      "form.required": "שדה חובה.",
      "form.emailInvalid": "נא להזין כתובת אימייל תקינה.",
      "form.phoneInvalid": "נא להזין מספר טלפון תקין.",
      "form.success": "תודה! קיבלנו את הבקשה שלך.",
      "toast.themeDark": "מצב כהה הופעל",
      "toast.themeLight": "מצב בהיר הופעל"
    }
  };

  AU.LANGS = [
    { code: "en", label: "English", native: "English", dir: "ltr" },
    { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
    { code: "he", label: "Hebrew", native: "עברית", dir: "rtl" }
  ];

  AU.t = function (key) {
    var lang = AU.getLang();
    var dict = AU.i18n[lang] || AU.i18n.en;
    return dict[key] || AU.i18n.en[key] || key;
  };

  /* ==========================================================================
     02. THEME + LANGUAGE / RTL
     ========================================================================== */
  var THEME_KEY = "au.theme";
  var DIR_KEY = "au.dir";
  var LANG_KEY = "au.lang";

  AU.getTheme = function () {
    return document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
  };

  AU.setTheme = function (theme, announce) {
    var next = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", next);
    AU.store.set(THEME_KEY, next);

    $$("[data-theme-toggle]").forEach(function (btn) {
      var icon = $(".bi", btn);
      if (icon) icon.className = "bi bi-" + (next === "dark" ? "sun" : "moon-stars");
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      btn.setAttribute("title", AU.t("theme.toggle"));
    });

    document.dispatchEvent(new CustomEvent("au:themechange", { detail: { theme: next } }));

    if (announce) {
      AU.toast(next === "dark" ? AU.t("toast.themeDark") : AU.t("toast.themeLight"), "info");
    }
  };

  AU.getDir = function () {
    return document.documentElement.getAttribute("dir") || AU.store.get(DIR_KEY) || "ltr";
  };

  AU.setDir = function (dir) {
    var nextDir = dir === "rtl" ? "rtl" : "ltr";
    var isRtl = nextDir === "rtl";
    var root = document.documentElement;

    root.setAttribute("lang", "en");
    root.setAttribute("dir", nextDir);
    AU.store.set(DIR_KEY, nextDir);

    /* Swap the Bootstrap build */
    var bs = document.getElementById("au-bs-css");
    if (bs) {
      var href = bs.getAttribute("href");
      bs.setAttribute("href", isRtl
        ? href.replace("bootstrap.min.css", "bootstrap.rtl.min.css")
        : href.replace("bootstrap.rtl.min.css", "bootstrap.min.css"));
    }

    /* Enable/disable the RTL override layer */
    var rtl = document.getElementById("au-rtl-css");
    if (rtl) rtl.disabled = !isRtl;

    /* Always maintain English text */
    AU.applyTranslations();

    $$("[data-dir-current]").forEach(function (el) {
      el.textContent = nextDir.toUpperCase();
    });

    document.dispatchEvent(new CustomEvent("au:dirchange", { detail: { dir: nextDir } }));
  };

  AU.getLang = function () {
    return document.documentElement.getAttribute("lang") || "en";
  };

  AU.setLang = function (code) {
    var meta = null;
    for (var i = 0; i < AU.LANGS.length; i++) {
      if (AU.LANGS[i].code === code) { meta = AU.LANGS[i]; break; }
    }
    if (!meta) meta = AU.LANGS[0];

    var root = document.documentElement;
    var isRtl = meta.dir === "rtl";

    root.setAttribute("lang", meta.code);
    root.setAttribute("dir", meta.dir);
    AU.store.set(LANG_KEY, meta.code);
    AU.store.set(DIR_KEY, meta.dir);

    /* Swap the Bootstrap build */
    var bs = document.getElementById("au-bs-css");
    if (bs) {
      var href = bs.getAttribute("href");
      bs.setAttribute("href", isRtl
        ? href.replace("bootstrap.min.css", "bootstrap.rtl.min.css")
        : href.replace("bootstrap.rtl.min.css", "bootstrap.min.css"));
    }

    /* Enable/disable the RTL override layer */
    var rtl = document.getElementById("au-rtl-css");
    if (rtl) rtl.disabled = !isRtl;

    AU.applyTranslations();

    $$("[data-lang-pick]").forEach(function (item) {
      var on = item.getAttribute("data-lang-pick") === meta.code;
      item.classList.toggle("active", on);
      item.setAttribute("aria-current", on ? "true" : "false");
    });
    $$("[data-lang-current]").forEach(function (el) {
      el.textContent = meta.code.toUpperCase();
    });
    $$("[data-dir-current]").forEach(function (el) {
      el.textContent = meta.dir.toUpperCase();
    });

    document.dispatchEvent(new CustomEvent("au:langchange", { detail: { lang: meta.code, dir: meta.dir } }));
  };

  AU.applyTranslations = function (ctx) {
    $$("[data-i18n]", ctx).forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = AU.t(key);
      if (val) el.textContent = val;
    });

    $$("[data-i18n-attr]", ctx).forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length !== 2) return;
        var attr = bits[0].trim();
        var key = bits[1].trim();
        var val = AU.t(key);
        if (val) el.setAttribute(attr, val);
      });
    });
  };

  function initThemeAndLang() {
    /* theme-init.js already applied the stored values before paint —
       here we just wire the controls and sync their visual state. */
    AU.setTheme(AU.getTheme(), false);
    AU.setDir(AU.getDir());

    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        AU.setTheme(AU.getTheme() === "dark" ? "light" : "dark", true);
      });
    });

    $$("[data-dir-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var currentDir = AU.getDir();
        var nextDir = currentDir === "rtl" ? "ltr" : "rtl";
        AU.setDir(nextDir);
      });
    });

    $$("[data-lang-pick]").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        AU.setLang(item.getAttribute("data-lang-pick"));
      });
    });
  }

  /* ==========================================================================
     03. NAVBAR
     ========================================================================== */
  function initNavbar() {
    var nav = $("[data-sticky-nav]");

    if (nav) {
      var onScroll = function () {
        nav.classList.toggle("is-stuck", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* Active link by current filename */
    var file = window.location.pathname.split("/").pop() || "index.html";
    if (file === "") file = "index.html";

    $$(".navbar-au .nav-link, .navbar-au .dropdown-item").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("http") === 0) return;
      var target = href.split("/").pop().split("#")[0];
      if (target === file) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        /* light up the parent dropdown toggle too */
        var parent = link.closest(".dropdown");
        if (parent) {
          var toggle = $(".dropdown-toggle", parent);
          if (toggle) toggle.classList.add("active");
        }
      }
    });

    /* Close the mobile menu after choosing a destination */
    var collapse = $("#auNavbarNav");
    if (collapse) {
      $$("#auNavbarNav .nav-link:not(.dropdown-toggle), #auNavbarNav .dropdown-item").forEach(function (link) {
        link.addEventListener("click", function () {
          if (window.innerWidth < 992 && collapse.classList.contains("show")) {
            var inst = window.bootstrap && window.bootstrap.Collapse.getInstance(collapse);
            if (inst) inst.hide();
          }
        });
      });
    }
  }

  /* ==========================================================================
     04. SMOOTH SCROLL
     ========================================================================== */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      if (link.hasAttribute("data-bs-toggle")) return;

      var target = document.getElementById(id.slice(1));
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top: top, behavior: AU.prefersReducedMotion() ? "auto" : "smooth" });

      /* keep keyboard focus with the visual jump */
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  /* ==========================================================================
     05. REVEAL ON SCROLL
     ========================================================================== */
  AU.observeReveals = function (ctx) {
    var items = $$(".reveal:not(.is-visible)", ctx);
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || AU.prefersReducedMotion()) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { io.observe(el); });
  };

  /* ==========================================================================
     06. COUNTERS
     ========================================================================== */
  AU.runCounter = function (el) {
    if (el.dataset.counted === "1") return;
    el.dataset.counted = "1";

    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = parseInt(el.getAttribute("data-duration") || "1800", 10);

    if (AU.prefersReducedMotion()) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(frame);
  };

  function initCounters() {
    var counters = $$("[data-count]");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(AU.runCounter);
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          AU.runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ==========================================================================
     07. BACK TO TOP
     ========================================================================== */
  function initBackToTop() {
    var btn = $("[data-back-to-top]");
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle("is-shown", window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: AU.prefersReducedMotion() ? "auto" : "smooth" });
    });
  }

  /* ==========================================================================
     08. BEFORE / AFTER SLIDER
     ========================================================================== */
  function initBeforeAfter() {
    $$("[data-before-after]").forEach(function (wrap) {
      var after = $(".ba-after", wrap);
      var handle = $(".ba-handle", wrap);
      if (!after || !handle) return;

      var dragging = false;
      var innerPh = $(".ph", after);

      function updateInnerWidth() {
        if (innerPh && wrap.offsetWidth) {
          innerPh.style.width = wrap.offsetWidth + "px";
        }
      }

      function setPos(pct) {
        var clamped = Math.max(0, Math.min(100, pct));
        after.style.width = clamped + "%";
        handle.style.insetInlineStart = clamped + "%";
        handle.setAttribute("aria-valuenow", Math.round(clamped));
        updateInnerWidth();
      }

      window.addEventListener("resize", updateInnerWidth, { passive: true });

      function fromEvent(clientX) {
        var rect = wrap.getBoundingClientRect();
        var raw = ((clientX - rect.left) / rect.width) * 100;
        /* mirror for RTL so dragging feels natural */
        if (document.documentElement.getAttribute("dir") === "rtl") raw = 100 - raw;
        setPos(raw);
      }

      handle.addEventListener("pointerdown", function (e) {
        dragging = true;
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
      });

      handle.addEventListener("pointermove", function (e) {
        if (dragging) fromEvent(e.clientX);
      });

      handle.addEventListener("pointerup", function (e) {
        dragging = false;
        try { handle.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
      });

      wrap.addEventListener("click", function (e) {
        if (e.target === handle || handle.contains(e.target)) return;
        fromEvent(e.clientX);
      });

      /* Keyboard: the handle is a real slider */
      handle.addEventListener("keydown", function (e) {
        var now = parseFloat(handle.getAttribute("aria-valuenow") || "50");
        var step = e.shiftKey ? 10 : 2;
        var isRtl = document.documentElement.getAttribute("dir") === "rtl";
        if (e.key === "ArrowLeft") { setPos(isRtl ? now + step : now - step); e.preventDefault(); }
        else if (e.key === "ArrowRight") { setPos(isRtl ? now - step : now + step); e.preventDefault(); }
        else if (e.key === "ArrowDown") { setPos(now - step); e.preventDefault(); }
        else if (e.key === "ArrowUp") { setPos(now + step); e.preventDefault(); }
        else if (e.key === "Home") { setPos(0); e.preventDefault(); }
        else if (e.key === "End") { setPos(100); e.preventDefault(); }
      });

      document.addEventListener("au:dirchange", function () {
        updateInnerWidth();
        var now = parseFloat(handle.getAttribute("aria-valuenow") || "50");
        setPos(now);
      });

      setPos(parseFloat(wrap.getAttribute("data-start") || "50"));
    });
  }

  /* ==========================================================================
     09. CAROUSEL
     ========================================================================== */
  AU.Carousel = function (root) {
    var track = $(".au-carousel-track", root);
    var slides = $$(".au-carousel-slide", root);
    if (!track || !slides.length) return null;

    var prevBtn = $("[data-carousel-prev]", root);
    var nextBtn = $("[data-carousel-next]", root);
    var dotsWrap = $("[data-carousel-dots]", root);
    var autoplay = root.hasAttribute("data-autoplay");
    var interval = parseInt(root.getAttribute("data-autoplay") || "5500", 10) || 5500;

    var index = 0;
    var timer = null;

    function perView() {
      var w = window.innerWidth;
      if (w >= 1200) return Math.min(3, slides.length);
      if (w >= 768) return Math.min(2, slides.length);
      return 1;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function render() {
      var pv = perView();
      var pct = (100 / pv) * index;
      var dir = document.documentElement.getAttribute("dir") === "rtl" ? 1 : -1;
      track.style.transform = "translateX(" + (dir * pct) + "%)";

      slides.forEach(function (slide, i) {
        var visible = i >= index && i < index + pv;
        slide.setAttribute("aria-hidden", visible ? "false" : "true");
        $$("a, button", slide).forEach(function (el) {
          if (visible) el.removeAttribute("tabindex");
          else el.setAttribute("tabindex", "-1");
        });
      });

      if (dotsWrap) {
        $$(".au-carousel-dot", dotsWrap).forEach(function (dot, i) {
          var on = i === index;
          dot.classList.toggle("is-active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
        });
      }

      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
    }

    function go(to) {
      index = Math.max(0, Math.min(maxIndex(), to));
      render();
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIndex(); i++) {
        (function (i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "au-carousel-dot";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", "Go to slide " + (i + 1));
          dot.addEventListener("click", function () { go(i); restart(); });
          dotsWrap.appendChild(dot);
        })(i);
      }
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (!autoplay || AU.prefersReducedMotion()) return;
      stop();
      timer = setInterval(function () {
        go(index >= maxIndex() ? 0 : index + 1);
      }, interval);
    }
    function restart() { stop(); start(); }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); restart(); });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    /* Touch swipe */
    var startX = 0, startY = 0, swiping = false;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      swiping = true;
      stop();
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        var rtl = document.documentElement.getAttribute("dir") === "rtl";
        var forward = rtl ? dx > 0 : dx < 0;
        go(forward ? index + 1 : index - 1);
      }
      start();
    }, { passive: true });

    var onResize = AU.debounce(function () {
      buildDots();
      go(Math.min(index, maxIndex()));
    }, 180);
    window.addEventListener("resize", onResize);
    document.addEventListener("au:dirchange", function () {
      render();
    });

    buildDots();
    render();
    start();

    return { go: go, next: function () { go(index + 1); }, prev: function () { go(index - 1); }, stop: stop, start: start };
  };

  function initCarousels() {
    $$("[data-carousel]").forEach(function (root) { AU.Carousel(root); });
  }

  /* ==========================================================================
     10. LIGHTBOX
     Any element with [data-lightbox] opens the shared overlay.
     Reads: data-lb-class (placeholder classes), data-lb-title, data-lb-text
     and groups by data-lightbox="groupName".
     ========================================================================== */
  AU.lightbox = (function () {
    var overlay = null;
    var stage = null;
    var titleEl = null;
    var textEl = null;
    var group = [];
    var current = 0;
    var lastFocus = null;

    function build() {
      if (overlay) return;

      overlay = document.createElement("div");
      overlay.className = "au-lightbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Image viewer");
      overlay.innerHTML =
        '<div class="au-lightbox-inner">' +
          '<button type="button" class="au-lightbox-close" aria-label="Close viewer"><i class="bi bi-x-lg"></i></button>' +
          '<button type="button" class="au-lightbox-prev" aria-label="Previous image"><i class="bi bi-chevron-left"></i></button>' +
          '<button type="button" class="au-lightbox-next" aria-label="Next image"><i class="bi bi-chevron-right"></i></button>' +
          '<div class="au-lightbox-stage"></div>' +
          '<div class="au-lightbox-caption"><h3></h3><p></p></div>' +
        '</div>';

      document.body.appendChild(overlay);
      stage = $(".au-lightbox-stage", overlay);
      titleEl = $(".au-lightbox-caption h3", overlay);
      textEl = $(".au-lightbox-caption p", overlay);

      $(".au-lightbox-close", overlay).addEventListener("click", close);
      $(".au-lightbox-prev", overlay).addEventListener("click", function () { step(-1); });
      $(".au-lightbox-next", overlay).addEventListener("click", function () { step(1); });

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });

      document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
        else if (e.key === "Tab") trapFocus(e);
      });
    }

    function trapFocus(e) {
      var focusables = $$("button", overlay);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }

    function paint() {
      var el = group[current];
      if (!el) return;

      var imgEl = el.querySelector("img");
      var imgSrc = el.getAttribute("data-lb-img") || (imgEl ? imgEl.src : "");
      var phClass = el.getAttribute("data-lb-class") || "ph-bride";
      var icon = el.getAttribute("data-lb-icon") || "bi-flower1";
      var label = el.getAttribute("data-lb-title") || "";
      var text = el.getAttribute("data-lb-text") || "";

      if (imgSrc) {
        stage.innerHTML =
          '<div class="ph ' + AU.escapeHtml(phClass) + ' ph-4x3 has-img" role="img" aria-label="' + AU.escapeHtml(label) + '">' +
            '<img src="' + AU.escapeHtml(imgSrc) + '" alt="' + AU.escapeHtml(label) + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">' +
          '</div>';
      } else {
        stage.innerHTML =
          '<div class="ph ' + AU.escapeHtml(phClass) + ' ph-4x3" role="img" aria-label="' + AU.escapeHtml(label) + '">' +
            '<i class="bi ' + AU.escapeHtml(icon) + '" aria-hidden="true"></i>' +
          '</div>';
      }

      titleEl.textContent = label;
      textEl.textContent = text;

      var multi = group.length > 1;
      $(".au-lightbox-prev", overlay).hidden = !multi;
      $(".au-lightbox-next", overlay).hidden = !multi;
    }

    function step(dir) {
      if (group.length < 2) return;
      current = (current + dir + group.length) % group.length;
      paint();
    }

    function open(el) {
      build();
      var name = el.getAttribute("data-lightbox") || "default";
      group = $$('[data-lightbox="' + name + '"]').filter(function (n) {
        return !n.closest(".is-hidden");
      });
      current = Math.max(0, group.indexOf(el));

      lastFocus = document.activeElement;
      paint();
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      $(".au-lightbox-close", overlay).focus();
    }

    function close() {
      if (!overlay) return;
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    return { open: open, close: close, step: step };
  })();

  function initLightbox() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (!trigger) return;
      e.preventDefault();
      AU.lightbox.open(trigger);
    });
  }

  /* ==========================================================================
     11. FORMS
     Add data-au-form to any <form>. Optional:
       data-success="#selectorOfSuccessPanel"
       data-reset-delay="6000"  (ms until the form returns; 0 = stay)
     ========================================================================== */
  AU.validators = {
    required: function (value) {
      return value.trim().length > 0 ? null : AU.t("form.required");
    },
    email: function (value) {
      if (!value.trim()) return null;
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? null : AU.t("form.emailInvalid");
    },
    tel: function (value, field) {
      if (!value.trim()) return null;
      var digits = value.replace(/\D/g, "");
      if (field && (field.getAttribute("pattern") === "[0-9]{10}" || field.hasAttribute("data-10-digit") || field.id === "bkPhone")) {
        return digits.length === 10 ? null : AU.t("form.phoneInvalid");
      }
      return (digits.length === 10 || /^[+]?[\d\s().-]{7,20}$/.test(value.trim())) ? null : AU.t("form.phoneInvalid");
    },
    pattern: function (value, field) {
      var pat = field.getAttribute("pattern");
      if (!pat || !value.trim()) return null;
      var regex = new RegExp("^" + pat + "$");
      if (pat === "[0-9]{10}") {
        return regex.test(value.trim().replace(/\D/g, "")) ? null : AU.t("form.phoneInvalid");
      }
      return regex.test(value.trim()) ? null : "Please match the requested format.";
    },
    minlength: function (value, field) {
      var min = parseInt(field.getAttribute("minlength"), 10);
      if (!min || !value.trim()) return null;
      return value.trim().length >= min ? null : "Please use at least " + min + " characters.";
    },
    match: function (value, field) {
      var otherSel = field.getAttribute("data-match");
      if (!otherSel) return null;
      var other = $(otherSel);
      if (!other) return null;
      return value === other.value ? null : "Values do not match.";
    }
  };

  AU.validateField = function (field) {
    if (field.disabled || field.type === "hidden") return true;

    var value = field.type === "checkbox" ? (field.checked ? "on" : "") : (field.value || "");
    var error = null;

    if (field.hasAttribute("required")) error = AU.validators.required(value);
    if (!error && field.type === "email") error = AU.validators.email(value);
    if (!error && field.type === "tel") error = AU.validators.tel(value, field);
    if (!error && field.hasAttribute("pattern")) error = AU.validators.pattern(value, field);
    if (!error && field.hasAttribute("minlength")) error = AU.validators.minlength(value, field);
    if (!error && field.hasAttribute("data-match")) error = AU.validators.match(value, field);

    /* Find the field's block wrapper — deliberately NOT .input-icon-group,
       whose .invalid-feedback sibling lives one level further out. */
    var wrap = field.closest(".form-check, .mb-3, .form-group, [class*='col-']") || field.parentNode;
    var feedback = $(".invalid-feedback", wrap);
    if (!feedback && wrap.parentNode) feedback = $(".invalid-feedback", wrap.parentNode);

    if (error) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      field.setAttribute("aria-invalid", "true");
      if (feedback) feedback.textContent = error;
      return false;
    }

    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    if (value.trim()) field.classList.add("is-valid");
    else field.classList.remove("is-valid");
    return true;
  };

  AU.validateForm = function (form) {
    var fields = $$("input, select, textarea", form).filter(function (f) {
      return f.type !== "hidden" && !f.disabled;
    });
    var firstBad = null;
    var ok = true;

    fields.forEach(function (field) {
      if (!AU.validateField(field)) {
        ok = false;
        if (!firstBad) firstBad = field;
      }
    });

    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ block: "center", behavior: AU.prefersReducedMotion() ? "auto" : "smooth" });
    }
    return ok;
  };

  AU.setButtonLoading = function (btn, loading) {
    if (!btn) return;
    btn.classList.toggle("is-loading", !!loading);
    btn.disabled = !!loading;
    btn.setAttribute("aria-busy", loading ? "true" : "false");
  };

  function initForms() {
    $$("[data-au-form]").forEach(function (form) {
      form.setAttribute("novalidate", "novalidate");

      /* Validate on blur once touched, then live-correct on input */
      $$("input, select, textarea", form).forEach(function (field) {
        field.addEventListener("blur", function () {
          if (field.dataset.touched === "1") AU.validateField(field);
        });
        field.addEventListener("input", function () {
          field.dataset.touched = "1";
          if (field.classList.contains("is-invalid")) AU.validateField(field);
        });
        field.addEventListener("change", function () {
          field.dataset.touched = "1";
          AU.validateField(field);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        $$("input, select, textarea", form).forEach(function (f) { f.dataset.touched = "1"; });

        if (!AU.validateForm(form)) {
          AU.toast("Please correct the highlighted fields.", "error");
          return;
        }

        var btn = $('[type="submit"]', form);
        AU.setButtonLoading(btn, true);

        /* Simulated network round-trip — no backend required */
        setTimeout(function () {
          AU.setButtonLoading(btn, false);

          var data = {};
          $$("input, select, textarea", form).forEach(function (f) {
            if (!f.name) return;
            if (f.type === "checkbox") data[f.name] = f.checked;
            else data[f.name] = f.value;
          });

          var successSel = form.getAttribute("data-success");
          var panel = successSel ? $(successSel) : null;

          if (panel) {
            form.hidden = true;
            panel.classList.add("is-shown");
            panel.setAttribute("tabindex", "-1");
            panel.focus({ preventScroll: true });
            panel.scrollIntoView({ block: "center", behavior: AU.prefersReducedMotion() ? "auto" : "smooth" });

            var delay = parseInt(form.getAttribute("data-reset-delay") || "0", 10);
            if (delay > 0) {
              setTimeout(function () {
                panel.classList.remove("is-shown");
                form.hidden = false;
                form.reset();
                $$(".is-valid, .is-invalid", form).forEach(function (f) {
                  f.classList.remove("is-valid", "is-invalid");
                  delete f.dataset.touched;
                });
              }, delay);
            }
          } else {
            AU.toast(AU.t("form.success"), "success");
            form.reset();
            $$(".is-valid, .is-invalid", form).forEach(function (f) {
              f.classList.remove("is-valid", "is-invalid");
              delete f.dataset.touched;
            });
          }

          form.dispatchEvent(new CustomEvent("au:submitted", { detail: { data: data }, bubbles: true }));
        }, 900);
      });
    });
  }

  /* ==========================================================================
     12. PASSWORD
     ========================================================================== */
  function initPassword() {
    $$("[data-pw-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = $(btn.getAttribute("data-pw-toggle"));
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        var icon = $(".bi", btn);
        if (icon) icon.className = "bi bi-" + (show ? "eye-slash" : "eye");
        btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
        btn.setAttribute("aria-pressed", show ? "true" : "false");
        input.focus();
      });
    });

    $$("[data-pw-meter]").forEach(function (meter) {
      var input = $(meter.getAttribute("data-pw-meter"));
      if (!input) return;
      var hint = $("[data-pw-hint]", meter.parentNode) || null;

      input.addEventListener("input", function () {
        var v = input.value;
        var score = 0;
        if (v.length >= 8) score++;
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
        if (/\d/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        if (!v) score = 0;

        meter.setAttribute("data-level", String(score));
        meter.setAttribute("aria-valuenow", String(score));

        if (hint) {
          hint.textContent = ["Enter a password", "Weak", "Fair", "Good", "Strong"][score];
        }
      });
    });
  }

  /* ==========================================================================
     13. TOASTS
     ========================================================================== */
  AU.toast = function (message, type, timeout) {
    var stack = $(".au-toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "au-toast-stack";
      stack.setAttribute("role", "status");
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }

    var icons = {
      success: "bi-check-circle-fill",
      error: "bi-exclamation-triangle-fill",
      info: "bi-info-circle-fill"
    };
    var kind = icons[type] ? type : "info";

    var el = document.createElement("div");
    el.className = "au-toast type-" + kind;
    el.innerHTML = '<i class="bi ' + icons[kind] + '" aria-hidden="true"></i><div>' + AU.escapeHtml(message) + "</div>";
    stack.appendChild(el);

    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    }, timeout || 3600);

    return el;
  };

  /* ==========================================================================
     14. COUNTDOWN
     ========================================================================== */
  function initCountdown() {
    $$("[data-countdown]").forEach(function (root) {
      var targetAttr = root.getAttribute("data-countdown");
      var target = new Date(targetAttr).getTime();

      /* Fall back to "45 days from now" so the demo never shows a dead clock */
      if (isNaN(target)) target = Date.now() + 45 * 24 * 60 * 60 * 1000;

      var cells = {
        days: $("[data-cd-days]", root),
        hours: $("[data-cd-hours]", root),
        minutes: $("[data-cd-minutes]", root),
        seconds: $("[data-cd-seconds]", root)
      };

      function pad(n) { return String(n).padStart(2, "0"); }

      function tick() {
        var diff = target - Date.now();
        if (diff <= 0) {
          Object.keys(cells).forEach(function (k) { if (cells[k]) cells[k].textContent = "00"; });
          clearInterval(timer);
          root.dispatchEvent(new CustomEvent("au:countdownend", { bubbles: true }));
          return;
        }
        var s = Math.floor(diff / 1000);
        if (cells.days) cells.days.textContent = pad(Math.floor(s / 86400));
        if (cells.hours) cells.hours.textContent = pad(Math.floor((s % 86400) / 3600));
        if (cells.minutes) cells.minutes.textContent = pad(Math.floor((s % 3600) / 60));
        if (cells.seconds) cells.seconds.textContent = pad(s % 60);
      }

      tick();
      var timer = setInterval(tick, 1000);
    });
  }

  /* ==========================================================================
     15. AUTHENTICATION & SESSION MANAGEMENT
     ========================================================================== */
  var SESSION_KEY = "au.session";
  var USERS_KEY = "au.users";
  var LOCKOUT_KEY = "au.auth.lockout";

  /* Cryptographic SHA-256 digest function for secure client-side password hashing */
  function sha256(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var i, j, result = "";
    var words = [];
    var asciiBitLength = ascii.length * 8;
    var hash = [];
    var k = [];
    var primeCounter = 0;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 312; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    hash = hash.slice(0, 8);
    ascii += "\x80";
    while ((ascii.length % 64) - 56) ascii += "\x00";
    for (i = 0; i < ascii.length; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return "";
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, (j += 16));
      var a = hash[0], b = hash[1], c = hash[2], d = hash[3];
      var e = hash[4], f = hash[5], g = hash[6], h = hash[7];
      for (i = 0; i < 64; i++) {
        if (i >= 16) {
          var w15 = w[i - 15], w2 = w[i - 2];
          var s0 = (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3));
          var s1 = (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10));
          w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        }
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ch + k[i] + w[i]) | 0;
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + maj) | 0;
        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }
      hash[0] = (hash[0] + a) | 0;
      hash[1] = (hash[1] + b) | 0;
      hash[2] = (hash[2] + c) | 0;
      hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0;
      hash[5] = (hash[5] + f) | 0;
      hash[6] = (hash[6] + g) | 0;
      hash[7] = (hash[7] + h) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (var byteIdx = 3; byteIdx >= 0; byteIdx--) {
        var byteVal = (hash[i] >> (byteIdx * 8)) & 255;
        result += (byteVal < 16 ? "0" : "") + byteVal.toString(16);
      }
    }
    return result;
  }

  function generateRandomHex(length) {
    var bytes = new Uint8Array(length || 16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (var i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    var hex = "";
    for (var j = 0; j < bytes.length; j++) hex += (bytes[j] < 16 ? "0" : "") + bytes[j].toString(16);
    return hex;
  }

  AU.auth = {
    hashPassword: function (password, salt) {
      return sha256((salt || "au_salt") + ":" + password);
    },

    users: function () {
      var stored = AU.store.get(USERS_KEY, null);
      if (!Array.isArray(stored) || stored.length === 0) {
        /* Initial master administrative & seed accounts with salted SHA-256 */
        var adminSalt = generateRandomHex(12);
        var clientSalt = generateRandomHex(12);
        stored = [
          {
            id: "usr_" + generateRandomHex(8),
            name: "Studio Admin",
            email: "admin@aurelle.com",
            phone: "+1 (415) 555-0100",
            salt: adminSalt,
            passwordHash: sha256(adminSalt + ":Admin@2026"),
            role: "admin",
            createdAt: new Date().toISOString()
          },
          {
            id: "usr_" + generateRandomHex(8),
            name: "Aisha Rahman",
            email: "client@aurelle.com",
            phone: "+1 (415) 555-0199",
            weddingDate: "2026-11-20",
            salt: clientSalt,
            passwordHash: sha256(clientSalt + ":Bridal@2026"),
            role: "client",
            createdAt: new Date().toISOString()
          }
        ];
        AU.store.set(USERS_KEY, stored);
      }
      return stored;
    },

    register: function (userData) {
      if (!userData || !userData.email || !userData.password) {
        return { ok: false, error: "Email and password are required." };
      }
      var email = String(userData.email).trim().toLowerCase();
      var userList = AU.auth.users();

      var existing = userList.some(function (u) {
        return u.email.toLowerCase() === email;
      });
      if (existing) {
        return { ok: false, error: "An account with that email address is already registered." };
      }

      var salt = generateRandomHex(12);
      var passwordHash = AU.auth.hashPassword(userData.password, salt);

      var newUser = {
        id: "usr_" + generateRandomHex(8),
        name: (userData.name || "Aurelle Bride").trim(),
        email: email,
        phone: userData.phone || "",
        weddingDate: userData.weddingDate || "",
        role: userData.role || "client",
        salt: salt,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      userList.push(newUser);
      AU.store.set(USERS_KEY, userList);
      return { ok: true, user: newUser };
    },

    login: function (email, password, remember) {
      var normEmail = String(email || "").trim().toLowerCase();
      var now = Date.now();

      /* Check lockout / rate-limiting */
      var lockout = AU.store.get(LOCKOUT_KEY, { attempts: 0, lockedUntil: 0 });
      if (lockout.lockedUntil && now < lockout.lockedUntil) {
        var remainingSec = Math.ceil((lockout.lockedUntil - now) / 1000);
        return { ok: false, error: "Too many failed attempts. Account locked for security. Please wait " + remainingSec + "s." };
      }

      var userList = AU.auth.users();
      var match = null;

      for (var i = 0; i < userList.length; i++) {
        var u = userList[i];
        if (u.email.toLowerCase() === normEmail) {
          var expectedHash = u.passwordHash;
          var actualHash = u.salt ? AU.auth.hashPassword(password, u.salt) : null;
          /* verify hash or legacy plaintext match */
          if ((actualHash && actualHash === expectedHash) || u.password === password) {
            match = u;
            break;
          }
        }
      }

      if (!match) {
        var attempts = (lockout.attempts || 0) + 1;
        var lockedUntil = 0;
        if (attempts >= 5) {
          lockedUntil = now + (60 * 1000); /* 60 second lockout */
        }
        AU.store.set(LOCKOUT_KEY, { attempts: attempts, lockedUntil: lockedUntil });
        return { ok: false, error: "Invalid email or password combination." };
      }

      /* Clear lockout on success */
      AU.store.remove(LOCKOUT_KEY);

      /* Update lastLogin timestamp */
      match.lastLoginAt = new Date().toISOString();
      AU.store.set(USERS_KEY, userList);

      /* Session duration: 30 days if remember, 24 hours if not */
      var ttlMs = (remember ? 30 : 1) * 24 * 60 * 60 * 1000;
      var session = {
        token: "au_tk_" + generateRandomHex(24),
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role,
        phone: match.phone || "",
        weddingDate: match.weddingDate || "",
        remember: !!remember,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(now + ttlMs).toISOString()
      };

      if (remember) {
        try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
        try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
      } else {
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
        try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      }

      document.dispatchEvent(new CustomEvent("au:sessionchange", { detail: { session: session } }));
      return { ok: true, session: session };
    },

    current: function () {
      var raw = null;
      try { raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY); } catch (e) {}
      if (!raw) return null;

      try {
        var s = JSON.parse(raw);
        if (!s || !s.email || !s.token) return null;
        if (s.expiresAt && new Date(s.expiresAt).getTime() < Date.now()) {
          AU.auth.logout();
          return null;
        }
        return s;
      } catch (e) {
        return null;
      }
    },

    logout: function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
      document.dispatchEvent(new CustomEvent("au:sessionchange", { detail: { session: null } }));
    },

    /* Guard a dashboard page. Returns the session, or redirects to login. */
    require: function (role, loginUrl) {
      var s = AU.auth.current();
      if (!s || (role && s.role !== role)) {
        var url = loginUrl || (role === "admin" ? "admin-login.html" : "login.html");
        var currentPath = window.location.pathname.split("/").pop() || "index.html";
        window.location.href = url + "?next=" + encodeURIComponent(currentPath);
        return null;
      }
      return s;
    }
  };

  /* Re-paints every [data-session-*] / [data-auth-only] / [data-guest-only]
     binding. Exposed because pages such as the dashboards sign a demo user in
     AFTER main.js has already booted. */
  function initSessionUi() {
    var session = AU.auth.current();
    var fullName = session && session.name ? session.name.trim() : "Guest";
    var firstName = session && session.name ? session.name.trim().split(/\s+/)[0] : "Guest";
    var parts = session && session.name ? session.name.trim().split(/\s+/) : [];
    var initials = ((parts[0] ? parts[0][0] : "") + (parts[1] ? parts[1][0] : "")).toUpperCase() || "AU";

    $$("[data-session-name]").forEach(function (el) {
      el.textContent = session ? session.name : "Guest";
    });
    $$("[data-session-first-name]").forEach(function (el) {
      el.textContent = firstName;
    });
    $$("[data-session-email]").forEach(function (el) {
      el.textContent = session ? session.email : "";
    });
    $$("[data-session-phone]").forEach(function (el) {
      el.textContent = session ? (session.phone || "") : "";
    });
    $$("[data-session-role]").forEach(function (el) {
      el.textContent = session ? (session.role === "admin" ? "Administrator" : "Client") : "";
    });
    $$("[data-user-avatar-initials]").forEach(function (el) {
      el.textContent = initials;
    });

    /* Navbar swaps Login -> Dashboard while a session exists */
    $$("[data-auth-only]").forEach(function (el) { el.hidden = !session; });
    $$("[data-guest-only]").forEach(function (el) { el.hidden = !!session; });

    if (session) {
      $$("[data-dash-link]").forEach(function (el) {
        el.href = session.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
        el.innerHTML = '<i class="bi bi-person-circle me-1" aria-hidden="true"></i> ' +
          (session.role === "admin" ? "Admin (" + firstName + ")" : firstName + "'s Dashboard");
      });
    }

    $$("[data-logout]").forEach(function (btn) {
      /* initSessionUi can run again on au:sessionchange — bind only once */
      if (btn.dataset.logoutBound === "1") return;
      btn.dataset.logoutBound = "1";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        AU.auth.logout();
        AU.toast("You have been signed out.", "info");
        setTimeout(function () { window.location.href = "login.html"; }, 700);
      });
    });
  }

  AU.refreshSessionUi = initSessionUi;

  /* ==========================================================================
     16. BOOT
     ========================================================================== */
  function boot() {
    initThemeAndLang();
    initNavbar();
    initSmoothScroll();
    AU.observeReveals();
    initCounters();
    initBackToTop();
    initBeforeAfter();
    initCarousels();
    initLightbox();
    initForms();
    initPassword();
    initCountdown();
    initSessionUi();

    /* Any later sign-in/sign-out repaints the session-bound UI */
    document.addEventListener("au:sessionchange", function () { AU.refreshSessionUi(); });

    /* Current year everywhere */
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    document.dispatchEvent(new CustomEvent("au:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);

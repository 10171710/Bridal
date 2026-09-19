/* ==========================================================================
   AURELLE — theme-init.js
   Loaded SYNCHRONOUSLY in <head>, before any paint.
   Applies the stored theme + direction so there is no flash of the wrong
   theme on load. Kept deliberately tiny; everything else is in main.js.
   ========================================================================== */
(function () {
  "use strict";

  var THEME_KEY = "au.theme";
  var DIR_KEY = "au.dir";

  function read(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  var root = document.documentElement;

  /* ---- Theme ---- */
  var theme = read(THEME_KEY);
  if (theme !== "dark" && theme !== "light") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  root.setAttribute("data-bs-theme", theme);

  /* ---- Direction (RTL in English) ---- */
  var dir = read(DIR_KEY) || "ltr";
  var isRtl = dir === "rtl";
  root.setAttribute("lang", "en");
  root.setAttribute("dir", isRtl ? "rtl" : "ltr");

  /* Swap the Bootstrap build and enable the RTL layer before first paint.
     Both <link> elements already exist in <head> by the time this runs
     only if this script is placed after them — main.js re-applies safely
     either way. */
  var bs = document.getElementById("au-bs-css");
  var rtl = document.getElementById("au-rtl-css");
  if (bs && isRtl) {
    bs.href = bs.href.replace("bootstrap.min.css", "bootstrap.rtl.min.css");
  }
  if (rtl) {
    rtl.disabled = !isRtl;
  }
})();

/* ==========================================================================
   AURELLE — portfolio.js
   Drives the filter bar, load-more reveal, live counts and empty state on
   portfolio.html (#portfolioGrid). Loaded AFTER main.js. Depends on
   AU.$ / AU.$$ / AU.toast but degrades harmlessly if AU is unavailable.
   The shared lightbox in main.js already groups by data-lightbox="portfolio"
   and skips anything with .is-hidden, so it is left untouched here.
   ========================================================================== */
(function () {
  "use strict";

  var initialized = false;

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function categoriesOf(item) {
    return (item.getAttribute("data-category") || "").trim().split(/\s+/).filter(Boolean);
  }

  function init() {
    if (initialized) return;
    initialized = true;

    var AU = window.AU || {};
    var qs = AU.$ || $;
    var qsa = AU.$$ || $all;

    var grid = qs("#portfolioGrid");
    if (!grid) return;

    var items = qsa(".portfolio-item", grid);
    if (!items.length) return;

    var filterBtns = qsa(".filter-btn[data-filter]");
    var loadMoreWrap = qs("#portfolioLoadMoreWrap");
    var loadMoreBtn = qs("#portfolioLoadMore");
    var emptyState = qs("#portfolioEmpty");
    var statusEl = qs("#portfolioStatus");
    var clearBtn = qs("#portfolioClearFilters");

    var PAGE_SIZE = 12;
    var STEP = 6;
    var activeFilter = "all";
    var visibleLimit = PAGE_SIZE;

    function matchesFilter(item, filter) {
      if (filter === "all") return true;
      return categoriesOf(item).indexOf(filter) !== -1;
    }

    function fillCounts() {
      filterBtns.forEach(function (btn) {
        var filter = btn.getAttribute("data-filter");
        var countEl = qs(".count", btn);
        if (!countEl) return;
        var n = items.filter(function (item) {
          return matchesFilter(item, filter);
        }).length;
        countEl.textContent = "(" + n + ")";
      });
    }

    function setActiveButton(target) {
      filterBtns.forEach(function (btn) {
        var isActive = btn === target;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function render() {
      var matches = items.filter(function (item) {
        return matchesFilter(item, activeFilter);
      });

      items.forEach(function (item) {
        item.classList.add("is-hidden");
      });

      var shown = matches.slice(0, visibleLimit);
      shown.forEach(function (item) {
        item.classList.remove("is-hidden");
      });

      var hasMore = matches.length > shown.length;
      if (loadMoreWrap) loadMoreWrap.hidden = !hasMore;
      if (loadMoreBtn) loadMoreBtn.disabled = !hasMore;

      var isEmpty = matches.length === 0;
      if (emptyState) emptyState.hidden = !isEmpty;
      grid.hidden = isEmpty;

      if (statusEl) {
        if (isEmpty) {
          statusEl.textContent = "No looks match this filter.";
        } else {
          statusEl.textContent = "Showing " + shown.length + " of " + matches.length +
            " look" + (matches.length === 1 ? "" : "s") + ".";
        }
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        if (!filter || filter === activeFilter) return;
        activeFilter = filter;
        visibleLimit = PAGE_SIZE;
        setActiveButton(btn);
        render();
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        visibleLimit += STEP;
        render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        var allBtn = filterBtns.filter(function (b) {
          return b.getAttribute("data-filter") === "all";
        })[0];
        activeFilter = "all";
        visibleLimit = PAGE_SIZE;
        if (allBtn) setActiveButton(allBtn);
        render();
        if (typeof AU.toast === "function") {
          AU.toast("Filters cleared — showing the full portfolio.", "info");
        }
      });
    }

    fillCounts();
    render();
  }

  document.addEventListener("au:ready", init);
  document.addEventListener("DOMContentLoaded", init);
})();

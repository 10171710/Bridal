/* ==========================================================================
   AURELLE — blog.js
   Drives search, category filtering, tag cloud filtering, URL sync,
   and "load more" paging on blog.html (#blogGrid / .blog-item).
   Loaded AFTER main.js. Degrades harmlessly if the grid or the AU namespace
   helpers are not present.
   ========================================================================== */
(function () {
  "use strict";

  var AU = window.AU;
  if (!AU || typeof AU.$ !== "function" || typeof AU.$$ !== "function") return;

  var $ = AU.$;
  var $$ = AU.$$;

  var PAGE_SIZE = 8;

  function init() {
    var grid = document.getElementById("blogGrid");
    if (!grid) return;

    var items = $$(".blog-item", grid);
    if (!items.length) return;

    var searchInput = document.getElementById("blogSearch");
    var filterBtns = $$(".filter-btn[data-filter]");
    var sidebarCatLinks = $$(".widget-cat-link[data-category]");
    var tagLinks = $$(".tag-cloud a[data-tag]");
    var loadMoreBtn = document.getElementById("blogLoadMore");
    var loadMoreWrap = document.getElementById("blogLoadMoreWrap");
    var emptyState = document.getElementById("blogEmpty");
    var clearBtn = document.getElementById("blogClearSearch");
    var resultStatus = document.getElementById("blogResultStatus");

    // Active filter indicator bar elements
    var activeFilterBar = document.getElementById("blogActiveFilter");
    var activeFilterText = document.getElementById("activeFilterText");
    var clearActiveFilterBtn = document.getElementById("clearActiveFilterBtn");
    var clearAllFiltersBtn = document.getElementById("clearAllFiltersBtn");

    var activeCategory = "all";
    var activeTag = "";
    var expanded = false;

    // Helper: Normalize strings for flexible tag/keyword matching
    function normalize(str) {
      return (str || "")
        .toLowerCase()
        .replace(/[-_+]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function isFiltering(term) {
      return activeCategory !== "all" || activeTag.length > 0 || term.length > 0;
    }

    function itemHaystack(item) {
      return [
        item.getAttribute("data-title") || "",
        item.getAttribute("data-tags") || "",
        item.getAttribute("data-category") || ""
      ].join(" ").toLowerCase();
    }

    function itemMatchesTag(item, tag) {
      if (!tag) return true;
      var normTag = normalize(tag);
      var itemTags = normalize(item.getAttribute("data-tags") || "");
      var itemCat = normalize(item.getAttribute("data-category") || "");
      var itemTitle = normalize(item.getAttribute("data-title") || "");

      // Check if normalized tag matches in data-tags list, title, or category
      if (itemTags.indexOf(normTag) !== -1) return true;
      if (itemCat.indexOf(normTag) !== -1) return true;
      if (itemTitle.indexOf(normTag) !== -1) return true;
      return false;
    }

    function updateUrlState() {
      if (!window.history || !window.history.replaceState) return;
      var params = new URLSearchParams();
      if (activeCategory && activeCategory !== "all") {
        params.set("category", activeCategory);
      }
      if (activeTag) {
        params.set("tag", activeTag);
      }
      var term = searchInput ? searchInput.value.trim() : "";
      if (term) {
        params.set("search", term);
      }
      var queryString = params.toString();
      var newUrl = window.location.pathname + (queryString ? "?" + queryString : "");
      window.history.replaceState(null, "", newUrl);
    }

    function updateCategoryUI(category) {
      // Top filter bar buttons
      filterBtns.forEach(function (btn) {
        var isActive = btn.getAttribute("data-filter") === category;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      // Sidebar category links
      sidebarCatLinks.forEach(function (link) {
        var isActive = link.getAttribute("data-category") === category;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function updateTagCloudUI(tag) {
      var normTag = normalize(tag);
      tagLinks.forEach(function (link) {
        var linkTag = normalize(link.getAttribute("data-tag") || link.textContent || "");
        var isActive = normTag.length > 0 && linkTag === normTag;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function updateActiveFilterBar(visibleCount) {
      if (!activeFilterBar) return;

      var labels = [];
      if (activeCategory !== "all") {
        var catName = activeCategory;
        for (var i = 0; i < filterBtns.length; i++) {
          if (filterBtns[i].getAttribute("data-filter") === activeCategory) {
            catName = filterBtns[i].childNodes[0].textContent.trim();
            break;
          }
        }
        labels.push("Category: " + catName);
      }
      if (activeTag) {
        var tagDisplay = activeTag.charAt(0).toUpperCase() + activeTag.slice(1);
        labels.push("Tag: " + tagDisplay);
      }
      var term = searchInput ? searchInput.value.trim() : "";
      if (term) {
        labels.push('Search: "' + term + '"');
      }

      if (labels.length > 0) {
        activeFilterBar.hidden = false;
        if (activeFilterText) {
          activeFilterText.textContent = labels.join(" • ") + " (" + visibleCount + ")";
        }
      } else {
        activeFilterBar.hidden = true;
      }
    }

    function announce(count, filtering) {
      if (!resultStatus) return;
      if (count === 0) {
        resultStatus.textContent = "No articles match your search or filters.";
      } else if (filtering) {
        resultStatus.textContent = count + " article" + (count === 1 ? "" : "s") + " found.";
      } else {
        resultStatus.textContent = count + " article" + (count === 1 ? "" : "s") + " shown.";
      }
    }

    function render(options) {
      var opts = options || {};
      var term = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var filtering = isFiltering(term);
      var visibleCount = 0;

      items.forEach(function (item, index) {
        var matchesCat = activeCategory === "all" || item.getAttribute("data-category") === activeCategory;
        var matchesTag = !activeTag || itemMatchesTag(item, activeTag);
        var matchesSearch = term.length === 0 || itemHaystack(item).indexOf(term) !== -1;
        var show;

        if (filtering) {
          show = matchesCat && matchesTag && matchesSearch;
        } else {
          show = expanded ? true : index < PAGE_SIZE;
        }

        item.hidden = !show;
        item.classList.toggle("is-hidden", !show);
        if (show) visibleCount++;
      });

      if (emptyState) emptyState.hidden = visibleCount !== 0;
      if (grid) grid.hidden = visibleCount === 0;

      if (loadMoreWrap) {
        var hasMore = items.length > PAGE_SIZE;
        loadMoreWrap.hidden = filtering || expanded || !hasMore;
      }

      updateCategoryUI(activeCategory);
      updateTagCloudUI(activeTag);
      updateActiveFilterBar(visibleCount);
      announce(visibleCount, filtering);

      if (!opts.silentUrl) {
        updateUrlState();
      }
    }

    // Dynamic category counts calculation from actual items
    function syncCounts() {
      filterBtns.forEach(function (btn) {
        var cat = btn.getAttribute("data-filter");
        var countEl = btn.querySelector(".count");
        if (!countEl) return;
        if (cat === "all") {
          countEl.textContent = items.length;
        } else {
          var count = items.filter(function (item) {
            return item.getAttribute("data-category") === cat;
          }).length;
          countEl.textContent = count;
        }
      });

      sidebarCatLinks.forEach(function (link) {
        var cat = link.getAttribute("data-category");
        var countEl = link.querySelector(".count, .badge-soft");
        if (!countEl) return;
        var count = items.filter(function (item) {
          return item.getAttribute("data-category") === cat;
        }).length;
        countEl.textContent = count;
      });
    }

    function scrollToGrid() {
      var headerOffset = 100;
      var elementPosition = grid.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      if (Math.abs(elementPosition) > 200) {
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    }

    // Event: Search Input
    if (searchInput) {
      searchInput.addEventListener("input", AU.debounce(function () {
        render();
      }, 200));
    }

    // Event: Top Category Filter Buttons
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var category = btn.getAttribute("data-filter") || "all";
        activeCategory = category;
        render();
      });
    });

    // Event: Sidebar Category Links
    sidebarCatLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var category = link.getAttribute("data-category") || "all";
        if (activeCategory === category) {
          // Clicking again resets to all
          activeCategory = "all";
        } else {
          activeCategory = category;
        }
        render();
        scrollToGrid();
      });
    });

    // Event: Tag Cloud Links
    tagLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var tag = link.getAttribute("data-tag") || link.textContent.trim();
        var normalizedClicked = normalize(tag);
        if (normalize(activeTag) === normalizedClicked) {
          // Toggle off
          activeTag = "";
        } else {
          activeTag = tag;
        }
        render();
        scrollToGrid();
      });
    });

    // Event: Clear Active Filter Chip
    if (clearActiveFilterBtn) {
      clearActiveFilterBtn.addEventListener("click", function () {
        activeTag = "";
        activeCategory = "all";
        if (searchInput) searchInput.value = "";
        render();
      });
    }

    // Event: Clear All Filters
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener("click", function () {
        activeTag = "";
        activeCategory = "all";
        if (searchInput) searchInput.value = "";
        render();
        if (searchInput) searchInput.focus();
      });
    }

    // Event: Load More Button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        expanded = true;
        render();
        if (typeof AU.toast === "function") {
          AU.toast("Showing all articles", "info");
        }
      });
    }

    // Event: Clear Button in Empty State
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        activeCategory = "all";
        activeTag = "";
        render();
        if (searchInput) searchInput.focus();
      });
    }

    // Initialize from URL parameters if present
    function parseUrlParams() {
      try {
        var params = new URLSearchParams(window.location.search);
        var catParam = params.get("category");
        var tagParam = params.get("tag");
        var searchParam = params.get("search") || params.get("q");

        var hasFilter = false;

        if (catParam) {
          activeCategory = catParam;
          hasFilter = true;
        }
        if (tagParam) {
          activeTag = tagParam.replace(/\+/g, " ");
          hasFilter = true;
        }
        if (searchParam && searchInput) {
          searchInput.value = searchParam;
          hasFilter = true;
        }

        return hasFilter;
      } catch (err) {
        return false;
      }
    }

    syncCounts();
    var hadUrlFilter = parseUrlParams();
    render({ silentUrl: true });

    if (hadUrlFilter) {
      setTimeout(function () {
        scrollToGrid();
      }, 150);
    }
  }

  document.addEventListener("au:ready", init);
  document.addEventListener("DOMContentLoaded", init);
})();

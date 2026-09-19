/* ==========================================================================
   AURELLE — blog-details.js
   Drives dynamic article rendering, slug routing, author signature,
   prev/next pagination, and related article links on blog-details.html.
   ========================================================================== */
(function () {
  "use strict";

  var articles = window.AURELLE_ARTICLES || [];
  if (!articles.length) return;

  function getQuerySlug() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get("slug") || params.get("article") || params.get("id") || "";
    } catch (e) {
      return "";
    }
  }

  function findArticle(query) {
    if (!query) return articles[0]; // Default to Skin Prep article

    var norm = String(query).toLowerCase().trim();
    
    // Check by exact slug
    var match = articles.find(function (a) {
      return a.slug.toLowerCase() === norm;
    });
    if (match) return match;

    // Check by ID
    var num = parseInt(query, 10);
    if (!isNaN(num)) {
      match = articles.find(function (a) {
        return a.id === num;
      });
      if (match) return match;
    }

    // Check by partial title or category
    match = articles.find(function (a) {
      return a.title.toLowerCase().indexOf(norm) !== -1 || a.slug.indexOf(norm) !== -1;
    });

    return match || articles[0];
  }

  function renderArticle(article) {
    if (!article) return;

    // Document Title
    document.title = article.title + " | Aurelle Journal";

    // Hero Breadcrumb
    var breadcrumbActive = document.querySelector(".breadcrumb-au .breadcrumb-item.active");
    if (breadcrumbActive) {
      breadcrumbActive.textContent = article.categoryName;
    }

    // Hero Eyebrow
    var eyebrow = document.querySelector(".page-hero .eyebrow-au");
    if (eyebrow) {
      eyebrow.innerHTML = '<i class="bi bi-tag" aria-hidden="true"></i> ' + article.categoryName + ' Guide';
    }

    // Hero Title & Lead
    var h1 = document.querySelector(".page-hero h1");
    if (h1) h1.textContent = article.title;

    var lead = document.querySelector(".page-hero .lead");
    if (lead) lead.textContent = article.lead;

    // Hero Meta row
    var metaWrap = document.querySelector(".page-hero .d-flex.flex-wrap");
    if (metaWrap) {
      metaWrap.innerHTML = `
        <span class="badge-soft"><i class="bi bi-tag" aria-hidden="true"></i> ${article.categoryName}</span>
        <span><i class="bi bi-person" aria-hidden="true"></i> ${article.author}</span>
        <span><i class="bi bi-calendar3" aria-hidden="true"></i> ${article.date}</span>
        <span><i class="bi bi-clock" aria-hidden="true"></i> ${article.readTime}</span>
      `;
    }

    // Main Feature Image Placeholder (ensure visible immediately)
    var heroPh = document.querySelector(".col-lg-8 > .ph");
    if (heroPh) {
      if (article.image) {
        heroPh.className = "ph " + (article.phClass || "ph-blog") + " ph-16x9 mb-4 is-visible has-img";
        heroPh.setAttribute("aria-label", article.title);
        heroPh.innerHTML = '<img src="' + article.image + '" alt="' + (article.imageAlt || article.title) + '" loading="lazy">';
      } else {
        heroPh.className = "ph " + (article.phClass || "ph-blog") + " ph-16x9 mb-4 is-visible";
        heroPh.setAttribute("aria-label", article.title);
        heroPh.innerHTML = '<i class="bi ' + (article.icon || "bi-droplet") + '" aria-hidden="true"></i>';
      }
    }

    // Post Body HTML
    var postBody = document.querySelector(".post-body");
    if (postBody) {
      postBody.innerHTML = article.body;
      // Ensure all child elements are 100% visible
      var bodyReveals = postBody.querySelectorAll(".reveal");
      bodyReveals.forEach(function (el) { el.classList.add("is-visible"); });
    }

    // Tag Cloud
    var tagCloud = document.querySelector(".tag-cloud[aria-label='Article tags']");
    if (tagCloud && article.tags && article.tags.length) {
      tagCloud.innerHTML = article.tags.map(function (t) {
        var queryTag = encodeURIComponent(t.toLowerCase());
        return '<a href="blog.html?tag=' + queryTag + '">' + t + '</a>';
      }).join("");
    }

    // Previous / Next Article Navigation
    var currentIndex = articles.findIndex(function (a) { return a.slug === article.slug; });
    if (currentIndex === -1) currentIndex = 0;

    var prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    var nextIndex = (currentIndex + 1) % articles.length;
    var prevArticle = articles[prevIndex];
    var nextArticle = articles[nextIndex];

    var navWrap = document.querySelector("nav[aria-label='Article navigation']");
    if (navWrap) {
      navWrap.innerHTML = `
        <a href="blog-details.html?slug=${prevArticle.slug}" class="d-inline-flex align-items-center gap-2 text-decoration-none">
          <i class="bi bi-arrow-left text-rose" aria-hidden="true"></i>
          <span><small class="d-block text-muted-au">Previous Article</small><strong>${prevArticle.title}</strong></span>
        </a>
        <a href="blog-details.html?slug=${nextArticle.slug}" class="d-inline-flex align-items-center gap-2 text-end text-decoration-none">
          <span><small class="d-block text-muted-au">Next Article</small><strong>${nextArticle.title}</strong></span>
          <i class="bi bi-arrow-right text-rose" aria-hidden="true"></i>
        </a>
      `;
    }

    // Sidebar Category active state update
    var catLinks = document.querySelectorAll(".widget-cat-link");
    catLinks.forEach(function (link) {
      var cat = link.getAttribute("href") || "";
      var isActive = cat.indexOf(article.category) !== -1;
      link.classList.toggle("is-active", isActive);
    });

    // Related Articles
    renderRelatedArticles(article, currentIndex);

    // Re-observe any remaining scroll reveal elements
    if (window.AU && typeof window.AU.observeReveals === "function") {
      window.AU.observeReveals();
    }
  }

  function renderRelatedArticles(currentArticle, currentIndex) {
    var relatedContainer = document.querySelector(".section-alt .row.g-4");
    if (!relatedContainer) return;

    // Pick 3 articles (distinct from current)
    var candidates = articles.filter(function (a) {
      return a.slug !== currentArticle.slug;
    });

    // Sort to prioritize same category or next in series
    candidates.sort(function (a, b) {
      if (a.category === currentArticle.category && b.category !== currentArticle.category) return -1;
      if (b.category === currentArticle.category && a.category !== currentArticle.category) return 1;
      return 0;
    });

    var selected = candidates.slice(0, 3);
    relatedContainer.innerHTML = selected.map(function (art, idx) {
      var imageHtml = art.image
        ? `<div class="ph ${art.phClass || 'ph-blog'} ph-4x3 has-img" role="img" aria-label="${art.imageAlt || art.title}">
            <img src="${art.image}" alt="${art.imageAlt || art.title}" loading="lazy">
          </div>`
        : `<div class="ph ${art.phClass || 'ph-blog'} ph-4x3" role="img" aria-label="${art.title}">
            <i class="bi ${art.icon || 'bi-journal-text'}" aria-hidden="true"></i>
          </div>`;

      return `
        <div class="col-lg-4 col-md-6 is-visible" data-delay="${idx}">
          <article class="card-au post-card h-100">
            <a href="blog-details.html?slug=${art.slug}" aria-label="Read: ${art.title}">
              ${imageHtml}
            </a>
            <div class="card-body-au d-flex flex-column">
              <div class="post-meta">
                <span><i class="bi bi-tag" aria-hidden="true"></i> ${art.categoryName}</span>
                <span><i class="bi bi-clock" aria-hidden="true"></i> ${art.readTime}</span>
              </div>
              <h3><a href="blog-details.html?slug=${art.slug}">${art.title}</a></h3>
              <p class="small text-muted-au">${art.lead}</p>
              <div class="post-foot">
                <a href="blog-details.html?slug=${art.slug}" class="btn btn-soft btn-sm" data-i18n="cta.readMore">Read More</a>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join("");
  }

  function init() {
    var slug = getQuerySlug();
    var article = findArticle(slug);
    renderArticle(article);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
  document.addEventListener("au:ready", init);
})();

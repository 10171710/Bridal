/* ==========================================================================
   AURELLE — charts.js
   A tiny dependency-free canvas chart engine for the two dashboards.
   No Chart.js, no CDN — just the 2D context.

   Public API (all take a <canvas> element and an options object):
     AU.chart.line(canvas, { labels, series, area, yFormat })
     AU.chart.bar(canvas, { labels, series, stacked, yFormat })
     AU.chart.donut(canvas, { segments, cutout })
     AU.chart.spark(canvas, { data, color, area })

   Every chart is:
     - HiDPI-correct (scales to devicePixelRatio)
     - responsive (redraws on container resize)
     - theme-aware (redraws on the `au:themechange` event)
     - keyboard/screen-reader safe (canvas carries role="img" + aria-label;
       pass `describe` to override the generated description)

   Load AFTER main.js and BEFORE dashboard.js / admin.js.
   ========================================================================== */
(function (window, document) {
  "use strict";

  var AU = window.AU || (window.AU = {});
  var registry = [];

  /* ---------------------------------------------------------------------
     Theme helpers — read live values off the CSS custom properties so the
     charts always match the active light/dark palette.
     --------------------------------------------------------------------- */
  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function palette() {
    return {
      rose: token("--au-rose", "#b76e79"),
      roseLight: token("--au-rose-light", "#d99aa3"),
      gold: token("--au-gold", "#c9a227"),
      goldLight: token("--au-gold-light", "#e2c76b"),
      plum: token("--au-plum", "#2b1a22"),
      text: token("--au-text", "#2b1a22"),
      muted: token("--au-text-muted", "#7b6670"),
      border: token("--au-border", "#ecdfd8"),
      surface: token("--au-surface", "#ffffff")
    };
  }

  AU.chartColors = function () {
    var p = palette();
    return [p.rose, p.gold, "#3469a8", "#2f9e6e", "#7c54a8", p.roseLight];
  };

  function hexToRgba(hex, alpha) {
    var h = String(hex).trim();
    if (h.charAt(0) !== "#") return h;
    if (h.length === 4) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    var n = parseInt(h.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  /* ---------------------------------------------------------------------
     Canvas setup
     --------------------------------------------------------------------- */
  function setup(canvas, height) {
    var parent = canvas.parentNode;
    var cssW = Math.max(160, parent.clientWidth || canvas.clientWidth || 320);
    var cssH = height || parseInt(canvas.getAttribute("data-height"), 10) || 240;
    var dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";

    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    return { ctx: ctx, w: cssW, h: cssH };
  }

  function describe(canvas, text) {
    canvas.setAttribute("role", "img");
    if (!canvas.getAttribute("aria-label")) canvas.setAttribute("aria-label", text);
  }

  function niceMax(value) {
    if (value <= 0) return 10;
    var pow = Math.pow(10, Math.floor(Math.log10(value)));
    var n = value / pow;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * pow;
  }

  function fmt(value, formatter) {
    if (typeof formatter === "function") return formatter(value);
    if (formatter === "money") return "$" + Number(value).toLocaleString("en-US");
    if (formatter === "percent") return value + "%";
    return Number(value).toLocaleString("en-US");
  }

  /* ---------------------------------------------------------------------
     Shared tooltip
     --------------------------------------------------------------------- */
  function tooltipFor(canvas) {
    var parent = canvas.parentNode;
    var tip = parent.querySelector(".chart-tooltip");
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "chart-tooltip";
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      parent.appendChild(tip);
    }
    return tip;
  }

  function bindHover(canvas, hitTest) {
    var tip = tooltipFor(canvas);

    function move(e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var hit = hitTest(x, y);
      if (hit) {
        tip.innerHTML = hit.html;
        tip.style.left = hit.x + "px";
        tip.style.top = hit.y + "px";
        tip.classList.add("is-shown");
      } else {
        tip.classList.remove("is-shown");
      }
    }

    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseleave", function () { tip.classList.remove("is-shown"); });
  }

  /* ---------------------------------------------------------------------
     Register + redraw on resize / theme change
     --------------------------------------------------------------------- */
  function register(canvas, draw) {
    var entry = { canvas: canvas, draw: draw };

    /* replace any previous registration for this canvas */
    registry = registry.filter(function (r) { return r.canvas !== canvas; });
    registry.push(entry);

    draw();

    if (window.ResizeObserver && canvas.parentNode) {
      if (entry.ro) entry.ro.disconnect();
      entry.ro = new ResizeObserver(AU.debounce(function () { draw(); }, 120));
      entry.ro.observe(canvas.parentNode);
    }
    return entry;
  }

  document.addEventListener("au:themechange", function () {
    registry.forEach(function (r) {
      if (document.body.contains(r.canvas)) r.draw();
    });
  });

  window.addEventListener("resize", AU.debounce(function () {
    registry.forEach(function (r) {
      if (document.body.contains(r.canvas)) r.draw();
    });
  }, 160));

  /* Redraw when a hidden dashboard panel becomes visible (canvas measures 0
     while display:none, so the first draw would otherwise be blank). */
  AU.redrawCharts = function () {
    registry.forEach(function (r) {
      if (document.body.contains(r.canvas) && r.canvas.parentNode.clientWidth > 0) r.draw();
    });
  };

  /* =====================================================================
     LINE / AREA
     ===================================================================== */
  function line(canvas, opts) {
    if (!canvas) return;
    var o = opts || {};
    var labels = o.labels || [];
    var series = o.series || [];

    function draw() {
      var s = setup(canvas, o.height);
      var ctx = s.ctx, w = s.w, h = s.h;
      var p = palette();
      var padL = 48, padR = 12, padT = 14, padB = 30;
      var plotW = w - padL - padR;
      var plotH = h - padT - padB;
      if (plotW <= 0 || plotH <= 0) return;

      var all = [];
      series.forEach(function (ser) { all = all.concat(ser.data); });
      var max = niceMax(Math.max.apply(null, all.concat([1])));
      var steps = 4;

      /* grid + y labels */
      ctx.font = "11px " + token("--au-font-body", "sans-serif");
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var i = 0; i <= steps; i++) {
        var val = (max / steps) * i;
        var y = padT + plotH - (plotH / steps) * i;
        ctx.strokeStyle = p.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, Math.round(y) + 0.5);
        ctx.lineTo(padL + plotW, Math.round(y) + 0.5);
        ctx.stroke();
        ctx.fillStyle = p.muted;
        ctx.fillText(fmt(Math.round(val), o.yFormat), padL - 8, y);
      }

      /* x labels */
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      var stepX = labels.length > 1 ? plotW / (labels.length - 1) : plotW;
      var skip = Math.ceil(labels.length / Math.max(2, Math.floor(plotW / 54)));
      labels.forEach(function (lab, i) {
        if (i % skip !== 0 && i !== labels.length - 1) return;
        ctx.fillStyle = p.muted;
        ctx.fillText(lab, padL + stepX * i, padT + plotH + 9);
      });

      /* series */
      var colors = AU.chartColors();
      var points = [];

      series.forEach(function (ser, si) {
        var color = ser.color || colors[si % colors.length];
        var pts = ser.data.map(function (v, i) {
          return { x: padL + stepX * i, y: padT + plotH - (v / max) * plotH, v: v, label: labels[i] };
        });
        points.push({ name: ser.name, color: color, pts: pts });

        if (o.area !== false) {
          var grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
          grad.addColorStop(0, hexToRgba(color, 0.28));
          grad.addColorStop(1, hexToRgba(color, 0));
          ctx.beginPath();
          ctx.moveTo(pts[0].x, padT + plotH);
          pts.forEach(function (pt) { ctx.lineTo(pt.x, pt.y); });
          ctx.lineTo(pts[pts.length - 1].x, padT + plotH);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        pts.forEach(function (pt, i) { i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y); });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();

        pts.forEach(function (pt) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = p.surface;
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      bindHover(canvas, function (mx) {
        if (!points.length) return null;
        var idx = Math.round((mx - padL) / stepX);
        if (idx < 0 || idx >= labels.length) return null;
        var rows = points.map(function (ser) {
          return '<span style="color:' + ser.color + '">●</span> ' +
                 (ser.name ? AU.escapeHtml(ser.name) + ": " : "") +
                 fmt(ser.pts[idx].v, o.yFormat);
        }).join("<br>");
        return {
          html: "<strong>" + AU.escapeHtml(labels[idx]) + "</strong><br>" + rows,
          x: padL + stepX * idx,
          y: points[0].pts[idx].y
        };
      });

      describe(canvas, (o.title || "Line chart") + ": " + series.map(function (ser) {
        return (ser.name || "series") + " from " + fmt(ser.data[0], o.yFormat) +
               " to " + fmt(ser.data[ser.data.length - 1], o.yFormat);
      }).join("; "));
    }

    return register(canvas, draw);
  }

  /* =====================================================================
     BAR (grouped or stacked)
     ===================================================================== */
  function bar(canvas, opts) {
    if (!canvas) return;
    var o = opts || {};
    var labels = o.labels || [];
    var series = o.series || [];

    function draw() {
      var s = setup(canvas, o.height);
      var ctx = s.ctx, w = s.w, h = s.h;
      var p = palette();
      var padL = 48, padR = 12, padT = 14, padB = 30;
      var plotW = w - padL - padR;
      var plotH = h - padT - padB;
      if (plotW <= 0 || plotH <= 0) return;

      var max;
      if (o.stacked) {
        max = niceMax(Math.max.apply(null, labels.map(function (_, i) {
          return series.reduce(function (sum, ser) { return sum + (ser.data[i] || 0); }, 0);
        }).concat([1])));
      } else {
        var all = [];
        series.forEach(function (ser) { all = all.concat(ser.data); });
        max = niceMax(Math.max.apply(null, all.concat([1])));
      }

      var steps = 4;
      ctx.font = "11px " + token("--au-font-body", "sans-serif");
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (var i = 0; i <= steps; i++) {
        var y = padT + plotH - (plotH / steps) * i;
        ctx.strokeStyle = p.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padL, Math.round(y) + 0.5);
        ctx.lineTo(padL + plotW, Math.round(y) + 0.5);
        ctx.stroke();
        ctx.fillStyle = p.muted;
        ctx.fillText(fmt(Math.round((max / steps) * i), o.yFormat), padL - 8, y);
      }

      var colors = AU.chartColors();
      var slot = plotW / labels.length;
      var groupW = slot * 0.62;
      var barW = o.stacked ? groupW : groupW / Math.max(1, series.length);
      var bars = [];

      labels.forEach(function (lab, li) {
        var baseX = padL + slot * li + (slot - groupW) / 2;
        var stackY = padT + plotH;

        series.forEach(function (ser, si) {
          var color = ser.color || colors[si % colors.length];
          var v = ser.data[li] || 0;
          var bh = (v / max) * plotH;
          var x = o.stacked ? baseX : baseX + barW * si;
          var y = o.stacked ? (stackY - bh) : (padT + plotH - bh);
          if (o.stacked) stackY -= bh;

          var r = Math.min(4, barW / 2, bh);
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, barW - 2), bh, [r, r, 0, 0]);
          else ctx.rect(x, y, Math.max(1, barW - 2), bh);
          ctx.fillStyle = color;
          ctx.fill();

          bars.push({ x: x, y: y, w: barW - 2, h: bh, v: v, label: lab, name: ser.name, color: color });
        });
      });

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      var skip = Math.ceil(labels.length / Math.max(2, Math.floor(plotW / 54)));
      labels.forEach(function (lab, li) {
        if (li % skip !== 0 && li !== labels.length - 1) return;
        ctx.fillStyle = p.muted;
        ctx.fillText(lab, padL + slot * li + slot / 2, padT + plotH + 9);
      });

      bindHover(canvas, function (mx, my) {
        for (var i = 0; i < bars.length; i++) {
          var b = bars[i];
          if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
            return {
              html: "<strong>" + AU.escapeHtml(b.label) + "</strong><br>" +
                    '<span style="color:' + b.color + '">●</span> ' +
                    (b.name ? AU.escapeHtml(b.name) + ": " : "") + fmt(b.v, o.yFormat),
              x: b.x + b.w / 2,
              y: b.y
            };
          }
        }
        return null;
      });

      describe(canvas, (o.title || "Bar chart") + " across " + labels.length + " periods, peak " + fmt(max, o.yFormat));
    }

    return register(canvas, draw);
  }

  /* =====================================================================
     DONUT
     ===================================================================== */
  function donut(canvas, opts) {
    if (!canvas) return;
    var o = opts || {};
    var segments = o.segments || [];

    function draw() {
      var s = setup(canvas, o.height);
      var ctx = s.ctx, w = s.w, h = s.h;
      var p = palette();
      if (w <= 0 || h <= 0) return;

      var total = segments.reduce(function (sum, seg) { return sum + seg.value; }, 0) || 1;
      var cx = w / 2, cy = h / 2;
      var outer = Math.max(20, Math.min(w, h) / 2 - 6);
      var inner = outer * (o.cutout || 0.62);
      var colors = AU.chartColors();
      var start = -Math.PI / 2;
      var arcs = [];

      segments.forEach(function (seg, i) {
        var color = seg.color || colors[i % colors.length];
        var angle = (seg.value / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(cx, cy, outer, start, start + angle);
        ctx.arc(cx, cy, inner, start + angle, start, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        ctx.strokeStyle = p.surface;
        ctx.lineWidth = 2;
        ctx.stroke();

        arcs.push({ from: start, to: start + angle, seg: seg, color: color, pct: (seg.value / total) * 100 });
        start += angle;
      });

      bindHover(canvas, function (mx, my) {
        var dx = mx - cx, dy = my - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < inner || dist > outer) return null;
        var a = Math.atan2(dy, dx);
        if (a < -Math.PI / 2) a += Math.PI * 2;
        for (var i = 0; i < arcs.length; i++) {
          if (a >= arcs[i].from && a <= arcs[i].to) {
            return {
              html: '<span style="color:' + arcs[i].color + '">●</span> ' +
                    AU.escapeHtml(arcs[i].seg.label) + ": " +
                    fmt(arcs[i].seg.value, o.yFormat) +
                    " (" + arcs[i].pct.toFixed(0) + "%)",
              x: mx,
              y: my
            };
          }
        }
        return null;
      });

      describe(canvas, (o.title || "Donut chart") + ": " + segments.map(function (seg) {
        return seg.label + " " + ((seg.value / total) * 100).toFixed(0) + "%";
      }).join(", "));
    }

    return register(canvas, draw);
  }

  /* =====================================================================
     SPARKLINE
     ===================================================================== */
  function spark(canvas, opts) {
    if (!canvas) return;
    var o = opts || {};
    var data = o.data || [];

    function draw() {
      var s = setup(canvas, o.height || 38);
      var ctx = s.ctx, w = s.w, h = s.h;
      if (w <= 0 || h <= 0 || !data.length) return;

      var color = o.color || palette().rose;
      var min = Math.min.apply(null, data);
      var max = Math.max.apply(null, data);
      var range = (max - min) || 1;
      var pad = 3;
      var stepX = data.length > 1 ? (w - pad * 2) / (data.length - 1) : w;

      var pts = data.map(function (v, i) {
        return { x: pad + stepX * i, y: pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2) };
      });

      if (o.area !== false) {
        var grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, hexToRgba(color, 0.32));
        grad.addColorStop(1, hexToRgba(color, 0));
        ctx.beginPath();
        ctx.moveTo(pts[0].x, h);
        pts.forEach(function (pt) { ctx.lineTo(pt.x, pt.y); });
        ctx.lineTo(pts[pts.length - 1].x, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      pts.forEach(function (pt, i) { i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y); });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      var last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      var dir = data[data.length - 1] >= data[0] ? "up" : "down";
      describe(canvas, (o.title || "Trend") + " trending " + dir +
        ", from " + fmt(data[0], o.yFormat) + " to " + fmt(data[data.length - 1], o.yFormat));
    }

    return register(canvas, draw);
  }

  /* =====================================================================
     Legend helper — builds .chart-legend markup from series/segments
     ===================================================================== */
  function legend(container, items) {
    if (!container) return;
    var colors = AU.chartColors();
    container.className = "chart-legend";
    container.innerHTML = items.map(function (item, i) {
      var color = item.color || colors[i % colors.length];
      return '<span class="cl-item"><span class="cl-swatch" style="background:' + color + '"></span>' +
             AU.escapeHtml(item.name || item.label) + "</span>";
    }).join("");
  }

  AU.chart = { line: line, bar: bar, donut: donut, spark: spark, legend: legend };
})(window, document);

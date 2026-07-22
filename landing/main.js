/* Idem landing — theme toggle + scroll reveal. No dependencies. */

(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return media.matches ? "dark" : "light";
  }

  function updateToggleLabel() {
    if (!toggle) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("idem-theme", next);
      } catch (e) {
        /* storage unavailable; theme still applies for this page view */
      }
      updateToggleLabel();
    });
  }

  if (media.addEventListener) {
    media.addEventListener("change", updateToggleLabel);
  }
  updateToggleLabel();

  /* ---------- Scroll reveal ---------- */

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || reduceMotion) {
    root.classList.add("no-observer");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();

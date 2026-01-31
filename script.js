(function () {
  "use strict";

  // Mobile-Menü: Hamburger öffnen/schließen
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var navOverlay = document.querySelector(".nav-overlay");
  var navClose = document.querySelector(".nav-close");

  function openNav() {
    if (!header || !navToggle || !siteNav) return;
    header.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Menü schließen");
    document.body.classList.add("nav-open");
  }
  function closeNav() {
    if (!header || !navToggle || !siteNav) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
    document.body.classList.remove("nav-open");
  }
  function toggleNav() {
    if (header.classList.contains("nav-open")) closeNav();
    else openNav();
  }

  if (navToggle) navToggle.addEventListener("click", toggleNav);
  if (navOverlay) navOverlay.addEventListener("click", closeNav);
  if (navClose) navClose.addEventListener("click", closeNav);
  if (siteNav) {
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && header && header.classList.contains("nav-open")) closeNav();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header && header.classList.contains("nav-open")) closeNav();
  });

  // Karussell: Nächstes/Vorheriges Bild
  var carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    var slides = carousel.querySelectorAll(".carousel-slide");
    var nextBtn = carousel.parentElement.querySelector(".carousel-next");
    var current = 0;

    function showSlide(index) {
      if (index >= slides.length) current = 0;
      else if (index < 0) current = slides.length - 1;
      else current = index;
      slides.forEach(function (s, i) {
        s.classList.toggle("active", i === current);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showSlide(current + 1);
      });
    }
    showSlide(0);
  }

  // Scroll-Indikatoren: sanft zur nächsten Sektion
  document.querySelectorAll(".scroll-indicator").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var href = el.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Optionale Anker-Smooth-Scroll für alle #-Links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute("href");
    if (id === "#") return;
    var target = document.querySelector(id);
    if (target) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  // Cookie-Banner (DSGVO)
  var cookieBanner = document.getElementById("cookie-banner");
  var cookieBtnAccept = document.getElementById("cookie-btn-accept");
  var cookieBtnNecessary = document.getElementById("cookie-btn-necessary");
  var cookieStorageKey = "123terrassendach-cookie-consent";

  function hideCookieBanner() {
    if (cookieBanner) cookieBanner.classList.remove("is-visible");
  }
  function showCookieBanner() {
    if (cookieBanner) cookieBanner.classList.add("is-visible");
  }
  function setConsent(value) {
    try {
      localStorage.setItem(cookieStorageKey, value);
    } catch (e) {}
    hideCookieBanner();
  }

  if (cookieBanner) {
    try {
      if (!localStorage.getItem(cookieStorageKey)) showCookieBanner();
    } catch (e) {
      showCookieBanner();
    }
    if (cookieBtnAccept) {
      cookieBtnAccept.addEventListener("click", function () { setConsent("all"); });
    }
    if (cookieBtnNecessary) {
      cookieBtnNecessary.addEventListener("click", function () { setConsent("necessary"); });
    }
  }
})();

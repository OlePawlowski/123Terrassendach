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

  // Sprachumschalter: Dropdown öffnen/schließen, Auswahl anzeigen
  document.querySelectorAll("[data-lang-select]").forEach(function (wrapper) {
    var current = wrapper.querySelector(".lang-select-current");
    var dropdown = wrapper.querySelector(".lang-select-dropdown");
    var options = wrapper.querySelectorAll(".lang-option");
    if (!current || !dropdown) return;

    function open() {
      wrapper.classList.add("is-open");
      current.setAttribute("aria-expanded", "true");
    }
    function close() {
      wrapper.classList.remove("is-open");
      current.setAttribute("aria-expanded", "false");
    }
    function setCurrent(opt) {
      options.forEach(function (o) {
        o.classList.toggle("is-current", o === opt);
      });
      var flag = opt.querySelector("[class^=flag-]");
      var lang = (opt.getAttribute("data-lang") || "de").toUpperCase();
      var currentLabel = current.querySelectorAll("span")[1];
      var currentFlag = current.querySelector("[class^=flag-]");
      if (currentLabel) currentLabel.textContent = lang;
      if (currentFlag && flag) {
        currentFlag.className = flag.className;
        currentFlag.setAttribute("aria-hidden", "true");
      }
    }

    current.addEventListener("click", function (e) {
      e.stopPropagation();
      if (wrapper.classList.contains("is-open")) close();
      else open();
    });
    options.forEach(function (opt) {
      opt.addEventListener("click", function (e) {
        var href = opt.getAttribute("href");
        if (href && href !== "#") {
          close();
          return;
        }
        e.preventDefault();
        setCurrent(opt);
        close();
      });
    });
    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wrapper.classList.contains("is-open")) close();
    });
  });

  // Kontaktformular: mailto-Fallback (ohne Backend)
  var kontaktForm = document.getElementById("kontakt-form");
  if (kontaktForm) {
    kontaktForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var emailEl = kontaktForm.querySelector('input[name="email"]');
      var messageEl = kontaktForm.querySelector('textarea[name="message"]');
      var email = (emailEl && emailEl.value) ? emailEl.value.trim() : "";
      var message = (messageEl && messageEl.value) ? messageEl.value.trim() : "";
      if (!email || !message) {
        if (kontaktForm.reportValidity) kontaktForm.reportValidity();
        return;
      }
      var isEn = document.documentElement.lang === "en";
      var subject = encodeURIComponent(isEn ? "Enquiry via 123 Terrassendach" : "Anfrage über 123 Terrassendach");
      var bodyLabel = isEn ? "Message" : "Nachricht";
      var body = encodeURIComponent("E-Mail: " + email + "\n\n" + bodyLabel + ":\n" + message);
      window.location.href = "mailto:info@123terrassendach.de?subject=" + subject + "&body=" + body;
    });
  }

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

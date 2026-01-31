(function () {
  "use strict";

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
})();

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var navMobile = document.querySelector(".nav-mobile");
  var scrollTopBtn = document.querySelector(".scroll-top");
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

  function setHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  function toggleMenu(force) {
    if (!menuToggle || !navMobile) return;
    var open = typeof force === "boolean" ? force : menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", open);
    navMobile.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", function () {
      toggleMenu();
    });
    navMobile.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        toggleMenu(false);
      });
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navMobile && navMobile.classList.contains("is-open")) {
      toggleMenu(false);
    }
  });

  window.addEventListener("scroll", function () {
    setHeaderShadow();
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 400);
    }
    updateActiveNav();
  });

  setHeaderShadow();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function updateActiveNav() {
    var y = window.scrollY + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80);
    var current = "";
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var h = sec.offsetHeight;
      if (y >= top && y < top + h) {
        current = sec.getAttribute("id") || "";
      }
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href");
      if (href && href.startsWith("#") && href.slice(1) === current) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Keep floating actions from covering form controls on small screens. */
  var contactSection = document.getElementById("contact");
  if (contactSection) {
    function syncContactVisibility() {
      if (window.matchMedia("(max-width: 650px)").matches) {
        var bounds = contactSection.getBoundingClientRect();
        document.body.classList.toggle(
          "contact-in-view",
          bounds.top < window.innerHeight && bounds.bottom > 0
        );
      } else {
        document.body.classList.remove("contact-in-view");
      }
    }

    window.addEventListener("scroll", syncContactVisibility, { passive: true });
    window.addEventListener("resize", syncContactVisibility);
    syncContactVisibility();
  }

  /* The Formspree handler is configured on the contact form in index.html. */
  updateActiveNav();
})();

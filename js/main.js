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

  /* Contact form — FormSubmit (AJAX) */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var formSuccessMessage =
    "Thank you — your message was sent. We'll get back to you soon. For urgent matters, call 081-324-6257.";

  function showFormStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = "form-status" + (type ? " is-" + type : "");
    statusEl.style.display = message ? "block" : "none";
  }

  function setFormBusy(isBusy) {
    var btn = form && form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = isBusy;
    btn.setAttribute("aria-busy", isBusy ? "true" : "false");
    btn.textContent = isBusy ? "Sending…" : "Send message";
  }

  if (form && statusEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var msg = form.querySelector("#message");
      var gotcha = form.querySelector('input[name="_gotcha"]');
      if (!name || !email || !msg) return;

      if (gotcha && gotcha.value) return;

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        showFormStatus("Please fill in your name, email, and message.", "error");
        return;
      }

      showFormStatus("", "");
      setFormBusy(true);

      var action = form.getAttribute("action") || "";
      if (action.indexOf("/ajax/") === -1) {
        action = action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (response.ok) {
              return data;
            }
            throw new Error(
              (data && data.message) || "Unable to send your message. Please try again."
            );
          });
        })
        .then(function () {
          form.reset();
          showFormStatus(formSuccessMessage, "success");
        })
        .catch(function (err) {
          showFormStatus(
            err.message ||
              "Something went wrong. Please email info@naumetech.com or call 081-324-6257.",
            "error"
          );
        })
        .finally(function () {
          setFormBusy(false);
        });
    });
  }

  /* Legacy redirect success (if user lands with ?contact=sent) */
  if (window.location.search.indexOf("contact=sent") !== -1 && statusEl) {
    showFormStatus(formSuccessMessage, "success");
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  }

  updateActiveNav();
})();

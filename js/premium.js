(function () {
  "use strict";

  // Progressive enhancement: the default recommendation is readable
  // even when JavaScript is unavailable.
  var options = document.querySelectorAll(".solution-option[data-solution]");
  var title = document.getElementById("solution-name");
  var description = document.getElementById("solution-description");
  var cta = document.getElementById("solution-cta");
  var serviceSelect = document.getElementById("service");

  var solutions = {
    managed: {
      title: "Managed IT Support",
      description: "Scoped remote support, maintenance and practical help for your business systems.",
      formValue: "Managed IT Support"
    },
    m365: {
      title: "Microsoft 365 Administration",
      description: "Support with business email, Teams, SharePoint, account management and secure user access.",
      formValue: "Microsoft 365 Administration"
    },
    software: {
      title: "Custom Software Development",
      description: "Purpose-built applications, APIs and integrations shaped around your business workflows.",
      formValue: "Custom Software Development"
    },
    web: {
      title: "Professional Website Development",
      description: "A professional website or online shop with practical functionality and room to grow.",
      formValue: "Professional Website Development"
    }
  };

  function applySolution(key) {
    var solution = solutions[key];
    if (!solution || !title || !description) return;
    title.textContent = solution.title;
    description.textContent = solution.description;
    options.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.solution === key));
    });
    if (cta) {
      cta.setAttribute("aria-label", "Enquire about " + solution.title);
    }
    if (serviceSelect) {
      var exists = Array.prototype.some.call(serviceSelect.options, function (opt) {
        return opt.value === solution.formValue;
      });
      if (exists) serviceSelect.value = solution.formValue;
    }
  }

  options.forEach(function (button) {
    button.addEventListener("click", function () {
      applySolution(button.dataset.solution);
    });
  });

  // Respect explicit visitor selection in the contact form itself.
  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      options.forEach(function (button) {
        var solution = solutions[button.dataset.solution];
        button.setAttribute("aria-pressed", String(!!solution && solution.formValue === serviceSelect.value));
      });
    });
  }
})();

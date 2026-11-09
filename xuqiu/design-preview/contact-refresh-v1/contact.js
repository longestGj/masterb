(function () {
  "use strict";

  document.querySelectorAll('[data-chrome-nav="contact"]').forEach(function (link) {
    link.setAttribute("aria-current", "page");
  });

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }
})();

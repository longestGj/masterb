(function () {
  "use strict";

  var header = document.querySelector("[data-sketch-header]");
  if (!header) {
    return;
  }

  var productsToggle = header.querySelector("[data-sketch-products-toggle]");
  var menuButton = header.querySelector("[data-sketch-menu-button]");
  var mobileMenu = header.querySelector("[data-sketch-mobile-menu]");

  function setProductsOpen(isOpen) {
    if (!productsToggle) {
      return;
    }
    header.classList.toggle("is-products-open", isOpen);
    productsToggle.setAttribute("aria-expanded", String(isOpen));
  }

  function setMenuOpen(isOpen, restoreFocus) {
    if (!menuButton || !mobileMenu) {
      return;
    }

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("sketch-menu-open", isOpen);

    var icon = menuButton.querySelector("img");
    if (icon) {
      icon.src = isOpen
        ? icon.getAttribute("data-close-icon")
        : icon.getAttribute("data-open-icon");
    }

    if (!isOpen && restoreFocus) {
      menuButton.focus();
    }
  }

  if (productsToggle) {
    productsToggle.addEventListener("click", function () {
      setProductsOpen(productsToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true", false);
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false, false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    setProductsOpen(false);
    setMenuOpen(false, true);
  });
})();

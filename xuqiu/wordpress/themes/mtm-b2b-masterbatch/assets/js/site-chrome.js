(function () {
	"use strict";

	var header = document.querySelector("[data-site-chrome-header]");
	if (!header) {
		return;
	}

	var productNav = header.querySelector("[data-chrome-product-nav]");
	var productToggle = header.querySelector("[data-chrome-products-toggle]");
	var resourceNav = header.querySelector("[data-chrome-resource-nav]");
	var resourceToggle = header.querySelector("[data-chrome-resources-toggle]");
	var mobileButton = header.querySelector("[data-site-chrome-menu-button]");
	var mobileMenu = header.querySelector("[data-site-chrome-menu]");
	var mobileProductsToggle = header.querySelector("[data-site-chrome-mobile-products-toggle]");
	var mobileProductsMenu = document.getElementById("site-chrome-mobile-products-menu");
	var mobileResourcesToggle = header.querySelector("[data-site-chrome-mobile-resources-toggle]");
	var mobileResourcesMenu = document.getElementById("site-chrome-mobile-resources-menu");
	var desktopQuery = window.matchMedia("(min-width: 981px)");

	function setProductsOpen(isOpen) {
		if (!productNav || !productToggle) {
			return;
		}

		productNav.classList.toggle("is-open", isOpen);
		productToggle.setAttribute("aria-expanded", String(isOpen));
	}

	function setResourcesOpen(isOpen) {
		if (!resourceNav || !resourceToggle) {
			return;
		}

		resourceNav.classList.toggle("is-open", isOpen);
		resourceToggle.setAttribute("aria-expanded", String(isOpen));
	}

	function setMobileMenuOpen(isOpen, restoreFocus) {
		if (!mobileButton || !mobileMenu) {
			return;
		}

		mobileButton.setAttribute("aria-expanded", String(isOpen));
		mobileButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
		mobileMenu.classList.toggle("is-open", isOpen);
		mobileMenu.setAttribute("aria-hidden", String(!isOpen));
		document.body.classList.toggle("site-chrome-menu-open", isOpen);

		var icon = mobileButton.querySelector("img");
		if (icon) {
			icon.src = isOpen
				? icon.getAttribute("data-close-src")
				: icon.getAttribute("data-open-src");
		}

		if (!isOpen && restoreFocus) {
			mobileButton.focus();
		}
	}

	if (productToggle) {
		productToggle.addEventListener("click", function () {
			var isOpen = productToggle.getAttribute("aria-expanded") !== "true";
			setResourcesOpen(false);
			setProductsOpen(isOpen);
		});

		productNav.addEventListener("focusout", function (event) {
			if (!productNav.contains(event.relatedTarget)) {
				setProductsOpen(false);
			}
		});
	}

	if (resourceToggle) {
		resourceToggle.addEventListener("click", function () {
			var isOpen = resourceToggle.getAttribute("aria-expanded") !== "true";
			setProductsOpen(false);
			setResourcesOpen(isOpen);
		});

		resourceNav.addEventListener("focusout", function (event) {
			if (!resourceNav.contains(event.relatedTarget)) {
				setResourcesOpen(false);
			}
		});
	}

	if (mobileButton) {
		mobileButton.addEventListener("click", function () {
			setMobileMenuOpen(mobileButton.getAttribute("aria-expanded") !== "true", false);
		});
	}

	if (mobileProductsToggle && mobileProductsMenu) {
		mobileProductsToggle.addEventListener("click", function () {
			var isOpen = mobileProductsToggle.getAttribute("aria-expanded") === "true";
			mobileProductsToggle.setAttribute("aria-expanded", String(!isOpen));
			mobileProductsMenu.classList.toggle("is-open", !isOpen);
		});
	}

	if (mobileResourcesToggle && mobileResourcesMenu) {
		mobileResourcesToggle.addEventListener("click", function () {
			var isOpen = mobileResourcesToggle.getAttribute("aria-expanded") === "true";
			mobileResourcesToggle.setAttribute("aria-expanded", String(!isOpen));
			mobileResourcesMenu.classList.toggle("is-open", !isOpen);
		});
	}

	if (mobileMenu) {
		mobileMenu.querySelectorAll("a").forEach(function (link) {
			link.addEventListener("click", function () {
				setMobileMenuOpen(false, false);
			});
		});
	}

	document.addEventListener("keydown", function (event) {
		if (event.key !== "Escape") {
			return;
		}

		if (mobileButton && mobileButton.getAttribute("aria-expanded") === "true") {
			setMobileMenuOpen(false, true);
		}

		setProductsOpen(false);
		setResourcesOpen(false);
	});

	var handleBreakpoint = function (event) {
		if (event.matches) {
			setMobileMenuOpen(false, false);
		} else {
			setProductsOpen(false);
			setResourcesOpen(false);
		}
	};

	if (typeof desktopQuery.addEventListener === "function") {
		desktopQuery.addEventListener("change", handleBreakpoint);
	} else {
		desktopQuery.addListener(handleBreakpoint);
	}

	var pathname = window.location.pathname.replace(/\/+$/, "") || "/";
	var currentMap = {
		home: "/",
		products: "/products",
		resources: "/resources",
		blog: "/blog",
		faq: "/faq",
		documents: "/technical-documents",
		about: "/about-quality",
		contact: "/request-a-quote"
	};

	Object.keys(currentMap).forEach(function (key) {
		var match = currentMap[key];
		var isCurrent = key === "home"
			? pathname === match
			: pathname === match || pathname.indexOf(match + "/") === 0;

		if (!isCurrent) {
			return;
		}

		document.querySelectorAll('[data-chrome-nav="' + key + '"]').forEach(function (link) {
			link.setAttribute("aria-current", "page");
		});

		if (productToggle && key === "products") {
			productToggle.setAttribute("aria-current", "page");
		}
	});

	if (
		resourceToggle
		&& ["/resources", "/blog", "/faq", "/technical-documents"].some(function (route) {
			return pathname === route || pathname.indexOf(route + "/") === 0;
		})
	) {
		resourceToggle.setAttribute("aria-current", "page");
	}

	if (document.body.classList.contains("single-post")) {
		document
			.querySelectorAll('[data-chrome-nav="resources"]')
			.forEach(function (link) {
				link.setAttribute("aria-current", "page");
			});

		if (resourceToggle) {
			resourceToggle.setAttribute("aria-current", "page");
		}

		document
			.querySelectorAll('[data-chrome-nav="blog"]')
			.forEach(function (link) {
				link.setAttribute("aria-current", "page");
			});
	}
})();

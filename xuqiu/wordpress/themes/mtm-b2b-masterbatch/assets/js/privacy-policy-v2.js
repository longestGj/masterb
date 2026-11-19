(function () {
	"use strict";

	var toc = document.querySelector(".mtm-privacy-v2 .privacy-toc");
	if (!toc) {
		return;
	}

	var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
	var sections = links
		.map(function (link) {
			return document.querySelector(link.getAttribute("href"));
		})
		.filter(Boolean);

	if (!links.length || !sections.length || !("IntersectionObserver" in window)) {
		return;
	}

	function setCurrent(id) {
		links.forEach(function (link) {
			if (link.getAttribute("href") === "#" + id) {
				link.setAttribute("aria-current", "true");
			} else {
				link.removeAttribute("aria-current");
			}
		});
	}

	var observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					setCurrent(entry.target.id);
				}
			});
		},
		{ rootMargin: "-18% 0px -66% 0px" }
	);

	sections.forEach(function (section) {
		observer.observe(section);
	});
}());

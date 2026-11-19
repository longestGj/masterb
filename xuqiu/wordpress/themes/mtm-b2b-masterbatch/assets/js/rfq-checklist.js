(function () {
	"use strict";

	var checklist = document.querySelector(".mtm-rfq-checklist-v2");
	if (!checklist) {
		return;
	}

	var inputs = Array.prototype.slice.call(
		checklist.querySelectorAll('.rfq-chapter input[type="checkbox"]')
	);
	var progress = checklist.querySelector("[data-rfq-checklist-progress]");
	var progressBar = checklist.querySelector(
		"[data-rfq-checklist-progress-bar]"
	);
	var clearButton = checklist.querySelector(
		"[data-rfq-checklist-clear]"
	);

	if (!inputs.length || !progress || !progressBar || !clearButton) {
		return;
	}

	var update = function () {
		var checked = inputs.filter(function (input) {
			return input.checked;
		}).length;
		var percentage = Math.round((checked / inputs.length) * 100);

		progress.textContent =
			checked + " of " + inputs.length + " items checked";
		progressBar.style.width = percentage + "%";
		clearButton.disabled = checked === 0;
	};

	inputs.forEach(function (input) {
		input.addEventListener("change", update);
	});

	clearButton.addEventListener("click", function () {
		inputs.forEach(function (input) {
			input.checked = false;
		});
		update();
		inputs[0].focus();
	});

	update();
})();

document.addEventListener("DOMContentLoaded", () => {
	const backToTopButton = document.getElementById("backToTop");

	// Adjust the scroll threshold (e.g., 500px) or tie it to a specific section
	const scrollThreshold = 1600;

	window.addEventListener("scroll", () => {
		if (window.scrollY > scrollThreshold) {
			backToTopButton.classList.add("show");
		} else {
			backToTopButton.classList.remove("show");
		}
	});

	backToTopButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
});

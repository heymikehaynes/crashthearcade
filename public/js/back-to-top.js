document.addEventListener("DOMContentLoaded", () => {
	const backToTopButton = document.getElementById("backToTop");

	// Show the button after scrolling down 100px
	window.addEventListener("scroll", () => {
		if (window.scrollY > 100) {
			backToTopButton.classList.add("show");
		} else {
			backToTopButton.classList.remove("show");
		}
	});

	// Scroll back to top when the button is clicked
	backToTopButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	});
});

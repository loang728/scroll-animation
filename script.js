document.addEventListener("DOMContentLoaded", () => {
	let numScrolled = 0;  //Index for the active image
	const images = document.querySelectorAll(".image-container img"); // Images array
	const targetElement = document.getElementById("imagewrapper"); // Intersecting element
	
	 new IntersectionObserver(
        (entries) => entries.forEach((entry) => intersecElement = entry.isIntersecting),
        { threshold: 0.2 } // Visible part of the element
    ).observe(targetElement);

	// Function for modifying scroll 
	const handleScroll = (delta) => {
		const rect = targetElement.getBoundingClientRect();

		if (intersecElement) { //Checking if element has reached or passed top of page  before starting animation
			if (delta < 0 && numScrolled > 0) { //Check Scrolling up and active image isnt the starting one, has to show previous image
				numScrolled--;
			} else if (delta > 0 && numScrolled < images.length - 1) { //Checks if scrolling down, and active image isnt last one 
				numScrolled++;
			} else {
				console.log("unmodified scroll"); //Animation is not active , keep scrolling
				return;
			}
 
			event.preventDefault(); // Prevents scroll from scrolling 
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			console.log("Modified scroll", numScrolled);
			images.forEach((img, idx) => img.classList.toggle("active", idx === numScrolled)); // Shows the desired image
			// Scroll the page to keep the target element 100px below the top
		}
	};

	// Add event listener for the wheel event (desktop)
	window.addEventListener("wheel", (event) => handleScroll(Math.sign(event.deltaY)), {
		passive: false
	});

	// Add touch event listeners (mobile)
	let touchStartY = 0;

	window.addEventListener("touchstart", (event) => touchStartY = event.touches[0].clientY);

	window.addEventListener("touchmove", (event) => {
		let touchEndY = event.touches[0].clientY;
		handleScroll(Math.sign(touchStartY - touchEndY));
		touchStartY = touchEndY; // Update touchStartY for continuous scrolling
	}, {
		passive: false
	});
});
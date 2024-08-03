document.addEventListener("DOMContentLoaded", () => {
    let lastScrollTop = 0;
    let intersecElement = false;
    let numScrolled = 0;
    const scrollStep = 5; // Number of pixels to scroll per step
    const images = document.querySelectorAll(".image-container img"); // Images array
    const targetElement = document.getElementById("imagesequence"); // Intersecting element

    // Intersection Observer to check if the target element is visible
    new IntersectionObserver(
        (entries) => entries.forEach((entry) => intersecElement = entry.isIntersecting),
        { threshold: 0.3 } // Visible part of the element
    ).observe(targetElement);

    // Function for modifying scroll when element is intersecting
    const handleScroll = (delta) => {
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let newScrollTop = currentScrollTop;

        if (intersecElement) {
            if (delta < 0 && numScrolled > 0) {
                numScrolled--;
                newScrollTop = Math.max(currentScrollTop - scrollStep, 0);
            } else if (delta > 0 && numScrolled < images.length - 1) {
                numScrolled++;
                newScrollTop = currentScrollTop + scrollStep;
            } else {
                console.log("unmodified scroll");
                return;
            }

            event.preventDefault();
            // Smoothly scroll to the new position
            window.scrollTo({ top: newScrollTop, behavior: "smooth" });

            // Update lastScrollTop
            lastScrollTop = newScrollTop;

            // Update the active image
            console.log("Modified scroll", numScrolled);
            images.forEach((img, idx) => img.classList.toggle("active", idx === numScrolled));
        }
    };

    // Add event listener for the wheel event (desktop)
    window.addEventListener("wheel", (event) => handleScroll(Math.sign(event.deltaY)), { passive: false });

    // Add touch event listeners (mobile)
    let touchStartY = 0;

    window.addEventListener("touchstart", (event) => touchStartY = event.touches[0].clientY);

    window.addEventListener("touchmove", (event) => {
        let touchEndY = event.touches[0].clientY;
        handleScroll(Math.sign(touchStartY - touchEndY));
        touchStartY = touchEndY; // Update touchStartY for continuous scrolling
    }, { passive: false });
});

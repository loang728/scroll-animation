document.addEventListener('DOMContentLoaded', () => {

    let scrollCount;
    let lastScrollTop = 0;
    let intersecElement = false;
    let numScrolled = 0;
    const scrollStep = 5; // Number of pixels to scroll per step
    const images = document.querySelectorAll('.image-container img'); // Images array
    const targetElement = document.getElementById('imagesequence');  // Intersecting element

    // Intersection Observer to check if the target element is visible
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            intersecElement = entry.isIntersecting;
        });
    }, {
        threshold: 0.3 // Adjust this value as needed
    });
    observer.observe(targetElement);

    // Function for modifying scroll when element is intersecting 
    function handleScroll(delta) {
        let modifyScroll = false;
        let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let newScrollTop;

        if (intersecElement) {
            // Prevents the default scroll behavior
            if (delta < 0 && numScrolled > 0) {
                modifyScroll = true;
                console.log('Scrolled up delta' + delta); // Indicates scrolling up (back)
                numScrolled = Math.max(numScrolled - 1, 0);
                newScrollTop = Math.max(currentScrollTop - scrollStep, 0);

            } else if (delta >= 0 && numScrolled < images.length - 1) {
                modifyScroll = true;
                console.log('Scrolled down delta' + delta); // Indicates scrolling down (forward)
                numScrolled = Math.min(numScrolled + 1, images.length - 1);
                newScrollTop = currentScrollTop + scrollStep;
            }

            if (modifyScroll) {
                // Smoothly scroll to the new position
                window.scrollTo({
                    top: newScrollTop,
                    behavior: 'smooth' // Optional: for smooth scrolling
                });

                // Update lastScrollTop
                lastScrollTop = newScrollTop;

                // Update the active image
                console.log('Modified scroll', numScrolled);
                images.forEach(img => img.classList.remove('active'));
                if (numScrolled >= 0 && numScrolled < images.length) {
                    images[numScrolled].classList.add('active');
                }
            }
        }
        console.log(numScrolled + " " + modifyScroll);
    }

    // Handle mouse wheel event
    function handleWheel(event) {
        let delta = Math.sign(event.deltaY); // Determine scroll direction (1 for down, -1 for up)
        handleScroll(delta);
        event.preventDefault();
    }

    // Handle touch events
    let touchStartY = null;
    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (touchStartY !== null) {
            let touchEndY = event.touches[0].clientY;
            let delta = touchStartY - touchEndY; // Determine scroll direction (positive for up, negative for down)
            handleScroll(delta);
            touchStartY = touchEndY; // Update the start position for the next move event
        }
    }

    // Add event listeners for the wheel and touch events
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
});

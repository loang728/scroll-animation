        document.addEventListener('DOMContentLoaded', () => {

            let scrollCount;
            let lastScrollTop = 0;
            let intersecElement = false;
            let numScrolled = 0;
            const scrollStep = 5; // Number of pixels to scroll per step
            const images = document.querySelectorAll('.image-container img'); //Images array
            const targetElement = document.getElementById('imagesequence');  //Intersecting element

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

                    } else if (delta >= 0 && numScrolled < 10) {
                        modifyScroll = true;
                        console.log('Scrolled down delta' + delta); // Indicates scrolling down (forward)
                        numScrolled = Math.min(numScrolled + 1, images.length - 1);
                        newScrollTop = currentScrollTop + scrollStep;
                    }
                }

                if (modifyScroll) {
                    event.preventDefault();
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
                } else {
                    console.log("unmodified scroll");
                }
                console.log(numScrolled + " " + modifyScroll);
            }

            // Add event listener for the wheel event (desktop)
            window.addEventListener('wheel', (event) => {
                handleScroll(Math.sign(event.deltaY));
            }, {
                passive: false
            });

            // Add touch event listeners (mobile)
            let touchStartY = 0;

            window.addEventListener('touchstart', (event) => {
                touchStartY = event.touches[0].clientY;
            });

            window.addEventListener('touchmove', (event) => {
                let touchEndY = event.touches[0].clientY;
                let delta = touchStartY - touchEndY;
                handleScroll(Math.sign(delta));
                touchStartY = touchEndY; // Update touchStartY for continuous scrolling
            }, {
                passive: false
            });
        });
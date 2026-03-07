// Parallax and scroll effects
        const heroImage = document.getElementById('heroImage');
        const heroContent = document.getElementById('heroContent');
        const ticker = document.getElementById('ticker');
        
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const progress = Math.min(scrollY / windowHeight, 1);
            
            // Image shrinks as you scroll (parallax effect)
            const scale = 1.1 - (progress * 0.2); // From 1.1 to 0.9
            heroImage.style.transform = `scale(${scale})`;
            
            // Content moves up and fades
            const translateY = -progress * 100;
            const opacity = 1 - progress;
            heroContent.style.transform = `translateY(${translateY}px)`;
            heroContent.style.opacity = opacity;
            
            // Ticker speeds up slightly when scrolling
            const animationDuration = 20 - (progress * 10);
            ticker.style.animationDuration = `${animationDuration}s`;
            
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // Smooth scroll for nav links
        // NEW CODE (allows external links to work):
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only prevent default for anchor links (same page navigation)
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // External links (like contact.html) will work normally
    });
});

        // Active nav state
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

                // Services Carousel - Left Aligned with Infinite Loop
        const carouselViewport = document.getElementById('carouselViewport');
        const carouselTrack = document.getElementById('carouselTrack');
        const originalSlides = Array.from(carouselTrack.children);
        const description = document.getElementById('serviceDescription');
        
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let autoPlayInterval;
        let currentIndex = 1; // Start with Sea Shipping (index 1)
        
        const slideWidth = 400 + 30; // slide width + gap
        const totalOriginalSlides = originalSlides.length;
        
        // Service descriptions data
        const serviceData = {
            air: {
                text: 'Reliable distribution within South Africa, ensuring <span class="highlight">efficient turnaround and consistent delivery performance.</span>',
                title: 'Local Transport'
            },
            sea: {
                text: 'High-capacity 34-ton payload vehicles <span class="highlight">built for dependable long-haul transport across provinces.</span>',
                title: 'Long Distance Haulage'
            },
            road: {
                text: 'Professional cross-border transport throughout the SADC region, <span class="highlight">handled by experienced operators.</span>',
                title: 'Cross-Border Freight'
            },
            rail: {
                text: 'Break bulk, containerized, hazardous, bonded and project cargo <span class="highlight">handled with strict compliance and safety protocols.</span>',
                title: 'Specialised Cargo'
            }
        };

        // Clone slides for infinite loop
        function initInfiniteCarousel() {
            // Clone last slide and prepend
            const lastClone = originalSlides[totalOriginalSlides - 1].cloneNode(true);
            lastClone.classList.add('clone');
            carouselTrack.insertBefore(lastClone, originalSlides[0]);
            
            // Clone first slide and append
            const firstClone = originalSlides[0].cloneNode(true);
            firstClone.classList.add('clone');
            carouselTrack.appendChild(firstClone);
            
            // Clone second slide and append
            const secondClone = originalSlides[1].cloneNode(true);
            secondClone.classList.add('clone');
            carouselTrack.appendChild(secondClone);
            
            updateSlideClasses();
            setPositionByIndex();
            startAutoPlay();
            
            setTimeout(() => {
                description.classList.add('visible');
            }, 500);
        }

        // Update active/prev/next classes
        function updateSlideClasses() {
            const slides = document.querySelectorAll('.service-slide');
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (index === currentIndex) {
                    slide.classList.add('active');
                } else if (index === currentIndex - 1) {
                    slide.classList.add('prev');
                } else if (index === currentIndex + 1) {
                    slide.classList.add('next');
                }
            });
            
            // Update description
            updateDescription();
        }

        // Update description text
        function updateDescription() {
            const activeSlide = document.querySelectorAll('.service-slide')[currentIndex];
            if (!activeSlide) return;
            
            const serviceKey = activeSlide.getAttribute('data-service');
            const data = serviceData[serviceKey];
            
            if (data) {
                description.classList.remove('visible');
                setTimeout(() => {
                    const descText = description.querySelector('.description-text');
                    descText.innerHTML = data.text;
                    description.classList.add('visible');
                }, 300);
            }
        }

        // Set position
        function setPositionByIndex() {
            currentTranslate = currentIndex * -slideWidth;
            prevTranslate = currentTranslate;
            carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
            updateSlideClasses();
        }

        // Auto play
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (!isDragging) {
                    moveRight();
                }
            }, 5000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Navigation functions
        function moveRight() {
            currentIndex++;
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setPositionByIndex();
            
            // Check for infinite loop reset
            setTimeout(() => {
                const slides = document.querySelectorAll('.service-slide');
                if (currentIndex >= slides.length - 2) {
                    carouselTrack.style.transition = 'none';
                    currentIndex = 1;
                    setPositionByIndex();
                }
            }, 500);
        }

        function moveLeft() {
            currentIndex--;
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setPositionByIndex();
            
            // Check for infinite loop reset
            setTimeout(() => {
                const slides = document.querySelectorAll('.service-slide');
                if (currentIndex <= 0) {
                    carouselTrack.style.transition = 'none';
                    currentIndex = slides.length - 3;
                    setPositionByIndex();
                }
            }, 500);
        }

        // Drag functionality
        carouselViewport.addEventListener('mousedown', dragStart);
        carouselViewport.addEventListener('touchstart', dragStart, {passive: true});

        carouselViewport.addEventListener('mouseup', dragEnd);
        carouselViewport.addEventListener('touchend', dragEnd);

        carouselViewport.addEventListener('mousemove', drag);
        carouselViewport.addEventListener('touchmove', drag, {passive: true});

        carouselViewport.addEventListener('mouseleave', () => {
            if (isDragging) dragEnd();
        });

        function dragStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            carouselViewport.classList.add('dragging');
            carouselTrack.style.transition = 'none';
            stopAutoPlay();
        }

        function drag(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                const diff = currentPosition - startPos;
                carouselTrack.style.transform = `translateX(${prevTranslate + diff}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            carouselViewport.classList.remove('dragging');
            
            const movedBy = currentTranslate - prevTranslate;
            const threshold = 100;
            
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            if (movedBy < -threshold) {
                moveRight();
            } else if (movedBy > threshold) {
                moveLeft();
            } else {
                setPositionByIndex();
            }
            
            startAutoPlay();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            if (isDragging) requestAnimationFrame(animation);
        }

        // Click on slide to select
        carouselTrack.addEventListener('click', (e) => {
            if (isDragging) return;
            
            const clickedSlide = e.target.closest('.service-slide');
            if (!clickedSlide) return;
            
            const slides = Array.from(document.querySelectorAll('.service-slide'));
            const clickedIndex = slides.indexOf(clickedSlide);
            
            if (clickedIndex !== -1 && clickedIndex !== currentIndex) {
                stopAutoPlay();
                if (clickedIndex > currentIndex) {
                    currentIndex = clickedIndex;
                    moveRight();
                } else {
                    currentIndex = clickedIndex;
                    moveLeft();
                }
                startAutoPlay();
            }
        });

        // Initialize
        initInfiniteCarousel();

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setPositionByIndex();
            }, 250);
        });

                // Process Section Animations
        const processSection = document.querySelector('.process-section');
        const steps = document.querySelectorAll('.step');
        const lineProgress = document.querySelector('.line-progress');
        
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate line
                    setTimeout(() => {
                        lineProgress.classList.add('animate');
                    }, 300);
                    
                    // Animate steps sequentially
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('visible');
                        }, 500 + (index * 400));
                    });
                    
                    processObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        if (processSection) {
            processObserver.observe(processSection);
        }

                // Logistics Services Section Animation
        const logisticsSection = document.querySelector('.logistics-services-section');
        const serviceItems = document.querySelectorAll('.service-item');
        
        const logisticsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    serviceItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150);
                    });
                    logisticsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        if (logisticsSection) {
            logisticsObserver.observe(logisticsSection);
        }

        // Track Section Animation
        const trackSection = document.querySelector('.track-section');
        const trackCard = document.querySelector('.track-card');
        
        const trackObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        trackCard.classList.add('visible');
                    }, 300);
                    trackObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        if (trackSection) {
            trackObserver.observe(trackSection);
        }

        // Track Form Handler
        const trackForm = document.getElementById('trackForm');
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trackingNumber = trackForm.querySelector('.track-input').value;
            if (trackingNumber) {
                // Simulate tracking action
                alert(`Tracking shipment: ${trackingNumber}\n\nIn a real application, this would fetch tracking data from the server.`);
            }
        });

                // Testimonials Slider
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentTestimonial = 0;
        const totalTestimonials = testimonialSlides.length;

        function updateTestimonialSlider() {
            testimonialSlides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                if (index === currentTestimonial) {
                    slide.classList.add('active');
                } else if (index < currentTestimonial) {
                    slide.classList.add('prev');
                } else {
                    slide.classList.add('next');
                }
            });

            // Update button states
            prevBtn.disabled = currentTestimonial === 0;
            nextBtn.disabled = currentTestimonial === totalTestimonials - 1;
            
            // Visual feedback for disabled state
            prevBtn.style.opacity = currentTestimonial === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentTestimonial === totalTestimonials - 1 ? '0.3' : '1';
        }

        function nextTestimonial() {
            if (currentTestimonial < totalTestimonials - 1) {
                currentTestimonial++;
                updateTestimonialSlider();
            }
        }

        function prevTestimonial() {
            if (currentTestimonial > 0) {
                currentTestimonial--;
                updateTestimonialSlider();
            }
        }

        // Event listeners
        nextBtn.addEventListener('click', nextTestimonial);
        prevBtn.addEventListener('click', prevTestimonial);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextTestimonial();
            if (e.key === 'ArrowLeft') prevTestimonial();
        });

        // Initialize
        updateTestimonialSlider();

        // Auto-play (optional - uncomment if you want auto-rotation)
        /*
        let autoPlayTestimonials = setInterval(() => {
            if (currentTestimonial < totalTestimonials - 1) {
                nextTestimonial();
            } else {
                currentTestimonial = 0;
                updateTestimonialSlider();
            }
        }, 6000);

        // Pause on hover
        const sliderContainer = document.querySelector('.testimonials-right');
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayTestimonials));
        sliderContainer.addEventListener('mouseleave', () => {
            autoPlayTestimonials = setInterval(() => {
                if (currentTestimonial < totalTestimonials - 1) {
                    nextTestimonial();
                } else {
                    currentTestimonial = 0;
                    updateTestimonialSlider();
                }
            }, 6000);
        });
        */

                // CTA & Footer Section Animation
        const ctaFooterSection = document.querySelector('.cta-footer-section');
        const ctaContent = document.querySelector('.cta-content');
        const footerMain = document.querySelector('.footer-main');
        
        const ctaFooterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate CTA
                    ctaContent.style.opacity = '0';
                    ctaContent.style.transform = 'translateX(30px)';
                    ctaContent.style.transition = 'all 0.8s ease';
                    
                    setTimeout(() => {
                        ctaContent.style.opacity = '1';
                        ctaContent.style.transform = 'translateX(0)';
                    }, 200);

                    // Animate Footer
                    footerMain.style.opacity = '0';
                    footerMain.style.transform = 'translateY(30px)';
                    footerMain.style.transition = 'all 0.8s ease 0.4s';
                    
                    setTimeout(() => {
                        footerMain.style.opacity = '1';
                        footerMain.style.transform = 'translateY(0)';
                    }, 600);
                    
                    ctaFooterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        if (ctaFooterSection) {
            ctaFooterObserver.observe(ctaFooterSection);
        }

        // Smooth scroll for footer links
        document.querySelectorAll('.footer-list a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // ============================================
// MOBILE HAMBURGER MENU
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Open menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }
    
    // Close menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Small delay to allow navigation to start
            setTimeout(closeMobileMenu, 100);
        });
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        hamburgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Update active state on scroll for mobile nav
    const sections = document.querySelectorAll('.section');
    
    function updateMobileActiveState() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < bottom) {
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateMobileActiveState);
});
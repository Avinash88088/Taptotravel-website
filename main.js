// ============================================
// TapToTravel - Main Application Script
// Consolidates: script.js, tilt.js, animations.js
// ============================================

// Fail-safe: Make everything visible if JS fails or takes too long
setTimeout(() => {
    document.body.classList.add('animations-loaded');
}, 3000);

document.addEventListener('DOMContentLoaded', () => {

    // 1. Check Dependencies
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded!');
        document.body.classList.add('animations-loaded');
        return;
    }

    console.log('TapToTravel: Initializing Premium Experience...');

    // 2. Register Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 3. Initialize Lenis Smooth Scroll (Optimized)
    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2, // Faster on mobile
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: !isMobile, // Disable smooth scroll on mobile for performance
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    if (!isMobile) {
        requestAnimationFrame(raf);
    }

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 4. Hero Section Animations (Entrance)
    const initHeroAnimations = () => {
        const tl = gsap.timeline();

        tl.from('.hero-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
            .from('.hero-subtitle', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-cta .btn', {
                y: 20,
                opacity: 0,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');

        // Parallax Effect for Hero 3D Container
        gsap.to('#global-3d-bg', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            },
            y: 200
            // scale: 0.85, // Removed to prevent "rectangle" artifact
            // opacity: 0.2 // Removed to prevent "rectangle" artifact
        });
    };

    initHeroAnimations();

    // 5. Scroll-Triggered Animations (General)
    const animateOnScroll = (elements, batch = false) => {
        if (!elements || elements.length === 0) return;

        const config = {
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            markers: false
        };

        if (batch) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: elements[0].closest('section') || elements[0].parentElement,
                    ...config
                },
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all' // Cleanup for better performance
            });
        } else {
            elements.forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        ...config
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            });
        }
    };

    // Apply standard scroll animations
    animateOnScroll(gsap.utils.toArray('.section-title'), false);
    animateOnScroll(gsap.utils.toArray('.step-card'), true);
    animateOnScroll(gsap.utils.toArray('.feature-card'), true);
    animateOnScroll(gsap.utils.toArray('.driver-feature-item'), true);
    animateOnScroll(gsap.utils.toArray('.spec-card'), true);
    animateOnScroll(gsap.utils.toArray('.arch-node'), true);
    animateOnScroll(gsap.utils.toArray('.safety-card'), true);
    animateOnScroll(gsap.utils.toArray('.partner-card'), true);
    animateOnScroll(gsap.utils.toArray('.faq-item'), true);

    // 6. Special Animations

    // Hardware Device Rotate & Fade
    const hardwareImg = document.querySelector('.hardware-device-img');
    if (hardwareImg) {
        gsap.from(hardwareImg, {
            scrollTrigger: {
                trigger: '.hardware-section',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.8,
            rotateY: 20,
            duration: 1.2,
            ease: 'power3.out'
        });
    }

    // Micro-Icon Pop
    gsap.utils.toArray('.step-icon, .feature-icon, .driver-icon, .spec-icon').forEach(icon => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.1,
            ease: 'back.out(1.7)'
        });
    });

    // 7. Interactive Effects

    // Magnetic Buttons (Premium Feel)
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });

        // Ripple Effect
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple'); // Ensure CSS has this class if needed, or inline styles
            // Inline styles for ripple as backup
            ripples.style.position = 'absolute';
            ripples.style.background = 'rgba(255,255,255,0.3)';
            ripples.style.borderRadius = '50%';
            ripples.style.transform = 'translate(-50%, -50%)';
            ripples.style.pointerEvents = 'none';
            ripples.style.animation = 'animateRipple 1s linear infinite';

            this.appendChild(ripples);
            setTimeout(() => ripples.remove(), 1000);
        });
    });

    // 3D Tilt Effect for Cards (Desktop only for performance)
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('.glass-premium, .glass-card, .step-card, .feature-card, .partner-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Subtle tilt
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, {
                    transformPerspective: 1000,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.02,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }

    // 8. UI Logic (Navbar, FAQ, Mobile Menu)

    // Navbar Hide/Show on Scroll
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                gsap.to(navbar, {
                    y: currentScroll > lastScroll ? -100 : 0,
                    duration: 0.3,
                    backgroundColor: currentScroll > 50 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'
                });
            } else {
                gsap.to(navbar, { y: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' });
            }
            lastScroll = currentScroll;
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !expanded);
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', false);
            });
        });
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', function () {
            const item = this.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('active');

            // Close others
            document.querySelectorAll('.faq-item.active').forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    const otherAnswer = i.querySelector('.faq-answer');
                    gsap.to(otherAnswer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            otherAnswer.style.display = 'none';
                        }
                    });
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.set(answer, { display: 'none' });
                    }
                });
            } else {
                item.classList.add('active');
                // Set initial state for animation
                gsap.set(answer, { display: 'block', height: 0, opacity: 0 });

                // Animate to auto height
                gsap.to(answer, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Year Update
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // 9. Navigation / Redirects
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Generic redirect helper
        const checkAndRedirect = (selector, type) => {
            const element = target.closest(selector);
            if (element) {
                // Don't redirect if clicking a button or link inside the card
                if (target.tagName === 'A' || target.tagName === 'BUTTON') return;

                console.log(`Navigating to details: ${type}`);
                window.location.href = `details.html?topic=${type}`;
            }
        };

        checkAndRedirect('.step-card', 'step-card');
        checkAndRedirect('.feature-card', 'feature-card');
        checkAndRedirect('.driver-feature-item', 'driver-feature-item');
        checkAndRedirect('.hardware-device-img', 'hardware-device-img');
        checkAndRedirect('.arch-node', 'arch-node');
        checkAndRedirect('.contact-item', 'contact-item');
    });


    // 10. Live Fare Estimator Logic
    const estimator = document.getElementById('fare-estimator-widget');
    const closeEstimator = document.getElementById('close-estimator');
    const distanceSlider = document.getElementById('distance-slider');
    const distanceValue = document.getElementById('distance-value');
    const fareValue = document.getElementById('fare-value');

    if (estimator && distanceSlider && !isMobile) {
        // Show widget after scrolling past hero
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'bottom center',
            onEnter: () => {
                gsap.to(estimator, { y: 0, opacity: 1, duration: 0.5 });
            },
            onLeaveBack: () => {
                gsap.to(estimator, { y: 200, opacity: 0, duration: 0.5 });
            }
        });

        closeEstimator.addEventListener('click', () => {
            gsap.to(estimator, { x: 400, opacity: 0, duration: 0.5 });
        });

        // Calculation Logic
        const calculateFare = (km) => {
            const baseFare = 25; // Base fare for first 2km
            const ratePerKm = 12; // Rate per km after

            if (km <= 2) return baseFare;
            return baseFare + ((km - 2) * ratePerKm);
        };

        distanceSlider.addEventListener('input', (e) => {
            const km = parseInt(e.target.value);
            distanceValue.textContent = `${km}km`;

            // Animate numbers
            const oldFare = parseInt(fareValue.textContent.replace('₹', ''));
            const newFare = calculateFare(km);

            const counter = { val: oldFare };
            gsap.to(counter, {
                val: newFare,
                duration: 0.3,
                onUpdate: () => {
                    fareValue.textContent = `₹${Math.round(counter.val)}`;
                }
            });
        });
    }

    // 11. Waitlist Modal Logic
    const waitlistModal = document.getElementById('waitlist-modal');
    const modalClose = waitlistModal ? waitlistModal.querySelector('.modal-close') : null;
    const downloadButtons = document.querySelectorAll('a[href="#"], .btn-primary:not([type="submit"])'); // Target "Download App" buttons

    if (waitlistModal) {
        const openModal = (e) => {
            e.preventDefault();
            waitlistModal.classList.add('active');
            gsap.fromTo(waitlistModal.querySelector('.modal-content'),
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        };

        const closeModal = () => {
            waitlistModal.classList.remove('active');
        };

        // Attach to all "Download App" type buttons
        downloadButtons.forEach(btn => {
            if (btn.textContent.includes('Download App')) {
                btn.addEventListener('click', openModal);
            }
        });

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        // Close on click outside
        waitlistModal.addEventListener('click', (e) => {
            if (e.target === waitlistModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && waitlistModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 12. Content Protection (Anti-Copy)
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Optional: Show a toast or alert
        // alert('Content is protected.');
    });

    // Disable copy/cut/paste
    document.addEventListener('copy', (e) => {
        e.preventDefault();
    });
    document.addEventListener('cut', (e) => {
        e.preventDefault();
    });
    document.addEventListener('paste', (e) => {
        e.preventDefault();
    });

    // Disable specific keyboard shortcuts (Cmd+C, Cmd+U, etc.)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p')) {
            e.preventDefault();
        }
    });

});

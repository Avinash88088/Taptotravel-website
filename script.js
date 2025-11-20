// Fail-safe: Make everything visible if JS fails
setTimeout(() => {
  document.body.classList.add('animations-loaded');
}, 3000);

window.addEventListener('load', () => {

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.body.classList.add('animations-loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Refresh ScrollTrigger to ensure correct calculations
  ScrollTrigger.refresh();

  // ============================================
  // Hero Section - Immediate Animations
  // ============================================
  const heroTl = gsap.timeline();
  heroTl.from('.hero-title', { opacity: 0, y: 100, duration: 1.2, ease: 'power3.out' })
    .from('.hero-subtitle', { opacity: 0, y: 60, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero-cta .btn', { opacity: 0, y: 40, stagger: 0.15, duration: 0.8, ease: 'power3.out' }, '-=0.6').from('.feature-badge', { opacity: 0, y: 30, scale: 0.9, stagger: 0.1, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.4');

  // Hero Image Floating Animation
  gsap.to('#hero-img-animate', {
    y: -20,
    duration: 2,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: -1
  });

  // ============================================
  // Parallax Effect
  // ============================================
  gsap.to('#hero-3d', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    },
    y: 200,
    scale: 0.85,
    opacity: 0.2
  });

  // ============================================
  // Scroll-Triggered Animations Configuration
  // ============================================
  const animateOnScroll = (elements, batch = false) => {
    if (!elements || elements.length === 0) return;

    const config = {
      start: 'top 85%',
      toggleActions: 'play none none none',
      markers: false // Set to true for debugging
    };

    if (batch) {
      gsap.from(elements, {
        scrollTrigger: {
          trigger: elements[0].closest('section') || elements[0].parentElement,
          ...config
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all' // Clear props after animation to prevent issues
      });
    } else {
      elements.forEach(el => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            ...config
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all'
        });
      });
    }
  };

  // Apply animations
  animateOnScroll(gsap.utils.toArray('.section-title'), false);
  animateOnScroll(gsap.utils.toArray('.step-card'), true);
  animateOnScroll(gsap.utils.toArray('.feature-card'), true);
  animateOnScroll(gsap.utils.toArray('.driver-feature-item'), true);
  animateOnScroll(gsap.utils.toArray('.spec-card'), true);
  animateOnScroll(gsap.utils.toArray('.arch-node'), true);
  animateOnScroll(gsap.utils.toArray('.safety-card'), true);
  animateOnScroll(gsap.utils.toArray('.partner-card'), true);
  animateOnScroll(gsap.utils.toArray('.faq-item'), true);

  // Hardware Device Special Animation
  const hardwareImg = document.querySelector('.hardware-device-img');
  if (hardwareImg) {
    gsap.from(hardwareImg, {
      scrollTrigger: {
        trigger: '.hardware-section',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.8,
      rotateY: 20,
      duration: 1.2,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }

  // ============================================
  // Interactive Features
  // ============================================

  // Card Hover
  document.querySelectorAll('.feature-card, .step-card, .safety-card, .partner-card, .spec-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -8, scale: 1.02, duration: 0.3 }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.3 }));
  });

  // Navbar Hide/Show
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (navbar && currentScroll > 100) {
      gsap.to(navbar, { y: currentScroll > lastScroll ? -100 : 0, duration: 0.3 });
    }
    lastScroll = currentScroll;
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function () {
      const item = this.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          gsap.to(i.querySelector('.faq-answer'), { height: 0, opacity: 0, duration: 0.3 });
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        gsap.to(answer, { height: 0, opacity: 0, duration: 0.3 });
      } else {
        item.classList.add('active');
        gsap.set(answer, { height: 'auto' });
        gsap.from(answer, { height: 0, opacity: 0, duration: 0.3 });
      }
    });
  });

  // Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      if (navMenu.classList.contains('active')) {
        gsap.fromTo(navMenu, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3 });
      }
    });
  }

  // Year Update
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ============================================
  // Navigation to Details Page
  // ============================================

  // Event Delegation for Cards
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Helper to check and redirect
    const checkAndRedirect = (selector, type) => {
      const element = target.closest(selector);
      if (element) {
        console.log(`Clicked on ${selector}, redirecting to: ${type}`);
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

  // Add cursor pointer to all interactive elements
  const addPointers = () => {
    const selectors = [
      '.step-card',
      '.feature-card',
      '.driver-feature-item',
      '.hardware-device-img',
      '.arch-node',
      '.contact-item'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.cursor = 'pointer';
      });
    });
  };

  addPointers();

  // Re-add pointers periodically in case of DOM changes
  setInterval(addPointers, 2000);

});

// Wait for both DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP or ScrollTrigger not loaded!');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Refresh ScrollTrigger after page load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // Hero Animation (Entrance)
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
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-features', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-main-img', {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1.0');

  // 3D Float Effect for Hero Image
  gsap.to('.hero-main-img', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Scroll Animations for Section Titles
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false // Set to true for debugging
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Staggered Animations for Cards
  const staggerCards = (selector, trigger) => {
    const elements = gsap.utils.toArray(selector);
    if (elements.length === 0) return;

    gsap.from(elements, {
      scrollTrigger: {
        trigger: trigger || elements[0].closest('section') || elements[0],
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false // Set to true for debugging
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });
  };

  staggerCards('.step-card', '.steps-container');
  staggerCards('.feature-card', '.features-grid');
  staggerCards('.partner-card', '.partners-grid');
  staggerCards('.spec-card', '.hardware-specs');
  staggerCards('.safety-card', '.safety-grid');
  staggerCards('.driver-feature-item', '.driver-features');

  // Magnetic Buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
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
  });

  // Connecting Line Animation for "How it Works"
  // Note: This assumes we add an SVG line or similar. For now, we animate the arrows.
  gsap.utils.toArray('.step-arrow').forEach(arrow => {
    gsap.from(arrow, {
      scrollTrigger: {
        trigger: arrow,
        start: 'top 80%',
        end: 'top 50%',
        scrub: true
      },
      scale: 0,
      opacity: 0,
      rotation: -45
    });
  });

  // Parallax Effect for Cards
  gsap.utils.toArray('.step-card, .feature-card, .spec-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -30, // Move up slightly faster than scroll
      ease: 'none'
    });
  });

  // Micro-Icon Animations
  const animateIcons = (selector) => {
    gsap.utils.toArray(selector).forEach(icon => {
      gsap.from(icon, {
        scrollTrigger: {
          trigger: icon,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'back.out(1.7)'
      });
    });
  };

  animateIcons('.step-icon');
  animateIcons('.feature-icon');
  animateIcons('.driver-icon');
  animateIcons('.spec-icon');

  // Parallax Effect for Hero Image (if not using 3D)
  // We are using 3D, but let's add parallax to the background elements
  gsap.to('.hero-glow-effect', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 200,
    opacity: 0
  });

  console.log('Premium animations initialized!');
});

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

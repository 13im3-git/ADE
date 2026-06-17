/* ============================================
   GSAP INIT - SCROLL & ENTRANCE ANIMATIONS
   Also initializes AOS library
   ============================================ */

(function initAnimations() {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'power3.out',
      once: false,
      mirror: true,
      offset: 120,
    });
  }

  // Initialize GSAP if available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* -----------------------------------------
     HERO
     ----------------------------------------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge',   { y: 40, opacity: 0, duration: 0.9 }, 0.1)
    .from('.hero-title .line-1', { y: 60, opacity: 0, duration: 1 }, 0.25)
    .from('.hero-title .line-2', { y: 60, opacity: 0, duration: 1 }, 0.4)
    .from('.hero-title .line-3', { y: 60, opacity: 0, duration: 1 }, 0.55)
    .from('.hero-description', { y: 30, opacity: 0, duration: 0.9 }, 0.75)
    .from('.hero-actions',  { y: 30, opacity: 0, duration: 0.9 }, 0.9)
    .from('.hero-stat',    { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.05)
    .from('.hero-floating-badge', { scale: 0.7, opacity: 0, duration: 0.8, stagger: 0.15 }, 1.2);

  gsap.to('.hero-product-showcase', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  });

  /* -----------------------------------------
     SECTION HEADERS
     ----------------------------------------- */
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  /* -----------------------------------------
     PRODUCT GRID STAGGER
     ----------------------------------------- */
  const gridSelectors = [
    '#featured-products .product-card',
    '#best-sellers .product-card',
    '#shop-products .product-card',
  ];

  gridSelectors.forEach(selector => {
    const cards = document.querySelectorAll(selector);
    if (!cards.length) return;
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.85,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards[0].closest('.products-grid') || cards[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  /* -----------------------------------------
     STAT CARDS (admin)
     ----------------------------------------- */
  document.querySelectorAll('.stat-card').forEach((card, i) => {
    gsap.from(card, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: card,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  /* -----------------------------------------
     VALUE / FEATURE CARDS
     ----------------------------------------- */
  document.querySelectorAll('.value-card, .feature-card').forEach((card, i) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  /* -----------------------------------------
     FLOATING BADGES LOOP
     ----------------------------------------- */
  document.querySelectorAll('.hero-floating-badge').forEach((badge, i) => {
    gsap.to(badge, {
      y: -18,
      duration: 2.4 + i * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  /* -----------------------------------------
     PARALLAX SECTIONS
     ----------------------------------------- */
  gsap.utils.toArray('.hero-bg-glow, .hero-bg-glow-2').forEach(glow => {
    gsap.to(glow, {
      y: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
})();

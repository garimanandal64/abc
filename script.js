/* ============================================================
   Forever Luxury Hotel — script.js
   Interactivity: Loader · Navbar · Parallax · Reveal · Slider
                  Lightbox · Form Validation · Smooth Scrolling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------
     1. PAGE LOADER
     -------------------------------------------------------- */
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  });

  /* --------------------------------------------------------
     2. NAVBAR – Transparent → Solid on scroll
     -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll(); // Run once on load

  /* --------------------------------------------------------
     3. MOBILE NAV TOGGLE
     -------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* --------------------------------------------------------
     4. SMOOTH SCROLL for anchor links
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------
     5. HERO PARALLAX EFFECT
     -------------------------------------------------------- */
  const heroBg = document.getElementById('heroBg');

  const handleParallax = () => {
    if (heroBg && window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.4;
      heroBg.style.transform = `translateY(${offset}px) scale(1.05)`;
    }
  };

  window.addEventListener('scroll', handleParallax);

  /* --------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS
     -------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------
     7. TESTIMONIAL SLIDER
     -------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  const goToSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => goToSlide(currentSlide + 1);

  const startAutoSlide = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => clearInterval(slideInterval);

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide(Number(dot.dataset.slide));
      startAutoSlide();
    });
  });

  startAutoSlide();

  /* --------------------------------------------------------
     8. GALLERY LIGHTBOX
     -------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  let lightboxIndex   = 0;

  // Collect all gallery image sources
  const gallerySrcs = Array.from(galleryItems).map(item =>
    item.querySelector('img').src
  );

  const openLightbox = (index) => {
    lightboxIndex = index;
    lightboxImg.src = gallerySrcs[lightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(Number(item.dataset.index));
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[lightboxIndex];
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex + 1) % gallerySrcs.length;
    lightboxImg.src = gallerySrcs[lightboxIndex];
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  /* --------------------------------------------------------
     9. BOOKING FORM VALIDATION
     -------------------------------------------------------- */
  const form = document.getElementById('bookingForm');

  const validateField = (field) => {
    const group = field.closest('.form-group');
    let valid = true;

    if (field.required && !field.value.trim()) {
      valid = false;
    }

    // Email check
    if (field.type === 'email' && field.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value.trim())) valid = false;
    }

    if (valid) {
      group.classList.remove('invalid');
    } else {
      group.classList.add('invalid');
    }

    return valid;
  };

  // Live validation on blur
  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('input, select');
    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    // Date logic: check-out must be after check-in
    const checkIn  = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) {
      checkOut.closest('.form-group').classList.add('invalid');
      checkOut.closest('.form-group').querySelector('.error-msg').textContent =
        'Check-out must be after check-in';
      allValid = false;
    }

    if (allValid) {
      // Success feedback
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Reservation Confirmed!';
      btn.style.background = 'linear-gradient(135deg, #1a6b4a, #2a8c62)';
      btn.style.color = '#fff';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
      }, 3000);
    }
  });

  /* --------------------------------------------------------
     10. ACTIVE NAV LINK HIGHLIGHTING
     -------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  /* --------------------------------------------------------
     11. SET MINIMUM DATES FOR BOOKING
     -------------------------------------------------------- */
  const today = new Date().toISOString().split('T')[0];
  const checkInEl = document.getElementById('checkIn');
  const checkOutEl = document.getElementById('checkOut');

  if (checkInEl)  checkInEl.setAttribute('min', today);
  if (checkOutEl) checkOutEl.setAttribute('min', today);

  checkInEl.addEventListener('change', () => {
    checkOutEl.setAttribute('min', checkInEl.value);
    if (checkOutEl.value && checkOutEl.value <= checkInEl.value) {
      checkOutEl.value = '';
    }
  });
});

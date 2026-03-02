/* ================================================
   FRAGRANCE — Premium Flower Shop
   script.js — All Interactivity & Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== PAGE LOADER =====
    const loader = document.getElementById('page-loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 2000);
    });

    // Fallback: remove loader after 3s even if images haven't loaded
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 3500);

    // ===== FLOATING PETALS ANIMATION =====
    const petalsContainer = document.getElementById('petals-container');
    const petalEmojis = ['🌸', '🌺', '🌷', '💮', '🏵️', '✿', '❀'];

    function createPetal() {
        const petal = document.createElement('span');
        petal.classList.add('petal');
        petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + '%';
        petal.style.fontSize = (0.8 + Math.random() * 1.0) + 'rem';
        petal.style.animationDuration = (8 + Math.random() * 12) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.opacity = 0.2 + Math.random() * 0.4;
        petalsContainer.appendChild(petal);

        // Remove petal after animation
        const duration = parseFloat(petal.style.animationDuration) + parseFloat(petal.style.animationDelay);
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }

    // Create initial petals
    for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 600);
    }

    // Continue creating petals
    setInterval(createPetal, 3000);

    // ===== STICKY NAVBAR =====
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    function handleScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger animation for grid items
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + (target >= 100 && target < 1000 ? '' : target >= 1000 ? '+' : '%');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // ===== LIGHTBOX GALLERY =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    const galleryImages = [];

    galleryItems.forEach((item, index) => {
        const fullSrc = item.getAttribute('data-full');
        galleryImages.push(fullSrc);

        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(fullSrc);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 200);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ===== TESTIMONIAL SLIDER =====
    const testimonialTrack = document.getElementById('testimonial-track');
    const testimonialDots = document.getElementById('testimonial-dots');
    const testimonialCards = testimonialTrack.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        testimonialDots.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;

        // Update dots
        document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % testimonialCards.length);
    }

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
    testimonialSlider.addEventListener('mouseleave', startAutoSlide);

    // Touch swipe for testimonials
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    testimonialSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide((currentSlide + 1) % testimonialCards.length);
            } else {
                goToSlide((currentSlide - 1 + testimonialCards.length) % testimonialCards.length);
            }
        }
        startAutoSlide();
    }, { passive: true });

    // ===== ADD TO CART =====
    const cartButtons = document.querySelectorAll('.btn-cart');
    const cartNotification = document.getElementById('cart-notification');
    const cartMessage = document.getElementById('cart-message');

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');

            cartMessage.textContent = `${name} ($${price}) added to cart!`;
            cartNotification.classList.add('show');

            // Button animation
            button.textContent = '✓ Added';
            button.style.background = 'var(--sage)';
            button.style.color = 'var(--white)';
            button.style.borderColor = 'var(--sage)';

            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.background = '';
                button.style.color = '';
                button.style.borderColor = '';
            }, 2000);

            setTimeout(() => {
                cartNotification.classList.remove('show');
            }, 3000);
        });
    });

    // ===== FORM VALIDATION =====
    const orderForm = document.getElementById('order-form');
    const formSuccess = document.getElementById('form-success');

    // Set minimum date to today
    const deliveryDateInput = document.getElementById('delivery-date');
    const today = new Date().toISOString().split('T')[0];
    deliveryDateInput.setAttribute('min', today);

    function validateField(field, errorId, message) {
        const errorEl = document.getElementById(errorId);
        if (!field.value.trim()) {
            field.classList.add('error');
            errorEl.textContent = message;
            return false;
        }
        field.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }

    function validateEmail(field, errorId) {
        const errorEl = document.getElementById(errorId);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
            field.classList.add('error');
            errorEl.textContent = 'Email is required';
            return false;
        }
        if (!emailRegex.test(field.value)) {
            field.classList.add('error');
            errorEl.textContent = 'Please enter a valid email';
            return false;
        }
        field.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }

    function validatePhone(field, errorId) {
        const errorEl = document.getElementById(errorId);
        const phoneRegex = /^[\d\s\-\(\)\+]{7,15}$/;
        if (!field.value.trim()) {
            field.classList.add('error');
            errorEl.textContent = 'Phone number is required';
            return false;
        }
        if (!phoneRegex.test(field.value)) {
            field.classList.add('error');
            errorEl.textContent = 'Please enter a valid phone number';
            return false;
        }
        field.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }

    // Real-time validation on blur
    document.getElementById('name').addEventListener('blur', function () {
        validateField(this, 'name-error', 'Name is required');
    });
    document.getElementById('email').addEventListener('blur', function () {
        validateEmail(this, 'email-error');
    });
    document.getElementById('phone').addEventListener('blur', function () {
        validatePhone(this, 'phone-error');
    });
    deliveryDateInput.addEventListener('blur', function () {
        validateField(this, 'date-error', 'Delivery date is required');
    });

    // Clear error on input
    orderForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorEl = field.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // Form submission
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const dateField = document.getElementById('delivery-date');

        const isNameValid = validateField(nameField, 'name-error', 'Name is required');
        const isEmailValid = validateEmail(emailField, 'email-error');
        const isPhoneValid = validatePhone(phoneField, 'phone-error');
        const isDateValid = validateField(dateField, 'date-error', 'Delivery date is required');

        if (isNameValid && isEmailValid && isPhoneValid && isDateValid) {
            formSuccess.classList.add('show');
            orderForm.reset();

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 6000);
        }
    });

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('button');

        if (input.value.trim()) {
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'var(--sage)';
            input.value = '';

            setTimeout(() => {
                btn.textContent = 'Subscribe';
                btn.style.background = '';
            }, 3000);
        }
    });

    // ===== INITIAL CHECK: Run scroll-dependent functions on load =====
    handleScroll();
    updateActiveLink();
});

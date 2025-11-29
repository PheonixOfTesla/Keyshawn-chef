/* ============================================
   IGNITEFIRE CO - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavigation();
    initScrollReveal();
    initTestimonialSlider();
    initSmoothScroll();
    initParallax();
});

/* ============================================
   LOADER
   ============================================ */
function initLoader() {
    const loader = document.getElementById('loader');

    // Add loading class to body
    document.body.classList.add('loading');

    // Hide loader after page load
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, 800);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll behavior for nav background
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('plates-grid') ||
                               parent.classList.contains('services-grid'))) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (index * 0.1) + 's';
                }

                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });
}

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentIndex = 0;
    let interval;

    function showTestimonial(index) {
        cards.forEach(function(card, i) {
            card.classList.remove('active');
            dots[i].classList.remove('active');
        });

        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextTestimonial() {
        let next = currentIndex + 1;
        if (next >= cards.length) {
            next = 0;
        }
        showTestimonial(next);
    }

    function startAutoplay() {
        interval = setInterval(nextTestimonial, 5000);
    }

    function stopAutoplay() {
        clearInterval(interval);
    }

    // Dot click handlers
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            stopAutoplay();
            showTestimonial(index);
            startAutoplay();
        });
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
    }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.getElementById('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallax() {
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        if (scrolled < heroHeight) {
            // Parallax for hero content
            if (heroContent) {
                const opacity = 1 - (scrolled / heroHeight) * 1.5;
                const translateY = scrolled * 0.4;
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = `translateY(${translateY}px)`;
            }
        }
    });
}

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
})();

/* ============================================
   PLATE CARD HOVER EFFECT (3D Tilt)
   ============================================ */
(function() {
    const cards = document.querySelectorAll('.plate-card');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

/* ============================================
   GOLDEN CURSOR GLOW (Optional)
   ============================================ */
(function() {
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    let isVisible = false;

    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';

        if (!isVisible) {
            cursorGlow.style.opacity = '1';
            isVisible = true;
        }
    });

    document.addEventListener('mouseleave', function() {
        cursorGlow.style.opacity = '0';
        isVisible = false;
    });
})();

/* ============================================
   VIDEO LAZY LOADING
   ============================================ */
(function() {
    const videos = document.querySelectorAll('video');

    videos.forEach(function(video) {
        // Ensure videos play on mobile
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.muted = true;

        // Play when in viewport
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    video.play().catch(function() {
                        // Autoplay might be blocked, that's ok
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(video);
    });
})();

/* ============================================
   FORM VALIDATION (for future Calendly alternative)
   ============================================ */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

/* ============================================
   CONSOLE BRANDING
   ============================================ */
console.log('%c IGNITEFIRE CO ', 'background: linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%); color: #0a0a0a; font-size: 24px; font-weight: bold; padding: 20px 40px;');
console.log('%c Private Culinary Experiences ', 'color: #d4af37; font-size: 14px; font-style: italic;');

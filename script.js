// ===================================
// PORTFOLIO - LAHCEN LAMKIRICH
// Interactive JavaScript Features
// ===================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', function () {
    // Theme Toggle
    initThemeToggle();

    // Mobile Menu Toggle
    initMobileMenu();

    // Smooth Scroll Navigation
    initSmoothScroll();

    // Navbar state & scroll progress
    initScrollEffects();

    // Scroll Animations
    initScrollAnimations();

    // Active Navigation Link
    initActiveNavigation();

    // Typewriter role
    initTypewriter();

    // Animated counters
    initCounters();

    // Card spotlight, cursor glow & code card tilt
    initPointerEffects();

    // Copy email button
    initCopyButtons();

    // Scroll to top button
    initScrollToTop();

    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();
});

// ===================================
// THEME TOGGLE
// ===================================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function syncIcon() {
        const icon = toggle.querySelector('i');
        const isDark = root.getAttribute('data-theme') !== 'light';
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggle.addEventListener('click', function () {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) { }
        syncIcon();
    });

    syncIcon();
}

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!mobileMenuToggle || !navLinks) return;

    function setOpen(open) {
        navLinks.classList.toggle('active', open);
        const icon = mobileMenuToggle.querySelector('i');
        icon.className = open ? 'fas fa-times' : 'fas fa-bars';
    }

    mobileMenuToggle.addEventListener('click', function () {
        setOpen(!navLinks.classList.contains('active'));
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
}

// ===================================
// NAVBAR STATE & SCROLL PROGRESS
// ===================================
function initScrollEffects() {
    const nav = document.getElementById('navbar');
    const progress = document.getElementById('scrollProgress');

    function update() {
        const scrollTop = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? scrollTop / max : 0})`;
        nav.classList.toggle('scrolled', scrollTop > 30);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    // Stagger siblings inside the same grid
    elements.forEach(el => {
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const index = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.min(index, 5) * 0.08}s`;
        observer.observe(el);
    });
}

// ===================================
// ACTIVE NAVIGATION
// ===================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.35;
        let currentId = sections[0].id;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // Call once on load
}

// ===================================
// TYPEWRITER
// ===================================
function initTypewriter() {
    const el = document.getElementById('typedRole');
    if (!el || prefersReducedMotion) return;

    const roles = [
        'Salesforce Developer',
        'Salesforce Consultant',
        'Apex & LWC Engineer',
        'Integration Specialist',
        'Platform Developer II'
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function tick() {
        const current = roles[roleIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        el.textContent = current.slice(0, charIndex);

        let delay = deleting ? 40 : 80;

        if (!deleting && charIndex === current.length) {
            deleting = true;
            delay = 2200;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 400;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 2500);
}

// ===================================
// ANIMATED COUNTERS
// ===================================
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    function animate(el) {
        const target = parseInt(el.dataset.count, 10);
        if (prefersReducedMotion) {
            el.textContent = target;
            return;
        }
        const duration = 1400;
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
        counters.forEach(animate);
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

// ===================================
// POINTER EFFECTS
// ===================================
function initPointerEffects() {
    if (!hasFinePointer) return;

    // Spotlight follows the cursor inside each card
    document.querySelectorAll('.spotlight').forEach(card => {
        card.addEventListener('pointermove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });

    if (prefersReducedMotion) return;

    // Soft glow that follows the cursor
    const glow = document.getElementById('cursorGlow');
    document.body.classList.add('has-pointer');
    window.addEventListener('pointermove', e => {
        glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    }, { passive: true });

    // 3D tilt on the hero code card
    const tilt = document.querySelector('.tilt');
    if (tilt) {
        const wrapper = tilt.parentElement;
        wrapper.addEventListener('pointermove', e => {
            const rect = wrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            tilt.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
        });
        wrapper.addEventListener('pointerleave', () => {
            tilt.style.transform = '';
        });
    }
}

// ===================================
// COPY TO CLIPBOARD
// ===================================
function initCopyButtons() {
    const toast = document.getElementById('toast');
    let hideTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(btn.dataset.copy);
                showToast('Email copied to clipboard ✓');
            } catch (e) {
                showToast(btn.dataset.copy);
            }
        });
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function () {
        scrollBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

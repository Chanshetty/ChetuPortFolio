/**
 * Portfolio Main JavaScript
 * Author: Laxman Chanshetty
 * Description: Handles all interactive features of the portfolio
 */

'use strict';

/* ─── DOM Ready ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initScrollAnimations();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initActiveNavLink();
});

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll effect: add .scrolled class when page is scrolled
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Mobile hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════════════════════════════════════════ */
function initTypingEffect() {
  const typedEl = document.getElementById('typedText');
  if (!typedEl) return;

  const words = [
    'Full Stack Developer',
    'Angular Developer',
    'Node.js Engineer',
    'Spring Boot Developer',
    'Problem Solver',
  ];

  let wordIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Remove a character
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      // Add a character
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Word fully typed — pause then start deleting
    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    }

    // Word fully deleted — move to next word
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing after a short delay
  setTimeout(type, 800);
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (Custom AOS-like)
═══════════════════════════════════════════════════════════════════════════ */
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('[data-aos]');

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          // Unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  animatedEls.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL PROGRESS BARS
═══════════════════════════════════════════════════════════════════════════ */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar       = entry.target;
          const targetWidth = bar.dataset.width || '0';
          // Animate the bar width
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => observer.observe(bar));
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════════════════════════════════ */
function initActiveNavLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
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
    },
    {
      threshold: 0.4,
      rootMargin: '-80px 0px -40% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar').offsetHeight;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
═══════════════════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const statusEl   = document.getElementById('formStatus');
  const submitBtn  = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showStatus('error', '⚠️ Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('error', '⚠️ Please enter a valid email address.');
      return;
    }

    // Simulate form submission (replace with real API call)
    setLoading(true);

    try {
      // Simulate network delay
      await delay(1500);

      // SUCCESS — In production, replace with actual fetch/axios call:
      // const res = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, subject, message }),
      // });

      showStatus('success', '✅ Message sent! I\'ll get back to you soon.');
      form.reset();
    } catch (err) {
      showStatus('error', '❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  });

  /** Show status message */
  function showStatus(type, message) {
    statusEl.textContent = message;
    statusEl.className   = `form-status ${type}`;
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }, 5000);
  }

  /** Toggle loading state on submit button */
  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════════════════════════════════════ */

/** Validate email format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Promise-based delay */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Debounce function */
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/* ─── Console Easter Egg ─────────────────────────────────────────────────── */
console.log(
  '%c👋 Hey there, fellow developer!',
  'color: #0f62fe; font-size: 18px; font-weight: bold;'
);
console.log(
  '%cLooking at the source? I like your style! 🚀\nFeel free to connect: laxman.dev@email.com',
  'color: #78a9ff; font-size: 13px;'
);

// Made with Bob

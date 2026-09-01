// ===== Sisili Credit — main.js =====

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Mobile nav toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  // FAQ items are <details> so they collapse on mobile. Above the mobile
  // breakpoint they should read as ordinary cards, so force them open —
  // `open` is an attribute, not something CSS can set.
  // Footer link columns collapse the same way.
  const collapsibles = document.querySelectorAll('.faq-item, .footer-group');
  if (collapsibles.length) {
    const desktop = window.matchMedia('(min-width: 721px)');
    const sync = () => {
      collapsibles.forEach((item) => {
        if (desktop.matches) item.setAttribute('open', '');
        else item.removeAttribute('open');
      });
    };
    sync();
    desktop.addEventListener('change', sync);
  }

  // "I am" chip selector on the contact page
  const chipGroup = document.querySelector('[data-chip-group]');
  if (chipGroup) {
    chipGroup.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipGroup.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
      });
    });
  }

  // Contact form (front-end only placeholder — not yet wired to a backend)
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      if (formStatus) {
        formStatus.textContent = 'Thank you — this form is not yet connected to a backend, so your message was not actually sent. Please reach us on WhatsApp or by phone in the meantime.';
      }
      contactForm.reset();
      if (chipGroup) {
        chipGroup.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('is-selected', i === 0));
      }
    });
  }
});

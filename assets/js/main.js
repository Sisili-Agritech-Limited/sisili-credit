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

  // "I am" chip selector on the contact page — mirrors the selection into a
  // hidden input so it's actually included in the form submission.
  const chipGroup = document.querySelector('[data-chip-group]');
  const iamValue = document.querySelector('[data-iam-value]');
  if (chipGroup) {
    chipGroup.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipGroup.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        if (iamValue) iamValue.value = chip.textContent.trim();
      });
    });
  }

  // Contact form — submits to Formspree (see the form's `action` in
  // contact.html; swap in the real form ID before launch). Falls back to a
  // WhatsApp/phone prompt if the request fails, so a submission never just
  // silently vanishes.
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const resetChips = () => {
        if (chipGroup) {
          chipGroup.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('is-selected', i === 0));
        }
        if (iamValue) iamValue.value = 'A farmer';
      };
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Form submission failed');
          if (formStatus) {
            formStatus.textContent = 'Thank you — your message has been sent. We reply within one working day.';
          }
          contactForm.reset();
          resetChips();
        })
        .catch(() => {
          if (formStatus) {
            formStatus.textContent = 'Sorry — that message could not be sent. Please reach us on WhatsApp or by phone instead; nothing here was lost, just not delivered.';
          }
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          }
        });
    });
  }
});

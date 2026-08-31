/**
 * ==========================================================================
 * COMPONENT: NAVIGATION CONTROLLER
 * Handles scroll-spy, header transitions, and accessible mobile drawer.
 * ==========================================================================
 */

import { $, $$, throttleRAF } from '../utils/helpers.js';

export function initNavigation() {
  const header = $('.site-header');
  const navToggle = $('#nav-toggle');
  const mobileOverlay = $('#mobile-nav-overlay');
  const navLinks = $$('.nav-link, .mobile-nav-link');
  const sections = $$('section[id]');

  if (!header) return;

  // 1. Header scroll blur & padding shrink
  const onScroll = throttleRAF(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // 2. Scroll-spy active section detection
    let currentSectionId = '';
    const scrollTrigger = scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollTrigger >= top && scrollTrigger < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'page');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  // 3. Mobile Navigation Drawer Toggle
  if (navToggle && mobileOverlay) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mobileOverlay.classList.contains('is-open');
      mobileOverlay.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Swap toggle icon between hamburger and close
      const icon = navToggle.querySelector('use, svg');
      if (isOpen) {
        navToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      } else {
        navToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`;
      }
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close on link click
    $$('.mobile-nav-link, .btn-nav-contact').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }
}


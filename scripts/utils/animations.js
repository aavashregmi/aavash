/**
 * ==========================================================================
 * UTILS: SCROLL REVEAL & INTERSECTION OBSERVER ANIMATIONS
 * ==========================================================================
 */

import { $$, debounce } from './helpers.js';
import { CONFIG } from '../config.js';

export function initScrollReveals() {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const revealElements = $$('.reveal-on-scroll, .reveal-scale');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: CONFIG.motion.scrollRevealThreshold
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}


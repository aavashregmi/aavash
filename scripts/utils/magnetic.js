/**
 * ==========================================================================
 * UTILS: MAGNETIC INTERACTION PHYSICS
 * Subtle pointer-attraction physics for interactive buttons & badges.
 * Automatically disabled on touch screens & reduced-motion preferences.
 * ==========================================================================
 */

import { $$ } from './helpers.js';
import { CONFIG } from '../config.js';

export function initMagneticEffect() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReducedMotion) return;

  const magneticElements = $$('.magnetic-item');

  magneticElements.forEach(el => {
    let boundRect = null;

    const onMouseEnter = () => {
      boundRect = el.getBoundingClientRect();
    };

    const onMouseMove = (e) => {
      if (!boundRect) boundRect = el.getBoundingClientRect();
      const elemCenterX = boundRect.left + boundRect.width / 2;
      const elemCenterY = boundRect.top + boundRect.height / 2;

      const deltaX = (e.clientX - elemCenterX) * CONFIG.motion.magneticPower;
      const deltaY = (e.clientY - elemCenterY) * CONFIG.motion.magneticPower;

      el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    };

    const onMouseLeave = () => {
      el.style.transform = 'translate3d(0px, 0px, 0)';
      boundRect = null;
    };

    el.addEventListener('mouseenter', onMouseEnter, { passive: true });
    el.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });
}


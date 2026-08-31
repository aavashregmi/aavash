/**
 * ==========================================================================
 * UTILS: CURSOR SPOTLIGHT TORCH
 * Smooth desktop cursor spotlight that illuminates monochromatic surfaces.
 * ==========================================================================
 */

import { $ } from './helpers.js';

export function initCursorTorch() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReducedMotion) return;

  const spotlight = $('.cursor-spotlight');
  if (!spotlight) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const renderSpotlight = () => {
    // Lerp for butter-smooth momentum
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderSpotlight);
  };

  renderSpotlight();
}


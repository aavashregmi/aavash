/**
 * ==========================================================================
 * AAVASH REGMI — MASTER CLIENT APPLICATION BOOTSTRAP
 * Monochromatic luxury experience with interactive cookie consent and motion
 * ==========================================================================
 */
import { initLogoWatermark } from './utils/logoWatermark.js';
import { initCookieConsent } from './components/cookieConsent.js';
import { initNavigation } from './components/navigation.js';
import { initLocalTime } from './components/localTime.js';
import { initContactForm } from './components/contactForm.js';
import { initProjectDrawer } from './components/projectDrawer.js';
import { initBackgroundCanvas } from './components/backgroundCanvas.js';
import { initScrollReveals } from './utils/animations.js';
import { initMagneticEffect } from './utils/magnetic.js';
import { initCursorTorch } from './utils/cursorTorch.js';
import { initPortfolioChat } from './components/chatWidget.js'; // Added your AI chat widget

function runSafely(moduleName, fn) {
  try {
    fn();
  } catch (error) {
    console.error(`[Aavash Regmi App] Module "${moduleName}" initialization failed:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Visual Atmosphere, Torch & Motion
  runSafely('Background Canvas', initBackgroundCanvas);
  runSafely('Cursor Spotlight', initCursorTorch);
  runSafely('Scroll Reveals', initScrollReveals);
  runSafely('Magnetic FX', initMagneticEffect);
  runSafely('Logo Watermark FX', initLogoWatermark);

  // Initialize Interactive Consent & Lag Engine
  runSafely('Cookie Consent HUD', initCookieConsent);

  // Initialize Interactive Components
  runSafely('Navigation & Scroll-Spy', initNavigation);
  runSafely('Local Kathmandu Clock', initLocalTime);
  runSafely('Contact Form Pipeline', initContactForm);
  runSafely('Project Drawer System', initProjectDrawer);

  // Initialize Portfolio AI Chat Assistant
  runSafely('Portfolio AI Chat', initPortfolioChat);

  console.log(
    '%c Aavash Regmi %c Monochromatic CE Space %c',
    'background: #ffffff; color: #000000; font-weight: 800; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #14151c; color: #ffffff; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'background: transparent'
  );
});
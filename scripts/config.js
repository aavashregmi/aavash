/**
 * ==========================================================================
 * AAVASH REGMI — APPLICATION CONFIGURATION
 * Centralized environment parameters, endpoints, and constants.
 * ==========================================================================
 */

export const CONFIG = {
  // Personal & Site Metadata
  siteName: 'Aavash Regmi',
  siteDomain: 'https://aavashregmi.com.np',
  authorEmail: 'contact@aavashregmi.com.np',
  location: {
    city: 'Kathmandu',
    country: 'Nepal',
    coordinates: '27.7172° N, 85.3240° E',
    timeZone: 'Asia/Kathmandu',
    utcOffsetHours: 5.75 // UTC+05:45
  },

  // Contact System Endpoint
  formspree: {
    endpoint: 'https://formspree.io/f/xbddjndv',
    timeoutMs: 12000
  },

  // Animation & Motion Constants
  motion: {
    scrollRevealThreshold: 0.12,
    magneticPower: 0.28,
    canvasParticleCount: 45
  }
};


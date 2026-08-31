/**
 * ==========================================================================
 * COMPONENT: COOKIE CONSENT HUD & INTERACTIVE LAG SYSTEM
 * Displays luxury consent popup on entry and handles emotional rejection flow.
 * ==========================================================================
 */

import { $, $$ } from '../utils/helpers.js';

export function initCookieConsent() {
  const overlay = $('#cookie-modal-overlay');
  const btnAcceptAll = $('#btn-cookie-accept-all');
  const btnAccept = $('#btn-cookie-accept');
  const btnReject = $('#btn-cookie-reject');
  const btnEmergencyRestore = $('#btn-emergency-restore');
  const btnBackHome = $('#btn-back-home');
  const shockwave = $('#shockwave-burst');
  const rejectedView = $('#rejected-message-view');

  if (!overlay) return;

  // Show consent HUD after brief moment on load
  setTimeout(() => {
    overlay.classList.add('is-active');
  }, 400);

  const triggerAcceptCelebration = () => {
    // 1. Trigger celebratory shockwave
    if (shockwave) {
      shockwave.classList.add('is-exploding');
      setTimeout(() => {
        shockwave.classList.remove('is-exploding');
      }, 900);
    }

    // 2. Dismiss everything and return to normal site view
    overlay.classList.remove('is-active');
    if (rejectedView) {
      rejectedView.classList.remove('is-visible');
      rejectedView.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('system-lag-mode');

    // Pause audio if it was playing
    const audio = document.getElementById('hidden-audio-player');
    if (audio) {
      audio.pause();
    }
  };

  const triggerRejectFlow = () => {
    // Scroll instantly to the top so the full-screen overlay covers everything correctly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 1. Dismiss cookie prompt and enable gentle lag
    overlay.classList.remove('is-active');
    document.body.classList.add('system-lag-mode');

    // 2. Open the emotional page overlay inside the same tab
    if (rejectedView) {
      rejectedView.classList.add('is-visible');
      rejectedView.setAttribute('aria-hidden', 'false');
    }

    // 3. Play local MP3 audio seamlessly using a native HTML5 audio element
    if (!document.getElementById('hidden-audio-player')) {
      const audio = document.createElement('audio');
      audio.id = 'hidden-audio-player';
      
      // Correct relative path from scripts/components/ to assets/audio/lae-dooba.mp3[cite: 1]
      audio.src = '../../assets/audio/lae-dooba.mp3'; 
      audio.currentTime = 27; // Starts playing at 27 seconds
      audio.loop = false;    
      audio.style.display = 'none';

      document.body.appendChild(audio);

      audio.play().catch(error => {
        console.warn('Audio playback was blocked by browser policy:', error);
      });
    }

    console.warn('[SYSTEM PANIC] Reject All Cookies detected! Opening emotional view and playing track...');
  };

  // Button Listeners
  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', triggerAcceptCelebration);
  }

  if (btnAccept) {
    btnAccept.addEventListener('click', triggerAcceptCelebration);
  }

  if (btnReject) {
    btnReject.addEventListener('click', triggerRejectFlow);
  }

  if (btnEmergencyRestore) {
    btnEmergencyRestore.addEventListener('click', triggerAcceptCelebration);
  }

  if (btnBackHome) {
    btnBackHome.addEventListener('click', triggerAcceptCelebration);
  }
}
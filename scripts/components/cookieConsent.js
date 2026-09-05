/**
 * ==========================================================================
 * COMPONENT: PROFESSIONAL COOKIE CONSENT & TELEMETRY LOGGER
 * Captures visitor telemetry upon consent and handles emotional rejection flow.
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

  // Function to gather and store real visitor telemetry upon cookie acceptance
  const captureAndStoreVisitorData = async () => {
    let ipData = { ip: 'Resolving...', city: 'Unknown', country_name: 'Unknown', org: 'Direct Connection' };
    
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        ipData = await response.json();
      }
    } catch (err) {
      console.warn('Telemetry IP lookup skipped/blocked.');
    }

    const ua = navigator.userAgent;
    let deviceType = /mobile/i.test(ua) ? 'Mobile Phone' : (/tablet/i.test(ua) ? 'Tablet' : 'Desktop Computer');
    let os = /windows/i.test(ua) ? 'Windows' : (/macintosh|mac os x/i.test(ua) ? 'MacOS' : (/android/i.test(ua) ? 'Android' : (/iphone|ipad|ipod/i.test(ua) ? 'iOS' : 'Linux')));
    let browser = /chrome/i.test(ua) && !/edge|opr/i.test(ua) ? 'Google Chrome' : (/safari/i.test(ua) && !/chrome/i.test(ua) ? 'Apple Safari' : (/firefox/i.test(ua) ? 'Mozilla Firefox' : (/edge/i.test(ua) ? 'Microsoft Edge' : 'Other')));

    const visitorRecord = {
      ip: ipData.ip || ipData.query || '127.0.0.1',
      location: `${ipData.city || 'Unknown City'}, ${ipData.region || 'Region'}, ${ipData.country_name || 'Nepal'}`,
      isp: ipData.org || ipData.asn || 'Local ISP',
      device: `${deviceType} (${os})`,
      browser: browser,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      language: navigator.language || 'en-US',
      cookieAcceptedAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Save/Update in localStorage logs array so admin panel table displays it instantly
    let logs = JSON.parse(localStorage.getItem('ar_visitor_logs') || '[]');
    const existingIndex = logs.findIndex(l => l.ip === visitorRecord.ip);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = visitorRecord;
    } else {
      logs.unshift(visitorRecord);
    }

    if (logs.length > 50) logs.pop();
    localStorage.setItem('ar_visitor_logs', JSON.stringify(logs));
    localStorage.setItem('ar_cookie_consent_status', 'accepted');
  };

  const triggerAcceptCelebration = async () => {
    // 1. Capture comprehensive device & network info into admin logs
    await captureAndStoreVisitorData();

    // 2. Trigger celebratory shockwave
    if (shockwave) {
      shockwave.classList.add('is-exploding');
      setTimeout(() => {
        shockwave.classList.remove('is-exploding');
      }, 900);
    }

    // 3. Dismiss everything and return to normal site view
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
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 1. Dismiss cookie prompt and enable gentle lag
    overlay.classList.remove('is-active');
    document.body.classList.add('system-lag-mode');

    // 2. Open the emotional page overlay inside the same tab
    if (rejectedView) {
      rejectedView.classList.add('is-visible');
      rejectedView.setAttribute('aria-hidden', 'false');
    }

    // 3. Play local MP3 audio seamlessly
    if (!document.getElementById('hidden-audio-player')) {
      const audio = document.createElement('audio');
      audio.id = 'hidden-audio-player';
      audio.src = '../../assets/audio/lae-dooba.mp3'; 
      audio.currentTime = 27; 
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
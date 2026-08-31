/**
 * ==========================================================================
 * COMPONENT: LIVE MULTI-CITY WORLD CLOCKS
 * Displays real-time clocks for Kathmandu, New York, London, and Sydney.
 * ==========================================================================
 */

import { CONFIG } from '../config.js';

export function initLocalTime() {
  const clockElements = document.querySelectorAll('time[data-timezone]');
  if (!clockElements.length) return;

  const updateClocks = () => {
    clockElements.forEach(clockEl => {
      const timeZone = clockEl.getAttribute('data-timezone');
      if (!timeZone) return;

      try {
        const options = {
          timeZone: timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };

        const formatter = new Intl.DateTimeFormat([], options);
        clockEl.textContent = formatter.format(new Date()).toLowerCase();
      } catch (err) {
        // Fallback calculation for Kathmandu if Intl fails
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const targetDate = new Date(utc + (3600000 * CONFIG.location.utcOffsetHours));
        
        let hours = targetDate.getHours();
        const minutes = String(targetDate.getMinutes()).padStart(2, '0');
        const seconds = String(targetDate.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      }
    });
  };

  updateClocks();
  setInterval(updateClocks, 1000);
}
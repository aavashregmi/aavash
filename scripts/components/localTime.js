import { CONFIG } from '../config.js';

export function initLocalTime() {
  const clockElements = document.querySelectorAll('[data-local-time]');

  const updateClocks = () => {
    try {
      const options = {
        timeZone: CONFIG.location.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };

      const formatter = new Intl.DateTimeFormat([], options);
      const now = new Date();
      
      clockElements.forEach(clockEl => {
        clockEl.textContent = formatter.format(now).toLowerCase();
      });

      // --- TIME GREETING LOGIC ---
      const hours24 = now.getHours();
      let greeting = "";
      let icon = "";

      if (hours24 >= 5 && hours24 < 12) {
        greeting = "Good Morning";
        icon = "☀️";
      } else if (hours24 >= 12 && hours24 < 17) {
        greeting = "Good Afternoon";
        icon = "🌤️";
      } else if (hours24 >= 17 && hours24 < 21) {
        greeting = "Good Evening";
        icon = "🌙";
      } else {
        greeting = "Good Midnight";
        icon = "✨";
      }

      const greetingTextEl = document.getElementById("time-greeting-text");
      const greetingIconEl = document.getElementById("time-greeting-icon");
      if (greetingTextEl) greetingTextEl.textContent = greeting;
      if (greetingIconEl) greetingIconEl.textContent = icon;
      // ---------------------------

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

      clockElements.forEach(clockEl => {
        clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
      });

      // --- FALLBACK TIME GREETING LOGIC ---
      const hours24Fallback = targetDate.getHours();
      let greeting = "";
      let icon = "";

      if (hours24Fallback >= 5 && hours24Fallback < 12) {
        greeting = "Good Morning";
        icon = "☀️";
      } else if (hours24Fallback >= 12 && hours24Fallback < 17) {
        greeting = "Good Afternoon";
        icon = "🌤️";
      } else if (hours24Fallback >= 17 && hours24Fallback < 21) {
        greeting = "Good Evening";
        icon = "🌙";
      } else {
        greeting = "Good Midnight";
        icon = "✨";
      }

      const greetingTextEl = document.getElementById("time-greeting-text");
      const greetingIconEl = document.getElementById("time-greeting-icon");
      if (greetingTextEl) greetingTextEl.textContent = greeting;
      if (greetingIconEl) greetingIconEl.textContent = icon;
      // ------------------------------------
    }
  };

  updateClocks();
  setInterval(updateClocks, 1000);
}
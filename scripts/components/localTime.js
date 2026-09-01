import { CONFIG } from '../config.js';

export function initLocalTime() {
  // Targets your exact HTML attribute: [data-timezone]
  const clockElements = document.querySelectorAll('[data-timezone]');

  const updateClocks = () => {
    const now = new Date();

    // 1. Update all 4 world clock elements based on their data-timezone attribute
    clockElements.forEach(clockEl => {
      try {
        const timeZone = clockEl.getAttribute('data-timezone');
        const options = {
          timeZone: timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };

        const formatter = new Intl.DateTimeFormat([], options);
        clockEl.textContent = formatter.format(now).toLowerCase();
      } catch (err) {
        clockEl.textContent = "--:--:-- --";
      }
    });

    // 2. --- UNTOUCHED TIME GREETING LOGIC ---
    try {
      const options24 = {
        timeZone: CONFIG.location.timeZone,
        hour: 'numeric',
        hour12: false
      };
      const formatter24 = new Intl.DateTimeFormat([], options24);
      const hours24 = parseInt(formatter24.format(now), 10);

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

    } catch (err) {
      // Fallback greeting calculation for Kathmandu if Intl fails
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const targetDate = new Date(utc + (3600000 * CONFIG.location.utcOffsetHours));
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
    }
  };

  updateClocks();
  setInterval(updateClocks, 1000);
}
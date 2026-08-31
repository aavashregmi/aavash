/**
 * ==========================================================================
 * UTILS: GENERAL HELPERS & DOM UTILITIES
 * ==========================================================================
 */

/**
 * Shorthand querySelector
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Shorthand querySelectorAll as Array
 */
export const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Debounce function execution
 */
export function debounce(fn, delay = 150) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function execution via requestAnimationFrame
 */
export function throttleRAF(fn) {
  let running = false;
  return function (...args) {
    if (running) return;
    running = true;
    requestAnimationFrame(() => {
      fn.apply(this, args);
      running = false;
    });
  };
}

/**
 * Copy text to clipboard with fallback and UI feedback callback
 */
export async function copyToClipboard(text, onSuccess, onError) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      if (onSuccess) onSuccess(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API error, attempting fallback:', err);
    }
  }

  // Fallback for older browsers or non-secure contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful && onSuccess) onSuccess(text);
    return successful;
  } catch (err) {
    if (onError) onError(err);
    return false;
  }
}

/**
 * Escape HTML to prevent XSS in dynamic renders
 */
export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


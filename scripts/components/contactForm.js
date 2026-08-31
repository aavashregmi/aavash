/**
 * ==========================================================================
 * COMPONENT: ASYNCHRONOUS CONTACT FORM & FORMSPREE PIPELINE
 * Submits via fetch(), handles validation, states, and prevents redirection.
 * ==========================================================================
 */

import { $, $$, copyToClipboard } from '../utils/helpers.js';
import { CONFIG } from '../config.js';

export function initContactForm() {
  const form = $('#contact-form');
  const submitBtn = $('#btn-form-submit');
  const statusBanner = $('#form-status');
  const copyBtn = $('#btn-copy-email');
  const copyFeedback = $('#copy-feedback-text');

  // 1. Direct Email Copy Utility
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = CONFIG.authorEmail;
      await copyToClipboard(
        email,
        () => {
          if (copyFeedback) {
            copyFeedback.textContent = 'Copied!';
            setTimeout(() => {
              copyFeedback.textContent = 'Copy';
            }, 2500);
          }
        },
        () => {
          if (copyFeedback) copyFeedback.textContent = 'Failed to copy';
        }
      );
    });
  }

  if (!form || !submitBtn || !statusBanner) return;

  const showStatus = (type, message) => {
    statusBanner.className = `form-status is-${type}`;
    statusBanner.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠'}</span>
      <span>${message}</span>
    `;
    statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const clearStatus = () => {
    statusBanner.className = 'form-status';
    statusBanner.innerHTML = '';
  };

  const validateInput = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;
    const val = input.value.trim();

    if (input.hasAttribute('required') && !val) {
      isValid = false;
    } else if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(val);
    }

    if (!isValid) {
      group.classList.add('is-invalid');
      input.classList.add('has-error');
    } else {
      group.classList.remove('is-invalid');
      input.classList.remove('has-error');
    }

    return isValid;
  };

  // Real-time blur validation
  $$('.form-input, .form-textarea', form).forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('has-error')) {
        validateInput(input);
      }
    });
  });

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearStatus();

    // Check honeypot spam trap
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim() !== '') {
      // Spam detected, silently return success without posting
      showStatus('success', 'Message sent. Thank you for reaching out.');
      form.reset();
      return;
    }

    // Validate all fields
    const inputs = $$('.form-input, .form-textarea', form);
    let formIsValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) formIsValid = false;
    });

    if (!formIsValid) {
      showStatus('error', 'Please fill out all required fields with valid information.');
      return;
    }

    // Prepare payload
    const formData = new FormData(form);
    const originalBtnText = submitBtn.innerHTML;

    try {
      // Disable button & show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.9"/>
        </svg>
        <span>Sending Message...</span>
      `;

      // Set timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.formspree.timeoutMs);

      const endpoint = CONFIG.formspree.endpoint;

      // Note: If Formspree ID is still the placeholder, we provide friendly developer notification
      if (endpoint.includes('YOUR_FORM_ID')) {
        await new Promise(r => setTimeout(r, 800)); // Simulate response for demo
        showStatus('success', 'Message simulated successfully! (Replace YOUR_FORM_ID in scripts/config.js with your Formspree endpoint)');
        form.reset();
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        showStatus('success', 'Message sent successfully. I will get back to you soon!');
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const errorMsg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Unable to send message at this moment. Please try again.';
        showStatus('error', errorMsg);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        showStatus('error', 'The request timed out. Please check your internet connection or email directly.');
      } else {
        showStatus('error', 'A network error occurred. Please try again or reach out at contact@aavashregmi.com.np.');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}


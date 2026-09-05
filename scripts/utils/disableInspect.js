/**
 * ==========================================================================
 * ADVANCED DEVICE SECURITY, PRIVACY SHIELD & SCROLLING PIN BANNER MODULE
 * ==========================================================================
 */
export function initDisableInspect() {
  const warningTitle = "SECURITY NOTICE";
  const strikeOneMessage = "Protected Content: Source code inspection and content copying are restricted on this portfolio. Be advised: a second violation will result in a temporary block or permanent restriction from your device.";
  
  const LOCK_DURATION = 60 * 1000; // Exact 1-minute ban duration for 2nd and 3rd strikes
  const SECRET_PIN = "+-+-";

  // Check existing lock status immediately upon script load
  checkExistingLock();

  function getStrikeCount() {
    return parseInt(localStorage.getItem('ar_security_strikes') || '0', 10);
  }

  function checkExistingLock() {
    const lockUntil = localStorage.getItem('ar_lock_until');
    if (lockUntil) {
      const remainingTime = parseInt(lockUntil, 10) - Date.now();
      if (remainingTime > 0) {
        freezeWebsite(remainingTime);
      } else {
        localStorage.removeItem('ar_lock_until');
      }
    }
  }

  function triggerSecurityAction() {
    if (localStorage.getItem('ar_lock_until')) return;

    let strikeCount = getStrikeCount();
    strikeCount++;
    localStorage.setItem('ar_security_strikes', strikeCount.toString());

    if (strikeCount === 1) {
      showCenterModal(strikeOneMessage);
    } else {
      // 2nd, 3rd, and subsequent strikes lock them down for exactly 1 minute
      const lockTime = Date.now() + LOCK_DURATION;
      localStorage.setItem('ar_lock_until', lockTime.toString());
      freezeWebsite(LOCK_DURATION);
    }
  }

  function showCenterModal(messageText) {
    if (document.getElementById('security-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'security-modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: '999998',
      opacity: '0',
      transition: 'opacity 0.4s ease'
    });

    const modal = document.createElement('div');
    modal.id = 'security-modal-box';
    modal.innerHTML = `
      <div style="font-size: 12px; letter-spacing: 2px; color: #888; margin-bottom: 8px; font-weight: 700;">${warningTitle}</div>
      <div style="font-size: 15px; color: #fff; margin-bottom: 20px; line-height: 1.5;">${messageText}</div>
      <button id="security-dismiss-btn" style="background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;">Understood</button>
    `;
    Object.assign(modal.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.95)',
      backgroundColor: '#14151c',
      color: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      zIndex: '999999',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    });

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    const dismiss = () => {
      overlay.style.opacity = '0';
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
      setTimeout(() => {
        overlay.remove();
        modal.remove();
      }, 400);
    };

    document.getElementById('security-dismiss-btn').addEventListener('click', dismiss);
    overlay.addEventListener('click', dismiss);
  }

  function freezeWebsite(durationMs) {
    // Hide all underlying content completely
    document.body.style.pointerEvents = 'none';
    document.body.style.userSelect = 'none';

    const oldOverlay = document.getElementById('security-modal-overlay');
    const oldModal = document.getElementById('security-modal-box');
    if (oldOverlay) oldOverlay.remove();
    if (oldModal) oldModal.remove();

    const strikeCount = getStrikeCount();

    // Inject CSS keyframes for continuous left-to-right/right-to-left marquee animation
    if (!document.getElementById('security-marquee-style')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'security-marquee-style';
      styleSheet.textContent = `
        @keyframes scrollBanner {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    const lockScreen = document.createElement('div');
    lockScreen.id = 'security-lock-screen';
    Object.assign(lockScreen.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0a0a0f',
      zIndex: '99999999',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'inherit',
      opacity: '1',
      overflow: 'hidden'
    });

    lockScreen.innerHTML = `
      <!-- Continuous scrolling small top banner -->
      <div style="position: absolute; top: 15px; width: 100%; overflow: hidden; white-space: nowrap; background: rgba(255,255,255,0.03); padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="display: inline-block; animation: scrollBanner 12s linear infinite; font-size: 11px; letter-spacing: 3px; color: #888; text-transform: uppercase;">
          ENTER 4 DIGIT NUMBER &nbsp;&nbsp;&bull;&nbsp;&nbsp; ENTER 4 DIGIT NUMBER &nbsp;&nbsp;&bull;&nbsp;&nbsp; ENTER 4 DIGIT NUMBER &nbsp;&nbsp;&bull;&nbsp;&nbsp; ENTER 4 DIGIT NUMBER
        </div>
      </div>

      <div style="font-size: 14px; letter-spacing: 2px; color: #ff4d4d; margin-bottom: 10px; font-weight: 700;">DEVICE RESTRICTED</div>
      <div style="font-size: 16px; color: #fff; margin-bottom: 8px;">Unauthorized Inspection Attempt Logged (Strike ${strikeCount})</div>
      <div style="font-size: 13px; color: #888; margin-bottom: 20px;">Your session has been temporarily locked due to policy violations.</div>
      <div style="font-size: 14px; color: #fff; background: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
        Auto-unlock in: <span id="lock-countdown" style="font-weight: bold; color: #ff4d4d;">--:--</span>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <input type="password" id="unlock-pin-input" placeholder="••••" maxlength="4" style="background: #14151c; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 16px; border-radius: 6px; font-size: 14px; text-align: center; outline: none; letter-spacing: 6px; width: 120px;" />
        <span id="pin-error-msg" style="font-size: 11px; color: #ff4d4d; min-height: 15px;"></span>
      </div>
    `;

    document.body.appendChild(lockScreen);

    // PIN Input Listener for Bypass
    setTimeout(() => {
      const pinInput = document.getElementById('unlock-pin-input');
      if (pinInput) {
        pinInput.focus();
        pinInput.addEventListener('input', (e) => {
          if (e.target.value === SECRET_PIN) {
            localStorage.removeItem('ar_lock_until');
            localStorage.removeItem('ar_security_strikes');
            window.location.reload();
          } else if (e.target.value.length === 4) {
            document.getElementById('pin-error-msg').textContent = "Incorrect PIN code.";
            setTimeout(() => { e.target.value = ''; document.getElementById('pin-error-msg').textContent = ''; }, 1500);
          }
        });
      }
    }, 100);

    // Live countdown timer handler with persistent local tracking
    const updateCountdown = () => {
      const lockUntil = parseInt(localStorage.getItem('ar_lock_until') || '0', 10);
      const timeLeft = Math.ceil((lockUntil - Date.now()) / 1000);

      if (timeLeft <= 0) {
        localStorage.removeItem('ar_lock_until');
        window.location.reload();
        return;
      }

      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const counterEl = document.getElementById('lock-countdown');
      if (counterEl) {
        counterEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Event Listeners for Violations
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    triggerSecurityAction();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
      e.preventDefault();
      triggerSecurityAction();
    }
    if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      triggerSecurityAction();
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      triggerSecurityAction();
    }
  });
}
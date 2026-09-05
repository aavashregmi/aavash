/**
 * ==========================================================================
 * DISABLE INSPECT & SHORTCUTS MODULE
 * ==========================================================================
 */
export function initDisableInspect() {
  // Disable Right-Click Context Menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("Inspect element is disabled on this portfolio!");
  });

  // Disable DevTools Keyboard Shortcuts
  document.addEventListener('keydown', function(e) {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      alert("Developer tools are disabled.");
    }
    
    // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      alert("Action blocked!");
    }
    
    // Prevent Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      alert("View Source is disabled.");
    }
  });
}
/**
 * ==========================================================================
 * BACKGROUND LOGO WATERMARK SCROLL FX
 * ==========================================================================
 */

export function initLogoWatermark() {
  const watermark = document.querySelector(".bg-logo-watermark");
  if (!watermark) return;

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    
    // Smooth, controlled scaling (starts at 0.9 and grows gently to max 1.5)
    let scaleValue = 0.9 + (scrollPos * 0.0005);
    if (scaleValue > 1.5) scaleValue = 1.5;

    // Subtle opacity increase as you scroll down
    let opacityValue = 0.04 + (scrollPos * 0.00004);
    if (opacityValue > 0.08) opacityValue = 0.08;

    watermark.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;
    watermark.style.opacity = opacityValue;
  }, { passive: true });
}
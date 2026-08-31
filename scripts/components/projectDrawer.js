/**
 * ==========================================================================
 * COMPONENT: PROJECT DETAIL MODAL / DRAWER
 * Accessible modal dialog with focus management and keyboard trapping.
 * ==========================================================================
 */

import { $, $$, sanitizeHTML } from '../utils/helpers.js';
import { PROJECTS_DATA } from '../data/projects.js';

export function initProjectDrawer() {
  const modal = $('#project-modal');
  const modalContent = $('#project-modal-content');
  const closeBtn = $('#modal-close-btn');

  if (!modal || !modalContent) return;

  let lastActiveElement = null;

  const openModal = (projectId) => {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project) return;

    lastActiveElement = document.activeElement;

    modalContent.innerHTML = `
      <div class="modal-header" style="margin-bottom: 1.5rem;">
        <span class="eyebrow">${sanitizeHTML(project.category)} • ${sanitizeHTML(project.year)}</span>
        <h3 style="font-size: 2rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">${sanitizeHTML(project.title)}</h3>
        <p style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.875rem;">Role: ${sanitizeHTML(project.role)}</p>
      </div>

      <div class="modal-media" style="margin-bottom: 2rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle);">
        <img src="${sanitizeHTML(project.image)}" alt="${sanitizeHTML(project.title)}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">
      </div>

      <div class="modal-body" style="color: var(--text-secondary); line-height: 1.7; font-size: 1.05rem;">
        <p style="margin-bottom: 1.5rem;">${sanitizeHTML(project.fullDesc)}</p>
        
        <h4 style="color: var(--text-primary); margin-bottom: 0.75rem; font-size: 1.15rem;">Key Architecture Highlights:</h4>
        <ul style="list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem;">
          ${project.highlights.map(h => `<li style="margin-bottom: 0.5rem;">${sanitizeHTML(h)}</li>`).join('')}
        </ul>

        <h4 style="color: var(--text-primary); margin-bottom: 0.75rem; font-size: 1.15rem;">Technologies & Specifications:</h4>
        <div class="project-tech-stack" style="margin-bottom: 2rem;">
          ${project.technologies.map(t => `<span class="tech-tag">${sanitizeHTML(t)}</span>`).join('')}
        </div>

        <div class="modal-actions" style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${sanitizeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 0.7rem 1.4rem;">
            <span>View Source / Demo</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </a>
        </div>
      </div>
    `;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  // Trigger buttons
  $$('[data-open-project]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-open-project');
      openModal(projectId);
    });
  });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}


/* ============================================
   COMPONENTS.JS - LEGACY WRAPPER
   Delegates to app.js functions where available
   ============================================ */

(function initComponents() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    // Only define fallbacks if not already defined by app.js
    if (typeof window.showToast !== 'function') {
      window.showToast = function (message, type = 'success') {
        const container = document.getElementById('toast-container') || document.getElementById('admin-toast-container');
        if (!container) return;
        const iconMap = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(120%)';
          toast.style.transition = 'all 0.35s ease';
          setTimeout(() => toast.remove(), 350);
        }, 3500);
      };
      window.showAdminToast = window.showToast;
    }

    if (typeof window.openModal !== 'function') {
      window.openModal = function (html) {
        const overlay = document.getElementById('modal-overlay') || document.getElementById('admin-modal');
        const content = document.getElementById('modal-content') || document.getElementById('admin-modal-content');
        if (!overlay || !content) return;
        content.innerHTML = html;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const closeBtn = content.querySelector('.modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
        const handler = (e) => { if (e.target === overlay) closeModal(); };
        overlay.addEventListener('click', handler);
        overlay._cleanup = () => overlay.removeEventListener('click', handler);
      };
    }

    if (typeof window.closeModal !== 'function') {
      window.closeModal = function () {
        const overlay = document.getElementById('modal-overlay') || document.getElementById('admin-modal');
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (typeof overlay._cleanup === 'function') overlay._cleanup();
      };
      window.closeAdminModal = window.closeModal;
    }

    // Mobile menu - delegated to app.js if exists
    if (typeof window.openMobileMenu !== 'function') {
      window.openMobileMenu = function () {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-overlay');
        if (!menu || !overlay) return;
        menu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'true');
      };
    }

    if (typeof window.closeMobileMenu !== 'function') {
      window.closeMobileMenu = function () {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-overlay');
        if (!menu) return;
        menu.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
        document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
      };
    }

    // Cart - delegated to app.js if exists
    if (typeof window.openCart !== 'function') {
      window.openCart = function () {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (!sidebar) return;
        sidebar.classList.add('open');
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (typeof updateCartSidebar === 'function') updateCartSidebar();
      };
    }

    if (typeof window.closeCart !== 'function') {
      window.closeCart = function () {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (!sidebar) return;
        sidebar.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
      };
    }

    AOS?.refresh();
  }

  // Admin sidebar toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.querySelector('.admin-sidebar')?.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-locked');
    });
  }

  // Generic tabs
  window.setupTabs = function (tabGroupSelector) {
    const buttons = document.querySelectorAll(`${tabGroupSelector} [data-tab], ${tabGroupSelector} .tab-btn`);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        if (!target) return;
        document.querySelectorAll(`${tabGroupSelector} [data-tab], ${tabGroupSelector} .tab-btn`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`${tabGroupSelector} .tab-content`).forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const content = document.getElementById(`tab-${target}`);
        if (content) content.classList.add('active');
      });
    });
  };
})();
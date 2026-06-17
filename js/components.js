/* ============================================
   COMPONENTS.JS - SHARED UI LOGIC
   Toast, Modal, Mobile Menus, Cart, Tabs
   ============================================ */

(function initComponents() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    setupToasts();
    setupModals();
    AOS?.refresh();
  }

  /* =========================================
     TOAST SYSTEM
     ========================================= */
  function setupToasts() {
    window.showToast = function (message, type = 'success') {
      const container = document.getElementById('toast-container') ||
                        document.getElementById('admin-toast-container');
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

  /* =========================================
     MODAL MANAGER
     ========================================= */
  function setupModals() {
    window.openModal = function (html) {
      const overlay = document.getElementById('modal-overlay') || document.getElementById('admin-modal');
      const content = document.getElementById('modal-content') || document.getElementById('admin-modal-content');
      if (!overlay || !content) return;
      content.innerHTML = html;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const closeBtn = content.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      const handler = (e) => { if (e.target === overlay) closeModal(); };
      overlay.addEventListener('click', handler);
      overlay._cleanup = () => overlay.removeEventListener('click', handler);
    };

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

  /* =========================================
     MOBILE MENU (storefront)
     ========================================= */
  window.openMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    if (!menu || !overlay) return;
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'true');
  };

  window.closeMobileMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    if (!menu) return;
    menu.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
  };

  /* =========================================
     CART SIDEBAR
     ========================================= */
  window.openCart = function () {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar) return;
    sidebar.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCartSidebar?.();
  };

  window.closeCart = function () {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar) return;
    sidebar.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* =========================================
     ADMIN SIDEBAR MOBILE TOGGLE
     ========================================= */
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.querySelector('.admin-sidebar')?.classList.toggle('mobile-open');
      document.body.classList.toggle('sidebar-locked');
    });
  }

  /* =========================================
     TABS (generic)
     ========================================= */
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

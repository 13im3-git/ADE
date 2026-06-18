// ============================================
// ADE NATURAL CEREALS - ADMIN DASHBOARD
// ============================================

// ===== STATE =====
const ADMIN_STATE = {
  currentTab: 'dashboard',
  orders: JSON.parse(localStorage.getItem('adeOrders') || '[]'),
  admins: JSON.parse(localStorage.getItem('adeAdmins') || '[]'),
  isSuperAdmin: false,
  currentAdmin: null,
  // Sales Control
  globalSalesEnabled: JSON.parse(localStorage.getItem('adeSalesEnabled') || 'true'),
  productSales: JSON.parse(localStorage.getItem('adeProductSales') || '{}')
};

// ===== DOM HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== UTILITY =====
function formatPrice(price) {
  return '₦' + Number(price).toLocaleString();
}

function showToast(message, type = 'success') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getStatusBadge(status) {
  const map = {
    'pending': 'Pending Payment Verification',
    'approved': 'Approved',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return `<span class="status-badge status-${status}">${map[status] || status}</span>`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  initAdmin();
  initMobileToggle();
});

function checkAuth() {
  const stored = localStorage.getItem('adeAdmins');
  if (!stored) {
    localStorage.setItem('adeAdmins', JSON.stringify([]));
    ADMIN_STATE.admins = [];
  } else {
    ADMIN_STATE.admins = JSON.parse(stored);
  }

  const session = sessionStorage.getItem('adeAdminSession');
  if (session) {
    try {
      const data = JSON.parse(session);
      const admin = ADMIN_STATE.admins.find(a => a.email === data.email && a.status === 'active');
      if (admin) {
        ADMIN_STATE.currentAdmin = admin;
        ADMIN_STATE.isSuperAdmin = admin.role === 'superadmin';
        updateAdminUI();
      }
    } catch (e) {
      sessionStorage.removeItem('adeAdminSession');
    }
  }

  if (!ADMIN_STATE.currentAdmin) {
    window.location.href = 'login.html';
    return;
  }
  
  const currentPath = window.location.pathname;
  const isSuperAdminPage = currentPath.includes('superadmin.html');
  
  if (isSuperAdminPage && !ADMIN_STATE.isSuperAdmin) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  if (ADMIN_STATE.isSuperAdmin && currentPath.includes('dashboard.html')) {
    window.location.href = 'superadmin.html';
    return;
  }

  updateAdminUI();
}

function updateAdminUI() {
  const isSuperAdmin = ADMIN_STATE.isSuperAdmin;
  
  document.getElementById('admin-name').textContent = ADMIN_STATE.currentAdmin.username || ADMIN_STATE.currentAdmin.email;
  document.getElementById('admin-role').textContent = isSuperAdmin ? 'Super Admin' : 'Admin';
  document.getElementById('admin-avatar').textContent = (ADMIN_STATE.currentAdmin.username || ADMIN_STATE.currentAdmin.email).slice(0, 2).toUpperCase();
  
  const settingsNav = document.querySelector('a[data-tab="settings"]');
  const settingsBtn = document.querySelector('button[data-tab="settings"]');
  if (settingsNav) settingsNav.style.display = isSuperAdmin ? '' : 'none';
  if (settingsBtn) settingsBtn.style.display = isSuperAdmin ? '' : 'none';
}

function initAdmin() {
  // Load orders from storage
  const storedOrders = localStorage.getItem('adeOrders');
  if (storedOrders) {
    ADMIN_STATE.orders = JSON.parse(storedOrders);
  }
  
  renderDashboard();
  switchTab('dashboard');
}

function initMobileToggle() {
  const toggle = document.getElementById('mobile-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// ===== TAB NAVIGATION =====
function switchTab(tab) {
  ADMIN_STATE.currentTab = tab;
  
  // Update tab buttons
  $$('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  // Update tab content
  $$('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === `tab-${tab}`);
  });
  
  // Render content
  switch(tab) {
    case 'dashboard': renderDashboard(); break;
    case 'analytics': renderAnalytics(); break;
    case 'orders': renderOrders(); break;
    case 'products': renderProducts(); break;
    case 'customers': renderCustomers(); break;
    case 'admins': renderAdmins(); break;
    case 'settings': renderSettings(); break;
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const orders = ADMIN_STATE.orders;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalCustomers = new Set(orders.map(o => o.customer.phone)).size;
  
  // Stats
  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statRevenue = document.getElementById('stat-revenue');
  const statCustomers = document.getElementById('stat-customers');
  
  if (statTotal) statTotal.textContent = totalOrders;
  if (statPending) statPending.textContent = pendingOrders;
  if (statRevenue) statRevenue.textContent = formatPrice(totalRevenue);
  if (statCustomers) statCustomers.textContent = totalCustomers;
  
  // Recent Orders
  const recentOrders = document.getElementById('recent-orders');
  if (recentOrders) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrders.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--gray-500)">No orders yet</td></tr>';
    } else {
      recentOrders.innerHTML = recent.map(o => `
        <tr>
          <td style="font-weight:600;color:var(--gold)">${o.orderNumber}</td>
          <td>${o.customer.name}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${formatDate(o.date)}</td>
          <td>${getStatusBadge(o.status)}</td>
          <td>
            <button class="btn btn-gold btn-sm" onclick="viewOrder('${o.orderNumber}')">View</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// ===== ORDERS =====
function renderOrders() {
  const container = document.getElementById('tab-orders');
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  
  const orders = ADMIN_STATE.orders;
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:60px;color:var(--gray-500)">No orders received yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td style="font-weight:600;color:var(--gold)">${o.orderNumber}</td>
      <td>${o.customer.name}</td>
      <td>${o.customer.phone}</td>
      <td>${formatPrice(o.total)}</td>
      <td>${formatDate(o.date)}</td>
      <td>${getStatusBadge(o.status)}</td>
      <td>${o.tracking || '-'}</td>
      <td>
        <button class="btn btn-gold btn-sm" onclick="viewOrder('${o.orderNumber}')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-ghost btn-sm" onclick="updateOrderStatus('${o.orderNumber}')"><i class="fas fa-edit"></i></button>
      </td>
    </tr>
  `).join('');
}

function viewOrder(orderNumber) {
  const order = ADMIN_STATE.orders.find(o => o.orderNumber === orderNumber);
  if (!order) return;
  
  const modal = document.getElementById('admin-modal');
  const content = document.getElementById('admin-modal-content');
  if (!modal || !content) return;
  
  let itemsHtml = order.items.map(item => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--glass-border);font-size:0.85rem">
      <span style="color:var(--white)">${item.name} × ${item.quantity}</span>
      <span style="color:var(--gold)">${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');
  
  content.innerHTML = `
    <button class="modal-close" onclick="closeAdminModal()"><i class="fas fa-times"></i></button>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:8px">Order ${order.orderNumber}</h3>
    <div style="margin-bottom:24px">${getStatusBadge(order.status)}</div>
    
    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Customer Details</h4>
      <p style="font-size:0.9rem;color:var(--white)">${order.customer.name}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer.phone}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer.address}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer.city}, ${order.customer.state}</p>
    </div>
    
    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Order Items</h4>
      ${itemsHtml}
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px">
        <span style="font-weight:600;color:var(--white)">Total</span>
        <span style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--gold)">${formatPrice(order.total)}</span>
      </div>
    </div>
    
    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Payment Details</h4>
      <p style="font-size:0.85rem;color:var(--white)">Sender: ${order.payment.senderName}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">Amount: ${formatPrice(order.payment.amountSent)}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">Time: ${order.payment.transferTime}</p>
      ${order.payment.screenshot ? `<div style="margin-top:8px"><img src="${order.payment.screenshot}" alt="Payment Screenshot" style="max-width:100%;border-radius:8px;max-height:200px"></div>` : ''}
    </div>
    
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${getStatusActions(order)}
      <input type="text" id="tracking-input" placeholder="Tracking number" style="flex:1;padding:10px 16px;border-radius:8px;background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--white);font-size:0.85rem" value="${order.tracking || ''}">
      <button class="btn btn-gold" onclick="updateTracking('${order.orderNumber}')">Update Tracking</button>
    </div>
  `;
  
  modal.classList.add('active');
}

function getStatusActions(order) {
  const statuses = ['pending', 'approved', 'processing', 'shipped', 'delivered', 'cancelled'];
  return statuses.map(s => {
    if (s === order.status) return '';
    return `<button class="btn btn-ghost btn-sm" onclick="changeOrderStatus('${order.orderNumber}', '${s}')">${s.charAt(0).toUpperCase() + s.slice(1)}</button>`;
  }).join('');
}

function changeOrderStatus(orderNumber, newStatus) {
  const order = ADMIN_STATE.orders.find(o => o.orderNumber === orderNumber);
  if (!order) return;
  
  order.status = newStatus;
  localStorage.setItem('adeOrders', JSON.stringify(ADMIN_STATE.orders));
  
  showToast(`Order ${orderNumber} status updated to ${newStatus}`);
  closeAdminModal();
  renderOrders();
  renderDashboard();
}

function updateTracking(orderNumber) {
  const input = document.getElementById('tracking-input');
  if (!input) return;
  
  const order = ADMIN_STATE.orders.find(o => o.orderNumber === orderNumber);
  if (!order) return;
  
  order.tracking = input.value;
  localStorage.setItem('adeOrders', JSON.stringify(ADMIN_STATE.orders));
  
  showToast('Tracking number updated');
  closeAdminModal();
  renderOrders();
}

function updateOrderStatus(orderNumber) {
  viewOrder(orderNumber);
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('active');
}

// ===== PRODUCT MODAL (ALL ADMINS) =====
function openProductModal(productId) {
  const modal = document.getElementById('admin-modal');
  const content = document.getElementById('admin-modal-content');
  if (!modal || !content) return;
  const isEdit = !!productId;
  let product = null;
  if (isEdit) {
    try { product = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(p => p.id === productId); } catch(e) {}
    if (!product) { showToast('Product not found', 'error'); return; }
  }

  const images = isEdit && product.images ? product.images : [];
  const featuredImage = isEdit && product.featuredImage ? product.featuredImage : (images.length > 0 ? images[0] : '');
  const existingImagesHtml = images.map((img, i) => `
    <div style="position:relative;display:inline-block;margin:4px" data-img-index="${i}">
      <img src="${img}" style="width:72px;height:72px;object-fit:cover;border-radius:8px;border:2px solid ${img === featuredImage ? 'var(--pink)' : 'var(--glass-border)'}">
      <button type="button" onclick="removeExistingImage(${i}, event)" style="position:absolute;top:-6px;right:-6px;background:var(--pink);color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.7rem;line-height:1">×</button>
      ${images.length > 1 ? `<button type="button" onclick="setFeaturedImage(${i})" style="position:absolute;bottom:-6px;left:-6px;background:${img === featuredImage ? 'var(--gold)' : 'var(--gray-400)'};color:var(--black);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:0.55rem;line-height:1" title="Set as featured">★</button>` : ''}
    </div>
  `).join('');

  content.innerHTML = `
    <button class="modal-close" onclick="closeAdminModal()"><i class="fas fa-times"></i></button>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:20px">${isEdit ? 'Edit Product' : 'Add Product'}</h3>
    <form id="product-form" onsubmit="saveProduct(event, '${productId || ''}')">
      <div class="form-group">
        <label class="form-label">Product Name</label>
        <input type="text" class="form-input" id="prod-name" value="${isEdit ? product.name : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="prod-category">
          ${['weight-gain','hips-and-butt','slimthick','flat-tummy','breast-kit','other-products','complete-sets'].map(c => `<option value="${c}" ${isEdit && product.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label class="form-label">Original Price (₦)</label>
          <input type="number" class="form-input" id="prod-original" value="${isEdit ? product.originalPrice : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Sale Price (₦)</label>
          <input type="number" class="form-input" id="prod-sale" value="${isEdit && product.salePrice ? product.salePrice : ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Sale Start Date (optional)</label>
          <input type="date" class="form-input" id="prod-sale-start" value="${isEdit && product.saleStart ? product.saleStart : ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Sale End Date (optional)</label>
          <input type="date" class="form-input" id="prod-sale-end" value="${isEdit && product.saleEnd ? product.saleEnd : ''}">
        </div>
      </div>
      <p style="font-size:0.7rem;color:var(--gray-500);margin-top:-8px;margin-bottom:12px">Leave dates empty for always-active sale. Sale is active only when current date is within the range.</p>
      <div class="form-group">
        <label class="form-label">Product Images (max 8)</label>
        <div id="image-previews" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${existingImagesHtml}</div>
        <input type="file" class="form-input" id="prod-images" accept="image/*" multiple ${images.length >= 8 ? 'disabled' : ''}>
        <p style="font-size:0.7rem;color:var(--gray-500);margin-top:4px">${images.length}/8 images. First image is featured by default. Click ★ to change.</p>
      </div>
      <div class="form-group">
        <label class="form-label">SKU (optional)</label>
        <input type="text" class="form-input" id="prod-sku" placeholder="ADE-WG-001" value="${isEdit ? product.sku || '' : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Weight / Volume (optional)</label>
        <input type="text" class="form-input" id="prod-weight" placeholder="1kg / 500g / 500ml" value="${isEdit ? product.weight || '' : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Short Description</label>
        <textarea class="form-input" id="prod-description" rows="3" placeholder="What this product is, who it's for, and why it works.">${isEdit ? (product.description || '') : ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Key Benefits (one per line)</label>
        <textarea class="form-input" id="prod-features" rows="3" placeholder="Supports healthy weight gain&#10;Boosts energy naturally&#10;Rich in vitamins and minerals">${isEdit && product.features ? product.features.join('\n') : ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Key Ingredients (optional)</label>
        <input type="text" class="form-input" id="prod-ingredients" placeholder="Oats, Millelet, Soy, Crayfish..." value="${isEdit ? (product.ingredients || '') : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Usage Instructions (optional)</label>
        <textarea class="form-input" id="prod-usage" rows="2" placeholder="Mix 2 scoops with milk or yogurt...">${isEdit ? (product.usage || '') : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-gold" style="width:100%">
        <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'} Product
      </button>
    </form>
  `;
  modal.classList.add('active');
}

function getExistingImages(productId) {
  try {
    const product = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(p => p.id === productId);
    if (!product) return [];
    if (product.images && Array.isArray(product.images)) return product.images;
    if (product.image) return [product.image];
  } catch(e) {}
  return [];
}

function removeExistingImage(index, event) {
  event.preventDefault();
  event.stopPropagation();
  const previews = document.getElementById('image-previews');
  if (!previews) return;
  const imgs = previews.querySelectorAll('[data-img-index]');
  if (imgs[index]) imgs[index].remove();
  const fileInput = document.getElementById('prod-images');
  if (previews.children.length === 0 && fileInput) fileInput.disabled = false;
}

function setFeaturedImage(index) {
  const previews = document.getElementById('image-previews');
  if (!previews) return;
  const imgs = previews.querySelectorAll('[data-img-index]');
  imgs.forEach((el, i) => {
    const img = el.querySelector('img');
    const star = el.querySelector('button[title="Set as featured"]');
    if (i === index) {
      if (img) img.style.borderColor = 'var(--pink)';
      if (star) { star.style.background = 'var(--gold)'; star.style.color = 'var(--black)'; }
    } else {
      if (img) img.style.borderColor = 'var(--glass-border)';
      if (star) { star.style.background = 'var(--gray-400)'; star.style.color = 'var(--black)'; }
    }
  });
}

function getImagesFromModal() {
  const previews = document.getElementById('image-previews');
  const images = [];
  if (previews) {
    previews.querySelectorAll('[data-img-index] img').forEach(img => images.push(img.src));
  }
  const fileInput = document.getElementById('prod-images');
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    Array.from(fileInput.files).slice(0, 8 - images.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => images.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }
  return images;
}

function saveProduct(event, productId) {
  event.preventDefault();
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const originalPrice = Number(document.getElementById('prod-original').value);
  const salePrice = Number(document.getElementById('prod-sale').value) || originalPrice;
  const sku = document.getElementById('prod-sku').value.trim();
  const weight = document.getElementById('prod-weight').value.trim();
  const description = document.getElementById('prod-description').value.trim();
  const features = document.getElementById('prod-features').value.trim().split('\n').filter(Boolean);
  const ingredients = document.getElementById('prod-ingredients').value.trim();
  const usage = document.getElementById('prod-usage').value.trim();
  const saleStartInput = document.getElementById('prod-sale-start');
  const saleEndInput = document.getElementById('prod-sale-end');
  const saleStart = saleStartInput ? saleStartInput.value.trim() : '';
  const saleEnd = saleEndInput ? saleEndInput.value.trim() : '';
  if (!name || !originalPrice) { showToast('Name and price required', 'error'); return; }

  const doSave = (images) => {
    let products = [];
    try { if (typeof PRODUCTS !== 'undefined') products = JSON.parse(JSON.stringify(PRODUCTS)); } catch(e) { products = []; }
    const featuredImage = images.length > 0 ? images[0] : '';
    const productData = {
      id: productId || ('prod_' + Date.now()),
      name,
      category,
      originalPrice,
      salePrice,
      sku,
      weight,
      description,
      features,
      ingredients,
      usage,
      images,
      featuredImage,
      saleStart: saleStart || '',
      saleEnd: saleEnd || '',
      rating: 0,
      reviews: 0,
      badge: '',
      categorySlug: category.toLowerCase().replace(/\s+/g, '-')
    };
    if (productId) {
      const idx = products.findIndex(p => p.id === productId);
      if (idx > -1) {
        const existing = products[idx];
        productData.rating = existing.rating || 0;
        productData.reviews = existing.reviews || 0;
        productData.badge = existing.badge || '';
        productData.categorySlug = existing.categorySlug || productData.categorySlug;
        if (!productData.sku) productData.sku = existing.sku || '';
        if (!productData.weight) productData.weight = existing.weight || '';
        if (!productData.description) productData.description = existing.description || '';
        if (!productData.features || productData.features.length === 0) productData.features = existing.features || [];
        if (!productData.ingredients) productData.ingredients = existing.ingredients || '';
        if (!productData.usage) productData.usage = existing.usage || '';
        if (!productData.saleStart) productData.saleStart = existing.saleStart || '';
        if (!productData.saleEnd) productData.saleEnd = existing.saleEnd || '';
        if (images.length === 0) {
          productData.images = existing.images || [];
          productData.featuredImage = existing.featuredImage || existing.image || '';
        }
        products[idx] = productData;
      }
    } else {
      products.push(productData);
    }
    localStorage.setItem('adeProducts', JSON.stringify(products));
    try { if (typeof PRODUCTS !== 'undefined') PRODUCTS = products; } catch(e) {}
    showToast(productId ? 'Product updated' : 'Product created');
    closeAdminModal();
    renderProducts();
  };

  const fileInput = document.getElementById('prod-images');
  const previews = document.getElementById('image-previews');
  const existingImages = [];
  if (previews) {
    previews.querySelectorAll('[data-img-index] img').forEach(img => existingImages.push(img.src));
  }

  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    const newFiles = Array.from(fileInput.files).slice(0, 8 - existingImages.length);
    if (newFiles.length === 0) { doSave(existingImages); return; }
    let loaded = 0;
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        existingImages.push(e.target.result);
        loaded++;
        if (loaded === newFiles.length) doSave(existingImages);
      };
      reader.readAsDataURL(file);
    });
  } else {
    doSave(existingImages.length > 0 ? existingImages : getExistingImages(productId));
  }
}

function deleteProduct(productId) {
  if (!confirm('Delete this product?')) return;
  let products = [];
  try { if (typeof PRODUCTS !== 'undefined') products = JSON.parse(JSON.stringify(PRODUCTS)); } catch(e) { products = []; }
  products = products.filter(p => p.id !== productId);
  localStorage.setItem('adeProducts', JSON.stringify(products));
  try { if (typeof PRODUCTS !== 'undefined') PRODUCTS = products; } catch(e) {}
  showToast('Product deleted');
  renderProducts();
}

// ===== PRODUCTS =====
// ===== SALES CONTROL (ADMIN) =====
function toggleAdminGlobalSales() {
  ADMIN_STATE.globalSalesEnabled = !ADMIN_STATE.globalSalesEnabled;
  localStorage.setItem('adeSalesEnabled', JSON.stringify(ADMIN_STATE.globalSalesEnabled));
  renderProducts();
  showToast(ADMIN_STATE.globalSalesEnabled ? 'Global Sales ON' : 'Global Sales OFF');
}

function toggleAdminProductSale(productId) {
  const current = ADMIN_STATE.productSales[productId];
  if (current === undefined) ADMIN_STATE.productSales[productId] = false;
  else if (current === false) ADMIN_STATE.productSales[productId] = true;
  else delete ADMIN_STATE.productSales[productId];
  localStorage.setItem('adeProductSales', JSON.stringify(ADMIN_STATE.productSales));
  renderProducts();
  const p = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []).find(x => x.id === productId);
  const s = ADMIN_STATE.productSales[productId];
  showToast(`${p?.name||'Product'}: ${s===false?'Sale OFF':s===true?'Sale ON':'Default'}`, 'info');
}

function getAdminProductPrice(product) {
  if (!ADMIN_STATE.globalSalesEnabled) return product.originalPrice;
  const po = ADMIN_STATE.productSales[product.id];
  if (po !== undefined) return po ? (product.salePrice || product.originalPrice) : product.originalPrice;
  if (product.salePrice && product.salePrice < product.originalPrice && isSaleDateActive(product)) {
    return product.salePrice;
  }
  return product.originalPrice;
}

function isSaleDateActive(product) {
  if (!product.saleStart && !product.saleEnd) return true;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  if (product.saleStart && today < product.saleStart) return false;
  if (product.saleEnd && today > product.saleEnd) return false;
  return true;
}

function hasAdminSaleActive(product) {
  if (!ADMIN_STATE.globalSalesEnabled) return false;
  const po = ADMIN_STATE.productSales[product.id];
  if (po !== undefined) return po === true;
  if (!product.salePrice || product.salePrice >= product.originalPrice) return false;
  return isSaleDateActive(product);
}

// ===== PRODUCTS =====
function renderProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;
  
  let products = [];
  try {
    if (typeof PRODUCTS !== 'undefined') products = PRODUCTS;
  } catch(e) {}
  
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:60px;color:var(--gray-500)">No products found. Add your first product below.</td></tr><tr><td colspan="8" style="padding:12px 16px"><button class="btn btn-gold" onclick="openProductModal(\'\')" style="width:100%"><i class="fas fa-plus"></i> Add New Product</button></td></tr>';
    return;
  }
  
  // Global sales toggle row
  const globalToggle = `
    <tr style="background:rgba(255,105,180,0.05)">
      <td colspan="7" style="padding:12px 16px;border-bottom:2px solid rgba(255,105,180,0.2)">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          <span style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;color:var(--gray-500);font-weight:600">🌙 Global Sales Mode</span>
          <label class="toggle-switch" style="position:relative;width:48px;height:26px;cursor:pointer;display:inline-block">
            <input type="checkbox" ${ADMIN_STATE.globalSalesEnabled ? 'checked' : ''} onchange="toggleAdminGlobalSales()" style="opacity:0;width:0;height:0">
            <span style="position:absolute;inset:0;background:${ADMIN_STATE.globalSalesEnabled ? 'var(--pink-gradient)' : 'var(--gray-300)'};border-radius:999px;transition:var(--transition-fast);box-shadow:${ADMIN_STATE.globalSalesEnabled ? '0 0 15px rgba(255,105,180,0.3)' : 'none'}"></span>
            <span style="position:absolute;width:20px;height:20px;border-radius:50%;top:3px;left:3px;background:white;transition:var(--transition-fast);transform:translateX(${ADMIN_STATE.globalSalesEnabled ? '22px' : '0'});box-shadow:0 2px 4px rgba(0,0,0,0.2)"></span>
          </label>
          <span style="font-size:0.75rem;color:${ADMIN_STATE.globalSalesEnabled ? 'var(--pink)' : 'var(--gray-500)'}">${ADMIN_STATE.globalSalesEnabled ? 'ON — All discounts active' : 'OFF — Original prices shown'}</span>
        </div>
      </td>
    </tr>
  `;
  
  const addRow = `
    <tr>
      <td colspan="7" style="padding:12px 16px">
        <button class="btn btn-primary" onclick="openProductModal('')" style="width:100%">
          <i class="fas fa-plus"></i> Add New Product
        </button>
      </td>
    </tr>
  `;
  
  tbody.innerHTML = globalToggle + (products.length === 0 ? '' : addRow) + products.map(p => {
    const saleActive = hasAdminSaleActive(p);
    const po = ADMIN_STATE.productSales[p.id];
    const effectiveSalePrice = getAdminProductPrice(p);
    const checked = po === true || (po === undefined && saleActive);
    const imgCount = p.images ? p.images.length : (p.image ? 1 : 0);
    return `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:48px;height:48px;border-radius:8px;background:var(--black-elevated);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
            ${(p.images && p.images[0]) || p.image ? `<img src="${(p.images && p.images[0]) || p.image}" style="width:100%;height:100%;object-fit:cover">` : '<i class="fas fa-box" style="color:var(--gold);font-size:1rem"></i>'}
          </div>
          <div>
            <div>${p.name}</div>
            ${imgCount > 1 ? `<div style="font-size:0.7rem;color:var(--gray-500)"><i class="fas fa-images"></i> ${imgCount} images</div>` : ''}
            ${p.sku ? `<div style="font-size:0.7rem;color:var(--gray-500)">${p.sku}</div>` : ''}
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td>${p.weight || '-'}</td>
      <td>${formatPrice(p.originalPrice)}</td>
      <td style="color:var(--gold);font-weight:600">${formatPrice(effectiveSalePrice)}</td>
      <td>
        <label class="toggle-switch" style="position:relative;width:48px;height:26px;cursor:pointer;display:inline-block">
          <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleAdminProductSale('${p.id}')" style="opacity:0;width:0;height:0">
          <span style="position:absolute;inset:0;background:${checked ? 'var(--pink-gradient)' : 'var(--gray-300)'};border-radius:999px;transition:var(--transition-fast);box-shadow:${checked ? '0 0 15px rgba(255,105,180,0.3)' : 'none'}"></span>
          <span style="position:absolute;width:20px;height:20px;border-radius:50%;top:3px;left:3px;background:white;transition:var(--transition-fast);transform:translateX(${checked ? '22px' : '0'});box-shadow:0 2px 4px rgba(0,0,0,0.2)"></span>
        </label>
        ${p.saleStart || p.saleEnd ? `<div style="font-size:0.65rem;color:var(--gray-500);margin-top:2px">${p.saleStart || '...'} → ${p.saleEnd || '...'}</div>` : ''}
      </td>
      <td>
        <button class="btn btn-gold btn-sm" onclick="openProductModal('${p.id}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `}).join('');
}

// ===== CUSTOMERS =====
function renderCustomers() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  
  const orders = ADMIN_STATE.orders;
  const customerMap = new Map();
  
  orders.forEach(o => {
    const phone = o.customer.phone;
    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        name: o.customer.name,
        phone: phone,
        orders: [],
        totalSpent: 0
      });
    }
    const c = customerMap.get(phone);
    c.orders.push(o.orderNumber);
    c.totalSpent += o.total;
  });
  
  const customers = Array.from(customerMap.values());
  
  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:60px;color:var(--gray-500)">No customers yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = customers.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.orders.length}</td>
      <td style="color:var(--gold);font-weight:600">${formatPrice(c.totalSpent)}</td>
    </tr>
  `).join('');
}

// ===== ADMINS (Super Admin Only) =====
function renderAdmins() {
  const tbody = document.getElementById('admins-table-body');
  if (!tbody) return;
  
  const admins = ADMIN_STATE.admins;
  
  tbody.innerHTML = admins.map(a => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--gold-gradient);color:var(--black);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem">
            ${(a.username || a.email).slice(0,2).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:600;color:var(--white);font-size:0.85rem">${a.username || a.email}</div>
            <div style="font-size:0.7rem;color:var(--gray-500)">${a.email}</div>
          </div>
        </div>
      </td>
      <td><span class="status-badge ${a.role === 'superadmin' ? 'status-delivered' : 'status-processing'}">${a.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span></td>
      <td>
        ${ADMIN_STATE.isSuperAdmin && a.role !== 'superadmin' ? `
          <select onchange="toggleAdminStatusFromSelect('${a.email}', this.value)" style="background:var(--glass-bg);color:var(--white);border:1px solid var(--glass-border);border-radius:6px;padding:4px 8px;font-size:0.75rem;cursor:pointer">
            <option value="active" ${a.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="suspended" ${a.status === 'suspended' ? 'selected' : ''}>Suspended</option>
          </select>
        ` : `<span class="status-badge ${a.status === 'active' ? 'status-approved' : 'status-cancelled'}">${a.status}</span>`}
      </td>
      <td>
        ${ADMIN_STATE.isSuperAdmin && a.role !== 'superadmin' ? `
          <button class="btn btn-ghost btn-sm" onclick="toggleAdminStatus('${a.email}')" title="Toggle Status">
            <i class="fas ${a.status === 'active' ? 'fa-ban' : 'fa-check'}"></i>
          </button>
          <button class="btn btn-primary btn-sm" onclick="openResetPasswordModal('${a.email}')" title="Reset Password">
            <i class="fas fa-key"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteAdmin('${a.email}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        ` : ADMIN_STATE.isSuperAdmin && a.role === 'superadmin' && a.email === ADMIN_STATE.currentAdmin?.email ? `
          <span style="font-size:0.75rem;color:var(--gold)">You</span>
        ` : '-'}
      </td>
    </tr>
  `).join('');
  
  // Show/hide add admin form for super admin
  const addForm = document.getElementById('add-admin-form');
  if (addForm) {
    addForm.style.display = ADMIN_STATE.isSuperAdmin ? 'block' : 'none';
  }
}

function addAdmin() {
  if (!ADMIN_STATE.isSuperAdmin) {
    showToast('Only Super Admin can add admins', 'error');
    return;
  }
  if (ADMIN_STATE.admins.filter(a => a.status === 'active').length >= 5) {
    showToast('Maximum 5 admins allowed', 'error');
    return;
  }

  const usernameInput = document.getElementById('new-admin-username');
  const emailInput = document.getElementById('new-admin-email');
  const passwordInput = document.getElementById('new-admin-password');
  const roleInput = document.getElementById('new-admin-role');

  if (!usernameInput || !emailInput || !passwordInput || !roleInput) return;

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleInput.value;

  if (!username || !email || !password) {
    showToast('Please fill all fields', 'error');
    return;
  }
  if (!email.endsWith('@gmail.com')) {
    showToast('Only Gmail addresses allowed', 'error');
    return;
  }
  if (ADMIN_STATE.admins.find(a => a.email === email)) {
    showToast('Admin already exists', 'error');
    return;
  }
  if (role === 'superadmin' && ADMIN_STATE.admins.some(a => a.role === 'superadmin' && a.status === 'active')) {
    showToast('Only one super admin allowed', 'error');
    return;
  }

  ADMIN_STATE.admins.push({
    username,
    email,
    password,
    role,
    status: 'active'
  });

  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  usernameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';

  showToast('Admin added successfully');
  renderAdmins();
}

function toggleAdminStatus(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (email === ADMIN_STATE.currentAdmin?.email) return;
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  admin.status = admin.status === 'active' ? 'suspended' : 'active';
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast(`Admin ${admin.status === 'active' ? 'activated' : 'suspended'}`);
  renderAdmins();
}

function toggleAdminStatusFromSelect(email, newStatus) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (email === ADMIN_STATE.currentAdmin?.email) return;
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  admin.status = newStatus;
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast(`Admin ${newStatus === 'active' ? 'activated' : 'suspended'}`);
  renderAdmins();
}

function deleteAdmin(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (email === ADMIN_STATE.currentAdmin?.email) return;
  
  if (!confirm('Are you sure you want to permanently delete this admin?')) return;
  
  ADMIN_STATE.admins = ADMIN_STATE.admins.filter(a => a.email !== email);
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast('Admin deleted permanently');
  renderAdmins();
}

function promoteAdmin(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (email === ADMIN_STATE.currentAdmin?.email) return;
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  if (admin.role === 'superadmin') {
    showToast('Already a Super Admin', 'info');
    return;
  }
  
  if (!confirm(`Promote ${admin.username || admin.email} to Super Admin?\n\nYou will be demoted to Admin and redirected to the regular dashboard.`)) return;
  
  const currentSuper = ADMIN_STATE.currentAdmin;
  currentSuper.role = 'admin';
  admin.role = 'superadmin';
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast(`${admin.username || admin.email} is now Super Admin. You have been demoted to Admin.`);
  window.location.href = 'dashboard.html';
}

function demoteAdmin(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (email === ADMIN_STATE.currentAdmin?.email) return;
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  if (admin.role === 'admin') {
    showToast('Already an Admin', 'info');
    return;
  }
  
  if (!confirm(`Demote ${admin.username || admin.email} to Admin?`)) return;
  
  admin.role = 'admin';
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast(`${admin.username || admin.email} demoted to Admin`);
  renderAdmins();
}

function openResetPasswordModal(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  
  const modal = document.getElementById('admin-modal');
  const content = document.getElementById('admin-modal-content');
  if (!modal || !content) return;
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  content.innerHTML = `
    <button class="modal-close" onclick="closeAdminModal()"><i class="fas fa-times"></i></button>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:20px">Reset Password</h3>
    <p style="color:var(--gray-500);margin-bottom:20px;font-size:0.9rem">
      Resetting password for: <strong style="color:var(--white)">${admin.username || admin.email}</strong>
    </p>
    <form onsubmit="resetAdminPassword(event, '${email}')">
      <div class="form-group">
        <label class="form-label">New Password</label>
        <input type="text" class="form-input" id="reset-password" placeholder="Enter new password" required minlength="4">
      </div>
      <button type="submit" class="btn btn-gold" style="width:100%">
        <i class="fas fa-key"></i> Reset Password
      </button>
    </form>
  `;
  
  modal.classList.add('active');
}

function resetAdminPassword(event, email) {
  event.preventDefault();
  
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  
  const newPassword = document.getElementById('reset-password').value.trim();
  if (!newPassword || newPassword.length < 4) {
    showToast('Password must be at least 4 characters', 'error');
    return;
  }
  
  admin.password = newPassword;
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  
  showToast(`Password reset for ${admin.username || admin.email}`);
  closeAdminModal();
  renderAdmins();
}

// ===== SETTINGS =====
function renderSettings() {
  const container = document.getElementById('tab-settings');
  if (!container) return;

  if (!ADMIN_STATE.isSuperAdmin) {
    container.innerHTML = `
      <div class="glass-card" style="text-align:center;padding:60px">
        <i class="fas fa-lock" style="font-size:3rem;color:var(--gray-500);margin-bottom:16px;display:block"></i>
        <h3 style="font-family:var(--font-sans);color:var(--gray-500);font-size:1rem">Settings restricted to Super Admin</h3>
      </div>
    `;
    return;
  }

  const settings = JSON.parse(localStorage.getItem('adeSettings') || '{}');

  const fields = [
    { id: 'setting-bank-name', placeholder: 'GTBank', value: settings.bankName || '' },
    { id: 'setting-account-name', placeholder: 'ADE Natural Cereals', value: settings.accountName || '' },
    { id: 'setting-account-number', placeholder: '0123 456 7890', value: settings.accountNumber || '' },
    { id: 'setting-whatsapp', placeholder: '2348012345678', value: settings.whatsapp || '' },
    { id: 'setting-instagram', placeholder: 'https://instagram.com/adenaturalcereals', value: settings.instagram || '' },
    { id: 'setting-facebook', placeholder: 'https://facebook.com/adenaturalcereals', value: settings.facebook || '' },
    { id: 'setting-twitter', placeholder: 'https://x.com/adenaturalcereals', value: settings.twitter || '' },
    { id: 'setting-tiktok', placeholder: 'https://tiktok.com/@adenaturalcereals', value: settings.tiktok || '' },
    { id: 'setting-contact-email', placeholder: 'adenaturalcereals@gmail.com', value: settings.contactEmail || '' },
    { id: 'setting-contact-phone', placeholder: '2348012345678', value: settings.contactPhone || '' },
    { id: 'setting-contact-address', placeholder: 'Lagos, Nigeria', value: settings.contactAddress || '' }
  ];

  container.innerHTML = `
    <div class="glass-card">
      <h3>Website Settings</h3>
      <div class="form-row">
        ${fields.slice(0,2).map(f => `
          <div class="form-group">
            <label>${f.id.replace('setting-','').replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
            <input type="text" id="${f.id}" placeholder="${f.placeholder}" value="${f.value}">
          </div>
        `).join('')}
      </div>
      ${fields.slice(2,4).map(f => `
        <div class="form-group">
          <label>${f.id.replace('setting-','').replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
          <input type="text" id="${f.id}" placeholder="${f.placeholder}" value="${f.value}">
        </div>
      `).join('')}
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin:24px 0 12px;color:var(--gold)">Social Media</h4>
      <div class="form-row">
        ${fields.slice(4,10,2).map(f => `
          <div class="form-group">
            <label>${f.id.replace('setting-','').replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
            <input type="text" id="${f.id}" placeholder="${f.placeholder}" value="${f.value}">
          </div>
        `).join('')}
      </div>
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;margin:24px 0 12px;color:var(--gold)">Contact</h4>
      ${fields.slice(10).map(f => `
        <div class="form-group">
          <label>${f.id.replace('setting-','').replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
          <input type="text" id="${f.id}" placeholder="${f.placeholder}" value="${f.value}">
        </div>
      `).join('')}
      <button class="btn btn-gold" onclick="saveSettings()"><i class="fas fa-save"></i> Save Settings</button>
    </div>
  `;
}

function saveSettings() {
  const settings = {
    bankName: document.getElementById('setting-bank-name')?.value || '',
    accountName: document.getElementById('setting-account-name')?.value || '',
    accountNumber: document.getElementById('setting-account-number')?.value || '',
    whatsapp: document.getElementById('setting-whatsapp')?.value || '',
    instagram: document.getElementById('setting-instagram')?.value || '',
    facebook: document.getElementById('setting-facebook')?.value || '',
    twitter: document.getElementById('setting-twitter')?.value || '',
    tiktok: document.getElementById('setting-tiktok')?.value || '',
    contactEmail: document.getElementById('setting-contact-email')?.value || '',
    contactPhone: document.getElementById('setting-contact-phone')?.value || '',
    contactAddress: document.getElementById('setting-contact-address')?.value || ''
  };
  localStorage.setItem('adeSettings', JSON.stringify(settings));
  showToast('Settings saved successfully');
}

// ===== ANALYTICS =====
function renderAnalytics() {
  const container = document.getElementById('tab-analytics');
  if (!container) return;

  const rangeVal = parseInt(document.getElementById('analytics-range')?.value || '30', 10);
  const now = Date.now();
  const cutoff = now - rangeVal * 24 * 60 * 60 * 1000;
  const orders = (ADMIN_STATE.orders || []).filter(o => new Date(o.date || o.orderNumber).getTime() >= cutoff && o.status !== 'cancelled');

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const uniqueCustomers = new Set(orders.map(o => o.customer?.phone).filter(Boolean)).size;

  const revenueEl = document.getElementById('analytics-revenue');
  const ordersEl = document.getElementById('analytics-orders');
  const avgEl = document.getElementById('analytics-avg');
  const customersEl = document.getElementById('analytics-customers');
  if (revenueEl) revenueEl.textContent = formatPrice(totalRevenue);
  if (ordersEl) ordersEl.textContent = totalOrders;
  if (avgEl) avgEl.textContent = formatPrice(avgOrder);
  if (customersEl) customersEl.textContent = uniqueCustomers;

  renderAnalyticsChart(orders, cutoff, now);
  renderAnalyticsCategories(orders);
  renderAnalyticsRecent(orders);
}

function renderAnalyticsChart(orders, cutoff, now) {
  const chartEl = document.getElementById('analytics-chart');
  if (!chartEl) return;

  const buckets = 30;
  const step = (now - cutoff) / buckets;
  const values = new Array(buckets).fill(0);
  orders.forEach(o => {
    const ts = new Date(o.date || o.orderNumber).getTime();
    const idx = Math.min(buckets - 1, Math.max(0, Math.floor((ts - cutoff) / step)));
    values[idx] += o.total || 0;
  });
  const max = Math.max(...values, 1);

  chartEl.innerHTML = values.map(v => {
    const h = Math.max(3, Math.round((v / max) * 180));
    return `<div style="flex:1;min-width:8px;height:${h}px;background:linear-gradient(180deg, var(--pink-gradient), rgba(255,105,180,0.2));border-radius:3px 3px 0 0;transition:height 0.4s ease"></div>`;
  }).join('');
}

function renderAnalyticsCategories(orders) {
  const el = document.getElementById('analytics-categories');
  if (!el) return;
  const map = {};
  orders.forEach(o => {
    o.items.forEach(it => {
      const cat = it.category || 'Other';
      map[cat] = (map[cat] || 0) + (it.price * it.quantity);
    });
  });
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;
  if (sorted.length === 0) {
    el.innerHTML = '<p style="color:var(--gray-500);padding:20px 0">No category data yet</p>';
    return;
  }
  el.innerHTML = sorted.map(([cat, val]) => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px">
        <span style="color:var(--white)">${cat}</span>
        <span style="color:var(--gold)">${formatPrice(val)}</span>
      </div>
      <div style="height:6px;background:var(--glass-bg);border-radius:50px;overflow:hidden">
        <div style="width:${Math.round((val/max)*100)}%;height:100%;background:linear-gradient(90deg, #FF69B4, #D4AF37);border-radius:50px"></div>
      </div>
    </div>
  `).join('');
}

function renderAnalyticsRecent(orders) {
  const el = document.getElementById('analytics-recent');
  if (!el) return;
  const recent = orders.slice().sort((a, b) => new Date(b.date || b.orderNumber) - new Date(a.date || a.orderNumber)).slice(0, 20);
  if (recent.length === 0) {
    el.innerHTML = '<p style="color:var(--gray-500);padding:20px 0">No transactions yet</p>';
    return;
  }
  el.innerHTML = recent.map(o => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--glass-border)">
      <div>
        <div style="font-size:0.8rem;color:var(--white);font-weight:600">${o.orderNumber}</div>
        <div style="font-size:0.7rem;color:var(--gray-500)">${o.customer?.name || 'Guest'} · ${new Date(o.date || o.orderNumber).toLocaleDateString()}</div>
      </div>
      <div style="font-family:var(--font-display);color:var(--gold);font-weight:700">${formatPrice(o.total)}</div>
    </div>
  `).join('');
}

function exportAnalyticsCSV() {
  const orders = ADMIN_STATE.orders || [];
  if (!orders.length) { showToast('No data to export', 'error'); return; }
  const header = 'Order,Customer,Phone,Total,Date,Status\n';
  const rows = orders.map(o => `${o.orderNumber},"${o.customer?.name || ''}",${o.customer?.phone || ''},${o.total},${o.date || o.orderNumber},${o.status}`);
  const csv = header + rows.join('\n');
  downloadBlob(csv, `ade-analytics-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
  showToast('CSV exported');
}

function exportAnalyticsJSON() {
  const data = { exportedAt: new Date().toISOString(), orders: ADMIN_STATE.orders || [] };
  downloadBlob(JSON.stringify(data, null, 2), `ade-analytics-${new Date().toISOString().slice(0,10)}.json`, 'application/json');
  showToast('JSON exported');
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== LOGOUT =====
function logoutAdmin() {
  window.location.href = '../index.html';
}
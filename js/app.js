// ============================================
// ADE NATURAL CEREALS - MAIN APPLICATION
// Navigation, Cart, Checkout, Search, Filters
// ============================================

// ===== STATE MANAGEMENT =====
const STATE = {
  currentPage: 'home',
  cart: JSON.parse(localStorage.getItem('adeCart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('adeWishlist') || '[]'),
  orders: JSON.parse(localStorage.getItem('adeOrders') || '[]'),
  currentProduct: null,
  checkoutStep: 1,
  isAuthenticated: false,
  currentUser: null,
  admins: JSON.parse(localStorage.getItem('adeAdmins') || JSON.stringify([
    { email: 'superadmin@ade.com', name: 'Super Admin', role: 'superadmin', status: 'active' },
    { email: 'admin1@ade.com', name: 'Admin One', role: 'admin', status: 'active' },
    { email: 'admin2@ade.com', name: 'Admin Two', role: 'admin', status: 'active' },
    { email: 'admin3@ade.com', name: 'Admin Three', role: 'admin', status: 'active' },
    { email: 'admin4@ade.com', name: 'Admin Four', role: 'admin', status: 'active' }
  ])),
  // Sales Toggle
  salesEnabled: JSON.parse(localStorage.getItem('adeSalesEnabled') || 'true'),
  productSales: JSON.parse(localStorage.getItem('adeProductSales') || '{}'),
  currentFilter: null
};

// ===== DOM REFERENCES =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return '₦' + price.toLocaleString();
}

function getDiscountPercent(original, sale) {
  return Math.round(((original - sale) / original) * 100);
}

function generateOrderNumber() {
  return 'ADE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

// ===== RENDER HELPERS =====
function reRenderProducts() {
  if (STATE.currentPage === 'home') { renderFeaturedProducts(); renderBestSellers(); }
  if (STATE.currentPage === 'shop') renderShop(STATE.currentFilter || document.querySelector('.filter-btn.active')?.dataset?.filter);
}

function getStarsHTML(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars += '<i class="fas fa-star"></i>';
    else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
    else stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

function showToast(message, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;
  
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
}

function saveCart() {
  localStorage.setItem('adeCart', JSON.stringify(STATE.cart));
  updateCartCount();
  updateCartSidebar();
}

function updateCartCount() {
  const count = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ===== NAVIGATION =====
function navigateTo(page, data = null) {
  const allPages = document.querySelectorAll('.page-content');
  const currentPage = Array.from(allPages).find(p => p.classList.contains('active'));
  const targetEl = document.getElementById(`page-${page}`);
  
  if (currentPage && targetEl && currentPage !== targetEl && typeof gsap !== 'undefined') {
    gsap.to(currentPage, {
      opacity: 0,
      y: -16,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        currentPage.classList.remove('active');
        gsap.set(currentPage, { opacity: 1, y: 0 });
        showPage(targetEl, page, data);
      }
    });
  } else if (targetEl) {
    if (currentPage) currentPage.classList.remove('active');
    showPage(targetEl, page, data);
  }
  
  closeCart();
}

function showPage(targetEl, page, data) {
  targetEl.classList.add('active');
  STATE.currentPage = page;
  
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  
  closeMobileMenu();
  renderPage(page, data);
  
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(targetEl, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPage(page, data) {
  switch (page) {
    case 'home': renderHome(); break;
    case 'shop': renderShop(data); break;
    case 'product': renderProductDetail(data); break;
    case 'cart': renderCartPage(); break;
    case 'checkout': renderCheckout(); break;
    case 'about': renderAbout(); break;
    case 'contact': renderContact(); break;
    case 'faq': renderFAQ(); break;
    case 'reviews': renderReviews(); break;
  }
  observeAnimations();
}

// ===== RENDER HOME =====
function renderHome() {
  renderFeaturedProducts();
  renderCategories();
  renderBestSellers();
  renderTestimonials();
  renderBeforeAfter();
}

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="glass-card category-card fade-up" onclick="navigateTo('shop', '${cat.slug}')">
      <div class="category-icon">
        <i class="fas ${cat.icon}"></i>
      </div>
      <h3>${cat.name}</h3>
      <p>${cat.count} Products</p>
    </div>
  `).join('');
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  const featured = PRODUCTS.slice(0, 4);
  grid.innerHTML = featured.map(product => renderProductCard(product)).join('');
}

function renderBestSellers() {
  const grid = document.getElementById('best-sellers');
  if (!grid) return;
  const bestSellers = PRODUCTS.filter(p => p.badge === 'best-seller').slice(0, 4);
  grid.innerHTML = bestSellers.map(product => renderProductCard(product)).join('');
}

function renderProductCard(product) {
  const hasSale = product.salePrice && product.salePrice < product.originalPrice;
  const currentPrice = hasSale ? product.salePrice : product.originalPrice;

  return `
    <div class="product-card fade-up">
      <span class="product-badge ${hasSale ? 'badge-sale' : product.badge === 'best-seller' ? 'badge-best-seller' : 'badge-new'}">
        ${hasSale ? `-${getDiscountPercent(product.originalPrice, product.salePrice)}%` : product.badge === 'best-seller' ? 'Best Seller' : product.badge === 'new' ? 'New' : product.badge || ''}
      </span>
      <div class="product-img" onclick="navigateTo('product', '${product.id}')">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <i class="fas fa-star"></i> ${product.rating} <span>(${product.reviews})</span>
        </div>
        <div class="product-price">
          ${hasSale 
            ? `<span class="price-current">${formatPrice(product.salePrice)}</span><span class="price-original">${formatPrice(product.originalPrice)}</span><span class="discount-badge-text">-${getDiscountPercent(product.originalPrice, product.salePrice)}%</span>`
            : `<span class="price-current">${formatPrice(currentPrice)}</span>`
          }
        </div>
        <div class="product-actions">
          <button class="btn btn-pink btn-sm" onclick="addToCart('${product.id}')">
            <i class="fas fa-shopping-bag"></i> Add
          </button>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('product', '${product.id}')">
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="swiper-slide">
      <div class="glass-card testimonial-card fade-up" data-aos="fade-up" data-aos-delay="0">
        <div class="testimonial-quote">"</div>
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.avatar}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <span class="testimonial-role">${t.role}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBeforeAfter() {
  const container = document.getElementById('before-after-container');
  if (!container) return;

  container.innerHTML = BEFORE_AFTER.map(ba => `
    <div class="swiper-slide">
      <div class="glass-card before-after-card fade-up" data-aos="fade-up" data-aos-delay="0">
        <div class="before">
          <div class="product-placeholder" style="height:100%">
            <div style="text-align:center">
              <div style="font-size:2rem;margin-bottom:8px;opacity:0.5">Before</div>
              <div style="font-size:0.8rem;opacity:0.3">${ba.name}</div>
            </div>
          </div>
        </div>
        <div class="after">
          <div class="product-placeholder" style="height:100%">
            <div style="text-align:center">
              <div style="font-size:2rem;margin-bottom:8px;opacity:0.5">After</div>
              <div style="font-size:0.8rem;opacity:0.3">${ba.result}</div>
            </div>
          </div>
        </div>
        <span class="before-after-label before-label">Before</span>
        <span class="before-after-label after-label">After</span>
      </div>
    </div>
  `).join('');
}

// ===== RENDER SHOP =====
function renderShop(filter) {
  const grid = document.getElementById('shop-products');
  if (!grid) return;
  
  let filtered = PRODUCTS;
  if (filter && filter !== 'all') {
    filtered = PRODUCTS.filter(p => p.categorySlug === filter);
  }
  STATE.currentFilter = filter || 'all';
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === (filter || 'all'));
  });
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px">
        <div style="font-size:4rem;margin-bottom:16px;opacity:0.3">🔍</div>
        <h3 style="color:var(--gray-500);font-family:var(--font-sans);font-size:1.1rem">No products found</h3>
        <p style="color:var(--gray-400);font-size:0.85rem;margin-top:8px">Try a different category</p>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filtered.map(product => renderProductCard(product)).join('');
  
  const countEl = document.getElementById('product-count');
  if (countEl) countEl.textContent = `${filtered.length} products`;
}

// ===== RENDER PRODUCT DETAIL =====
function renderProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  STATE.currentProduct = product;
  const container = document.getElementById('product-detail-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-image fade-in">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info fade-up">
        <span class="category-tag">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="product-rating" style="margin-bottom:16px">
          <span class="stars">${getStarsHTML(product.rating)}</span>
          <span class="rating-count">(${product.reviews} reviews)</span>
        </div>
        <div class="product-detail-price">
          <span class="current-price" style="font-size:2rem">${formatPrice(product.salePrice && product.salePrice < product.originalPrice ? product.salePrice : product.originalPrice)}</span>
          ${product.salePrice && product.salePrice < product.originalPrice ? `<span class="original-price" style="font-size:1rem">${formatPrice(product.originalPrice)}</span><span class="discount" style="margin-left:8px">-${getDiscountPercent(product.originalPrice, product.salePrice)}%</span>` : ''}
        </div>
        <p class="product-detail-description">${product.description}</p>
        
        ${product.sku ? `<div style="margin-bottom:16px;display:flex;align-items:center;gap:8px;font-size:0.75rem;color:var(--gray-500)"><i class="fas fa-barcode"></i> SKU: <strong style="color:var(--white)">${product.sku}</strong></div>` : ''}
         ${product.weight ? `<div style="margin-bottom:16px;display:flex;align-items:center;gap:8px;font-size:0.85rem;color:var(--gray-500)"><i class="fas fa-weight-hanging"></i> <span>${product.weight}</span></div>` : ''}
        
        <div style="margin-bottom:24px">
          <h4 style="font-family:var(--font-sans);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:12px">Benefits</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${(product.features && product.features.length ? product.features : (product.benefits || [])).map(b => `
              <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--gray-500)">
                <i class="fas fa-check-circle" style="color:var(--gold);font-size:0.8rem"></i>
                ${b}
              </div>
            `).join('')}
          </div>
        </div>
        
        ${product.ingredients ? `<div style="margin-bottom:24px"><h4 style="font-family:var(--font-sans);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:12px">Key Ingredients</h4><p style="color:var(--gray-400);font-size:0.9rem;line-height:1.6">${product.ingredients}</p></div>` : ''}
        ${product.usage ? `<div style="margin-bottom:24px"><h4 style="font-family:var(--font-sans);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:12px">Usage Instructions</h4><p style="color:var(--gray-400);font-size:0.9rem;line-height:1.6">${product.usage}</p></div>` : ''}
        
        <div class="product-detail-actions">
          <div class="quantity-selector">
            <button onclick="changeDetailQty(-1)">-</button>
            <span id="detail-qty">1</span>
            <button onclick="changeDetailQty(1)">+</button>
          </div>
          <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail()" style="flex:1">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
          <button class="btn btn-pink btn-lg" onclick="buyNow()">
            <i class="fas fa-bolt"></i> Buy Now
          </button>
        </div>
        
        <div style="margin-top:32px">
          <h4 style="font-family:var(--font-sans);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:16px">Share this product</h4>
          <div style="display:flex;gap:12px">
            <a href="#" style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;color:var(--gray-500);transition:var(--transition-smooth)" onclick="shareProduct('facebook');return false"><i class="fab fa-facebook-f"></i></a>
            <a href="#" style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;color:var(--gray-500);transition:var(--transition-smooth)" onclick="shareProduct('twitter');return false"><i class="fab fa-twitter"></i></a>
            <a href="#" style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;color:var(--gray-500);transition:var(--transition-smooth)" onclick="shareProduct('whatsapp');return false"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </div>
    
    <div style="margin-top:60px">
      <h3 class="section-title" style="text-align:center;font-size:2rem">Related Products</h3>
      <p class="section-subtitle" style="text-align:center;margin-bottom:40px">You might also like</p>
      <div class="products-grid" id="related-products"></div>
    </div>
  `;
  
  const related = document.getElementById('related-products');
  if (related) {
    const relatedProducts = PRODUCTS.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
    related.innerHTML = relatedProducts.map(p => renderProductCard(p)).join('');
  }
}

let detailQty = 1;

function changeDetailQty(change) {
  detailQty = Math.max(1, detailQty + change);
  const el = document.getElementById('detail-qty');
  if (el) el.textContent = detailQty;
}

function addToCartFromDetail() {
  if (STATE.currentProduct) {
    addToCart(STATE.currentProduct.id, detailQty);
    detailQty = 1;
    const el = document.getElementById('detail-qty');
    if (el) el.textContent = '1';
  }
}

function buyNow() {
  if (STATE.currentProduct) {
    addToCart(STATE.currentProduct.id, detailQty);
    detailQty = 1;
    const el = document.getElementById('detail-qty');
    if (el) el.textContent = '1';
    navigateTo('checkout');
  }
}

// ===== CART FUNCTIONS =====
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const price = product.salePrice && product.salePrice < product.originalPrice ? product.salePrice : product.originalPrice;
  const existing = STATE.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    STATE.cart.push({
      id: product.id,
      name: product.name,
      price: price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: quantity
    });
  }
  
  saveCart();
  showToast(`${product.name} added to cart!`);
  openCart();
}

function removeFromCart(productId) {
  STATE.cart = STATE.cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removed from cart');
}

function updateCartQuantity(productId, change) {
  const item = STATE.cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) { removeFromCart(productId); return; }
  saveCart();
}

function getCartTotal() {
  return STATE.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ===== CART SIDEBAR =====
function openCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function updateCartSidebar() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if (!container) return;
  
  if (STATE.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 0">
        <div style="font-size:4rem;margin-bottom:16px;opacity:0.3">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }
  
  if (footer) footer.style.display = 'block';
  
  container.innerHTML = STATE.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="quantity-control" style="margin-top:8px">
          <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
      <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:var(--gray-400);cursor:pointer;font-size:1.1rem;padding:4px;transition:var(--transition-fast);align-self:flex-start" onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='var(--gray-400)'">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
  
  const total = document.getElementById('cart-total-amount');
  if (total) total.textContent = formatPrice(getCartTotal());
}

// ===== CART PAGE =====
function renderCartPage() {
  const container = document.getElementById('cart-page-container');
  if (!container) return;
  if (STATE.cart.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:60px 20px"><div style="font-size:5rem;margin-bottom:16px;opacity:0.3">🛒</div><h2 style="font-family:var(--font-serif);font-size:1.5rem;color:var(--gray-500);margin-bottom:8px">Your cart is empty</h2><p style="color:var(--gray-400);margin-bottom:24px">Looks like you haven't added anything yet</p><button class="btn btn-primary" onclick="navigateTo('shop')"><i class="fas fa-shopping-bag"></i> Start Shopping</button></div>`;
    return;
  }
  
  let subtotal = 0;
  container.innerHTML = `
    <div style="max-width:800px;margin:0 auto">
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:32px">Shopping Cart</h2>
      ${STATE.cart.map(item => { subtotal += item.price * item.quantity; return `
        <div class="glass-card" style="display:flex;align-items:center;gap:20px;padding:20px;margin-bottom:16px">
          <div style="width:80px;height:80px;border-radius:12px;background:var(--black-elevated);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">
            <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover">
          </div>
          <div style="flex:1">
            <h4 style="font-size:0.95rem;color:var(--white);margin-bottom:4px">${item.name}</h4>
            <div style="color:var(--pink);font-weight:600">${formatPrice(item.price)}</div>
          </div>
          <div class="quantity-control">
            <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
            <input type="text" value="${item.quantity}" readonly>
            <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
          </div>
          <div style="font-family:var(--font-display);font-size:1.2rem;color:var(--pink);font-weight:700;min-width:80px;text-align:right">
            ${formatPrice(item.price * item.quantity)}
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:var(--gray-400);cursor:pointer;padding:8px;transition:var(--transition-smooth);font-size:1.1rem" onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='var(--gray-400)'"><i class="fas fa-times"></i></button>
        </div>`; }).join('')}
      
      <div class="glass-card" style="padding:32px;margin-top:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h3 style="font-size:1rem;text-transform:uppercase;letter-spacing:2px;color:var(--white)">Total</h3>
          <span style="font-family:var(--font-display);font-size:2rem;font-weight:700;background:var(--pink-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${formatPrice(subtotal)}</span>
        </div>
        <div style="display:flex;gap:16px">
          <button class="btn btn-secondary" style="flex:1" onclick="navigateTo('shop')"><i class="fas fa-arrow-left"></i> Continue</button>
          <button class="btn btn-primary" style="flex:2" onclick="navigateTo('checkout')"><i class="fas fa-lock"></i> Checkout</button>
        </div>
      </div>
    </div>
  `;
}

// ===== CHECKOUT =====
function renderCheckout() {
  if (STATE.cart.length === 0) { navigateTo('shop'); showToast('Add some products first', 'error'); return; }
  STATE.checkoutStep = 1;
  updateCheckoutView();
}

let checkoutData = { name: '', phone: '', address: '', state: '', city: '', senderName: '', amountSent: '', transferTime: '', screenshot: null };

function updateCheckoutView() {
  const container = document.getElementById('checkout-container');
  if (!container) return;
  
  let html = `<div class="checkout-steps">${[1,2,3,4].map(step => `
    <div class="checkout-step ${step < STATE.checkoutStep ? 'completed' : step === STATE.checkoutStep ? 'active' : ''}">${step < STATE.checkoutStep ? '<i class="fas fa-check"></i>' : step}</div>
    ${step < 4 ? `<div class="checkout-line ${step < STATE.checkoutStep ? 'completed' : ''}"></div>` : ''}
  `).join('')}</div><div class="checkout-form">`;
  
  if (STATE.checkoutStep === 1) {
    html += `<h3 class="checkout-form-title">Delivery Information</h3>
      <div class="form-group"><label class="form-label">Full Name *</label><input class="form-input" type="text" id="checkout-name" placeholder="Enter your full name" value="${checkoutData.name}" required></div>
      <div class="form-group"><label class="form-label">Phone Number *</label><input class="form-input" type="tel" id="checkout-phone" placeholder="Enter your phone number" value="${checkoutData.phone}" required></div>
      <div class="form-group"><label class="form-label">Delivery Address *</label><textarea class="form-textarea" id="checkout-address" placeholder="Enter your delivery address" required>${checkoutData.address}</textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group"><label class="form-label">State *</label><input class="form-input" type="text" id="checkout-state" placeholder="State" value="${checkoutData.state}" required></div>
        <div class="form-group"><label class="form-label">City *</label><input class="form-input" type="text" id="checkout-city" placeholder="City" value="${checkoutData.city}" required></div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep1()">Continue <i class="fas fa-arrow-right"></i></button>`;
  }
  
  if (STATE.checkoutStep === 2) {
    const total = getCartTotal();
    html += `<h3 class="checkout-form-title">Payment — Bank Transfer</h3>
      <p style="text-align:center;color:var(--gray-500);margin-bottom:24px">Transfer the total to the account below</p>
      <div class="checkout-summary">
        <div class="checkout-summary-item"><span>Bank</span><span>GTBank</span></div>
        <div class="checkout-summary-item"><span>Account Name</span><span>ADE Natural Cereals</span></div>
        <div class="checkout-summary-item"><span>Account Number</span><span style="font-size:1.2rem;letter-spacing:2px;color:var(--gold);font-weight:700">0123 456 7890</span></div>
        <div class="checkout-summary-total"><span>Amount to Pay</span><span class="amount">${formatPrice(total)}</span></div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep2()">I've Made the Transfer <i class="fas fa-arrow-right"></i></button>`;
  }
  
  if (STATE.checkoutStep === 3) {
    html += `<h3 class="checkout-form-title">Upload Payment Proof</h3>
      <p style="text-align:center;color:var(--gray-500);margin-bottom:24px">Upload your transfer screenshot</p>
      <div class="upload-area" id="upload-area" onclick="document.getElementById('screenshot-input').click()" style="border:2px dashed var(--glass-border);border-radius:16px;padding:40px;text-align:center;cursor:pointer;transition:var(--transition-smooth);background:var(--glass-bg)" onmouseover="this.style.borderColor='var(--pink)'" onmouseout="this.style.borderColor='var(--glass-border)'">
        <i class="fas fa-cloud-upload-alt" style="font-size:3rem;color:var(--gray-400);margin-bottom:12px"></i>
        <p style="color:var(--gray-500)">Click to upload transfer screenshot</p>
        <p style="font-size:0.75rem;color:var(--gray-400);margin-top:8px">PNG, JPG or JPEG</p>
        <input type="file" id="screenshot-input" accept="image/*" style="display:none" onchange="handleUpload(event)">
      </div>
      <div class="upload-preview" id="upload-preview" style="display:none;margin-bottom:16px"><img src="" alt="Payment Screenshot" id="preview-image" style="max-width:100%;border-radius:12px;border:2px solid var(--glass-border)"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
        <div class="form-group"><label class="form-label">Sender Name *</label><input class="form-input" type="text" id="checkout-sender" placeholder="Name used for transfer" value="${checkoutData.senderName}"></div>
        <div class="form-group"><label class="form-label">Amount Sent *</label><input class="form-input" type="number" id="checkout-amount" placeholder="Amount sent" value="${checkoutData.amountSent}"></div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep3()">Submit Order <i class="fas fa-check"></i></button>`;
  }
  
  if (STATE.checkoutStep === 4) {
    html += `<div class="order-confirmation"><div class="order-confirm-icon"><i class="fas fa-check"></i></div><h2>Order Submitted!</h2><p>Your order number is:</p><div class="order-number" id="order-number-display"></div><p style="color:var(--gray-500);margin:8px 0 32px">Your order is pending payment verification.</p><button class="btn btn-primary" onclick="navigateTo('home')"><i class="fas fa-home"></i> Back to Home</button></div>`;
  }
  
  html += '</div>';
  
  // Order summary
  html += `<div class="checkout-summary" style="max-width:600px;margin:32px auto">
    <h3 style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:16px">Order Summary (${STATE.cart.length} items)</h3>
    ${STATE.cart.map(item => `
      <div class="checkout-summary-item"><span>${item.name} × ${item.quantity}</span><span>${formatPrice(item.price * item.quantity)}</span></div>
    `).join('')}
    <div class="checkout-summary-total"><span>Total</span><span class="amount">${formatPrice(getCartTotal())}</span></div>
  </div>`;
  
  container.innerHTML = html;
}

function checkoutStep1() {
  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const state = document.getElementById('checkout-state')?.value.trim();
  const city = document.getElementById('checkout-city')?.value.trim();
  if (!name || !phone || !address || !state || !city) { showToast('Please fill all required fields', 'error'); return; }
  
  checkoutData = { ...checkoutData, name, phone, address, state, city };
  STATE.checkoutStep = 2;
  updateCheckoutView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkoutStep2() {
  STATE.checkoutStep = 3;
  updateCheckoutView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    checkoutData.screenshot = e.target.result;
    const preview = document.getElementById('upload-preview');
    const img = document.getElementById('preview-image');
    if (preview && img) { img.src = e.target.result; preview.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

function checkoutStep3() {
  const senderName = document.getElementById('checkout-sender')?.value.trim();
  const amountSent = document.getElementById('checkout-amount')?.value.trim();
  const transferTime = document.getElementById('checkout-time')?.value.trim();
  if (!checkoutData.screenshot) { showToast('Please upload payment screenshot', 'error'); return; }
  if (!senderName || !amountSent || !transferTime) { showToast('Please fill all payment details', 'error'); return; }
  
  checkoutData.senderName = senderName;
  checkoutData.amountSent = amountSent;
  checkoutData.transferTime = transferTime;
  
  const order = {
    orderNumber: generateOrderNumber(), date: new Date().toISOString(),
    customer: { name: checkoutData.name, phone: checkoutData.phone, address: checkoutData.address, state: checkoutData.state, city: checkoutData.city },
    items: [...STATE.cart], total: getCartTotal(),
    payment: { senderName, amountSent, transferTime, screenshot: checkoutData.screenshot },
    status: 'pending', tracking: ''
  };
  
  STATE.orders.unshift(order);
  localStorage.setItem('adeOrders', JSON.stringify(STATE.orders));
  sendOrderToWhatsApp(order);
  STATE.cart = []; saveCart();
  STATE.checkoutStep = 4;
  updateCheckoutView();
  const display = document.getElementById('order-number-display');
  if (display) display.textContent = order.orderNumber;
  checkoutData = { name: '', phone: '', address: '', state: '', city: '', senderName: '', amountSent: '', transferTime: '', screenshot: null };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sendOrderToWhatsApp(order) {
  const phoneNumber = '2348012345678';
  let msg = `🧾 *NEW ORDER - ADE*\n📋 *Order:* ${order.orderNumber}\n📅 *Date:* ${new Date(order.date).toLocaleDateString()}\n\n👤 *Customer:*\n${order.customer.name}\n${order.customer.phone}\n${order.customer.address}, ${order.customer.city}, ${order.customer.state}\n\n🛍 *Items:*\n`;
  order.items.forEach((item, i) => { msg += `${i+1}. ${item.name} × ${item.quantity} = ₦${(item.price*item.quantity).toLocaleString()}\n`; });
  msg += `\n💰 *Total:* ₦${order.total.toLocaleString()}\n💳 *Payment:* ${order.payment.senderName} — ₦${parseInt(order.payment.amountSent).toLocaleString()} at ${order.payment.transferTime}\n📸 *Screenshot:* Attached\n\n_Thank you for choosing ADE!_`;
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== ABOUT PAGE =====
function renderAbout() {}

// ===== CONTACT PAGE =====
function renderContact() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const message = document.getElementById('contact-message')?.value;
      if (!name || !email || !message) { showToast('Please fill all fields', 'error'); return; }
      showToast('Message sent! We\'ll get back to you soon.');
      this.reset();
    };
  }
}

// ===== FAQ PAGE =====
function renderFAQ() {
  const container = document.getElementById('faq-container');
  if (!container) return;
  container.innerHTML = FAQS.map((faq, i) => `
    <div class="faq-item" onclick="toggleFAQ(this)">
      <div class="faq-question"><h3>${faq.q}</h3><i class="fas fa-plus"></i></div>
      <div class="faq-answer"><div class="faq-answer-inner">${faq.a}</div></div>
    </div>
  `).join('');
}

function toggleFAQ(el) { el.classList.toggle('open'); }

// ===== REVIEWS PAGE =====
function renderReviews() {
  const summary = document.getElementById('reviews-summary');
  const container = document.getElementById('reviews-container');
  if (!summary || !container) return;
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);
  
  summary.innerHTML = `<div class="reviews-score"><div class="score">${avgRating}</div><div class="label">Average Rating</div></div>`;
  
  container.innerHTML = REVIEWS.map(r => `
    <div class="glass-card review-card fade-up">
      <div class="review-avatar">${r.avatar}</div>
      <div class="review-info">
        <h4>${r.name}</h4>
        <div class="review-meta">${getStarsHTML(r.rating)} — ${new Date(r.date).toLocaleDateString()}</div>
        <p class="review-text">${r.text}</p>
      </div>
    </div>
  `).join('');
}

// ===== WHATSAPP CHAT =====
function openWhatsAppChat() {
  window.open('https://wa.me/2348012345678?text=Hello!%20I%20have%20a%20question%20about%20ADE%20products.', '_blank');
}

function shareProduct(platform) {
  if (!STATE.currentProduct) return;
  const url = window.location.href;
  const text = `Check out ${STATE.currentProduct.name} at ADE Natural Cereals!`;
  const urls = { facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, whatsapp: `https://wa.me/?text=${encodeURIComponent(text+' '+url)}` };
  if (urls[platform]) window.open(urls[platform], '_blank');
}

// ===== ANIMATIONS =====
function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '50px' });
  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
}

// ===== AUTH =====
function loginWithGoogle() {
  const email = prompt('Enter your Gmail address for admin login:');
  if (!email) return;
  const admin = STATE.admins.find(a => a.email === email && a.status === 'active');
  if (admin) {
    STATE.isAuthenticated = true; STATE.currentUser = admin;
    showToast(`Welcome, ${admin.name}!`);
    window.location.href = admin.role === 'superadmin' ? 'admin/superadmin.html' : 'admin/dashboard.html';
  } else { showToast('Access denied.', 'error'); }
}

function logout() { STATE.isAuthenticated = false; STATE.currentUser = null; showToast('Logged out'); }

// ===== MOBILE MENU =====
function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (menu) menu.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateCartSidebar();
  renderHome();
  
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('mobile-overlay')?.addEventListener('click', closeMobileMenu);
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeCart(); closeMobileMenu(); closeModal(); }
  });
  
  observeAnimations();
});

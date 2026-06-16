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
  ]))
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
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
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
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    STATE.currentPage = page;
    
    // Update active nav link
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    
    // Close mobile menu
    closeMobileMenu();
    
    // Render page content
    renderPage(page, data);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Close cart if open
  closeCart();
}

function renderPage(page, data) {
  switch (page) {
    case 'home':
      renderHome();
      break;
    case 'shop':
      renderShop(data);
      break;
    case 'product':
      renderProductDetail(data);
      break;
    case 'cart':
      renderCartPage();
      break;
    case 'checkout':
      renderCheckout();
      break;
    case 'about':
      renderAbout();
      break;
    case 'contact':
      renderContact();
      break;
    case 'faq':
      renderFAQ();
      break;
    case 'reviews':
      renderReviews();
      break;
  }
  
  // Observe animations
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
  const inWishlist = STATE.wishlist.includes(product.id);
  return `
    <div class="product-card fade-up">
      ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? `-${getDiscountPercent(product.originalPrice, product.salePrice)}%` : product.badge === 'best-seller' ? 'Best Seller' : 'New'}</span>` : ''}
      <button class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${product.id}')">
        <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <div class="product-image" onclick="navigateTo('product', '${product.id}')">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-image-overlay">
          <button class="product-quick-view" onclick="event.stopPropagation(); quickViewProduct('${product.id}')">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category-tag">${product.category}</span>
        <h3 class="product-name" onclick="navigateTo('product', '${product.id}')">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${getStarsHTML(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.salePrice)}</span>
          <span class="original-price">${formatPrice(product.originalPrice)}</span>
          <span class="discount">-${getDiscountPercent(product.originalPrice, product.salePrice)}%</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" onclick="addToCart('${product.id}')">
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
    <div class="glass-card testimonial-card fade-up">
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
  `).join('');
}

function renderBeforeAfter() {
  const container = document.getElementById('before-after-container');
  if (!container) return;
  
  container.innerHTML = BEFORE_AFTER.map(ba => `
    <div class="glass-card before-after-card fade-up">
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
  
  // Update active filter
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
  
  // Update product count
  const count = document.getElementById('product-count');
  if (count) count.textContent = `${filtered.length} products`;
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
          <span class="current-price" style="font-size:2rem">${formatPrice(product.salePrice)}</span>
          <span class="original-price" style="font-size:1rem">${formatPrice(product.originalPrice)}</span>
          <span class="discount" style="margin-left:8px">-${getDiscountPercent(product.originalPrice, product.salePrice)}%</span>
        </div>
        <p class="product-detail-description">${product.description}</p>
        
        <div style="margin-bottom:24px">
          <h4 style="font-family:var(--font-sans);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:12px">Benefits</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${product.benefits.map(b => `
              <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--gray-500)">
                <i class="fas fa-check-circle" style="color:var(--gold);font-size:0.8rem"></i>
                ${b}
              </div>
            `).join('')}
          </div>
        </div>
        
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
  
  // Render related products
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
  
  const existing = STATE.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    STATE.cart.push({
      id: product.id,
      name: product.name,
      price: product.salePrice,
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
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
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
  if (overlay) overlay.classList.add('active');
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function updateCartSidebar() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if (!container) return;
  
  if (STATE.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
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
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
        <i class="fas fa-trash-alt"></i>
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
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px">
        <div style="font-size:5rem;margin-bottom:16px;opacity:0.3">🛒</div>
        <h2 style="font-family:var(--font-serif);font-size:1.5rem;color:var(--gray-500);margin-bottom:8px">Your cart is empty</h2>
        <p style="color:var(--gray-400);margin-bottom:24px">Looks like you haven't added anything yet</p>
        <button class="btn btn-primary" onclick="navigateTo('shop')"><i class="fas fa-shopping-bag"></i> Start Shopping</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="container" style="max-width:800px">
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:32px">Shopping Cart</h2>
      ${STATE.cart.map(item => `
        <div class="glass-card" style="display:flex;align-items:center;gap:20px;padding:20px;margin-bottom:16px">
          <div style="width:80px;height:80px;border-radius:12px;background:var(--black-elevated);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:contain">
          </div>
          <div style="flex:1">
            <h4 style="font-family:var(--font-sans);font-size:0.95rem;color:var(--white);margin-bottom:4px">${item.name}</h4>
            <div style="color:var(--gold);font-weight:600">${formatPrice(item.price)}</div>
          </div>
          <div class="quantity-selector">
            <button onclick="updateCartQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
          </div>
          <div style="font-family:var(--font-display);font-size:1.2rem;color:var(--gold);font-weight:700;min-width:80px;text-align:right">
            ${formatPrice(item.price * item.quantity)}
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:var(--gray-400);cursor:pointer;padding:8px;transition:var(--transition-smooth)" onmouseover="this.style.color='var(--pink)'" onmouseout="this.style.color='var(--gray-400)'">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('')}
      
      <div class="glass-card" style="padding:32px;margin-top:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
          <h3 style="font-family:var(--font-sans);font-size:1rem;text-transform:uppercase;letter-spacing:2px;color:var(--white)">Total</h3>
          <span style="font-family:var(--font-display);font-size:2rem;font-weight:700;background:var(--gold-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${formatPrice(getCartTotal())}</span>
        </div>
        <div style="display:flex;gap:16px">
          <button class="btn btn-secondary" style="flex:1" onclick="navigateTo('shop')"><i class="fas fa-arrow-left"></i> Continue Shopping</button>
          <button class="btn btn-primary" style="flex:2" onclick="navigateTo('checkout')"><i class="fas fa-lock"></i> Proceed to Checkout</button>
        </div>
      </div>
    </div>
  `;
}

// ===== WISHLIST =====
function toggleWishlist(productId) {
  const index = STATE.wishlist.indexOf(productId);
  if (index > -1) {
    STATE.wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  } else {
    STATE.wishlist.push(productId);
    showToast('Added to wishlist!');
  }
  localStorage.setItem('adeWishlist', JSON.stringify(STATE.wishlist));
  
  // Re-render current view to update heart icons
  const page = STATE.currentPage;
  if (page === 'home') renderHome();
  else if (page === 'shop') renderShop(document.querySelector('.filter-btn.active')?.dataset?.filter);
}

// ===== QUICK VIEW =====
function quickViewProduct(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;
  
  content.innerHTML = `
    <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">
      <div style="border-radius:12px;overflow:hidden;background:var(--black-elevated);padding:24px;display:flex;align-items:center;justify-content:center">
        <img src="${product.image}" alt="${product.name}" style="max-height:200px;width:auto;object-fit:contain">
      </div>
      <div>
        <span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--gold);display:block;margin-bottom:8px">${product.category}</span>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;color:var(--white);margin-bottom:8px">${product.name}</h3>
        <div style="margin-bottom:12px">
          <span style="font-size:1.5rem;font-weight:700;color:var(--gold)">${formatPrice(product.salePrice)}</span>
          <span style="font-size:0.85rem;color:var(--gray-400);text-decoration:line-through;margin-left:8px">${formatPrice(product.originalPrice)}</span>
        </div>
        <p style="color:var(--gray-500);font-size:0.85rem;line-height:1.6;margin-bottom:16px">${product.description}</p>
        <button class="btn btn-primary" style="width:100%" onclick="addToCart('${product.id}');closeModal()">
          <i class="fas fa-shopping-bag"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) modal.classList.remove('active');
}

// ===== CHECKOUT =====
function renderCheckout() {
  if (STATE.cart.length === 0) {
    navigateTo('shop');
    showToast('Add some products first', 'error');
    return;
  }
  
  STATE.checkoutStep = 1;
  updateCheckoutView();
}

let checkoutData = {
  name: '',
  phone: '',
  address: '',
  state: '',
  city: '',
  senderName: '',
  amountSent: '',
  transferTime: '',
  screenshot: null
};

function updateCheckoutView() {
  const container = document.getElementById('checkout-container');
  if (!container) return;
  
  let html = '';
  
  // Step indicators
  html += `
    <div style="display:flex;justify-content:center;gap:8px;margin-bottom:40px">
      ${[1,2,3,4].map(step => `
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;transition:var(--transition-smooth);
            ${step < STATE.checkoutStep ? 'background:var(--gold-gradient);color:var(--black)' : 
              step === STATE.checkoutStep ? 'background:var(--gold-gradient);color:var(--black);box-shadow:0 0 20px rgba(212,175,55,0.3)' : 
              'background:var(--glass-bg);color:var(--gray-500)'}">
            ${step < STATE.checkoutStep ? '<i class="fas fa-check"></i>' : step}
          </div>
          ${step < 4 ? '<div style="width:40px;height:2px;background:var(--glass-border);border-radius:1px"></div>' : ''}
        </div>
      `).join('')}
    </div>
  `;
  
  // Step content
  html += '<div class="checkout-form">';
  
  if (STATE.checkoutStep === 1) {
    html += `
      <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:24px;text-align:center">Delivery Information</h3>
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="checkout-name" placeholder="Enter your full name" value="${checkoutData.name}" required>
      </div>
      <div class="form-group">
        <label>Phone Number *</label>
        <input type="tel" id="checkout-phone" placeholder="Enter your phone number" value="${checkoutData.phone}" required>
      </div>
      <div class="form-group">
        <label>Delivery Address *</label>
        <textarea id="checkout-address" placeholder="Enter your delivery address" required>${checkoutData.address}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>State *</label>
          <input type="text" id="checkout-state" placeholder="Enter your state" value="${checkoutData.state}" required>
        </div>
        <div class="form-group">
          <label>City *</label>
          <input type="text" id="checkout-city" placeholder="Enter your city" value="${checkoutData.city}" required>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep1()">
        Continue <i class="fas fa-arrow-right"></i>
      </button>
    `;
  }
  
  if (STATE.checkoutStep === 2) {
    html += `
      <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:24px;text-align:center">Payment Details</h3>
      <p style="text-align:center;color:var(--gray-500);margin-bottom:24px">Transfer the total amount to the bank account below</p>
      <div class="glass-card bank-details">
        <h3>Bank Transfer Details</h3>
        <div class="bank-info">
          <div class="bank-item">
            <span class="label">Bank Name</span>
            <span class="value">GTBank</span>
          </div>
          <div class="bank-item">
            <span class="label">Account Name</span>
            <span class="value">ADE Natural Cereals</span>
          </div>
          <div class="bank-item">
            <span class="label">Account Number</span>
            <span class="value" style="font-size:1.2rem;letter-spacing:2px;color:var(--gold)">0123 456 7890</span>
          </div>
          <div class="bank-item">
            <span class="label">Amount</span>
            <span class="value" style="font-size:1.2rem;color:var(--gold)">${formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep2()">
        I've Made the Transfer <i class="fas fa-arrow-right"></i>
      </button>
    `;
  }
  
  if (STATE.checkoutStep === 3) {
    html += `
      <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:24px;text-align:center">Upload Payment Proof</h3>
      <p style="text-align:center;color:var(--gray-500);margin-bottom:24px">Upload your transfer screenshot and confirm details</p>
      
      <div class="upload-area" id="upload-area" onclick="document.getElementById('screenshot-input').click()">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload transfer screenshot</p>
        <p style="font-size:0.75rem;color:var(--gray-400);margin-top:8px">PNG, JPG or JPEG</p>
        <input type="file" id="screenshot-input" accept="image/*" style="display:none" onchange="handleUpload(event)">
      </div>
      <div class="upload-preview" id="upload-preview">
        <img src="" alt="Payment Screenshot" id="preview-image">
      </div>
      
      <div class="form-group" style="margin-top:16px">
        <label>Sender Name *</label>
        <input type="text" id="checkout-sender" placeholder="Name used for transfer" value="${checkoutData.senderName}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Amount Sent *</label>
          <input type="number" id="checkout-amount" placeholder="Amount sent" value="${checkoutData.amountSent}">
        </div>
        <div class="form-group">
          <label>Transfer Time *</label>
          <input type="time" id="checkout-time" value="${checkoutData.transferTime}">
        </div>
      </div>
      
      <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="checkoutStep3()">
        Submit Order <i class="fas fa-check"></i>
      </button>
    `;
  }
  
  if (STATE.checkoutStep === 4) {
    html += `
      <div style="text-align:center;padding:40px 20px">
        <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,rgba(37,211,102,0.2),rgba(37,211,102,0.05));display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <i class="fas fa-check-circle" style="font-size:2.5rem;color:#25D366"></i>
        </div>
        <h3 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:12px">Order Submitted!</h3>
        <p style="color:var(--gray-500);margin-bottom:8px">Your order number is:</p>
        <div style="font-family:var(--font-display);font-size:1.5rem;color:var(--gold);font-weight:700;margin-bottom:24px;letter-spacing:2px" id="order-number-display"></div>
        <p style="color:var(--gray-500);margin-bottom:32px">Your order is pending payment verification. You'll receive a WhatsApp confirmation shortly.</p>
        <button class="btn btn-primary" onclick="navigateTo('home')"><i class="fas fa-home"></i> Back to Home</button>
      </div>
    `;
  }
  
  html += '</div>';
  
  // Order summary
  html += `
    <div class="glass-card order-summary" style="max-width:600px;margin:32px auto">
      <h3>Order Summary (${STATE.cart.length} items)</h3>
      ${STATE.cart.map(item => `
        <div class="order-summary-item">
          <span class="name">${item.name} × ${item.quantity}</span>
          <span class="amount">${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('')}
      <div class="order-total">
        <span class="label">Total</span>
        <span class="amount">${formatPrice(getCartTotal())}</span>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

function checkoutStep1() {
  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const state = document.getElementById('checkout-state')?.value.trim();
  const city = document.getElementById('checkout-city')?.value.trim();
  
  if (!name || !phone || !address || !state || !city) {
    showToast('Please fill all required fields', 'error');
    return;
  }
  
  checkoutData.name = name;
  checkoutData.phone = phone;
  checkoutData.address = address;
  checkoutData.state = state;
  checkoutData.city = city;
  
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
    if (preview && img) {
      img.src = e.target.result;
      preview.style.display = 'block';
    }
  };
  reader.readAsDataURL(file);
}

function checkoutStep3() {
  const senderName = document.getElementById('checkout-sender')?.value.trim();
  const amountSent = document.getElementById('checkout-amount')?.value.trim();
  const transferTime = document.getElementById('checkout-time')?.value.trim();
  
  if (!checkoutData.screenshot) {
    showToast('Please upload payment screenshot', 'error');
    return;
  }
  
  if (!senderName || !amountSent || !transferTime) {
    showToast('Please fill all payment details', 'error');
    return;
  }
  
  checkoutData.senderName = senderName;
  checkoutData.amountSent = amountSent;
  checkoutData.transferTime = transferTime;
  
  // Create order
  const order = {
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
    customer: {
      name: checkoutData.name,
      phone: checkoutData.phone,
      address: checkoutData.address,
      state: checkoutData.state,
      city: checkoutData.city
    },
    items: [...STATE.cart],
    total: getCartTotal(),
    payment: {
      senderName: checkoutData.senderName,
      amountSent: checkoutData.amountSent,
      transferTime: checkoutData.transferTime,
      screenshot: checkoutData.screenshot
    },
    status: 'pending',
    tracking: ''
  };
  
  STATE.orders.unshift(order);
  localStorage.setItem('adeOrders', JSON.stringify(STATE.orders));
  
  // Send to WhatsApp
  sendOrderToWhatsApp(order);
  
  // Clear cart
  STATE.cart = [];
  saveCart();
  
  STATE.checkoutStep = 4;
  updateCheckoutView();
  
  const display = document.getElementById('order-number-display');
  if (display) display.textContent = order.orderNumber;
  
  // Reset checkout data
  checkoutData = { name: '', phone: '', address: '', state: '', city: '', senderName: '', amountSent: '', transferTime: '', screenshot: null };
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function sendOrderToWhatsApp(order) {
  const phoneNumber = '2348012345678'; // Replace with actual business WhatsApp number
  
  let message = `🧾 *NEW ORDER - ADE NATURAL CEREALS*\n\n`;
  message += `📋 *Order Number:* ${order.orderNumber}\n`;
  message += `📅 *Date:* ${new Date(order.date).toLocaleDateString()}\n\n`;
  message += `👤 *Customer Details:*\n`;
  message += `Name: ${order.customer.name}\n`;
  message += `Phone: ${order.customer.phone}\n`;
  message += `Address: ${order.customer.address}\n`;
  message += `State: ${order.customer.state}\n`;
  message += `City: ${order.customer.city}\n\n`;
  message += `🛍 *Products Ordered:*\n`;
  
  order.items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} × ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}\n`;
  });
  
  message += `\n💰 *Total Amount:* ₦${order.total.toLocaleString()}\n\n`;
  message += `💳 *Payment Details:*\n`;
  message += `Sender: ${order.payment.senderName}\n`;
  message += `Amount Sent: ₦${parseInt(order.payment.amountSent).toLocaleString()}\n`;
  message += `Transfer Time: ${order.payment.transferTime}\n\n`;
  message += `📸 *Payment Screenshot:* Attached\n\n`;
  message += `✅ *Status:* Pending Payment Verification\n\n`;
  message += `_Thank you for choosing ADE Natural Cereals!_`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// ===== ABOUT PAGE =====
function renderAbout() {
  // Static content is in HTML - no dynamic rendering needed
}

// ===== CONTACT PAGE =====
function renderContact() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const message = document.getElementById('contact-message')?.value;
      
      if (!name || !email || !message) {
        showToast('Please fill all fields', 'error');
        return;
      }
      
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
      <div class="faq-question">
        <h3>${faq.q}</h3>
        <i class="fas fa-plus"></i>
      </div>
      <div class="faq-answer">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(el) {
  el.classList.toggle('active');
}

// ===== REVIEWS PAGE =====
function renderReviews() {
  const summary = document.getElementById('reviews-summary');
  const container = document.getElementById('reviews-container');
  if (!summary || !container) return;
  
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);
  
  summary.innerHTML = `
    <div class="big-rating">${avgRating}</div>
    <div class="stars-big">${getStarsHTML(parseFloat(avgRating))}</div>
    <p style="color:var(--gray-500);font-size:0.9rem">Based on ${REVIEWS.length} reviews</p>
  `;
  
  container.innerHTML = REVIEWS.map(r => `
    <div class="glass-card review-card fade-up">
      <div class="review-header">
        <div class="review-avatar">${r.avatar}</div>
        <div>
          <div style="font-weight:600;color:var(--white)">${r.name}</div>
          <div class="review-stars">${getStarsHTML(r.rating)}</div>
        </div>
      </div>
      <p class="review-text">${r.text}</p>
      <div class="review-date">${new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  `).join('');
}

// ===== WHATSAPP CHAT =====
function openWhatsAppChat() {
  const phoneNumber = '2348012345678';
  const message = 'Hello! I have a question about ADE Natural Cereals products.';
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// ===== SHARE PRODUCT =====
function shareProduct(platform) {
  if (!STATE.currentProduct) return;
  const url = window.location.href;
  const text = `Check out ${STATE.currentProduct.name} at ADE Natural Cereals!`;
  
  let shareUrl = '';
  if (platform === 'facebook') {
    shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  } else if (platform === 'twitter') {
    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  } else if (platform === 'whatsapp') {
    shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
  }
  
  if (shareUrl) window.open(shareUrl, '_blank');
}

// ===== ANIMATIONS =====
function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });
  
  document.querySelectorAll('.fade-up, .fade-in, .scale-in').forEach(el => {
    observer.observe(el);
  });
}

// ===== AUTH FUNCTIONS =====
function loginWithGoogle() {
  // Simulate Google OAuth
  const email = prompt('Enter your Gmail address for admin login:');
  if (!email) return;
  
  // Check if admin
  const admin = STATE.admins.find(a => a.email === email && a.status === 'active');
  if (admin) {
    STATE.isAuthenticated = true;
    STATE.currentUser = admin;
    showToast(`Welcome, ${admin.name}!`);
    
    if (admin.role === 'superadmin') {
      window.location.href = 'admin/superadmin.html';
    } else {
      window.location.href = 'admin/dashboard.html';
    }
  } else {
    showToast('Access denied. Unauthorized email.', 'error');
  }
}

function logout() {
  STATE.isAuthenticated = false;
  STATE.currentUser = null;
  showToast('Logged out successfully');
}

// ===== MOBILE MENU =====
function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (menu) menu.classList.add('open');
  if (overlay) overlay.classList.add('active');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart count
  updateCartCount();
  updateCartSidebar();
  
  // Initialize home
  renderHome();
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });
  
  // Close cart on overlay click
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  
  // Close mobile menu on overlay click
  const mobileOverlay = document.getElementById('mobile-overlay');
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Escape key handlers
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCart();
      closeMobileMenu();
      closeModal();
    }
  });
  
  // Initialize Intersection Observer
  observeAnimations();
});
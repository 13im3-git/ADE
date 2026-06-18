// ============================================
// ADE NATURAL CEREALS - ADMIN DASHBOARD
// Redesigned with Enhanced Analytics Dashboard
// ============================================

// ===== STATE =====
const ADMIN_STATE = {
  currentTab: 'dashboard',
  orders: JSON.parse(localStorage.getItem('adeOrders') || '[]'),
  admins: JSON.parse(localStorage.getItem('adeAdmins') || '[]'),
  isSuperAdmin: false,
  currentAdmin: null,
  trendRange: 30
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
        return;
      }
    } catch (e) {
      sessionStorage.removeItem('adeAdminSession');
    }
  }

  // Fallback: URL param or prompt
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email') || prompt('Enter admin email for verification:');

  if (email) {
    const admin = ADMIN_STATE.admins.find(a => a.email === email && a.status === 'active');
    if (admin) {
      ADMIN_STATE.currentAdmin = admin;
      ADMIN_STATE.isSuperAdmin = admin.role === 'superadmin';
      updateAdminUI();
      return;
    }
  }

  showToast('Access denied. Please login with an authorized admin email.', 'error');
  setTimeout(() => window.location.href = '../index.html', 2000);
}

function updateAdminUI() {
  const nameEl = document.getElementById('admin-name');
  const roleEl = document.getElementById('admin-role');
  const avatarEl = document.getElementById('admin-avatar');
  if (nameEl) nameEl.textContent = ADMIN_STATE.currentAdmin?.name || 'Admin';
  if (roleEl) roleEl.textContent = ADMIN_STATE.isSuperAdmin ? 'Super Admin' : 'Admin';
  if (avatarEl) avatarEl.textContent = (ADMIN_STATE.currentAdmin?.name || 'AD').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function initAdmin() {
  const storedOrders = localStorage.getItem('adeOrders');
  if (storedOrders) {
    ADMIN_STATE.orders = JSON.parse(storedOrders);
  }
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

  $$('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  $$('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === `tab-${tab}`);
  });

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
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCustomers = new Set(orders.map(o => o.customer?.phone)).size;

  const statTotal = document.getElementById('stat-total');
  const statPending = document.getElementById('stat-pending');
  const statRevenue = document.getElementById('stat-revenue');
  const statCustomers = document.getElementById('stat-customers');

  if (statTotal) statTotal.textContent = totalOrders;
  if (statPending) statPending.textContent = pendingOrders;
  if (statRevenue) statRevenue.textContent = formatPrice(totalRevenue);
  if (statCustomers) statCustomers.textContent = totalCustomers;

  const recentOrders = document.getElementById('recent-orders');
  if (recentOrders) {
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentOrders.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--gray-500)">No orders yet</td></tr>';
    } else {
      recentOrders.innerHTML = recent.map(o => `
        <tr>
          <td style="font-weight:600;color:var(--gold)">${o.orderNumber || 'N/A'}</td>
          <td>${o.customer?.name || 'Unknown'}</td>
          <td>${formatPrice(o.total || 0)}</td>
          <td>${formatDate(o.date || o.orderNumber)}</td>
          <td>${getStatusBadge(o.status)}</td>
          <td>
            <button class="btn btn-gold btn-sm" onclick="viewOrder('${o.orderNumber}')">View</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

// ===== ANALYTICS DASHBOARD (Enhanced) =====
function renderAnalytics() {
  const orders = ADMIN_STATE.orders;
  const range = parseInt(document.getElementById('analytics-range')?.value || '30');

  // Filter orders within range
  const now = new Date();
  const rangeStart = new Date(now.getTime() - range * 86400000);
  const filteredOrders = orders.filter(o => {
    const d = new Date(o.date || o.orderNumber);
    return d >= rangeStart;
  });

  const completedOrders = filteredOrders.filter(o => o.status !== 'cancelled');
  const grossRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;
  const totalProductsSold = completedOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 0), 0);
  const activeCustomers = new Set(completedOrders.map(o => o.customer?.phone)).size;
  const conversionRate = totalOrdersCount > 0 ? Math.round((completedOrders.length / totalOrdersCount) * 100) : 0;

  // Revenue growth (compare current period vs previous period)
  const prevStart = new Date(rangeStart.getTime() - range * 86400000);
  const prevOrders = orders.filter(o => {
    const d = new Date(o.date || o.orderNumber);
    return d >= prevStart && d < rangeStart && o.status !== 'cancelled';
  });
  const prevRevenue = prevOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const revenueGrowth = prevRevenue > 0 ? Math.round(((grossRevenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Net revenue (estimated after 10% platform fees)
  const netRevenue = grossRevenue * 0.9;

  // Update stat cards
  const grossEl = document.getElementById('analytics-gross-revenue');
  const netEl = document.getElementById('analytics-net-revenue');
  const growthEl = document.getElementById('analytics-revenue-growth');
  const ordersEl = document.getElementById('analytics-orders');
  const avgEl = document.getElementById('analytics-avg');
  const productsSoldEl = document.getElementById('analytics-products-sold');
  const activeCustEl = document.getElementById('analytics-active-customers');
  const conversionEl = document.getElementById('analytics-conversion');

  if (grossEl) grossEl.textContent = formatPrice(grossRevenue);
  if (netEl) netEl.textContent = formatPrice(netRevenue);
  if (growthEl) {
    growthEl.textContent = (revenueGrowth >= 0 ? '+' : '') + revenueGrowth + '%';
    growthEl.style.color = revenueGrowth >= 0 ? '#25D366' : '#F44336';
  }
  if (ordersEl) ordersEl.textContent = totalOrdersCount;
  if (avgEl) avgEl.textContent = formatPrice(avgOrderValue);
  if (productsSoldEl) productsSoldEl.textContent = totalProductsSold;
  if (activeCustEl) activeCustEl.textContent = activeCustomers;
  if (conversionEl) conversionEl.textContent = conversionRate + '%';

  // Order Status Breakdown
  renderAnalyticsStatusBreakdown(filteredOrders);

  // Best Performing Category
  renderAnalyticsBestCategory(completedOrders);

  // Revenue Trend Chart
  renderAnalyticsChart(orders, range);

  // Top Categories
  renderAnalyticsCategories(completedOrders);

  // Revenue by Category (bar chart)
  renderAnalyticsCategoryChart(completedOrders);

  // Recent Transactions
  renderAnalyticsRecent(filteredOrders);

  // Traffic & Sources Overview
  renderAnalyticsTraffic(orders);

  // Top 10 Products by Revenue
  renderAnalyticsTopProducts(completedOrders);
}

function renderAnalyticsStatusBreakdown(orders) {
  const el = document.getElementById('analytics-status-breakdown');
  if (!el) return;
  const counts = {};
  orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  const total = orders.length || 1;
  const labels = { pending: 'Pending', approved: 'Approved', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

  el.innerHTML = Object.keys(counts).map(status => {
    const pct = Math.round((counts[status] / total) * 100);
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px">
          <span style="color:var(--gray-500)">${labels[status] || status}</span>
          <span style="color:var(--white)">${counts[status]} (${pct}%)</span>
        </div>
        <div style="height:6px;background:var(--glass-bg);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--gold-gradient);border-radius:3px;transition:width 0.6s ease"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAnalyticsBestCategory(orders) {
  const el = document.getElementById('analytics-best-category');
  if (!el) return;
  const catRevenue = {};
  const catOrders = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const cat = item.category || 'Uncategorized';
      catRevenue[cat] = (catRevenue[cat] || 0) + (item.price || 0) * (item.quantity || 1);
      catOrders[cat] = (catOrders[cat] || 0) + 1;
    });
  });
  const best = Object.keys(catRevenue).sort((a, b) => catRevenue[b] - catRevenue[a])[0];
  if (!best) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--gray-500)">No data available</div>';
    return;
  }
  el.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-family:var(--font-display);font-size:2rem;color:var(--gold);margin-bottom:8px">${best}</div>
      <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:4px">Top Category Revenue</div>
      <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${formatPrice(catRevenue[best])}</div>
      <div style="font-size:0.7rem;color:var(--gray-500);margin-top:4px">${catOrders[best]} orders</div>
    </div>
  `;
}

function renderAnalyticsChart(orders, range) {
  const el = document.getElementById('analytics-chart');
  if (!el) return;
  const days = range;
  const daily = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    daily[key] = 0;
  }
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    const key = (o.date || o.orderNumber).slice(0, 10);
    if (daily[key] !== undefined) daily[key] += o.total || 0;
  });
  const values = Object.values(daily);
  const max = Math.max(...values, 1);
  const barCount = Math.min(values.length, 60);
  const displayValues = values.slice(-barCount);

  el.innerHTML = displayValues.map((v, i) => {
    const height = (v / max) * 100;
    const label = barCount > 14 && i % Math.ceil(barCount / 14) !== 0 ? '' : Object.keys(daily)[i]?.slice(5);
    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;position:relative" title="${formatPrice(v)}">
        <div style="width:100%;max-width:24px;height:${Math.max(height * 0.85, 4)}%;background:var(--gold-gradient);border-radius:4px 4px 0 0;transition:height 0.4s ease;min-height:4px"></div>
        ${label ? `<span style="font-size:0.55rem;color:var(--gray-500);transform:rotate(-45deg);white-space:nowrap;margin-top:4px">${label}</span>` : ''}
      </div>
    `;
  }).join('');
}

function renderAnalyticsCategories(orders) {
  const el = document.getElementById('analytics-categories');
  if (!el) return;
  const catData = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const cat = item.category || 'Uncategorized';
      if (!catData[cat]) catData[cat] = { revenue: 0, count: 0 };
      catData[cat].revenue += (item.price || 0) * (item.quantity || 1);
      catData[cat].count += item.quantity || 1;
    });
  });
  const sorted = Object.entries(catData).sort((a, b) => b[1].revenue - a[1].revenue);
  const total = sorted.reduce((s, [, d]) => s + d.revenue, 0) || 1;

  if (sorted.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--gray-500)">No data</div>';
    return;
  }

  el.innerHTML = sorted.map(([cat, data]) => {
    const pct = Math.round((data.revenue / total) * 100);
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px">
          <span style="color:var(--gray-500)">${cat}</span>
          <span style="color:var(--gold)">${formatPrice(data.revenue)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:6px;background:var(--glass-bg);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:var(--gold-gradient);border-radius:3px;transition:width 0.6s ease"></div>
          </div>
          <span style="font-size:0.65rem;color:var(--gray-500);min-width:32px;text-align:right">${pct}%</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderAnalyticsCategoryChart(orders) {
  const el = document.getElementById('analytics-category-chart');
  if (!el) return;
  const catData = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const cat = item.category || 'Uncategorized';
      catData[cat] = (catData[cat] || 0) + (item.price || 0) * (item.quantity || 1);
    });
  });
  const sorted = Object.entries(catData).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...sorted.map(([, v]) => v), 1);

  if (sorted.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray-500)">No data</div>';
    return;
  }

  el.innerHTML = sorted.slice(0, 8).map(([cat, rev]) => {
    const pct = (rev / max) * 100;
    return `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:0.7rem;color:var(--gray-500);min-width:60px;text-align:right">${cat}</span>
        <div style="flex:1;height:20px;background:var(--glass-bg);border-radius:4px;overflow:hidden;position:relative">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg, var(--gold), var(--pink));border-radius:4px;transition:width 0.6s ease"></div>
        </div>
        <span style="font-size:0.65rem;color:var(--gold);min-width:50px;text-align:right">${formatPrice(rev)}</span>
      </div>
    `;
  }).join('');
}

function renderAnalyticsRecent(orders) {
  const el = document.getElementById('analytics-recent');
  if (!el) return;
  const recent = orders.slice(-20).reverse();
  if (recent.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--gray-500)">No transactions</div>';
    return;
  }
  el.innerHTML = recent.map(o => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--glass-border)">
      <div>
        <div style="font-size:0.8rem;color:var(--white)">${o.customer?.name || 'Unknown'}</div>
        <div style="font-size:0.65rem;color:var(--gray-500)">${o.orderNumber || ''} · ${formatDate(o.date || o.orderNumber)}</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-display);font-size:0.95rem;color:var(--gold)">${formatPrice(o.total || 0)}</div>
        <div>${getStatusBadge(o.status)}</div>
      </div>
    </div>
  `).join('');
}

function renderAnalyticsTraffic(orders) {
  const el = document.getElementById('analytics-traffic');
  if (!el) return;
  const stats = computeTrafficStats(orders);
  el.innerHTML = `
    <div class="glass-card" style="padding:20px">
      <h3 style="margin-bottom:16px">Daily Traffic</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Orders Today</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${stats.todayOrders}</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Avg Daily Orders</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${stats.avgDailyOrders}</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Peak Day</div>
          <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--white)">${stats.peakDay}</div>
          <div style="font-size:0.7rem;color:var(--gray-500)">${stats.peakDayCount} orders</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Peak Hour</div>
          <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--white)">${stats.peakHour}:00</div>
          <div style="font-size:0.7rem;color:var(--gray-500)">${stats.peakHourCount} orders</div>
        </div>
      </div>
    </div>
    <div class="glass-card" style="padding:20px">
      <h3 style="margin-bottom:16px">Customers</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">New Customers</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${stats.newCustomers}</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Returning</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${stats.returningCustomers}</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Returning Rate</div>
          <div style="font-family:var(--font-display);font-size:1.4rem;color:var(--white)">${stats.returningRate}%</div>
        </div>
        <div style="padding:12px;background:var(--glass-bg);border-radius:10px;border:1px solid var(--glass-border)">
          <div style="font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Orders Summary</div>
          <div style="font-family:var(--font-display);font-size:1rem;color:var(--white)">${stats.todayOrders} today · ${stats.avgDailyOrders} avg</div>
        </div>
      </div>
    </div>
  `;
}

function computeTrafficStats(orders) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayOrders = orders.filter(o => new Date(o.date || o.orderNumber).getTime() >= todayStart).length;

  const daySet = new Set();
  const hourCounts = new Array(24).fill(0);
  const dayCounts = new Array(7).fill(0);
  const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  orders.forEach(o => {
    const d = new Date(o.date || o.orderNumber);
    daySet.add(d.toDateString());
    hourCounts[d.getHours()] += 1;
    dayCounts[d.getDay()] += 1;
  });

  const uniqueDays = daySet.size || 1;
  const avgDailyOrders = Math.round(orders.length / uniqueDays);
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakHourCount = hourCounts[peakHour];
  const peakDayIdx = dayCounts.indexOf(Math.max(...dayCounts));
  const peakDay = dayLabels[peakDayIdx];
  const peakDayCount = dayCounts[peakDayIdx];

  const seen = new Set();
  let newCustomers = 0;
  let returningCustomers = 0;
  orders.forEach(o => {
    const phone = o.customer?.phone;
    if (!phone) return;
    if (seen.has(phone)) { returningCustomers += 1; } else { seen.add(phone); newCustomers += 1; }
  });
  const returningRate = (newCustomers + returningCustomers) ? Math.round((returningCustomers / (newCustomers + returningCustomers)) * 100) : 0;

  return { todayOrders, avgDailyOrders, peakDay, peakDayCount, peakHour, peakHourCount, newCustomers, returningCustomers, returningRate };
}

function renderAnalyticsTopProducts(orders) {
  const tbody = document.getElementById('analytics-top-products-table');
  if (!tbody) return;
  const productMap = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.name || 'Unknown';
      if (!productMap[key]) productMap[key] = { name: key, category: item.category || 'N/A', units: 0, revenue: 0 };
      productMap[key].units += item.quantity || 1;
      productMap[key].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });
  const sorted = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--gray-500)">No data</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map((p, i) => `
    <tr>
      <td style="color:var(--gold);font-weight:600">#${i + 1}</td>
      <td style="color:var(--white)">${p.name}</td>
      <td style="color:var(--gray-500)">${p.category}</td>
      <td>${p.units}</td>
      <td style="color:var(--gold);font-weight:600">${formatPrice(p.revenue)}</td>
    </tr>
  `).join('');
}

// ===== EXPORT FUNCTIONS =====
function exportAnalyticsCSV() {
  const orders = ADMIN_STATE.orders || [];
  if (!orders.length) { showToast('No data to export', 'error'); return; }
  const header = 'Order,Customer,Phone,Total,Date,Status,Items\n';
  const rows = orders.map(o => {
    const items = (o.items || []).map(i => `${i.name}×${i.quantity}`).join('; ');
    return `${o.orderNumber},"${o.customer?.name || ''}",${o.customer?.phone || ''},${o.total || 0},${o.date || o.orderNumber},${o.status},"${items}"`;
  });
  const csv = header + rows.join('\n');
  downloadBlob(csv, `ade-analytics-${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
  showToast('CSV exported successfully');
}

function exportAnalyticsJSON() {
  const data = { exportedAt: new Date().toISOString(), totalOrders: ADMIN_STATE.orders.length, orders: ADMIN_STATE.orders || [] };
  downloadBlob(JSON.stringify(data, null, 2), `ade-analytics-${new Date().toISOString().slice(0,10)}.json`, 'application/json');
  showToast('JSON exported successfully');
}

function exportAnalyticsPDF() {
  const orders = ADMIN_STATE.orders || [];
  if (!orders.length) { showToast('No data to export', 'error'); return; }
  const total = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
  const summary = `ADE Natural Cereals - Analytics Report\nGenerated: ${new Date().toLocaleString()}\n\n`;
  const stats = `Total Orders: ${orders.length}\nTotal Revenue: ${formatPrice(total)}\nCustomers: ${new Set(orders.map(o => o.customer?.phone)).size}\n\n`;
  const csv = summary + stats + 'Order,Customer,Total,Date,Status\n' +
    orders.map(o => `${o.orderNumber},"${o.customer?.name || ''}",${o.total},${o.date || o.orderNumber},${o.status}`).join('\n');
  downloadBlob(csv, `ade-analytics-report-${new Date().toISOString().slice(0,10)}.txt`, 'text/plain');
  showToast('Report exported');
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

// ===== TREND RANGE =====
function setTrendRange(days) {
  ADMIN_STATE.trendRange = days;
  $$('.trend-range').forEach(b => b.classList.toggle('active', parseInt(b.dataset.range) === days));
  renderAnalytics();
}

// ===== ORDERS =====
function renderOrders() {
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
      <td>${o.customer?.name || 'Unknown'}</td>
      <td>${o.customer?.phone || '-'}</td>
      <td>${formatPrice(o.total || 0)}</td>
      <td>${formatDate(o.date || o.orderNumber)}</td>
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

  let itemsHtml = (order.items || []).map(item => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--glass-border);font-size:0.85rem">
      <span style="color:var(--white)">${item.name} × ${item.quantity}</span>
      <span style="color:var(--gold)">${formatPrice((item.price || 0) * (item.quantity || 1))}</span>
    </div>
  `).join('');

  content.innerHTML = `
    <button class="modal-close" onclick="closeAdminModal()"><i class="fas fa-times"></i></button>
    <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:8px">Order ${order.orderNumber}</h3>
    <div style="margin-bottom:24px">${getStatusBadge(order.status)}</div>

    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Customer Details</h4>
      <p style="font-size:0.9rem;color:var(--white)">${order.customer?.name || 'N/A'}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer?.phone || 'N/A'}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer?.address || 'N/A'}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">${order.customer?.city || ''}${order.customer?.state ? ', ' + order.customer.state : ''}</p>
    </div>

    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Order Items</h4>
      ${itemsHtml || '<div style="color:var(--gray-500);font-size:0.85rem">No items</div>'}
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px">
        <span style="font-weight:600;color:var(--white)">Total</span>
        <span style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--gold)">${formatPrice(order.total || 0)}</span>
      </div>
    </div>

    <div style="margin-bottom:20px">
      <h4 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--gray-500);margin-bottom:8px">Payment Details</h4>
      <p style="font-size:0.85rem;color:var(--white)">Sender: ${order.payment?.senderName || 'N/A'}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">Amount: ${formatPrice(order.payment?.amountSent || 0)}</p>
      <p style="font-size:0.85rem;color:var(--gray-500)">Time: ${order.payment?.transferTime || 'N/A'}</p>
      ${order.payment?.screenshot ? `<div style="margin-top:8px"><img src="${order.payment.screenshot}" alt="Payment Screenshot" style="max-width:100%;border-radius:8px;max-height:200px"></div>` : ''}
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

// ===== PRODUCTS =====
function renderProducts() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;
  let products = [];
  try {
    if (typeof PRODUCTS !== 'undefined') { products = PRODUCTS; }
  } catch(e) {}

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:60px;color:var(--gray-500)">Load main site first or add products</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:40px;height:40px;border-radius:8px;background:var(--black-elevated);display:flex;align-items:center;justify-content:center">
            <i class="fas fa-box" style="color:var(--gold);font-size:1rem"></i>
          </div>
          <span>${p.name}</span>
        </div>
      </td>
      <td>${p.category || 'N/A'}</td>
      <td>${p.weight || 'N/A'}</td>
      <td>${formatPrice(p.originalPrice || 0)}</td>
      <td style="color:var(--gold);font-weight:600">${formatPrice(p.salePrice || p.originalPrice || 0)}</td>
      <td>${getStatusBadge(p.badge === 'best-seller' ? 'delivered' : p.badge === 'sale' ? 'processing' : 'pending')}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="showToast('Edit product - Coming soon')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-danger btn-sm" onclick="showToast('Delete product - Coming soon')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

// ===== CUSTOMERS =====
function renderCustomers() {
  const tbody = document.getElementById('customers-table-body');
  if (!tbody) return;
  const orders = ADMIN_STATE.orders;
  const customerMap = new Map();

  orders.forEach(o => {
    const phone = o.customer?.phone;
    if (!phone) return;
    if (!customerMap.has(phone)) {
      customerMap.set(phone, { name: o.customer.name, phone, orders: [], totalSpent: 0 });
    }
    const c = customerMap.get(phone);
    c.orders.push(o.orderNumber);
    c.totalSpent += o.total || 0;
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
            ${(a.name || 'AD').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:600;color:var(--white);font-size:0.85rem">${a.name}</div>
            <div style="font-size:0.7rem;color:var(--gray-500)">${a.email}</div>
          </div>
        </div>
      </td>
      <td><span class="status-badge ${a.role === 'superadmin' ? 'status-delivered' : 'status-processing'}">${a.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span></td>
      <td><span class="status-badge ${a.status === 'active' ? 'status-approved' : 'status-cancelled'}">${a.status}</span></td>
      <td>
        ${ADMIN_STATE.isSuperAdmin && a.role !== 'superadmin' ? `
          <button class="btn btn-ghost btn-sm" onclick="toggleAdminStatus('${a.email}')"><i class="fas ${a.status === 'active' ? 'fa-ban' : 'fa-check'}"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteAdmin('${a.email}')"><i class="fas fa-trash"></i></button>
        ` : '-'}
      </td>
    </tr>
  `).join('');

  const addForm = document.getElementById('add-admin-form');
  if (addForm) {
    addForm.style.display = ADMIN_STATE.isSuperAdmin ? 'block' : 'none';
  }
}

function addAdmin() {
  if (!ADMIN_STATE.isSuperAdmin) { showToast('Only Super Admin can add admins', 'error'); return; }
  const username = document.getElementById('new-admin-username')?.value?.trim();
  const email = document.getElementById('new-admin-email')?.value?.trim();
  const password = document.getElementById('new-admin-password')?.value?.trim();
  const role = document.getElementById('new-admin-role')?.value || 'admin';
  if (!username || !email || !password) { showToast('Please fill all fields', 'error'); return; }
  if (ADMIN_STATE.admins.find(a => a.email === email)) { showToast('Admin with this email already exists', 'error'); return; }
  ADMIN_STATE.admins.push({ email, name: username, role, status: 'active' });
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  if (document.getElementById('new-admin-username')) document.getElementById('new-admin-username').value = '';
  if (document.getElementById('new-admin-email')) document.getElementById('new-admin-email').value = '';
  if (document.getElementById('new-admin-password')) document.getElementById('new-admin-password').value = '';
  showToast('Admin added successfully');
  renderAdmins();
}

function toggleAdminStatus(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  const admin = ADMIN_STATE.admins.find(a => a.email === email);
  if (!admin) return;
  admin.status = admin.status === 'active' ? 'suspended' : 'active';
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  showToast(`Admin ${admin.status === 'active' ? 'activated' : 'suspended'}`);
  renderAdmins();
}

function deleteAdmin(email) {
  if (!ADMIN_STATE.isSuperAdmin) return;
  if (!confirm('Are you sure you want to delete this admin?')) return;
  ADMIN_STATE.admins = ADMIN_STATE.admins.filter(a => a.email !== email);
  localStorage.setItem('adeAdmins', JSON.stringify(ADMIN_STATE.admins));
  showToast('Admin deleted');
  renderAdmins();
}

// ===== SETTINGS =====
function renderSettings() {
  if (!ADMIN_STATE.isSuperAdmin) {
    const container = document.getElementById('tab-settings');
    if (container) {
      container.innerHTML = `
        <div class="glass-card" style="text-align:center;padding:60px">
          <i class="fas fa-lock" style="font-size:3rem;color:var(--gray-500);margin-bottom:16px;display:block"></i>
          <h3 style="color:var(--gray-500);font-size:1rem">Settings restricted to Super Admin</h3>
        </div>
      `;
    }
    return;
  }

  const bankName = document.getElementById('setting-bank-name');
  const accountName = document.getElementById('setting-account-name');
  const accountNumber = document.getElementById('setting-account-number');
  if (bankName && !bankName.value) bankName.value = 'GTBank';
  if (accountName && !accountName.value) accountName.value = 'ADE Natural Cereals';
  if (accountNumber && !accountNumber.value) accountNumber.value = '0123 456 7890';
}

function saveSettings() {
  showToast('Settings saved successfully');
}

// ===== LOGOUT =====
function logoutAdmin() {
  window.location.href = '../index.html';
}
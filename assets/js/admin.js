/* ============================================================
   JOVENT — Admin Panel Engine
   ============================================================ */
(function () {
'use strict';

/* ---------------- utils ---------------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const U = (id, w) => `https://images.unsplash.com/photo-${id}?q=80&w=${w || 400}&auto=format&fit=crop`;
const fmt = n => '৳' + Number(n).toLocaleString('en-US');
const uid = p => (p || 'id') + '_' + Math.random().toString(36).slice(2, 8);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dstr = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const CATS = { formal: 'Formal Wear', casual: 'Casual Wear', accessories: 'Accessories' };

function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><span></span>'; document.body.appendChild(el); }
    el.querySelector('span').textContent = msg;
    el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- seed ---------------- */
function seed() {
    const P = (id, name, cat, price, old, stock, sku, badge, img, sold) => ({ id, name, cat, price, old: old || 0, stock, sku, badge: badge || '', status: 'active', img: U(img), sold: sold || 0, rating: 5 });
    const products = [
        P('p01', 'Regal Black Two-Piece Suit', 'formal', 14500, 16900, 14, 'JV-F-001', 'Sale', '1507679799987-c73779587ccf', 86),
        P('p02', 'Ivory Classic Dress Shirt', 'formal', 2850, 0, 64, 'JV-F-002', '', '1596755094514-f87e34085b2c', 142),
        P('p03', 'Charcoal Wool Blazer', 'formal', 8900, 0, 22, 'JV-F-003', 'New', '1594938298603-c8148c4dae35', 58),
        P('p04', 'Midnight Slim-Fit Trousers', 'formal', 3200, 0, 41, 'JV-F-004', '', '1519085360753-af0119f7cbe7', 97),
        P('p05', 'Essential White Crew Tee', 'casual', 950, 0, 210, 'JV-C-001', '', '1521572163474-6864f9cf17ab', 320),
        P('p06', 'Urban Graphic Tee', 'casual', 1150, 0, 133, 'JV-C-002', 'New', '1576566588028-4147f3842f27', 118),
        P('p07', 'Oversized Street Tee', 'casual', 1250, 0, 96, 'JV-C-003', '', '1618354691373-d851c5c3a990', 104),
        P('p08', 'Ranger Field Jacket', 'casual', 6800, 0, 9, 'JV-C-004', '', '1591047139829-d91aecb6caea', 44),
        P('p09', 'Heritage Denim Jacket', 'casual', 5400, 0, 6, 'JV-C-005', 'Hot', '1488161628813-04466f872be2', 71),
        P('p10', 'Chrono Steel Watch', 'accessories', 12500, 0, 18, 'JV-A-001', 'Limited', '1523170335258-f5ed11844a49', 39),
        P('p11', 'Voyager Leather Backpack', 'accessories', 4800, 0, 27, 'JV-A-002', '', '1553062407-98eeb64c6a62', 52),
        P('p12', 'Court Classic Sneakers', 'accessories', 5900, 0, 4, 'JV-A-003', 'Hot', '1549298916-b41d501d3772', 88),
    ];
    const byP = id => products.find(p => p.id === id);
    const O = (code, name, phone, city, addr, items, pay, status, date) => {
        const sub = items.reduce((s, [pid, q]) => s + byP(pid).price * q, 0);
        const ship = sub >= 5000 ? 0 : 120;
        return { id: uid('o'), code, customer: name, phone, city, address: addr, items: items.map(([pid, q, size]) => ({ pid, qty: q, size: size || 'M', price: byP(pid).price })), pay, status, date, subtotal: sub, shipping: ship, total: sub + ship };
    };
    const orders = [
        O('JV-8K2N4P', 'Tanvir Ahmed', '01711223344', 'Dhaka', 'House 12, Road 5, Gulshan, Dhaka 1212', [['p01', 1, 'L'], ['p02', 2, 'M']], 'bKash', 'Pending', '2026-10-11'),
        O('JV-3M7Q9W', 'Rafid Hasan', '01855667788', 'Chattogram', 'Flat 4B, GEC Circle, Chattogram', [['p08', 1, 'L']], 'COD', 'Pending', '2026-10-11'),
        O('JV-5T2R8K', 'Nabil Chowdhury', '01699887766', 'Sylhet', 'Zindabazar, Sylhet 3100', [['p05', 3, 'M'], ['p12', 1, '42']], 'Card', 'Confirmed', '2026-10-10'),
        O('JV-9P4L2M', 'Arif Rahman', '01933445566', 'Dhaka', 'House 8, Road 11, Banani, Dhaka', [['p03', 1, 'M']], 'COD', 'Shipped', '2026-10-09'),
        O('JV-2X8N6Q', 'Sakib Hossain', '01577889900', 'Rajshahi', 'Shaheb Bazar, Rajshahi', [['p10', 1, 'One Size']], 'bKash', 'Shipped', '2026-10-08'),
        O('JV-6H3K9T', 'Fahim Islam', '01722334455', 'Dhaka', 'House 21, Road 7, Dhanmondi, Dhaka', [['p09', 1, 'L'], ['p07', 2, 'XL']], 'COD', 'Delivered', '2026-10-06'),
        O('JV-4W9M1Z', 'Rahim Uddin', '01811223344', 'Khulna', 'KDA Avenue, Khulna', [['p02', 2, 'L']], 'COD', 'Delivered', '2026-10-05'),
        O('JV-7Q5P3X', 'Mehedi Khan', '01644556677', 'Dhaka', 'House 3, Road 2, Uttara, Dhaka', [['p11', 1, 'One Size']], 'Card', 'Delivered', '2026-10-03'),
        O('JV-1N6T8V', 'Karim Sheikh', '01966778899', 'Barishal', 'Sadar Road, Barishal', [['p06', 1, 'M']], 'COD', 'Cancelled', '2026-10-02'),
        O('JV-8B2D4F', 'Imran Ali', '01533445566', 'Dhaka', 'House 9, Road 4, Mirpur, Dhaka', [['p04', 1, 'M'], ['p02', 1, 'M']], 'bKash', 'Delivered', '2026-09-29'),
        O('JV-3G7H2J', 'Nasir Ahmed', '01788990011', 'Rangpur', 'Jahaj Company Mor, Rangpur', [['p12', 1, '43']], 'COD', 'Returned', '2026-09-27'),
        O('JV-5K9L1P', 'Jahidul Karim', '01822334455', 'Mymensingh', 'Ganginar Par, Mymensingh', [['p05', 2, 'L']], 'COD', 'Delivered', '2026-09-25'),
    ];
    const customers = [
        { id: uid('c'), name: 'Tanvir Ahmed', phone: '01711223344', email: 'tanvir.a@gmail.com', city: 'Dhaka', joined: '2026-03-14' },
        { id: uid('c'), name: 'Rafid Hasan', phone: '01855667788', email: 'rafid.h@gmail.com', city: 'Chattogram', joined: '2026-05-02' },
        { id: uid('c'), name: 'Nabil Chowdhury', phone: '01699887766', email: 'nabil.c@gmail.com', city: 'Sylhet', joined: '2026-01-22' },
        { id: uid('c'), name: 'Arif Rahman', phone: '01933445566', email: 'arif.r@gmail.com', city: 'Dhaka', joined: '2025-11-30' },
        { id: uid('c'), name: 'Sakib Hossain', phone: '01577889900', email: 'sakib.h@gmail.com', city: 'Rajshahi', joined: '2026-07-19' },
        { id: uid('c'), name: 'Fahim Islam', phone: '01722334455', email: 'fahim.i@gmail.com', city: 'Dhaka', joined: '2026-02-08' },
        { id: uid('c'), name: 'Mehedi Khan', phone: '01644556677', email: 'mehedi.k@gmail.com', city: 'Dhaka', joined: '2026-08-25' },
        { id: uid('c'), name: 'Imran Ali', phone: '01533445566', email: 'imran.a@gmail.com', city: 'Dhaka', joined: '2026-04-11' },
    ];
    return {
        products, orders, customers,
        categories: [
            { id: 'formal', name: 'Formal Wear', slug: 'formal', desc: 'Suits, shirts, blazers & trousers', img: U('1594938298603-c8148c4dae35', 600) },
            { id: 'casual', name: 'Casual Wear', slug: 'casual', desc: 'Tees, jackets & denim', img: U('1552374196-1ab2a1c593e8', 600) },
            { id: 'accessories', name: 'Accessories', slug: 'accessories', desc: 'Watches, leather & footwear', img: U('1523170335258-f5ed11844a49', 600) },
        ],
        coupons: [
            { id: uid('cp'), code: 'WELCOME15', type: '%', value: 15, min: 2000, used: 184, limit: 500, expiry: '2026-12-31', status: 'active' },
            { id: uid('cp'), code: 'EID10', type: '%', value: 10, min: 3000, used: 96, limit: 300, expiry: '2026-11-30', status: 'active' },
            { id: uid('cp'), code: 'FLAT500', type: 'flat', value: 500, min: 8000, used: 41, limit: 100, expiry: '2026-10-31', status: 'active' },
            { id: uid('cp'), code: 'GENTLEMAN5', type: '%', value: 5, min: 0, used: 512, limit: 1000, expiry: '2027-01-31', status: 'draft' },
        ],
        banners: [
            { id: uid('b'), title: 'Style That Defines You', subtitle: 'Dress sharp. Live confident — new season tailoring has landed.', cta: 'Shop Formal Wear', img: 'assets/../assets/img/brand-banner.jpg', link: 'collection.html?cat=formal', order: 1, active: true },
            { id: uid('b'), title: 'The Wedding Edit ’26', subtitle: 'Half-canvassed suits for the days everyone remembers.', cta: 'Shop the Edit', img: U('1507679799987-c73779587ccf', 1600), link: 'collection.html?cat=formal', order: 2, active: true },
            { id: uid('b'), title: 'New Season Casuals', subtitle: 'Effortless everyday luxury, without the effort.', cta: 'Shop Casuals', img: U('1488161628813-04466f872be2', 1600), link: 'collection.html?cat=casual', order: 3, active: true },
        ],
        lookbook: [
            { id: uid('l'), title: 'The Wedding Edit', sub: 'Suits · Shirts — 24 looks', img: U('1507679799987-c73779587ccf', 800) },
            { id: uid('l'), title: 'Autumn / Winter ’26', sub: 'Jackets · Denim — 18 looks', img: U('1488161628813-04466f872be2', 800) },
            { id: uid('l'), title: 'Office Essentials', sub: 'Shirts · Trousers — 15 looks', img: U('1519085360753-af0119f7cbe7', 800) },
            { id: uid('l'), title: 'The Details', sub: 'Watches · Leather — 12 looks', img: U('1523170335258-f5ed11844a49', 800) },
        ],
        videos: [
            { id: uid('v'), title: 'Behind the Seams', cat: 'Craft', type: 'mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: U('1594938298603-c8148c4dae35', 600) },
            { id: uid('v'), title: 'The Wedding Edit', cat: 'Editorial', type: 'youtube', url: 'dQw4w9WgXcQ', thumb: U('1507679799987-c73779587ccf', 600) },
            { id: uid('v'), title: 'Styling the Jacket', cat: 'Styling', type: 'youtube', url: 'dQw4w9WgXcQ', thumb: U('1488161628813-04466f872be2', 600) },
            { id: uid('v'), title: 'New Season ’26', cat: 'Drop', type: 'mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: U('1552374196-1ab2a1c593e8', 600) },
            { id: uid('v'), title: 'The Details', cat: 'Accessories', type: 'youtube', url: 'dQw4w9WgXcQ', thumb: U('1523170335258-f5ed11844a49', 600) },
        ],
        reviews: [
            { id: uid('r'), product: 'Regal Black Two-Piece Suit', customer: 'Tanvir Ahmed', rating: 5, text: 'Fits better than tailors I’ve paid triple for. The fabric, the finish — unreal for the price.', date: '2026-10-09', status: 'approved' },
            { id: uid('r'), product: 'Ranger Field Jacket', customer: 'Rafid Hasan', rating: 5, text: 'Ordered Tuesday, wearing it Friday. Now my everyday armour — quality is top tier.', date: '2026-10-08', status: 'approved' },
            { id: uid('r'), product: 'Ivory Classic Dress Shirt', customer: 'Nabil Chowdhury', rating: 5, text: 'Finally a local brand that understands fit. Needed zero alterations.', date: '2026-10-05', status: 'pending' },
            { id: uid('r'), product: 'Chrono Steel Watch', customer: 'Sakib Hossain', rating: 4, text: 'Beautiful watch, strap took a day to soften. Great value overall.', date: '2026-10-03', status: 'pending' },
            { id: uid('r'), product: 'Essential White Crew Tee', customer: 'Fahim Islam', rating: 5, text: 'Third time reordering. Collar never sags, fabric is heavy and soft.', date: '2026-09-30', status: 'approved' },
            { id: uid('r'), product: 'Court Classic Sneakers', customer: 'Nasir Ahmed', rating: 2, text: 'Runs small — had to exchange. Exchange process was smooth though.', date: '2026-09-28', status: 'rejected' },
        ],
        settings: { storeName: 'Jovent Menswear', phone: '+880 1700-000000', email: 'hello@joventmenswear.com', address: 'House 12, Road 5, Gulshan, Dhaka 1212', cod: true, bkash: true, card: true, shipDhaka: 80, shipOutside: 130, freeOver: 5000, exchangeDays: 7, courier: { provider: 'steadfast', apiKey: '', secret: '', endpoint: '', enabled: false },
            seo: { title: 'Jovent Menswear — Style That Defines You', description: 'Premium menswear designed in Dhaka — sharp tailoring, modern casuals and accessories. Cash on Delivery across Bangladesh.', keywords: 'menswear bangladesh, suits dhaka, premium shirts, jovent', image: '' },
            analytics: { gaId: '', pixelId: '' },
            social: { facebook: '', instagram: '', tiktok: '', youtube: '', whatsapp: '' },
            chat: { enabled: true, welcome: '', whatsapp: '', hours: 'Sat–Thu, 10am–8pm' },
            paydetails: { bkash: '', nagad: '', bankName: '', accName: '', accNo: '', routing: '', branch: '', instructions: 'Send Money to the merchant number above, then enter your Transaction ID below.' },
            gateway: { provider: 'sslcommerz', storeId: '', storePass: '', sandbox: true } },
        /* COD fraud control — keyed by normalized phone. refused = parcels refused at the door. */
        fraud: {},
    };
}

/* ---------------- store ---------------- */
const KEY = 'jovent_admin_db_v1';
let DB;
function load() { try { DB = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { DB = seed(); } }
function save() { localStorage.setItem(KEY, JSON.stringify(DB)); }
const prod = id => DB.products.find(p => p.id === id);

/* ---------------- COD fraud control ----------------
   Phone-keyed risk store. A refused delivery at the door flags the number,
   and the storefront hides Cash on Delivery for flagged numbers. */
const normPhone = p => String(p || '').replace(/\D/g, '').replace(/^880/, '0');
const todayStr = () => new Date().toISOString().slice(0, 10);
function fraudRec(phone) { return DB.fraud[normPhone(phone)] || null; }
function isFlagged(phone) { const r = fraudRec(phone); return !!(r && r.flagged); }
function phoneStats(phone) {
    const k = normPhone(phone);
    const os = DB.orders.filter(o => normPhone(o.phone) === k);
    const delivered = os.filter(o => o.status === 'Delivered').length;
    const returned = os.filter(o => o.status === 'Returned').length;
    const cancelled = os.filter(o => o.status === 'Cancelled').length;
    const total = os.length;
    return { total, delivered, returned, cancelled, ratio: total ? Math.round(delivered / total * 100) : null };
}
function flagPhone(phone, reason) {
    const k = normPhone(phone); if (k.length < 11) return false;
    const r = DB.fraud[k] || { refused: 0, cancelled: 0 };
    r.flagged = true; r.reason = reason; r.date = todayStr();
    DB.fraud[k] = r; save(); return true;
}
function unflagPhone(phone) {
    const k = normPhone(phone), r = DB.fraud[k]; if (!r) return;
    r.flagged = false; r.unflagged = todayStr(); save();
}
function recordRefused(o) {
    const k = normPhone(o.phone); if (k.length < 11) return;
    const r = DB.fraud[k] || { refused: 0, cancelled: 0 };
    r.refused = (r.refused || 0) + 1;
    r.flagged = true;
    r.reason = `Refused delivery — ${o.code}`;
    r.date = todayStr();
    DB.fraud[k] = r; save();
}
function recordCustomerCancel(o) {
    const k = normPhone(o.phone); if (k.length < 11) return;
    const r = DB.fraud[k] || { refused: 0, cancelled: 0 };
    r.cancelled = (r.cancelled || 0) + 1;
    DB.fraud[k] = r; save();
}

/* ---------------- Courier integration ----------------
   Adapter over BD courier providers. DEMO mode simulates the full
   consignment lifecycle locally. LIVE mode calls your provider's API —
   paste the endpoint + keys in Settings → Courier Integration.
   Production (Laravel): swap CourierAPI.live.* for Http::withToken()
   calls to the same endpoints; keep the status pipeline identical. */
const COURIERS = {
    steadfast: { name: 'Steadfast', prefix: 'SF-', color: '#e2574c' },
    redx: { name: 'RedX', prefix: 'RX-', color: '#f5a623' },
    pathao: { name: 'Pathao', prefix: 'PT-', color: '#d32f2f' },
    ecourier: { name: 'eCourier', prefix: 'EC-', color: '#2e9e5b' },
    paperfly: { name: 'Paperfly', prefix: 'PF-', color: '#7b5cff' },
};
const COURIER_PIPE = ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
const COURIER_LABEL = { created: 'Consignment created', picked_up: 'Picked up', in_transit: 'In transit', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned' };
const courierCfg = () => Object.assign({ provider: 'steadfast', apiKey: '', secret: '', endpoint: '', enabled: false }, DB.settings.courier || {});
const CourierAPI = {
    providerName(p) { return (COURIERS[p] || {}).name || p; },
    /* Create a consignment for an order. Returns the courier object. */
    create(o) {
        const cfg = courierCfg();
        const cx = COURIERS[cfg.provider] || COURIERS.steadfast;
        const trackingId = cx.prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const courier = {
            provider: cfg.provider, trackingId, status: 'created', updated: now, mode: cfg.enabled && cfg.apiKey ? 'live' : 'demo',
            history: [{ s: 'created', t: now, note: 'Consignment created' + (courierModeNote(cfg)) }],
        };
        /* LIVE: POST cfg.endpoint (e.g. Pathao POST /aladdin/api/v1/orders)
           with { recipient, address, phone, cod_amount: o.total } and use the
           returned consignment_id as trackingId. */
        o.courier = courier; save();
        return courier;
    },
    /* Advance (demo) or fetch (live) the courier status. Returns new status. */
    sync(o) {
        const c = o.courier; if (!c) return null;
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        const i = COURIER_PIPE.indexOf(c.status);
        /* LIVE: GET {endpoint}/track/{trackingId} (or provider webhook) →
           map the provider status onto COURIER_PIPE and push to history. */
        if (i >= 0 && i < COURIER_PIPE.length - 1) {
            c.status = COURIER_PIPE[i + 1];
            c.updated = now;
            c.history.push({ s: c.status, t: now, note: COURIER_LABEL[c.status] });
            if (c.status === 'out_for_delivery' && o.status !== 'Delivered') o.status = 'Out for delivery';
            if (c.status === 'delivered') o.status = 'Delivered';
            save();
        }
        return c.status;
    },
    cancel(o) {
        const c = o.courier; if (!c) return;
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        c.status = 'cancelled'; c.updated = now;
        c.history.push({ s: 'cancelled', t: now, note: 'Consignment cancelled by merchant' });
        save();
    },
};
function courierModeNote(cfg) { return (cfg.enabled && cfg.apiKey) ? ' · live API' : ' · demo mode'; }

/* ---------------- charts (hand-rolled canvas) ---------------- */
function setupCanvas(cv, h) {
    const dpr = window.devicePixelRatio || 1, w = cv.clientWidth;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    return [ctx, w, h];
}
function animate(draw, dur) {
    dur = dur || 1100; const t0 = performance.now();
    (function f(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); draw(e); if (p < 1) requestAnimationFrame(f); })(t0);
}
function lineChart(cv, labels, data) {
    const [ctx, W, H] = setupCanvas(cv, 300), pad = { l: 46, r: 14, t: 18, b: 30 };
    const max = Math.max(...data) * 1.15;
    const X = i => pad.l + (W - pad.l - pad.r) * i / (data.length - 1);
    const Y = v => H - pad.b - (H - pad.t - pad.b) * v / max;
    animate(p => {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.fillStyle = '#8f8a80'; ctx.font = '10.5px Jost'; ctx.lineWidth = 1;
        for (let g = 0; g <= 4; g++) { const v = max * g / 4, y = Y(v);
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
            ctx.fillText('৳' + Math.round(v) + 'k', 4, y + 3.5); }
        labels.forEach((l, i) => { if (i % 2 === 0) ctx.fillText(l, X(i) - 8, H - 10); });
        const n = Math.max(2, Math.floor(data.length * p));
        const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
        grad.addColorStop(0, 'rgba(201,162,75,.32)'); grad.addColorStop(1, 'rgba(201,162,75,0)');
        ctx.beginPath(); ctx.moveTo(X(0), Y(data[0]));
        for (let i = 1; i < n; i++) { const xc = (X(i - 1) + X(i)) / 2; ctx.bezierCurveTo(xc, Y(data[i - 1]), xc, Y(data[i]), X(i), Y(data[i])); }
        ctx.strokeStyle = '#c9a24b'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.lineTo(X(n - 1), H - pad.b); ctx.lineTo(X(0), H - pad.b); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
        const lx = X(n - 1), ly = Y(data[n - 1]);
        ctx.beginPath(); ctx.arc(lx, ly, 5, 0, 7); ctx.fillStyle = '#e6c878'; ctx.fill();
        ctx.beginPath(); ctx.arc(lx, ly, 9, 0, 7); ctx.strokeStyle = 'rgba(230,200,120,.4)'; ctx.lineWidth = 2; ctx.stroke();
    });
}
function donutChart(cv, parts) {
    const [ctx, W, H] = setupCanvas(cv, 230), cx = W / 2, cy = H / 2, R = 78, r = 52;
    const total = parts.reduce((s, x) => s + x.v, 0);
    animate(p => {
        ctx.clearRect(0, 0, W, H); let a = -Math.PI / 2;
        parts.forEach(x => {
            const a2 = a + (x.v / total) * Math.PI * 2 * p;
            ctx.beginPath(); ctx.arc(cx, cy, R, a, a2); ctx.arc(cx, cy, r, a2, a, true); ctx.closePath();
            ctx.fillStyle = x.c; ctx.fill(); a = a2;
        });
        ctx.fillStyle = '#f4f1e8'; ctx.font = '600 24px Jost'; ctx.textAlign = 'center';
        ctx.fillText(Math.round(total * p) + '%', cx, cy + 2);
        ctx.fillStyle = '#8f8a80'; ctx.font = '11px Jost'; ctx.fillText('by category', cx, cy + 22); ctx.textAlign = 'left';
    });
}
function barChart(cv, labels, data) {
    const [ctx, W, H] = setupCanvas(cv, 230), pad = { l: 10, r: 10, t: 16, b: 28 };
    const max = Math.max(...data) * 1.2, bw = (W - pad.l - pad.r) / data.length;
    animate(p => {
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#8f8a80'; ctx.font = '10.5px Jost';
        data.forEach((v, i) => {
            const h = (H - pad.t - pad.b) * v / max * p, x = pad.l + bw * i + bw * .22, y = H - pad.b - h;
            const g = ctx.createLinearGradient(0, y, 0, H - pad.b);
            g.addColorStop(0, '#e6c878'); g.addColorStop(1, '#8a6d2f');
            ctx.fillStyle = g;
            const w = bw * .56; ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, w, h, [5, 5, 0, 0]); else ctx.rect(x, y, w, h);
            ctx.fill();
            ctx.fillStyle = '#8f8a80'; ctx.fillText(labels[i], x + w / 2 - 8, H - 9);
            if (p === 1) { ctx.fillStyle = '#f4f1e8'; ctx.fillText(v, x + w / 2 - 4, y - 7); ctx.fillStyle = '#8f8a80'; }
        });
    });
}

/* ---------------- page detection & auth ---------------- */
const PAGE = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
const VIEW = PAGE === 'index' ? 'dashboard' : PAGE;
const RENDER = { dashboard: renderDashboard, orders: renderOrders, products: renderProducts, categories: renderCategories, customers: renderCustomers, coupons: renderCoupons, banners: renderBanners, content: renderContent, reviews: renderReviews, subscribers: renderSubscribers, fraud: renderFraud, reports: renderReports, settings: renderSettings };
const TITLES = {
    dashboard: ['Dashboard', 'Here’s what’s happening at Jovent today.'],
    orders: ['Orders', 'Track, update and fulfil every order.'],
    products: ['Products', 'Your entire catalogue in one place.'],
    categories: ['Categories', 'Organise how customers browse.'],
    customers: ['Customers', 'Every gentleman who shops with you.'],
    coupons: ['Coupons', 'Discounts that drive sales.'],
    banners: ['Hero Banners', 'Control the homepage spotlight.'],
    content: ['Content', 'Lookbook stories and brand films.'],
    reviews: ['Reviews', 'What customers say — approve the best.'],
    subscribers: ['Subscribers', 'Everyone on your newsletter list.'],
    fraud: ['Fraud Control', 'COD risk — refused deliveries and blacklisted numbers.'],
    reports: ['Reports', 'Revenue, top products and exports.'],
    settings: ['Settings', 'Store details, payments and delivery.'],
};
function requireAuth() {
    if (PAGE === 'login') return true;
    if (sessionStorage.getItem('jovent_admin') !== '1') { location.href = 'login.html'; return false; }
    return true;
}

/* ---------------- shared bits ---------------- */
const pill = (txt, cls) => `<span class="pill ${cls}">${txt}</span>`;
const oPill = s => pill(s, { Pending: 'p-pending', Confirmed: 'p-confirmed', Shipped: 'p-shipped', 'Out for delivery': 'p-transit', Delivered: 'p-delivered', Cancelled: 'p-cancelled', Returned: 'p-returned' }[s] || 'p-pending');
const stockPill = s => s === 0 ? pill('Out of stock', 'p-out') : s <= 8 ? pill(`Low · ${s}`, 'p-low') : pill(`In stock · ${s}`, 'p-in');
const stars = r => `<span class="stars">${'★'.repeat(r)}${'☆'.repeat(5 - r)}</span>`;

/* ---------------- DASHBOARD ---------------- */
function renderDashboard() {
    const rev = DB.orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
    const pending = DB.orders.filter(o => o.status === 'Pending').length;
    const low = DB.products.filter(p => p.stock <= 8).length;
    const stats = [
        { l: 'Total Revenue', v: fmt(rev), d: '+18.2%', up: 1, ic: '<path d="M12 2v20M17 7c0-2-2.2-3-5-3s-5 1-5 3 2 3 5 3 5 1 5 3-2.2 3-5 3-5-1-5-3"/>' },
        { l: 'Orders', v: DB.orders.length, d: '+12.5%', up: 1, ic: '<path d="M6 8h15l-1.5 12.5a1 1 0 0 1-1 .5H8.5a1 1 0 0 1-1-.5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' },
        { l: 'Customers', v: DB.customers.length, d: '+8.1%', up: 1, ic: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.7c2.6.3 4.7 2 5.5 5"/>' },
        { l: 'Products Live', v: DB.products.filter(p => p.status === 'active').length, d: low + ' low stock', up: 0, ic: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>' },
    ];
    $('#dashStats').innerHTML = stats.map(s => `
        <div class="stat-card"><div class="stat-top">
            <div class="ic"><svg viewBox="0 0 24 24">${s.ic}</svg></div>
            <span class="delta ${s.up ? 'up' : 'down'}">${s.d}</span></div>
            <h3>${s.v}</h3><div class="lbl">${s.l}</div></div>`).join('');
    lineChart($('#chRevenue'), ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], [38, 45, 42, 58, 63, 71, 68, 84, 96, 118]);
    donutChart($('#chDonut'), [{ v: 46, c: '#c9a24b' }, { v: 35, c: '#6b5a34' }, { v: 19, c: '#3a3a3a' }]);
    barChart($('#chBars'), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [12, 19, 9, 14, 22, 28, 17]);
    const recent = [...DB.orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    $('#dashOrders').innerHTML = recent.map(o => `
        <tr><td><b>${o.code}</b><br><small style="color:var(--muted)">${esc(o.customer)}</small></td>
        <td class="num">${fmt(o.total)}</td><td>${oPill(o.status)}</td><td style="color:var(--muted)">${dstr(o.date)}</td></tr>`).join('');
    const top = [...DB.products].sort((a, b) => b.sold - a.sold).slice(0, 5);
    $('#dashTop').innerHTML = top.map(p => `
        <div class="li-row"><img src="${p.img}" alt="" loading="lazy">
        <div class="t"><b>${esc(p.name)}</b><small>${p.sold} sold · ${fmt(p.price)}</small>
        <div class="stock-bar"><i style="width:${Math.min(100, p.sold / 3.4)}%"></i></div></div>
        <div class="v">${fmt(p.sold * p.price)}</div></div>`).join('');
    const lowP = DB.products.filter(p => p.stock <= 8).sort((a, b) => a.stock - b.stock);
    $('#dashLow').innerHTML = lowP.length ? lowP.map(p => `
        <div class="li-row"><img src="${p.img}" alt="" loading="lazy">
        <div class="t"><b>${esc(p.name)}</b><small>${p.sku}</small></div>
        <div>${stockPill(p.stock)}</div></div>`).join('')
        : '<p style="color:var(--muted);font-weight:300">All stocked up. Nothing running low.</p>';
}

/* ---------------- ORDERS ---------------- */
let orderQ = '', orderF = 'all';
function renderOrders() {
    const rows = DB.orders.filter(o =>
        (orderF === 'all' || o.status === orderF) &&
        (o.code + o.customer + o.phone).toLowerCase().includes(orderQ));
    $('#ordersTbl').innerHTML = rows.map(o => `
        <tr><td><b>${o.code}</b><br><small style="color:var(--muted)">${dstr(o.date)}</small></td>
        <td><div class="cell-main"><b>${esc(o.customer)}${isFlagged(o.phone) ? ' <span class="pill p-flagged" title="COD blocked for this number">⚠</span>' : ''}</b><small>${esc(o.phone)} · ${esc(o.city)}</small></div></td>
        <td class="num">${o.items.reduce((s, i) => s + i.qty, 0)}</td>
        <td>${o.pay}</td><td class="num"><b>${fmt(o.total)}</b></td><td>${oPill(o.status)}</td>
        <td><div class="row-actions"><button class="mini-btn" data-view-order="${o.id}" title="View"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></button></div></td></tr>`).join('')
        || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:40px">No orders match.</td></tr>`;
    $$('#view-orders [data-view-order]').forEach(b => b.onclick = () => openOrder(b.dataset.viewOrder));
}
function openOrder(id) {
    const o = DB.orders.find(x => x.id === id); if (!o) return;
    const items = o.items.map(i => { const p = prod(i.pid); return `
        <div class="od-line"><img src="${p ? p.img : ''}" alt="">
        <div class="t"><b>${p ? esc(p.name) : 'Removed product'}</b><small>Size ${i.size} · Qty ${i.qty}</small></div>
        <div class="num">${fmt(i.price * i.qty)}</div></div>`; }).join('');
    const flagged = isFlagged(o.phone);
    const c = o.courier;
    const courierSec = c ? `
        <div class="courier-box">
            <div class="courier-top"><span class="courier-name" style="--cc:${(COURIERS[c.provider] || {}).color || '#c9a24b'}">${esc(CourierAPI.providerName(c.provider))}</span>
                <code class="track-id">${esc(c.trackingId)}</code>
                <button class="mini-btn" id="odCopyTrack" title="Copy tracking ID"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>
                <span class="pill ${c.status === 'delivered' ? 'p-delivered' : c.status === 'cancelled' ? 'p-cancelled' : 'p-shipped'}">${esc(COURIER_LABEL[c.status] || c.status)}</span></div>
            <div class="courier-hist">${c.history.map(h => `<div class="ch-row"><i></i><div><b>${esc(COURIER_LABEL[h.s] || h.s)}</b><small>${esc(h.t)}${h.note ? ' · ' + esc(h.note) : ''}</small></div></div>`).join('')}</div>
            <div class="mrow" style="margin-top:12px">
                <button class="btn btn-ghost" id="odSync" style="flex:1;justify-content:center">Sync Status</button>
                ${c.status !== 'delivered' && c.status !== 'cancelled' ? '<button class="btn btn-ghost" id="odCancelCons" style="flex:1;justify-content:center">Cancel Consignment</button>' : ''}
            </div>
            <small style="color:var(--muted)">${c.mode === 'live' ? 'Live courier API' : 'Demo mode — connect your courier API in Settings'} · updated ${esc(c.updated)}</small>
        </div>` : `
        <p style="color:var(--muted);font-size:13px;font-weight:300;margin-bottom:12px">No consignment yet. Create one to generate a tracking ID — it appears on the customer's tracking page automatically.</p>
        <button class="btn btn-gold btn-block" id="odCreateCons" style="justify-content:center">Create Consignment${courierCfg().enabled && courierCfg().apiKey ? ' · ' + esc(CourierAPI.providerName(courierCfg().provider)) : ''}</button>`;
    openDrawer(`Order ${o.code}`, `
        <div class="od-head"><div>${oPill(o.status)}${flagged ? ' <span class="pill p-flagged" title="This number refused a delivery before — COD is blocked for it">⚠ Flagged</span>' : ''}</div>
            <select class="sel" id="odStatus">${['Pending', 'Confirmed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled', 'Returned'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        <div class="od-sec"><h5>Customer ${flagged ? '<span class="pill p-flagged">COD blocked</span>' : ''}</h5><p><b style="color:var(--white)">${esc(o.customer)}</b><br>${esc(o.phone)}<br>${esc(o.address)}, ${esc(o.city)}</p></div>
        <div class="od-sec"><h5>Items</h5>${items}
            <div class="tot-row"><span>Subtotal</span><span class="num">${fmt(o.subtotal)}</span></div>
            ${o.discount ? `<div class="tot-row"><span>Coupon ${esc(o.coupon || '')}</span><span class="num">−${fmt(o.discount)}</span></div>` : ''}
            <div class="tot-row"><span>Delivery</span><span class="num">${o.shipping === 0 ? 'Free' : fmt(o.shipping)}</span></div>
            <div class="tot-row grand"><span>Total</span><span class="num">${fmt(o.total)}</span></div>
            <div class="pay-edit"><span>Payment</span><select class="sel" id="odPay">${['COD', 'bKash', 'Card'].map(p => `<option ${p === o.pay ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
            ${o.trx ? `<div class="pay-edit"><span>Transaction ID</span><code class="track-id">${esc(o.trx)}</code></div>` : ''}</div>
        <div class="od-sec"><h5>Courier & Tracking</h5>${courierSec}</div>
        <div class="od-sec"><h5>Timeline</h5><p>Placed ${dstr(o.date)}<br>Status history is tracked automatically.</p></div>`,
        `<button class="btn btn-ghost" id="odClose" style="flex:1;justify-content:center">Close</button>
         ${(o.status === 'Shipped' || o.status === 'Out for delivery') && o.pay === 'COD' ? '<button class="btn btn-danger" id="odRefused" style="flex:1.4;justify-content:center">Refused at Delivery</button>' : ''}
         <button class="btn btn-gold" id="odSave" style="flex:2;justify-content:center">Save Changes</button>`);
    $('#odClose').onclick = closeDrawer;
    $('#odSave').onclick = () => {
        const ns = $('#odStatus').value;
        if (ns === 'Cancelled' && o.status !== 'Cancelled') recordCustomerCancel(o);
        o.status = ns; o.pay = $('#odPay').value; save(); closeDrawer(); renderOrders(); renderNotifs(); toast(`Order ${o.code} updated`);
    };
    const rf = $('#odRefused');
    if (rf) rf.onclick = () => confirmBox('Refused at delivery?', `${esc(o.customer)} (${esc(o.phone)}) refused this COD parcel at the door. The number will be flagged and Cash on Delivery blocked for all future orders.`, () => {
        o.status = 'Returned'; recordRefused(o); save(); closeDrawer(); renderOrders(); renderNotifs();
        toast('Marked refused — number flagged, COD blocked');
    });
    const cc = $('#odCreateCons');
    if (cc) cc.onclick = () => { CourierAPI.create(o); openOrder(id); renderOrders(); toast(`Consignment ${o.courier.trackingId} created`); };
    const sy = $('#odSync');
    if (sy) sy.onclick = () => { const s = CourierAPI.sync(o); openOrder(id); renderOrders(); toast(s ? `Courier: ${COURIER_LABEL[s]}` : 'Already at final status'); };
    const cx = $('#odCancelCons');
    if (cx) cx.onclick = () => confirmBox('Cancel this consignment?', 'The courier booking will be cancelled.', () => { CourierAPI.cancel(o); openOrder(id); toast('Consignment cancelled'); });
    const cp = $('#odCopyTrack');
    if (cp) cp.onclick = () => { try { navigator.clipboard.writeText(o.courier.trackingId); toast('Tracking ID copied'); } catch { toast(o.courier.trackingId); } };
}

/* ---------------- PRODUCTS ---------------- */
let prodQ = '', prodF = 'all';
function renderProducts() {
    const rows = DB.products.filter(p =>
        (prodF === 'all' || p.cat === prodF || (prodF === 'low' && p.stock <= 8)) &&
        (p.name + p.sku).toLowerCase().includes(prodQ));
    $('#productsTbl').innerHTML = rows.map(p => `
        <tr><td><img class="timg" src="${p.img}" alt="" loading="lazy"></td>
        <td><div class="cell-main"><b>${esc(p.name)}</b><small>${p.sku} · ${CATS[p.cat]}${p.badge ? ' · ' + esc(p.badge) : ''}</small></div></td>
        <td class="num"><b>${fmt(p.price)}</b>${p.old ? `<br><small style="color:var(--muted)"><s>${fmt(p.old)}</s></small>` : ''}</td>
        <td>${stockPill(p.stock)}</td>
        <td>${p.status === 'active' ? pill('Active', 'p-active') : pill('Draft', 'p-draft')}</td>
        <td><div class="row-actions">
            <button class="mini-btn" data-edit-p="${p.id}" title="Edit"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>
            <button class="mini-btn" data-toggle-p="${p.id}" title="Toggle status"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/></svg></button>
            <button class="mini-btn danger" data-del-p="${p.id}" title="Delete"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button>
        </div></td></tr>`).join('')
        || `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:40px">No products found.</td></tr>`;
    $$('#view-products [data-edit-p]').forEach(b => b.onclick = () => productForm(b.dataset.editP));
    $$('#view-products [data-toggle-p]').forEach(b => b.onclick = () => { const p = prod(b.dataset.toggleP); p.status = p.status === 'active' ? 'draft' : 'active'; save(); renderProducts(); toast(`${p.name} → ${p.status}`); });
    $$('#view-products [data-del-p]').forEach(b => b.onclick = () => confirmBox('Delete this product?', 'It will be removed from the storefront immediately.', () => {
        DB.products = DB.products.filter(p => p.id !== b.dataset.delP); save(); renderProducts(); renderNotifs(); toast('Product deleted');
    }));
}
function productForm(id) {
    const p = id ? prod(id) : { name: '', cat: 'formal', price: '', old: '', stock: 20, sku: 'JV-' + Math.random().toString(36).slice(2, 6).toUpperCase(), badge: '', img: '', status: 'active' };
    openDrawer(id ? 'Edit Product' : 'Add Product', `
        <div class="f-grid">
            <div class="f-field full"><label>Product name</label><input id="pfName" value="${esc(p.name)}" placeholder="e.g. Navy Two-Piece Suit"></div>
            <div class="f-field"><label>Category</label><select id="pfCat">${Object.entries(CATS).map(([k, v]) => `<option value="${k}" ${p.cat === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
            <div class="f-field"><label>SKU</label><input id="pfSku" value="${esc(p.sku)}"></div>
            <div class="f-field"><label>Price (৳)</label><input id="pfPrice" type="number" min="0" value="${p.price}"></div>
            <div class="f-field"><label>Compare price (৳)</label><input id="pfOld" type="number" min="0" value="${p.old || ''}" placeholder="Optional"></div>
            <div class="f-field"><label>Stock</label><input id="pfStock" type="number" min="0" value="${p.stock}"></div>
            <div class="f-field"><label>Badge</label><select id="pfBadge">${['', 'New', 'Sale', 'Hot', 'Limited'].map(b => `<option ${p.badge === b ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
            <div class="f-field"><label>Status</label><select id="pfStatus"><option value="active" ${p.status === 'active' ? 'selected' : ''}>Active</option><option value="draft" ${p.status === 'draft' ? 'selected' : ''}>Draft</option></select></div>
            <div class="f-field full"><label>Image URL</label><input id="pfImg" value="${esc(p.img)}" placeholder="https://…"><img class="img-preview" id="pfPrev" src="${esc(p.img) || ''}" style="${p.img ? '' : 'display:none'}"></div>
        </div>`,
        `<button class="btn btn-ghost" id="pfCancel" style="flex:1;justify-content:center">Cancel</button>
         <button class="btn btn-gold" id="pfSave" style="flex:2;justify-content:center">${id ? 'Save Changes' : 'Add Product'}</button>`);
    $('#pfCancel').onclick = closeDrawer;
    $('#pfImg').oninput = e => { const im = $('#pfPrev'); im.src = e.target.value; im.style.display = e.target.value ? '' : 'none'; };
    $('#pfSave').onclick = () => {
        const v = x => $(x).value.trim();
        if (!v('#pfName') || !v('#pfPrice')) { toast('Name and price are required'); return; }
        const data = { name: v('#pfName'), cat: v('#pfCat'), sku: v('#pfSku'), price: +v('#pfPrice'), old: +v('#pfOld') || 0, stock: +v('#pfStock') || 0, badge: v('#pfBadge'), status: v('#pfStatus'), img: v('#pfImg') || U('1521572163474-6864f9cf17ab') };
        if (id) Object.assign(prod(id), data); else DB.products.unshift(Object.assign({ id: uid('p'), sold: 0, rating: 5 }, data));
        save(); closeDrawer(); renderProducts(); renderNotifs(); toast(id ? 'Product updated' : 'Product added');
    };
}

/* ---------------- CATEGORIES ---------------- */
function renderCategories() {
    $('#catsGrid').innerHTML = DB.categories.map(c => {
        const n = DB.products.filter(p => p.cat === c.id).length;
        return `<div class="cont-card"><div class="cimg"><img src="${c.img}" alt="${esc(c.name)}" loading="lazy"></div>
        <div class="cbody"><b>${esc(c.name)}</b><small>${esc(c.desc)}</small></div>
        <div class="cfoot"><span class="pill p-active">${n} products</span>
        <div class="row-actions"><button class="mini-btn" data-edit-c="${c.id}"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button></div></div></div>`;
    }).join('');
    $$('#view-categories [data-edit-c]').forEach(b => b.onclick = () => {
        const c = DB.categories.find(x => x.id === b.dataset.editC);
        openDrawer('Edit Category', `
            <div class="f-field"><label>Name</label><input id="cfName" value="${esc(c.name)}"></div>
            <div class="f-field"><label>Description</label><input id="cfDesc" value="${esc(c.desc)}"></div>
            <div class="f-field"><label>Image URL</label><input id="cfImg" value="${esc(c.img)}"></div>`,
            `<button class="btn btn-ghost" id="cfCancel" style="flex:1;justify-content:center">Cancel</button>
             <button class="btn btn-gold" id="cfSave" style="flex:2;justify-content:center">Save</button>`);
        $('#cfCancel').onclick = closeDrawer;
        $('#cfSave').onclick = () => { c.name = $('#cfName').value.trim() || c.name; c.desc = $('#cfDesc').value.trim(); c.img = $('#cfImg').value.trim() || c.img; save(); closeDrawer(); renderCategories(); toast('Category updated'); };
    });
}

/* ---------------- CUSTOMERS ---------------- */
let custQ = '';
function renderCustomers() {
    const rows = DB.customers.filter(c => (c.name + c.phone + c.email).toLowerCase().includes(custQ)).map(c => {
        const os = DB.orders.filter(o => o.phone === c.phone && o.status !== 'Cancelled');
        const spent = os.reduce((s, o) => s + o.total, 0);
        return { c, n: os.length, spent };
    });
    $('#custTbl').innerHTML = rows.map(({ c, n, spent }) => `
        <tr><td><div class="cell-main"><b>${esc(c.name)}${isFlagged(c.phone) ? ' <span class="pill p-flagged" title="COD blocked">⚠ Flagged</span>' : ''}</b><small>Since ${dstr(c.joined)}</small></div></td>
        <td>${esc(c.phone)}<br><small style="color:var(--muted)">${esc(c.email)}</small></td>
        <td>${esc(c.city)}</td><td class="num">${n}</td><td class="num"><b>${fmt(spent)}</b></td>
        <td><div class="row-actions"><button class="mini-btn" data-view-c="${c.id}" title="View"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></button></div></td></tr>`).join('')
        || `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:40px">No customers found.</td></tr>`;
    $$('#view-customers [data-view-c]').forEach(b => b.onclick = () => {
        const c = DB.customers.find(x => x.id === b.dataset.viewC);
        const os = DB.orders.filter(o => o.phone === c.phone);
        const r = fraudRec(c.phone), st = phoneStats(c.phone);
        const riskSec = `
            <div class="od-sec"><h5>Risk &amp; COD Eligibility</h5>
                ${r && r.flagged
                    ? `<p><span class="pill p-flagged">⚠ COD blocked</span></p><p style="color:var(--muted);font-size:13px">${esc(r.reason || '')} · ${esc(r.date || '')}</p>
                       <button class="btn btn-ghost" id="ccUnflag" style="justify-content:center">Remove Flag — Restore COD</button>`
                    : `<p style="color:var(--muted);font-size:13px">Clean record · ${st.delivered} delivered · ${st.returned} returned · ${st.cancelled} cancelled</p>
                       <button class="btn btn-ghost" id="ccFlag" style="justify-content:center">Flag Number — Block COD</button>`}
            </div>`;
        openDrawer(c.name, `
            <div class="od-sec"><h5>Contact</h5><p>${esc(c.phone)}<br>${esc(c.email)}<br>${esc(c.city)} · Customer since ${dstr(c.joined)}</p></div>
            ${riskSec}
            <div class="od-sec"><h5>Order history (${os.length})</h5>
            ${os.length ? os.map(o => `<div class="od-line"><div class="t"><b>${o.code}</b><small>${dstr(o.date)} · ${o.items.reduce((s, i) => s + i.qty, 0)} items</small></div>${oPill(o.status)}<div class="num">${fmt(o.total)}</div></div>`).join('') : '<p>No orders yet.</p>'}</div>`,
            `<button class="btn btn-gold btn-block" id="ccClose" style="justify-content:center">Done</button>`);
        $('#ccClose').onclick = closeDrawer;
        const uf = $('#ccUnflag');
        if (uf) uf.onclick = () => { unflagPhone(c.phone); closeDrawer(); renderCustomers(); toast('Flag removed — COD restored'); };
        const fl = $('#ccFlag');
        if (fl) fl.onclick = () => { flagPhone(c.phone, 'Manually flagged by admin'); closeDrawer(); renderCustomers(); toast('Number flagged — COD blocked'); };
    });
}

/* ---------------- COUPONS ---------------- */
function renderCoupons() {
    $('#couponsTbl').innerHTML = DB.coupons.map(c => `
        <tr><td><span class="code-chip">${esc(c.code)}</span></td>
        <td><b>${c.type === '%' ? c.value + '% off' : fmt(c.value) + ' off'}</b><br><small style="color:var(--muted)">Min. ${fmt(c.min)} · Expires ${dstr(c.expiry)}</small></td>
        <td class="num">${c.used} / ${c.limit}</td>
        <td><div class="stock-bar" style="width:120px"><i style="width:${Math.min(100, c.used / c.limit * 100)}%"></i></div></td>
        <td>${c.status === 'active' ? pill('Active', 'p-active') : pill('Draft', 'p-draft')}</td>
        <td><div class="row-actions">
            <button class="mini-btn" data-edit-cp="${c.id}"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>
            <button class="mini-btn danger" data-del-cp="${c.id}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button>
        </div></td></tr>`).join('');
    $$('#view-coupons [data-edit-cp]').forEach(b => b.onclick = () => couponForm(b.dataset.editCp));
    $$('#view-coupons [data-del-cp]').forEach(b => b.onclick = () => confirmBox('Delete this coupon?', 'Customers with the code will no longer be able to use it.', () => {
        DB.coupons = DB.coupons.filter(x => x.id !== b.dataset.delCp); save(); renderCoupons(); toast('Coupon deleted');
    }));
}
function couponForm(id) {
    const c = id ? DB.coupons.find(x => x.id === id) : { code: '', type: '%', value: 10, min: 0, limit: 100, expiry: '2026-12-31', status: 'active' };
    openDrawer(id ? 'Edit Coupon' : 'New Coupon', `
        <div class="f-grid">
            <div class="f-field"><label>Code</label><input id="cpCode" value="${esc(c.code)}" placeholder="e.g. WINTER20" style="text-transform:uppercase"></div>
            <div class="f-field"><label>Type</label><select id="cpType"><option value="%" ${c.type === '%' ? 'selected' : ''}>Percentage %</option><option value="flat" ${c.type === 'flat' ? 'selected' : ''}>Flat ৳</option></select></div>
            <div class="f-field"><label>Value</label><input id="cpVal" type="number" min="1" value="${c.value}"></div>
            <div class="f-field"><label>Min. order (৳)</label><input id="cpMin" type="number" min="0" value="${c.min}"></div>
            <div class="f-field"><label>Usage limit</label><input id="cpLim" type="number" min="1" value="${c.limit}"></div>
            <div class="f-field"><label>Expiry</label><input id="cpExp" type="date" value="${c.expiry}"></div>
            <div class="f-field"><label>Status</label><select id="cpSt"><option value="active" ${c.status === 'active' ? 'selected' : ''}>Active</option><option value="draft" ${c.status === 'draft' ? 'selected' : ''}>Draft</option></select></div>
        </div>`,
        `<button class="btn btn-ghost" id="cpCancel" style="flex:1;justify-content:center">Cancel</button>
         <button class="btn btn-gold" id="cpSave" style="flex:2;justify-content:center">${id ? 'Save' : 'Create Coupon'}</button>`);
    $('#cpCancel').onclick = closeDrawer;
    $('#cpSave').onclick = () => {
        const code = $('#cpCode').value.trim().toUpperCase();
        if (!code) { toast('Coupon code is required'); return; }
        const d = { code, type: $('#cpType').value, value: +$('#cpVal').value || 1, min: +$('#cpMin').value || 0, limit: +$('#cpLim').value || 1, expiry: $('#cpExp').value, status: $('#cpSt').value };
        if (id) Object.assign(c, d); else DB.coupons.unshift(Object.assign({ id: uid('cp'), used: 0 }, d));
        save(); closeDrawer(); renderCoupons(); toast(id ? 'Coupon updated' : 'Coupon created');
    };
}

/* ---------------- BANNERS ---------------- */
function renderBanners() {
    const list = [...DB.banners].sort((a, b) => a.order - b.order);
    $('#bannersGrid').innerHTML = list.map((b, i) => `
        <div class="cont-card"><div class="cimg"><img src="${b.img}" alt="" loading="lazy" onerror="this.style.display='none'">
            <span class="p-badge" style="position:absolute;top:12px;left:12px;z-index:2">Slide ${b.order}</span></div>
        <div class="cbody"><b>${esc(b.title)}</b><small>${esc(b.subtitle)}</small></div>
        <div class="cfoot">
            <label class="switch"><input type="checkbox" data-btog="${b.id}" ${b.active ? 'checked' : ''}><span class="tr"></span></label>
            <div class="row-actions">
                ${i > 0 ? `<button class="mini-btn" data-bup="${b.id}" title="Move up"><svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>` : ''}
                <button class="mini-btn" data-bedit="${b.id}"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>
                <button class="mini-btn danger" data-bdel="${b.id}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button>
            </div></div></div>`).join('');
    $$('#view-banners [data-btog]').forEach(t => t.onchange = () => { DB.banners.find(x => x.id === t.dataset.btog).active = t.checked; save(); toast('Banner ' + (t.checked ? 'enabled' : 'disabled')); });
    $$('#view-banners [data-bedit]').forEach(b => b.onclick = () => bannerForm(b.dataset.bedit));
    $$('#view-banners [data-bup]').forEach(btn => btn.onclick = () => {
        const l = [...DB.banners].sort((a, x) => a.order - x.order), ix = l.findIndex(x => x.id === btn.dataset.bup);
        [l[ix - 1].order, l[ix].order] = [l[ix].order, l[ix - 1].order]; save(); renderBanners(); toast('Slide order updated');
    });
    $$('#view-banners [data-bdel]').forEach(btn => btn.onclick = () => confirmBox('Delete this slide?', 'It will be removed from the homepage hero.', () => {
        DB.banners = DB.banners.filter(x => x.id !== btn.dataset.bdel); save(); renderBanners(); toast('Slide deleted');
    }));
}
function bannerForm(id) {
    const b = id ? DB.banners.find(x => x.id === id) : { title: '', subtitle: '', cta: 'Shop Now', img: '', link: 'collection.html', order: DB.banners.length + 1, active: true };
    openDrawer(id ? 'Edit Slide' : 'New Slide', `
        <div class="f-field"><label>Heading</label><input id="bnT" value="${esc(b.title)}" placeholder="Style That Defines You"></div>
        <div class="f-field"><label>Subheading</label><input id="bnS" value="${esc(b.subtitle)}"></div>
        <div class="f-grid">
            <div class="f-field"><label>Button text</label><input id="bnC" value="${esc(b.cta)}"></div>
            <div class="f-field"><label>Button link</label><input id="bnL" value="${esc(b.link)}"></div>
        </div>
        <div class="f-field"><label>Background image URL</label><input id="bnI" value="${esc(b.img)}" placeholder="https://…"><img class="img-preview" id="bnP" src="${esc(b.img)}" style="${b.img ? '' : 'display:none'}"></div>`,
        `<button class="btn btn-ghost" id="bnX" style="flex:1;justify-content:center">Cancel</button>
         <button class="btn btn-gold" id="bnGo" style="flex:2;justify-content:center">${id ? 'Save' : 'Add Slide'}</button>`);
    $('#bnX').onclick = closeDrawer;
    $('#bnI').oninput = e => { const im = $('#bnP'); im.src = e.target.value; im.style.display = e.target.value ? '' : 'none'; };
    $('#bnGo').onclick = () => {
        if (!$('#bnT').value.trim()) { toast('Heading is required'); return; }
        const d = { title: $('#bnT').value.trim(), subtitle: $('#bnS').value.trim(), cta: $('#bnC').value.trim() || 'Shop Now', link: $('#bnL').value.trim(), img: $('#bnI').value.trim() };
        if (id) Object.assign(b, d); else DB.banners.push(Object.assign({ id: uid('b') }, d));
        save(); closeDrawer(); renderBanners(); toast(id ? 'Slide updated' : 'Slide added');
    };
}

/* ---------------- CONTENT (lookbook + videos) ---------------- */
let contentTab = 'lookbook';
function renderContent() {
    $$('#view-content .tab').forEach(t => t.classList.toggle('active', t.dataset.ctab === contentTab));
    const box = $('#contentGrid');
    if (contentTab === 'lookbook') {
        box.innerHTML = DB.lookbook.map(l => `
            <div class="cont-card"><div class="cimg"><img src="${l.img}" alt="" loading="lazy"></div>
            <div class="cbody"><b>${esc(l.title)}</b><small>${esc(l.sub)}</small></div>
            <div class="cfoot"><span style="font-size:12px;color:var(--muted)">Lookbook story</span>
            <div class="row-actions"><button class="mini-btn" data-ledit="${l.id}"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>
            <button class="mini-btn danger" data-ldel="${l.id}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button></div></div></div>`).join('');
        $('#contentAdd').textContent = '+ New Story';
        $$('#view-content [data-ledit]').forEach(b => b.onclick = () => lookForm(b.dataset.ledit));
        $$('#view-content [data-ldel]').forEach(b => b.onclick = () => confirmBox('Delete this story?', '', () => { DB.lookbook = DB.lookbook.filter(x => x.id !== b.dataset.ldel); save(); renderContent(); toast('Story deleted'); }));
    } else {
        box.innerHTML = DB.videos.map(v => `
            <div class="cont-card"><div class="cimg"><img src="${v.thumb}" alt="" loading="lazy">
                <span class="p-badge" style="position:absolute;top:12px;left:12px;z-index:2">${v.type === 'youtube' ? 'YouTube' : 'MP4'}</span></div>
            <div class="cbody"><b>${esc(v.title)}</b><small>${esc(v.cat)}</small></div>
            <div class="cfoot"><span style="font-size:12px;color:var(--muted)">Brand film</span>
            <div class="row-actions"><button class="mini-btn" data-vedit="${v.id}"><svg viewBox="0 0 24 24"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>
            <button class="mini-btn danger" data-vdel="${v.id}"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button></div></div></div>`).join('');
        $('#contentAdd').textContent = '+ New Video';
        $$('#view-content [data-vedit]').forEach(b => b.onclick = () => videoForm(b.dataset.vedit));
        $$('#view-content [data-vdel]').forEach(b => b.onclick = () => confirmBox('Delete this video?', '', () => { DB.videos = DB.videos.filter(x => x.id !== b.dataset.vdel); save(); renderContent(); toast('Video deleted'); }));
    }
}
function lookForm(id) {
    const l = id ? DB.lookbook.find(x => x.id === id) : { title: '', sub: '', img: '' };
    openDrawer(id ? 'Edit Story' : 'New Story', `
        <div class="f-field"><label>Title</label><input id="lkT" value="${esc(l.title)}"></div>
        <div class="f-field"><label>Subtitle</label><input id="lkS" value="${esc(l.sub)}" placeholder="e.g. Suits · Shirts — 24 looks"></div>
        <div class="f-field"><label>Cover image URL</label><input id="lkI" value="${esc(l.img)}"></div>`,
        `<button class="btn btn-ghost" id="lkX" style="flex:1;justify-content:center">Cancel</button>
         <button class="btn btn-gold" id="lkGo" style="flex:2;justify-content:center">${id ? 'Save' : 'Add Story'}</button>`);
    $('#lkX').onclick = closeDrawer;
    $('#lkGo').onclick = () => {
        if (!$('#lkT').value.trim()) { toast('Title is required'); return; }
        const d = { title: $('#lkT').value.trim(), sub: $('#lkS').value.trim(), img: $('#lkI').value.trim() };
        if (id) Object.assign(l, d); else DB.lookbook.push(Object.assign({ id: uid('l') }, d));
        save(); closeDrawer(); renderContent(); toast(id ? 'Story updated' : 'Story added');
    };
}
function videoForm(id) {
    const v = id ? DB.videos.find(x => x.id === id) : { title: '', cat: 'Craft', type: 'youtube', url: '', thumb: '' };
    openDrawer(id ? 'Edit Video' : 'New Video', `
        <div class="f-field"><label>Title</label><input id="vdT" value="${esc(v.title)}"></div>
        <div class="f-grid">
            <div class="f-field"><label>Category</label><input id="vdC" value="${esc(v.cat)}" placeholder="Craft / Editorial / Styling"></div>
            <div class="f-field"><label>Source</label><select id="vdTy"><option value="youtube" ${v.type === 'youtube' ? 'selected' : ''}>YouTube</option><option value="mp4" ${v.type === 'mp4' ? 'selected' : ''}>MP4 file</option></select></div>
        </div>
        <div class="f-field"><label>Video URL / YouTube ID</label><input id="vdU" value="${esc(v.url)}" placeholder="YouTube ID or .mp4 link"></div>
        <div class="f-field"><label>Thumbnail URL</label><input id="vdTh" value="${esc(v.thumb)}"></div>`,
        `<button class="btn btn-ghost" id="vdX" style="flex:1;justify-content:center">Cancel</button>
         <button class="btn btn-gold" id="vdGo" style="flex:2;justify-content:center">${id ? 'Save' : 'Add Video'}</button>`);
    $('#vdX').onclick = closeDrawer;
    $('#vdGo').onclick = () => {
        if (!$('#vdT').value.trim() || !$('#vdU').value.trim()) { toast('Title and video URL are required'); return; }
        const d = { title: $('#vdT').value.trim(), cat: $('#vdC').value.trim() || 'Film', type: $('#vdTy').value, url: $('#vdU').value.trim(), thumb: $('#vdTh').value.trim() };
        if (id) Object.assign(v, d); else DB.videos.push(Object.assign({ id: uid('v') }, d));
        save(); closeDrawer(); renderContent(); toast(id ? 'Video updated' : 'Video added');
    };
}

/* ---------------- REVIEWS ---------------- */
let revF = 'all';
function renderReviews() {
    const rows = DB.reviews.filter(r => revF === 'all' || r.status === revF);
    $('#reviewsBox').innerHTML = rows.map(r => `
        <div class="panel" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:flex-start">
            <div style="flex:1;min-width:220px">
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap"><b>${esc(r.customer)}</b>${stars(r.rating)}<small style="color:var(--muted)">on ${esc(r.product)} · ${dstr(r.date)}</small></div>
                <p style="color:var(--silver);font-weight:300;font-size:14px">“${esc(r.text)}”</p>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end">
                ${r.status === 'approved' ? pill('Approved', 'p-approved') : r.status === 'rejected' ? pill('Rejected', 'p-rejected') : pill('Pending', 'p-pending')}
                <div class="row-actions">
                    ${r.status !== 'approved' ? `<button class="mini-btn" data-rok="${r.id}" title="Approve"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></button>` : ''}
                    ${r.status !== 'rejected' ? `<button class="mini-btn danger" data-rno="${r.id}" title="Reject"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>` : ''}
                    <button class="mini-btn danger" data-rdel="${r.id}" title="Delete"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"/></svg></button>
                </div>
            </div></div></div>`).join('')
        || '<p style="color:var(--muted)">No reviews in this bucket.</p>';
    $$('#view-reviews [data-rok]').forEach(b => b.onclick = () => { DB.reviews.find(x => x.id === b.dataset.rok).status = 'approved'; save(); renderReviews(); toast('Review approved'); });
    $$('#view-reviews [data-rno]').forEach(b => b.onclick = () => { DB.reviews.find(x => x.id === b.dataset.rno).status = 'rejected'; save(); renderReviews(); toast('Review rejected'); });
    $$('#view-reviews [data-rdel]').forEach(b => b.onclick = () => confirmBox('Delete this review?', '', () => { DB.reviews = DB.reviews.filter(x => x.id !== b.dataset.rdel); save(); renderReviews(); toast('Review deleted'); }));
}

/* ---------------- SETTINGS ---------------- */
function renderSettings() {
    const s = DB.settings;
    $('#setStore').innerHTML = `
        <div class="f-field"><label>Store name</label><input id="sName" value="${esc(s.storeName)}"></div>
        <div class="f-grid">
            <div class="f-field"><label>Phone</label><input id="sPhone" value="${esc(s.phone)}"></div>
            <div class="f-field"><label>Email</label><input id="sEmail" value="${esc(s.email)}"></div>
        </div>
        <div class="f-field"><label>Address</label><input id="sAddr" value="${esc(s.address)}"></div>
        <button class="btn btn-gold" id="sSaveStore">Save Changes</button>`;
    $('#sSaveStore').onclick = () => {
        Object.assign(s, { storeName: $('#sName').value.trim(), phone: $('#sPhone').value.trim(), email: $('#sEmail').value.trim(), address: $('#sAddr').value.trim() });
        save(); toast('Store details saved');
    };
    const sw = (key, t, d) => `<div class="set-row"><div class="t"><b>${t}</b><small>${d}</small></div><label class="switch"><input type="checkbox" data-set="${key}" ${s[key] ? 'checked' : ''}><span class="tr"></span></label></div>`;
    $('#setPay').innerHTML =
        sw('cod', 'Cash on Delivery', 'Pay in cash when the order arrives') +
        sw('bkash', 'bKash', 'Mobile payment — details sent after ordering') +
        sw('card', 'Debit / Credit Card', 'Secure card payment via SSLCommerz');
    $$('#setPay [data-set]').forEach(t => t.onchange = () => { s[t.dataset.set] = t.checked; save(); toast('Payment methods updated'); });
    $('#setShip').innerHTML = `
        <div class="f-grid">
            <div class="f-field"><label>Inside Dhaka (৳)</label><input id="sDhaka" type="number" value="${s.shipDhaka}"></div>
            <div class="f-field"><label>Outside Dhaka (৳)</label><input id="sOut" type="number" value="${s.shipOutside}"></div>
            <div class="f-field"><label>Free delivery over (৳)</label><input id="sFree" type="number" value="${s.freeOver}"></div>
            <div class="f-field"><label>Exchange window (days)</label><input id="sEx" type="number" value="${s.exchangeDays}"></div>
        </div>
        <button class="btn btn-gold" id="sSaveShip">Save Changes</button>
        <div style="margin-top:26px;padding-top:22px;border-top:1px solid var(--border-soft)">
            <b style="display:block;margin-bottom:6px">Danger zone</b>
            <p style="color:var(--muted);font-size:13px;font-weight:300;margin-bottom:14px">Restore the original demo catalogue, orders and settings.</p>
            <button class="btn btn-danger" id="sReset">Reset Demo Data</button>
        </div>`;
    $('#sSaveShip').onclick = () => {
        Object.assign(s, { shipDhaka: +$('#sDhaka').value || 0, shipOutside: +$('#sOut').value || 0, freeOver: +$('#sFree').value || 0, exchangeDays: +$('#sEx').value || 7 });
        save(); toast('Delivery settings saved');
    };
    $('#sReset').onclick = () => confirmBox('Reset all demo data?', 'Every change you made will be lost.', () => { DB = seed(); save(); renderSettings(); renderNotifs(); toast('Demo data restored'); });
    /* Courier integration */
    const cc = courierCfg();
    $('#setCourier').innerHTML = `
        <div class="f-grid">
            <div class="f-field"><label>Provider</label><select id="cProv">${Object.entries(COURIERS).map(([k, v]) => `<option value="${k}" ${cc.provider === k ? 'selected' : ''}>${v.name}</option>`).join('')}</select></div>
            <div class="f-field"><label>Status</label><select id="cEn"><option value="0" ${!cc.enabled ? 'selected' : ''}>Demo mode</option><option value="1" ${cc.enabled ? 'selected' : ''}>Live API</option></select></div>
            <div class="f-field"><label>API Key</label><input id="cKey" value="${esc(cc.apiKey)}" placeholder="Paste from courier dashboard" autocomplete="off"></div>
            <div class="f-field"><label>API Secret</label><input id="cSec" type="password" value="${esc(cc.secret)}" placeholder="Kept private" autocomplete="off"></div>
            <div class="f-field full"><label>API Endpoint (optional)</label><input id="cEnd" value="${esc(cc.endpoint)}" placeholder="e.g. https://api.yourcourier.com/v1 — blank = demo simulation"></div>
        </div>
        <div class="mrow" style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-gold" id="cSave" style="flex:1;justify-content:center">Save Courier Settings</button>
            <button class="btn btn-ghost" id="cTest" style="flex:1;justify-content:center">Test Connection</button>
        </div>
        <p style="color:var(--muted);font-size:12.5px;font-weight:300;margin-top:12px">Demo mode simulates the full consignment lifecycle. In Live mode the panel calls your endpoint for create / track / cancel — see <b>CourierAPI</b> in admin.js for the exact integration points your Laravel backend should implement.</p>`;
    $('#cSave').onclick = () => {
        DB.settings.courier = { provider: $('#cProv').value, apiKey: $('#cKey').value.trim(), secret: $('#cSec').value.trim(), endpoint: $('#cEnd').value.trim(), enabled: $('#cEn').value === '1' };
        save(); toast('Courier settings saved');
    };
    $('#cTest').onclick = async () => {
        const cfg = { provider: $('#cProv').value, apiKey: $('#cKey').value.trim(), secret: $('#cSec').value.trim(), endpoint: $('#cEnd').value.trim(), enabled: $('#cEn').value === '1' };
        if (!cfg.enabled || !cfg.apiKey) { toast('Demo mode — nothing to test. Add a key and enable Live API first.'); return; }
        if (!cfg.endpoint) { toast('Add your provider API endpoint to test the live connection.'); return; }
        toast('Pinging courier API…');
        try {
            const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 8000);
            const r = await fetch(cfg.endpoint, { headers: { 'Authorization': 'Bearer ' + cfg.secret || cfg.apiKey }, signal: ctl.signal });
            clearTimeout(to);
            toast(r.ok ? 'Connected — courier API reachable' : `API responded ${r.status} — check keys`);
        } catch { toast('Could not reach the endpoint — check the URL'); }
    };
    /* ---- SEO & Analytics ---- */
    const seo = Object.assign({ title: '', description: '', keywords: '', image: '' }, s.seo || {});
    const ana = Object.assign({ gaId: '', pixelId: '' }, s.analytics || {});
    $('#setSeo').innerHTML = `
        <div class="f-field"><label>Site title</label><input id="seoTitle" value="${esc(seo.title)}"></div>
        <div class="f-field"><label>Meta description</label><input id="seoDesc" value="${esc(seo.description)}"></div>
        <div class="f-field"><label>Keywords</label><input id="seoKw" value="${esc(seo.keywords)}"></div>
        <div class="f-field"><label>OG image URL</label><input id="seoImg" value="${esc(seo.image)}" placeholder="https://\u2026"></div>
        <div class="f-grid">
            <div class="f-field"><label>Google Analytics ID</label><input id="seoGa" value="${esc(ana.gaId)}" placeholder="G-XXXXXXXXXX"></div>
            <div class="f-field"><label>Meta Pixel ID</label><input id="seoPx" value="${esc(ana.pixelId)}" placeholder="1234567890"></div>
        </div>
        <button class="btn btn-gold" id="seoSave" style="margin-top:14px">Save SEO Settings</button>
        <p style="color:var(--muted);font-size:12px;font-weight:300;margin-top:10px">Applied to the storefront automatically \u2014 meta tags, social previews and tracking scripts.</p>`;
    $('#seoSave').onclick = () => {
        s.seo = { title: $('#seoTitle').value.trim(), description: $('#seoDesc').value.trim(), keywords: $('#seoKw').value.trim(), image: $('#seoImg').value.trim() };
        s.analytics = { gaId: $('#seoGa').value.trim(), pixelId: $('#seoPx').value.trim() };
        save(); toast('SEO settings saved \u2014 live on the storefront');
    };
    /* ---- Social media ---- */
    const sm = Object.assign({ facebook: '', instagram: '', tiktok: '', youtube: '', whatsapp: '' }, s.social || {});
    const smField = (k, label, ph) => `<div class="f-field"><label>${label}</label><input id="sm_${k}" value="${esc(sm[k])}" placeholder="${ph}"></div>`;
    $('#setSocial').innerHTML =
        smField('facebook', 'Facebook URL', 'https://facebook.com/\u2026') +
        smField('instagram', 'Instagram URL', 'https://instagram.com/\u2026') +
        smField('tiktok', 'TikTok URL', 'https://tiktok.com/@\u2026') +
        smField('youtube', 'YouTube URL', 'https://youtube.com/@\u2026') +
        smField('whatsapp', 'WhatsApp number', '8801XXXXXXXXX \u2014 footer chat button') +
        `<button class="btn btn-gold" id="smSave" style="margin-top:14px">Save Social Links</button>
         <p style="color:var(--muted);font-size:12px;font-weight:300;margin-top:10px">Filled-in networks appear as icons in the storefront footer.</p>`;
    $('#smSave').onclick = () => {
        s.social = { facebook: $('#sm_facebook').value.trim(), instagram: $('#sm_instagram').value.trim(), tiktok: $('#sm_tiktok').value.trim(), youtube: $('#sm_youtube').value.trim(), whatsapp: $('#sm_whatsapp').value.trim().replace(/\D/g, '') };
        save(); toast('Social links saved \u2014 live in the footer');
    };
    /* ---- Customer chat ---- */
    const ch = Object.assign({ enabled: true, welcome: '', whatsapp: '', hours: '' }, s.chat || {});
    $('#setChat').innerHTML = `
        <div class="set-row"><div class="t"><b>Chat widget</b><small>Floating concierge on the storefront</small></div><label class="switch"><input type="checkbox" id="chEn" ${ch.enabled ? 'checked' : ''}><span class="tr"></span></label></div>
        <div class="f-field"><label>Welcome message</label><input id="chWelcome" value="${esc(ch.welcome)}" placeholder="Default greeting"></div>
        <div class="f-grid">
            <div class="f-field"><label>WhatsApp number</label><input id="chWa" value="${esc(ch.whatsapp)}" placeholder="8801XXXXXXXXX"></div>
            <div class="f-field"><label>Support hours</label><input id="chHours" value="${esc(ch.hours)}" placeholder="Sat\u2013Thu, 10am\u20138pm"></div>
        </div>
        <button class="btn btn-gold" id="chSave" style="margin-top:14px">Save Chat Settings</button>
        <p style="color:var(--muted);font-size:12px;font-weight:300;margin-top:10px">A WhatsApp number adds a \u201cContinue on WhatsApp\u201d button inside the chat.</p>`;
    $('#chSave').onclick = () => {
        s.chat = { enabled: $('#chEn').checked, welcome: $('#chWelcome').value.trim(), whatsapp: $('#chWa').value.trim().replace(/\D/g, ''), hours: $('#chHours').value.trim() };
        save(); toast('Chat settings saved');
    };
    /* ---- Payment details (manual bKash / bank) ---- */
    const pd = Object.assign({ bkash: '', nagad: '', bankName: '', accName: '', accNo: '', routing: '', branch: '', instructions: '' }, s.paydetails || {});
    $('#setPayDet').innerHTML = `
        <div class="f-grid">
            <div class="f-field"><label>bKash merchant no.</label><input id="pdBkash" value="${esc(pd.bkash)}" placeholder="01XXXXXXXXX"></div>
            <div class="f-field"><label>Nagad merchant no.</label><input id="pdNagad" value="${esc(pd.nagad)}" placeholder="01XXXXXXXXX"></div>
        </div>
        <div class="f-grid">
            <div class="f-field"><label>Bank name</label><input id="pdBank" value="${esc(pd.bankName)}" placeholder="e.g. BRAC Bank"></div>
            <div class="f-field"><label>Account name</label><input id="pdAccName" value="${esc(pd.accName)}"></div>
        </div>
        <div class="f-grid">
            <div class="f-field"><label>Account number</label><input id="pdAccNo" value="${esc(pd.accNo)}"></div>
            <div class="f-field"><label>Routing no.</label><input id="pdRouting" value="${esc(pd.routing)}"></div>
        </div>
        <div class="f-field"><label>Branch</label><input id="pdBranch" value="${esc(pd.branch)}"></div>
        <div class="f-field"><label>Checkout instructions</label><input id="pdInstr" value="${esc(pd.instructions)}" placeholder="How the customer should pay"></div>
        <button class="btn btn-gold" id="pdSave" style="margin-top:14px">Save Payment Details</button>
        <p style="color:var(--muted);font-size:12px;font-weight:300;margin-top:10px">Shown at checkout when the customer picks bKash or card.</p>`;
    $('#pdSave').onclick = () => {
        s.paydetails = { bkash: $('#pdBkash').value.trim(), nagad: $('#pdNagad').value.trim(), bankName: $('#pdBank').value.trim(), accName: $('#pdAccName').value.trim(), accNo: $('#pdAccNo').value.trim(), routing: $('#pdRouting').value.trim(), branch: $('#pdBranch').value.trim(), instructions: $('#pdInstr').value.trim() };
        save(); toast('Payment details saved \u2014 live at checkout');
    };
    /* ---- Payment gateway API ---- */
    const gw = Object.assign({ provider: 'sslcommerz', storeId: '', storePass: '', sandbox: true }, s.gateway || {});
    const gwOpts = [['sslcommerz', 'SSLCommerz'], ['bkashpgw', 'bKash PGW'], ['stripe', 'Stripe'], ['shurjopay', 'ShurjoPay']];
    $('#setGateway').innerHTML = `
        <div class="f-grid">
            <div class="f-field"><label>Provider</label><select id="gwProv" class="sel" style="width:100%">${gwOpts.map(([v, l]) => `<option value="${v}" ${gw.provider === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
            <div class="f-field"><label>Mode</label><select id="gwMode" class="sel" style="width:100%"><option value="1" ${gw.sandbox ? 'selected' : ''}>Sandbox</option><option value="0" ${!gw.sandbox ? 'selected' : ''}>Live</option></select></div>
        </div>
        <div class="f-field"><label>Store ID / Merchant ID</label><input id="gwId" value="${esc(gw.storeId)}" placeholder="From your gateway dashboard"></div>
        <div class="f-field"><label>Store password / Secret key</label><input id="gwPass" type="password" value="${esc(gw.storePass)}" placeholder="Kept private"></div>
        <button class="btn btn-gold" id="gwSave" style="margin-top:14px">Save Gateway Settings</button>
        <p style="color:var(--muted);font-size:12px;font-weight:300;margin-top:10px">Credentials are used by the Laravel backend (never exposed to the browser). Sandbox lets you test without real money.</p>`;
    $('#gwSave').onclick = () => {
        s.gateway = { provider: $('#gwProv').value, storeId: $('#gwId').value.trim(), storePass: $('#gwPass').value, sandbox: $('#gwMode').value === '1' };
        save(); toast('Gateway settings saved');
    };
}

/* ---------------- drawer & confirm ---------------- */
function openDrawer(title, body, foot) {
    $('#drawerTitle').textContent = title;
    $('#drawerBody').innerHTML = body;
    $('#drawerFoot').innerHTML = foot || '';
    $('#overlay').classList.add('show');
    $('#drawer').classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    $('#overlay').classList.remove('show');
    $('#drawer').classList.remove('show');
    $('#confirmCard').classList.remove('show');
    document.body.style.overflow = '';
}
function confirmBox(title, text, onYes) {
    $('#confirmTitle').textContent = title;
    $('#confirmText').textContent = text || 'Are you sure?';
    $('#overlay').classList.add('show');
    $('#confirmCard').classList.add('show');
    document.body.style.overflow = 'hidden';
    $('#confirmYes').onclick = () => { closeDrawer(); onYes(); };
}

/* ---------------- notifications ---------------- */
function renderNotifs() {
    const pend = DB.orders.filter(o => o.status === 'Pending');
    const low = DB.products.filter(p => p.stock <= 8);
    const items = [
        ...pend.map(o => ({ ic: '<path d="M6 8h15l-1.5 12.5a1 1 0 0 1-1 .5H8.5a1 1 0 0 1-1-.5L6 8z"/>', c: '#f0c46c', bg: 'rgba(240,196,108,.12)', h: `<p><b>${o.code}</b> needs confirmation — ${fmt(o.total)} via ${o.pay}</p><small>${dstr(o.date)}</small>` })),
        ...(() => { const n = Object.keys(DB.fraud).filter(k => DB.fraud[k].flagged).length; return n ? [{ ic: '<path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', c: '#ff8f8f', bg: 'rgba(255,143,143,.12)', h: `<p><b>${n} number${n === 1 ? '' : 's'} flagged</b> — COD blocked for fraud-risk customers</p><small>Fraud Control</small>` }] : []; })(),
        ...low.map(p => ({ ic: '<path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', c: '#ff8f8f', bg: 'rgba(255,143,143,.12)', h: `<p><b>${esc(p.name)}</b> is running low — ${p.stock} left</p><small>${p.sku}</small>` })),
    ];
    $('#notifDot').style.display = items.length ? '' : 'none';
    $('#notifCount').textContent = items.length;
    $('#notifList').innerHTML = items.length ? items.map(n => `
        <div class="dd-item"><div class="nicon" style="background:${n.bg}"><svg viewBox="0 0 24 24" style="stroke:${n.c}">${n.ic}</svg></div><div>${n.h}</div></div>`).join('')
        : '<div class="dd-item"><p>All clear — nothing needs attention.</p></div>';
    const oc = $('#navOrderCount'), lc = $('#navLowCount');
    if (oc) { oc.textContent = pend.length; oc.style.display = pend.length ? '' : 'none'; }
    if (lc) { lc.textContent = low.length; lc.style.display = low.length ? '' : 'none'; }
}

/* ---------------- login ---------------- */
function initLoginPage() {
    if (sessionStorage.getItem('jovent_admin') === '1') { location.href = 'index.html'; return; }
    const doLogin = (e) => {
        if (e) e.preventDefault();
        const em = $('#liEmail').value.trim(), pw = $('#liPass').value;
        if ((em === 'admin@jovent.com' && pw === 'jovent123') || em === 'demo') {
            sessionStorage.setItem('jovent_admin', '1');
            location.href = 'index.html';
        } else { $('#liErr').style.display = 'block'; }
    };
    $('#loginForm').addEventListener('submit', doLogin);
    $('#demoBtn').addEventListener('click', () => { $('#liEmail').value = 'demo'; $('#liPass').value = 'demo'; doLogin(); });
}

/* ---------------- Subscribers (storefront newsletter) ---------------- */
const SUB_KEY = 'jovent_newsletter_v1';
function getSubs() { try { return JSON.parse(localStorage.getItem(SUB_KEY)) || []; } catch { return []; } }
function downloadCSV(name, rows) {
    const csv = rows.map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function renderSubscribers() {
    const paint = () => {
        const s = getSubs();
        $('#subCount').textContent = s.length + (s.length === 1 ? ' subscriber' : ' subscribers');
        $('#subsTbl').innerHTML = s.length ? s.map((x, i) => `
            <tr><td><b>${esc(x.email)}</b></td><td style="color:var(--muted)">${esc(x.date || '—')}</td>
            <td><div class="row-actions"><button class="mini-btn" data-del-sub="${i}" title="Remove"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-.8 12.2a1 1 0 0 1-1 .8H7.8a1 1 0 0 1-1-.8L6 7"/></svg></button></div></td></tr>`).join('')
            : `<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:44px">No subscribers yet — they appear here the moment visitors join the newsletter.</td></tr>`;
        $$('#view-subscribers [data-del-sub]').forEach(b => b.onclick = () => confirmBox('Remove this subscriber?', 'They will no longer receive newsletters.', () => {
            const arr = getSubs(); arr.splice(+b.dataset.delSub, 1);
            localStorage.setItem(SUB_KEY, JSON.stringify(arr)); paint(); toast('Subscriber removed');
        }));
    };
    paint();
    $('#subExport').onclick = () => {
        const s = getSubs();
        downloadCSV('jovent-subscribers.csv', [['Email', 'Subscribed'], ...s.map(x => [x.email, x.date || ''])]);
        toast(s.length ? 'Subscribers exported' : 'Nothing to export');
    };
}

/* ---------------- Reports ---------------- */
function renderReports() {
    const orders = DB.orders.filter(o => o.status !== 'Cancelled');
    const rev = orders.reduce((s, o) => s + (+o.total || 0), 0);
    const aov = orders.length ? Math.round(rev / orders.length) : 0;
    const withCoupon = DB.orders.filter(o => o.coupon).length;
    const stats = [
        { l: 'Total Revenue', v: fmt(rev), ic: '<path d="M12 2v20M17 7c0-2-2.2-3-5-3s-5 1-5 3 2 3 5 3 5 1 5 3-2.2 3-5 3-5-1-5-3"/>' },
        { l: 'Orders (excl. cancelled)', v: orders.length, ic: '<path d="M6 8h15l-1.5 12.5a1 1 0 0 1-1 .5H8.5a1 1 0 0 1-1-.5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' },
        { l: 'Avg Order Value', v: fmt(aov), ic: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>' },
        { l: 'Orders with Coupon', v: withCoupon, ic: '<path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a3 3 0 0 0 0-6z"/>' },
    ];
    $('#repStats').innerHTML = stats.map(s => `
        <div class="stat-card"><div class="stat-top"><div class="ic"><svg viewBox="0 0 24 24">${s.ic}</svg></div></div>
        <h3>${s.v}</h3><div class="lbl">${s.l}</div></div>`).join('');
    const labels = [], data = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
        const key = d.toISOString().slice(0, 7);
        labels.push(d.toLocaleString('en', { month: 'short' }));
        data.push(Math.round(orders.filter(o => (o.date || '').slice(0, 7) === key).reduce((s, o) => s + (+o.total || 0), 0) / 1000));
    }
    barChart($('#repChart'), labels, data);
    const byPid = {};
    orders.forEach(o => (o.items || []).forEach(it => {
        byPid[it.pid] = byPid[it.pid] || { qty: 0, rev: 0 };
        byPid[it.pid].qty += it.qty; byPid[it.pid].rev += it.qty * (+it.price || 0);
    }));
    const top = Object.entries(byPid).sort((a, b) => b[1].rev - a[1].rev).slice(0, 8);
    $('#repTop').innerHTML = top.length ? top.map(([pid, t]) => {
        const p = DB.products.find(x => x.id === pid);
        return `<tr><td><b>${esc(p ? p.name : pid)}</b><br><small style="color:var(--muted)">${t.qty} sold</small></td><td class="num">${fmt(t.rev)}</td></tr>`;
    }).join('') : `<tr><td colspan="2" style="text-align:center;color:var(--muted);padding:30px">No sales data yet.</td></tr>`;
    $('#expOrders').onclick = () => {
        downloadCSV('jovent-orders.csv', [
            ['Order', 'Date', 'Customer', 'Phone', 'Email', 'City', 'Items', 'Payment', 'Coupon', 'Discount', 'Subtotal', 'Shipping', 'Total', 'Status'],
            ...DB.orders.map(o => [o.code, o.date, o.customer, o.phone, o.email || '', o.city, (o.items || []).reduce((s, i) => s + i.qty, 0), o.pay, o.coupon || '', o.discount || 0, o.subtotal, o.shipping, o.total, o.status])
        ]);
        toast('Orders exported');
    };
    $('#expProducts').onclick = () => {
        downloadCSV('jovent-products.csv', [
            ['ID', 'Name', 'Category', 'Price', 'Old Price', 'Stock', 'Sold', 'Status'],
            ...DB.products.map(p => [p.id, p.name, p.cat, p.price, p.old || '', p.stock, p.sold, p.status])
        ]);
        toast('Products exported');
    };
}

/* ---------------- Fraud Control ---------------- */
function renderFraud() {
    const keys = Object.keys(DB.fraud);
    const flagged = keys.filter(k => DB.fraud[k].flagged);
    const refusedTotal = keys.reduce((s, k) => s + (DB.fraud[k].refused || 0), 0);
    const stats = [
        { l: 'Numbers Flagged', v: flagged.length, ic: '<path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>' },
        { l: 'Parcels Refused', v: refusedTotal, ic: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>' },
        { l: 'COD Protected', v: flagged.length ? 'Active' : '—', ic: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>' },
    ];
    $('#fraudStats').innerHTML = stats.map(s => `
        <div class="stat-card"><div class="stat-top"><div class="ic"><svg viewBox="0 0 24 24">${s.ic}</svg></div></div>
        <h3>${s.v}</h3><div class="lbl">${s.l}</div></div>`).join('');
    const paint = () => {
        const ks = Object.keys(DB.fraud).sort((a, b) => (DB.fraud[b].flagged ? 1 : 0) - (DB.fraud[a].flagged ? 1 : 0));
        $('#fraudTbl').innerHTML = ks.length ? ks.map(k => {
            const r = DB.fraud[k], st = phoneStats(k);
            const lastOrder = [...DB.orders].filter(o => normPhone(o.phone) === k).sort((a, b) => b.date.localeCompare(a.date))[0];
            return `<tr>
                <td><b>${esc(k)}</b><br><small style="color:var(--muted)">${esc(lastOrder ? lastOrder.customer : '—')}</small></td>
                <td class="num">${st.total}</td>
                <td class="num" style="color:var(--green)">${st.delivered}</td>
                <td class="num" style="color:var(--red)">${r.refused || 0}</td>
                <td class="num">${r.cancelled || 0}</td>
                <td>${st.ratio === null ? '<span style="color:var(--muted)">—</span>' : `<b style="color:${st.ratio >= 70 ? 'var(--green)' : st.ratio >= 40 ? 'var(--gold-soft)' : 'var(--red)'}">${st.ratio}%</b>`}</td>
                <td><small style="color:var(--muted)">${esc(r.reason || '—')}</small></td>
                <td>${r.flagged ? '<span class="pill p-flagged">⚠ COD blocked</span>' : '<span class="pill p-active">Clean</span>'}</td>
                <td><div class="row-actions">${r.flagged
                    ? `<button class="mini-btn" data-unflag="${k}" title="Remove flag — restore COD"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></button>`
                    : `<button class="mini-btn danger" data-flag="${k}" title="Flag — block COD"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg></button>`}</div></td>
            </tr>`;
        }).join('') : `<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:44px">No risk records yet. Numbers appear here automatically when a COD parcel is refused at delivery.</td></tr>`;
        $$('#view-fraud [data-unflag]').forEach(b => b.onclick = () => { unflagPhone(b.dataset.unflag); renderFraud(); toast('Flag removed — COD restored'); });
        $$('#view-fraud [data-flag]').forEach(b => b.onclick = () => { flagPhone(b.dataset.flag, 'Manually flagged by admin'); renderFraud(); toast('Number flagged — COD blocked'); });
    };
    paint();
    $('#fraudAdd').onclick = () => {
        const ph = $('#fraudPhone').value.trim(), rs = $('#fraudReason').value.trim() || 'Manually blacklisted';
        if (normPhone(ph).length < 11) { toast('Enter a valid 11-digit phone number'); return; }
        flagPhone(ph, rs);
        $('#fraudPhone').value = ''; $('#fraudReason').value = '';
        renderFraud(); toast('Number blacklisted — COD blocked');
    };
}

/* ---------------- boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
    load();
    if (PAGE === 'login') { initLoginPage(); return; }
    if (!requireAuth()) return;
    const T = TITLES[VIEW] || TITLES.dashboard;
    $('#pageTitle').textContent = T[0];
    $('#pageSub').textContent = T[1];
    $('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
    $$('.dd').forEach(d => {
        const btn = d.querySelector('[data-dd]');
        btn.addEventListener('click', e => { e.stopPropagation(); $$('.dd').forEach(x => x !== d && x.classList.remove('open')); d.classList.toggle('open'); });
    });
    document.addEventListener('click', () => $$('.dd').forEach(x => x.classList.remove('open')));
    const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };
    // toolbars (only present on their own pages)
    on('#orderSearch', 'input', e => { orderQ = e.target.value.toLowerCase(); renderOrders(); });
    on('#orderFilter', 'change', e => { orderF = e.target.value; renderOrders(); });
    on('#prodSearch', 'input', e => { prodQ = e.target.value.toLowerCase(); renderProducts(); });
    on('#prodFilter', 'change', e => { prodF = e.target.value; renderProducts(); });
    on('#custSearch', 'input', e => { custQ = e.target.value.toLowerCase(); renderCustomers(); });
    $$('#view-reviews .pill').forEach(pl => pl.addEventListener('click', () => {
        $$('#view-reviews .pill').forEach(x => { x.style.opacity = '.45'; });
        pl.style.opacity = '1'; revF = pl.dataset.rev; renderReviews();
    }));
    $$('#view-content .tab').forEach(t => t.addEventListener('click', () => { contentTab = t.dataset.ctab; renderContent(); }));
    on('#addProductBtn', 'click', () => productForm(null));
    on('#addCouponBtn', 'click', () => couponForm(null));
    on('#addBannerBtn', 'click', () => bannerForm(null));
    on('#contentAdd', 'click', () => contentTab === 'lookbook' ? lookForm(null) : videoForm(null));
    // drawer / modal closes
    on('#drawerX', 'click', closeDrawer);
    on('#overlay', 'click', closeDrawer);
    on('#confirmNo', 'click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
    // topbar search → jump to products page with query
    on('#topSearch', 'keydown', e => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            sessionStorage.setItem('jovent_admin_q', e.target.value.trim());
            location.href = 'products.html';
        }
    });
    on('#notifClear', 'click', () => { $('#notifDot').style.display = 'none'; $('#notifList').innerHTML = '<div class="dd-item"><p>All caught up.</p></div>'; });
    $$('[data-goto]').forEach(b => b.addEventListener('click', () => { location.href = b.dataset.goto + '.html'; }));
    on('#viewStoreBtn', 'click', () => toast('Storefront preview — open your Jovent site'));
    on('#logoutBtn', 'click', () => { sessionStorage.removeItem('jovent_admin'); location.href = 'login.html'; });
    // render this page
    (RENDER[VIEW] || renderDashboard)();
    renderNotifs();
    // search handoff from another page
    const q = sessionStorage.getItem('jovent_admin_q');
    if (q && VIEW === 'products') {
        prodQ = q.toLowerCase(); const pi = $('#prodSearch'); if (pi) pi.value = q;
        sessionStorage.removeItem('jovent_admin_q'); renderProducts();
    }
});

})();
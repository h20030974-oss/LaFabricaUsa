const products = [
    { id: 1, name: "ISO100 HYDROLYZED", price: 1300, img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", desc: "بروتين هيدروليزيد نقي للامتصاص السريع وعضلات صافية." },
    { id: 2, name: "CREATINE PURE 100%", price: 300, img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800", desc: "كرياتين نقي لزيادة القوة البدنية والتحمل العضلي." },
    { id: 3, name: "GOLD CASEIN", price: 900, img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800", desc: "بروتين بطيء الامتصاص للاستشفاء العضلي أثناء النوم." },
    { id: 4, name: "VAPOR X5 PRE-WORKOUT", price: 650, img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800", desc: "طاقة انفجارية وتركيز عالٍ لتمارينك الصعبة." }
];

let cart = JSON.parse(localStorage.getItem('nikeCart')) || [];
let currentProduct = null;
let currentQty = 1;

function init() {
    renderProducts(products);
    updateCartUI();
}

function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = items.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box"><img src="${p.img}" loading="lazy"></div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;
    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = currentProduct.price + " MAD";
    document.getElementById('m-desc').innerText = currentProduct.desc;
    document.getElementById('qtyVal').innerText = currentQty;
    document.getElementById('productModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function updateQty(val) {
    let next = currentQty + val;
    if (next >= 1 && next <= 10) {
        currentQty = next;
        document.getElementById('qtyVal').innerText = currentQty;
        // زيادة الثمن مع الكمية
        document.getElementById('m-price').innerText = (currentProduct.price * currentQty) + " MAD";
    }
}

function addToCart() {
    const existing = cart.find(item => item.id === currentProduct.id);
    if (existing) existing.qty = Math.min(existing.qty + currentQty, 10);
    else cart.push({ ...currentProduct, qty: currentQty });
    save();
    closeModal();
    toggleCart(true);
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    container.innerHTML = cart.map((item, index) => `
        <div style="display:flex; gap:10px; margin-bottom:15px; background:#111; padding:10px; border-radius:4px; align-items:center">
            <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px">
            <div style="flex:1">
                <h4 style="font-size:12px">${item.name}</h4>
                <p style="color:var(--accent); font-size:14px; font-weight:900">${item.price * item.qty} MAD</p>
            </div>
            <i class="fas fa-trash" onclick="removeFromCart(${index})" style="cursor:pointer; color:red; font-size:12px"></i>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cartTotal').innerText = total + " MAD";
    document.getElementById('cartCount').innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    save();
}

function save() {
    localStorage.setItem('nikeCart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart(show) {
    document.getElementById('cartDrawer').classList.toggle('open', show);
}

function sendOrder() {
    const name = document.getElementById('cNameCart').value;
    const city = document.getElementById('cCityCart').value;
    if (cart.length === 0 || !name || !city) return alert("المرجو إكمال البيانات واختيار منتج.");

    let msg = `*طلب جديد - LA FABRICAUSA*%0A%0A`;
    cart.forEach(item => msg += `• ${item.name} (x${item.qty}) = ${item.price * item.qty} MAD%0A`);
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    msg += `%0A*المجموع الكلي:* ${total} MAD%0A%0A*الزبون:* ${name}%0A*المدينة:* ${city}`;
    window.open(`https://wa.me/212603852896?text=${msg}`, '_blank');
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function toggleDesc() {
    document.getElementById('m-desc').classList.toggle('show');
}

document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderProducts(products.filter(p => p.name.toLowerCase().includes(term)));
});

init();
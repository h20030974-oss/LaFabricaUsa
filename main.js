const products = [
    { id: 1, name: "Whey Isolate Elite", price: 1300, img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", desc: "نقاء تام لسرعة بناء العضلات والاستشفاء." },
    { id: 2, name: "Creatine Micronized", price: 300, img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800", desc: "زيادة القوة البدنية والتحمل في أصعب التمارين." },
    { id: 3, name: "Casein Recovery Night", price: 900, img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800", desc: "بروتين بطيء الامتصاص مثالي لفترة النوم." }
];

let cart = [];
let currentProduct = null;
let currentQty = 1;

function init() {
    render();
}

function render() {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box"><img src="${p.img}" alt="${p.name}"></div>
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
    document.getElementById('modal').style.display = 'flex';
}

function updateQty(val) {
    if(currentQty + val >= 1 && currentQty + val <= 10) {
        currentQty += val;
        document.getElementById('qty').innerText = currentQty;
        document.getElementById('m-price').innerText = (currentProduct.price * currentQty) + " MAD";
    }
}

function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if(existing) existing.qty += currentQty;
    else cart.push({...currentProduct, qty: currentQty});
    
    updateCart();
    closeModal();
    toggleCart(true);
}

function updateCart() {
    const container = document.getElementById('cartItems');
    container.innerHTML = cart.map((item, index) => `
        <div style="display:flex; gap:15px; margin-bottom:20px; background:#f8fafc; padding:15px; border-radius:15px; align-items:center">
            <img src="${item.img}" style="width:60px; height:60px; object-image:contain">
            <div style="flex:1">
                <h4 style="font-size:14px">${item.name}</h4>
                <p style="color:var(--primary); font-weight:800">${item.price * item.qty} MAD (x${item.qty})</p>
            </div>
            <button onclick="removeFromCart(${index})" style="border:none; color:red; cursor:pointer; background:none">حذف</button>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cartTotal').innerText = total + " MAD";
    document.getElementById('cartCount').innerText = cart.length;
}

function removeFromCart(i) { cart.splice(i, 1); updateCart(); }

function toggleCart(show) { document.getElementById('cartDrawer').classList.toggle('open', show); }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

function checkout() {
    const name = document.getElementById('uName').value;
    const city = document.getElementById('uCity').value;
    if(!name || !city) return alert("المرجو ملئ البيانات");
    
    let msg = `*طلب جديد - La FabricaUsa*%0A%0A`;
    cart.forEach(i => msg += `- ${i.name} (x${i.qty})%0A`);
    msg += `%0A*المجموع:* ${document.getElementById('cartTotal').innerText}%0A*الزبون:* ${name}%0A*المدينة:* ${city}`;
    window.open(`https://wa.me/212603852896?text=${msg}`, '_blank');
}

init();
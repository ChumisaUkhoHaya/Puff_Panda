// --- DATABASE SIMULATION ---
const products = [
    { id: 1, name: 'Blue Dream', type: 'Hybrid', price: 350, image: 'https://images.unsplash.com/photo-1594950314814-6b89f6b2b319?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'OG Kush', type: 'Indica', price: 320, image: 'https://images.unsplash.com/photo-1600515348473-81561f13bc29?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Durban Poison', type: 'Sativa', price: 300, image: 'https://images.unsplash.com/photo-1584912534960-19f4a4c32678?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Vegan Fruit Chews', type: 'Edible', price: 180, image: 'https://images.unsplash.com/photo-1556928045-16f7f50be0f3?auto=format&fit=crop&q=80&w=400' }
];

let cart = JSON.parse(localStorage.getItem('puffPandaCart')) || [];
let currentUser = JSON.parse(localStorage.getItem('puffPandaUser')) || null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Age Gate Logic
    const ageGate = document.getElementById('age-gate');
    const app = document.getElementById('app');
    if(localStorage.getItem('puffPandaAgeVerified') === 'true') {
        ageGate.style.display = 'none';
        app.style.display = 'block';
    }

    document.getElementById('enter-btn').addEventListener('click', () => {
        localStorage.setItem('puffPandaAgeVerified', 'true');
        ageGate.style.display = 'none';
        app.style.display = 'block';
    });

    renderProducts();
    updateCartUI();
    checkLoginState();
});

// --- UI NAVIGATION ---
function switchTab(tab) {
    document.getElementById('view-shop').style.display = tab === 'shop' ? 'block' : 'none';
    document.getElementById('view-info').style.display = tab === 'info' ? 'block' : 'none';
    
    document.getElementById('nav-shop').classList.toggle('active-tab', tab === 'shop');
    document.getElementById('nav-info').classList.toggle('active-tab', tab === 'info');
    
    window.scrollTo(0, 0);
}

// --- RENDER PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(product => `
        <div class="glass-card product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="strain-type">${product.type}</span>
                <div class="product-bottom">
                    <span class="price">R ${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- CART FUNCTIONALITY ---
function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    // Auto open cart to show feedback
    if(!document.getElementById('cart-drawer').classList.contains('open')) {
        toggleCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('puffPandaCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    
    // Update items list
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; margin-top: 50px;">Your cart is empty.</p>';
        cartTotal.innerText = 'R 0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name} (x${item.quantity})</h4>
                <p>R ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = `R ${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!currentUser) {
        alert("Please sign in to complete your purchase.");
        toggleCart();
        openAuthModal();
        return;
    }
    
    alert(`Thank you, ${currentUser.name}! Your order of R${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} has been placed. (Mock Checkout)`);
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// --- AUTHENTICATION (Mock Backend) ---
function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
    if(currentUser) {
        toggleAuthForms('loggedin');
    } else {
        toggleAuthForms('login');
    }
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function toggleAuthForms(view) {
    document.getElementById('login-form-container').style.display = view === 'login' ? 'block' : 'none';
    document.getElementById('register-form-container').style.display = view === 'register' ? 'block' : 'none';
    document.getElementById('logged-in-container').style.display = view === 'loggedin' ? 'block' : 'none';
}

// Register
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // Simulate saving to database
    const users = JSON.parse(localStorage.getItem('puffPandaUsers')) || [];
    if(users.find(u => u.email === email)) {
        return alert("Account with this email already exists.");
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('puffPandaUsers', JSON.stringify(users));
    
    // Auto-login after register
    localStorage.setItem('puffPandaUser', JSON.stringify({name, email}));
    currentUser = {name, email};
    
    alert("Account created successfully!");
    checkLoginState();
    closeAuthModal();
});

// Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('puffPandaUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if(user) {
        localStorage.setItem('puffPandaUser', JSON.stringify({name: user.name, email: user.email}));
        currentUser = {name: user.name, email: user.email};
        checkLoginState();
        closeAuthModal();
    } else {
        alert("Invalid email or password.");
    }
});

// Logout
function logout() {
    localStorage.removeItem('puffPandaUser');
    currentUser = null;
    checkLoginState();
    closeAuthModal();
}

// Check State
function checkLoginState() {
    const userDisplay = document.getElementById('user-display');
    const loggedInEmail = document.getElementById('logged-in-email');
    
    if (currentUser) {
        userDisplay.innerText = currentUser.name.split(' ')[0]; // Show first name
        loggedInEmail.innerText = currentUser.email;
    } else {
        userDisplay.innerText = "Sign In";
    }
}

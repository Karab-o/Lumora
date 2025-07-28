// Global Variables
let cart = [];
let currentUser = null;
let isAuthenticated = false;
let currentPage = 'home';
let currentCarouselIndex = 0;
let barCustomization = {
    chocolate: null,
    fruits: [],
    extras: [],
    quantity: 1,
    basePrice: 12.00
};

// Product catalog
const productCatalog = [
    {
        id: 'fraise-premium',
        name: 'Chocolat Fraise Premium',
        price: 8.50,
        category: 'noir',
        image: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400&h=300&fit=crop',
        description: 'Chocolat noir 70% et fraises françaises lyophilisées',
        ingredients: 'Cacao 70%, fraises lyophilisées, sucre de canne bio',
        nutritional: '534 kcal/100g | Protéines: 8.2g | Glucides: 35.6g',
        isVegan: false,
        isGlutenFree: true
    },
    {
        id: 'mangue-passion',
        name: 'Délice Mangue Passion',
        price: 9.00,
        category: 'lait',
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop',
        description: 'Chocolat au lait onctueux et mangue tropicale',
        ingredients: 'Chocolat au lait 65%, mangue séchée, lait en poudre',
        nutritional: '548 kcal/100g | Protéines: 7.8g | Glucides: 38.2g',
        isVegan: false,
        isGlutenFree: true
    },
    {
        id: 'framboises-blanc',
        name: 'Chocolat Blanc Framboises',
        price: 8.75,
        category: 'blanc',
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=300&fit=crop',
        description: 'Chocolat blanc délicat et framboises acidulées',
        ingredients: 'Chocolat blanc 70%, framboises lyophilisées',
        nutritional: '556 kcal/100g | Protéines: 6.9g | Glucides: 41.3g',
        isVegan: false,
        isGlutenFree: true
    },
    {
        id: 'orange-noir',
        name: 'Chocolat Noir Orange',
        price: 8.25,
        category: 'noir',
        image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop',
        description: 'Chocolat noir intense et zestes d\'orange confits',
        ingredients: 'Cacao 75%, zestes d\'orange bio, sucre de canne',
        nutritional: '528 kcal/100g | Protéines: 8.8g | Glucides: 33.1g',
        isVegan: true,
        isGlutenFree: true
    },
    {
        id: 'myrtilles-lait',
        name: 'Chocolat Lait Myrtilles',
        price: 9.25,
        category: 'lait',
        image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop',
        description: 'Chocolat au lait gourmand et myrtilles sauvages',
        ingredients: 'Chocolat au lait 60%, myrtilles séchées',
        nutritional: '542 kcal/100g | Protéines: 7.5g | Glucides: 36.8g',
        isVegan: false,
        isGlutenFree: true
    },
    {
        id: 'ananas-coco',
        name: 'Exotique Ananas Coco',
        price: 9.50,
        category: 'blanc',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        description: 'Chocolat blanc tropical à l\'ananas et coco',
        ingredients: 'Chocolat blanc, ananas séché, noix de coco râpée',
        nutritional: '562 kcal/100g | Protéines: 6.2g | Glucides: 42.1g',
        isVegan: false,
        isGlutenFree: true
    }
];

// Promotional codes
const promoCodes = {
    'BIENVENUE20': { discount: 0.20, description: '20% de réduction' },
    'FIDELITE10': { discount: 0.10, description: '10% de réduction fidélité' },
    'NOEL25': { discount: 0.25, description: '25% de réduction Noël' }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    checkAuthStatus();
    setupEventListeners();
    initializeEmailJS();
    setupPasswordStrengthMeter();
    if (isAuthenticated) {
        showApp();
        loadProducts();
        updateCartDisplay();
    } else {
        showWelcomePage();
    }
}

// Authentication Functions
function checkAuthStatus() {
    const savedUser = localStorage.getItem('chocolat-user');
    const authStatus = localStorage.getItem('chocolat-auth');
    
    if (authStatus === 'true' && savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('chocolat-user');
            localStorage.removeItem('chocolat-auth');
        }
    }
}

function showWelcomePage() {
    document.getElementById('welcomePage').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('welcomePage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    updateUserInterface();
    showPage('home');
}

function showAuthModal(type) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    modal.classList.add('active');
    playSound('modal-open');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthForm(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    showLoading();
    
    // Simulate login process
    setTimeout(() => {
        currentUser = {
            id: 'user-' + Date.now(),
            name: email.split('@')[0],
            email: email,
            loginMethod: 'email',
            rememberMe: rememberMe
        };
        
        authenticateUser();
        hideLoading();
    }, 1500);
}

function handleSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const subscribeNewsletter = document.getElementById('subscribeNewsletter').checked;
    
    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Veuillez accepter les conditions d\'utilisation', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate signup process
    setTimeout(() => {
        currentUser = {
            id: 'user-' + Date.now(),
            name: `${firstName} ${lastName}`,
            email: email,
            loginMethod: 'email',
            newsletter: subscribeNewsletter
        };
        
        authenticateUser();
        hideLoading();
        showNotification('Compte créé avec succès ! Bienvenue !', 'success');
    }, 2000);
}

function handleGoogleLogin(response) {
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        currentUser = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            loginMethod: 'google'
        };
        authenticateUser();
    } catch (error) {
        console.error('Google login error:', error);
        showNotification('Erreur de connexion Google', 'error');
    }
}

function handleDemoLogin() {
    currentUser = {
        id: 'demo-user',
        name: 'Utilisateur Démo',
        email: 'demo@chocolatfruitier.fr',
        loginMethod: 'demo'
    };
    authenticateUser();
}

function authenticateUser() {
    isAuthenticated = true;
    localStorage.setItem('chocolat-user', JSON.stringify(currentUser));
    localStorage.setItem('chocolat-auth', 'true');
    
    hideAuthModal();
    showApp();
    
    // Welcome notification
    setTimeout(() => {
        showNotification(`Bienvenue ${currentUser.name} !`, 'success');
    }, 1000);
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        currentUser = null;
        isAuthenticated = false;
        cart = [];
        
        localStorage.removeItem('chocolat-user');
        localStorage.removeItem('chocolat-auth');
        localStorage.removeItem('chocolat-cart');
        
        showWelcomePage();
        showNotification('Vous avez été déconnecté', 'info');
    }
}

function updateUserInterface() {
    if (!currentUser) return;
    
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    userName.textContent = currentUser.name;
    
    if (currentUser.picture) {
        userAvatar.innerHTML = `<img src="${currentUser.picture}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    } else {
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }
}

// Password strength checker
function setupPasswordStrengthMeter() {
    // This will be called during initialization
}

function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    if (strength === 0) {
        feedback = 'Saisissez un mot de passe';
        strengthBar.style.background = '#ddd';
    } else if (strength <= 25) {
        feedback = 'Faible';
        strengthBar.style.background = '#ff6b6b';
    } else if (strength <= 50) {
        feedback = 'Moyen';
        strengthBar.style.background = '#ffa726';
    } else if (strength <= 75) {
        feedback = 'Fort';
        strengthBar.style.background = '#66bb6a';
    } else {
        feedback = 'Très fort';
        strengthBar.style.background = '#4caf50';
    }
    
    strengthBar.style.width = strength + '%';
    strengthText.textContent = feedback;
}

function checkPasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchDiv = document.getElementById('passwordMatch');
    
    if (confirmPassword.length === 0) {
        matchDiv.textContent = '';
        return;
    }
    
    if (password === confirmPassword) {
        matchDiv.textContent = '✓ Les mots de passe correspondent';
        matchDiv.style.color = '#4caf50';
    } else {
        matchDiv.textContent = '✗ Les mots de passe ne correspondent pas';
        matchDiv.style.color = '#ff6b6b';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        currentPage = pageId;
    }
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load page-specific content
    switch (pageId) {
        case 'products':
            loadProducts();
            break;
        case 'order':
            initializeBarBuilder();
            break;
        case 'gifts':
            loadGifts();
            break;
        case 'contact':
            // Contact page is static
            break;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Products Page
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productCatalog.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Setup filter buttons
    setupProductFilters();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.category = product.category;
    card.dataset.vegan = product.isVegan;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-overlay">
                <button class="quick-view-btn" onclick="openProductModal('${product.id}')">
                    <i class="fas fa-eye"></i> Voir détails
                </button>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i> Ajouter
                </button>
            </div>
            ${product.isVegan ? '<div class="product-badge vegan">Vegan</div>' : ''}
            ${product.isGlutenFree ? '<div class="product-badge gluten-free">Sans Gluten</div>' : ''}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price.toFixed(2)}€</div>
            <div class="product-rating">
                <span class="stars">★★★★★</span>
                <span class="rating-count">(${Math.floor(Math.random() * 50) + 10})</span>
            </div>
        </div>
    `;
    
    return card;
}

function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let show = false;
        
        switch (filter) {
            case 'all':
                show = true;
                break;
            case 'vegan':
                show = card.dataset.vegan === 'true';
                break;
            default:
                show = card.dataset.category === filter;
        }
        
        if (show) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

function openProductModal(productId) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;
    
    // Create product modal HTML
    const modalHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-price-large">${product.price.toFixed(2)}€</div>
                <p class="product-description">${product.description}</p>
                
                <div class="product-specs">
                    <h4>Ingrédients</h4>
                    <p>${product.ingredients}</p>
                    
                    <h4>Valeurs nutritionnelles</h4>
                    <p>${product.nutritional}</p>
                    
                    <div class="product-badges">
                        ${product.isVegan ? '<span class="badge vegan">Vegan</span>' : ''}
                        ${product.isGlutenFree ? '<span class="badge gluten-free">Sans Gluten</span>' : ''}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <label>Quantité:</label>
                    <div class="quantity-controls">
                        <button onclick="changeProductQuantity(-1, '${productId}')">-</button>
                        <input type="number" id="productQuantity" value="1" min="1" max="10">
                        <button onclick="changeProductQuantity(1, '${productId}')">+</button>
                    </div>
                </div>
                
                <button class="add-to-cart-large" onclick="addToCartFromModal('${productId}')">
                    Ajouter au panier - ${product.price.toFixed(2)}€
                    <i class="fas fa-cart-plus"></i>
                </button>
                
                <div class="product-share">
                    <h5>Partager ce produit</h5>
                    <div class="share-buttons">
                        <button onclick="shareProduct('facebook', '${productId}')"><i class="fab fa-facebook"></i></button>
                        <button onclick="shareProduct('twitter', '${productId}')"><i class="fab fa-twitter"></i></button>
                        <button onclick="shareProduct('pinterest', '${productId}')"><i class="fab fa-pinterest"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal (you'll need to implement the modal display logic)
    showModal(modalHTML);
}

// Custom Bar Builder
function initializeBarBuilder() {
    resetBarCustomization();
    updateBarPreview();
    setupBuilderInteractions();
}

function resetBarCustomization() {
    barCustomization = {
        chocolate: null,
        fruits: [],
        extras: [],
        quantity: 1,
        basePrice: 12.00
    };
}

function setupBuilderInteractions() {
    // Chocolate selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const chocolateType = this.dataset.chocolate;
            selectChocolate(chocolateType);
        });
    });
    
    // Fruit selection
    document.querySelectorAll('.fruit-option').forEach(option => {
        option.addEventListener('click', function() {
            const fruit = this.dataset.fruit;
            toggleFruit(fruit);
        });
    });
    
    // Extra selection
    document.querySelectorAll('.extra-option').forEach(option => {
        option.addEventListener('click', function() {
            const extra = this.dataset.extra;
            toggleExtra(extra);
        });
    });
}

function selectChocolate(type) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    document.querySelector(`[data-chocolate="${type}"]`).classList.add('selected');
    
    barCustomization.chocolate = type;
    updateBarPreview();
}

function toggleFruit(fruit) {
    const option = document.querySelector(`[data-fruit="${fruit}"]`);
    const index = barCustomization.fruits.indexOf(fruit);
    
    if (index > -1) {
        // Remove fruit
        barCustomization.fruits.splice(index, 1);
        option.classList.remove('selected');
    } else {
        // Add fruit (max 3)
        if (barCustomization.fruits.length < 3) {
            barCustomization.fruits.push(fruit);
            option.classList.add('selected');
        } else {
            showNotification('Maximum 3 fruits par barre', 'info');
        }
    }
    
    updateBarPreview();
}

function toggleExtra(extra) {
    const option = document.querySelector(`[data-extra="${extra}"]`);
    const index = barCustomization.extras.indexOf(extra);
    
    if (index > -1) {
        barCustomization.extras.splice(index, 1);
        option.classList.remove('selected');
    } else {
        if (barCustomization.extras.length < 2) {
            barCustomization.extras.push(extra);
            option.classList.add('selected');
        } else {
            showNotification('Maximum 2 extras par barre', 'info');
        }
    }
    
    updateBarPreview();
}

function updateBarPreview() {
    const barName = document.getElementById('barName');
    const ingredientsList = document.getElementById('ingredientsList');
    const barPrice = document.getElementById('barPrice');
    const barChocolate = document.getElementById('barChocolate');
    const barToppings = document.getElementById('barToppings');
    
    // Update visual representation
    if (barCustomization.chocolate) {
        const chocolateColors = {
            noir: '#3d2914',
            lait: '#8b4513',
            blanc: '#f5f5dc'
        };
        if (barChocolate) {
            barChocolate.style.background = chocolateColors[barCustomization.chocolate] || '#8b4513';
        }
    }
    
    // Update name and ingredients
    if (barCustomization.chocolate) {
        const chocolateNames = {
            noir: 'Chocolat Noir',
            lait: 'Chocolat au Lait',
            blanc: 'Chocolat Blanc'
        };
        
        let name = chocolateNames[barCustomization.chocolate];
        if (barCustomization.fruits.length > 0) {
            name += ` aux ${barCustomization.fruits.join(', ')}`;
        }
        
        barName.textContent = name;
        
        let ingredients = [chocolateNames[barCustomization.chocolate]];
        ingredients = ingredients.concat(barCustomization.fruits);
        ingredients = ingredients.concat(barCustomization.extras);
        
        ingredientsList.innerHTML = `<p><strong>Ingrédients:</strong> ${ingredients.join(', ')}</p>`;
    } else {
        barName.textContent = 'Personnalisez votre barre';
        ingredientsList.innerHTML = '<p>Sélectionnez vos ingrédients</p>';
    }
    
    // Calculate and update price
    const price = calculateBarPrice();
    barPrice.textContent = `${price.toFixed(2)}€`;
}

function calculateBarPrice() {
    let total = barCustomization.basePrice;
    
    // Add fruit costs
    const fruitPrices = {
        fraise: 2.0,
        mangue: 2.5,
        framboises: 3.0,
        orange: 1.5,
        myrtilles: 3.0,
        ananas: 2.0
    };
    
    barCustomization.fruits.forEach(fruit => {
        total += fruitPrices[fruit] || 2.0;
    });
    
    // Add extra costs
    const extraPrices = {
        nuts: 2.0,
        caramel: 1.5,
        coconut: 1.0
    };
    
    barCustomization.extras.forEach(extra => {
        total += extraPrices[extra] || 1.0;
    });
    
    // White chocolate premium
    if (barCustomization.chocolate === 'blanc') {
        total += 1.0;
    }
    
    return total * barCustomization.quantity;
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('barQuantity');
    let newQuantity = parseInt(quantityInput.value) + delta;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    
    quantityInput.value = newQuantity;
    barCustomization.quantity = newQuantity;
    updateBarPreview();
}

function addCustomBarToCart() {
    if (!barCustomization.chocolate) {
        showNotification('Veuillez choisir un type de chocolat', 'error');
        return;
    }
    
    if (barCustomization.fruits.length === 0) {
        showNotification('Veuillez sélectionner au moins un fruit', 'error');
        return;
    }
    
    const customBar = {
        id: 'custom-' + Date.now(),
        name: document.getElementById('barName').textContent,
        price: calculateBarPrice() / barCustomization.quantity,
        quantity: barCustomization.quantity,
        customization: { ...barCustomization },
        isCustom: true
    };
    
    cart.push(customBar);
    updateCartDisplay();
    saveCartToStorage();
    
    showNotification('Barre personnalisée ajoutée au panier !', 'success');
    
    // Reset builder
    setTimeout(() => {
        initializeBarBuilder();
    }, 1000);
}

// Shopping Cart Functions
function addToCart(productId, quantity = 1) {
    const product = productCatalog.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId && !item.isCustom);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`${product.name} ajouté au panier`, 'success');
    
    // Cart animation
    animateCartButton();
}

function removeFromCart(itemId, isCustom = false) {
    const index = cart.findIndex(item => {
        if (isCustom) {
            return item.id === itemId && item.isCustom;
        }
        return item.id === itemId && !item.isCustom;
    });
    
    if (index > -1) {
        cart.splice(index, 1);
        updateCartDisplay();
        saveCartToStorage();
        showNotification('Produit retiré du panier', 'info');
    }
}

function updateCartQuantity(itemId, newQuantity, isCustom = false) {
    const item = cart.find(item => {
        if (isCustom) {
            return item.id === itemId && item.isCustom;
        }
        return item.id === itemId && !item.isCustom;
    });
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId, isCustom);
        } else {
            item.quantity = Math.min(newQuantity, 10);
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <button onclick="showPage('products')">Découvrir nos produits</button>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}€</p>
                    ${item.isCustom ? '<span class="custom-badge">Personnalisé</span>' : ''}
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1}, ${item.isCustom || false})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1}, ${item.isCustom || false})">+</button>
                    <button onclick="removeFromCart('${item.id}', ${item.isCustom || false})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartSubtotal.textContent = `${subtotal.toFixed(2)}€`;
        cartTotal.textContent = `${calculateCartTotal().toFixed(2)}€`;
        cartFooter.style.display = 'block';
    }
}

function calculateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = getCurrentDiscount();
    const shipping = subtotal > 50 ? 0 : 5.90;
    
    return Math.max(0, subtotal - discount + shipping);
}

function getCurrentDiscount() {
    const discountElement = document.getElementById('cartDiscount');
    if (discountElement && discountElement.parentElement.style.display !== 'none') {
        const discountText = discountElement.textContent.replace('€', '').replace('-', '');
        return parseFloat(discountText) || 0;
    }
    return 0;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    
    if (cartSidebar.classList.contains('active')) {
        playSound('modal-open');
    }
}

function animateCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.animation = 'pulse 0.3s ease';
    
    setTimeout(() => {
        cartBtn.style.animation = '';
    }, 300);
}

function applyPromoCode(code) {
    if (!code) {
        code = document.getElementById('promoInput').value.toUpperCase();
    }
    
    if (!code) {
        showNotification('Veuillez saisir un code promo', 'error');
        return;
    }
    
    const promo = promoCodes[code];
    if (!promo) {
        showNotification('Code promo invalide', 'error');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * promo.discount;
    
    // Update discount display
    const discountLine = document.getElementById('discountLine');
    const cartDiscount = document.getElementById('cartDiscount');
    
    discountLine.style.display = 'flex';
    cartDiscount.textContent = `-${discount.toFixed(2)}€`;
    
    // Update total
    updateCartDisplay();
    
    showNotification(`Code promo appliqué : ${promo.description}`, 'success');
    document.getElementById('promoInput').value = '';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }
    
    const total = calculateCartTotal();
    
    if (confirm(`Confirmer votre commande de ${total.toFixed(2)}€ ?`)) {
        showLoading();
        
        setTimeout(() => {
            // Simulate order processing
            const orderId = 'CF' + Date.now().toString().slice(-6);
            
            showNotification(`Commande ${orderId} confirmée ! Merci pour votre achat.`, 'success');
            
            // Clear cart
            cart = [];
            updateCartDisplay();
            saveCartToStorage();
            toggleCart();
            hideLoading();
            
            // Send confirmation email (if EmailJS is set up)
            sendOrderConfirmation(orderId, total);
        }, 2000);
    }
}

// Contact Form
function initializeEmailJS() {
    // Initialize EmailJS (you'll need to add your public key)
    // emailjs.init("YOUR_PUBLIC_KEY");
}

function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };
    
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
        event.target.reset();
        hideLoading();
    }, 1500);
    
    // If EmailJS is configured:
    // emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
    //     .then(() => {
    //         showNotification('Message envoyé avec succès !', 'success');
    //         event.target.reset();
    //     })
    //     .catch(() => {
    //         showNotification('Erreur lors de l\'envoi', 'error');
    //     })
    //     .finally(() => hideLoading());
}

function sendOrderConfirmation(orderId, total) {
    // This would send an order confirmation email
    console.log(`Order confirmation for ${orderId}: ${total}€`);
}

// Gift Functions
function loadGifts() {
    // This function would load gift-specific content
    // For now, gifts are statically defined in HTML
}

function selectGiftCard(amount) {
    const giftCard = {
        id: 'gift-' + Date.now(),
        name: `Carte Cadeau ${amount}€`,
        price: amount,
        quantity: 1,
        isGiftCard: true
    };
    
    cart.push(giftCard);
    updateCartDisplay();
    saveCartToStorage();
    
    showNotification(`Carte cadeau de ${amount}€ ajoutée au panier`, 'success');
}

// Utility Functions
function saveCartToStorage() {
    localStorage.setItem('chocolat-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('chocolat-cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (error) {
            console.error('Error loading cart:', error);
            cart = [];
        }
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function playSound(type) {
    if (!window.audioContext) {
        try {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            return; // Audio not supported
        }
    }
    
    const frequencies = {
        'modal-open': 600,
        'add-to-cart': 800,
        'success': 1000,
        'error': 300
    };
    
    const frequency = frequencies[type] || 600;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, window.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
    
    oscillator.start(window.audioContext.currentTime);
    oscillator.stop(window.audioContext.currentTime + 0.3);
}

function scrollToSection(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // User dropdown toggle
    document.addEventListener('click', function(e) {
        const userProfile = document.querySelector('.user-profile');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userProfile && userProfile.contains(e.target)) {
            userDropdown.classList.toggle('active');
        } else {
            userDropdown.classList.remove('active');
        }
        
        // Close cart if clicking outside
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && !cartSidebar.contains(e.target) && !e.target.closest('.cart-container')) {
            cartSidebar.classList.remove('active');
        }
        
        // Close auth modal if clicking outside
        const authModal = document.getElementById('authModal');
        if (authModal && e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            hideAuthModal();
            document.getElementById('cartSidebar').classList.remove('active');
            document.getElementById('userDropdown').classList.remove('active');
        }
    });
    
    // Load cart on page load
    loadCartFromStorage();
    
    // Initialize intersection observer for animations
    setupScrollAnimations();
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .product-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.getElementById('mobileToggle');
    
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
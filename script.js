// Global Variables
let cart = [];
let currentCarouselIndex = 0;
const productsPerView = window.innerWidth <= 768 ? 1 : 3;
let currentUser = null;
let isAuthenticated = false;

// Product Data
const productData = {
    fraise: {
        name: "Chocolat Fraise",
        price: 8.50,
        description: "Notre chocolat noir 70% premium enrobé de morceaux de fraises séchées françaises. Un équilibre parfait entre l'amertume du cacao et la douceur fruitée.",
        ingredients: "Cacao (70%), fraises séchées (15%), sucre de canne, beurre de cacao, lécithine de tournesol",
        nutritional: "Calories: 534 kcal/100g | Protéines: 8.2g | Glucides: 35.6g | Lipides: 42.1g",
        image: "https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=600&h=400&fit=crop"
    },
    mangue: {
        name: "Chocolat Mangue",
        price: 9.00,
        description: "Chocolat au lait onctueux sublimé par des cubes de mangue exotique. Une évasion tropicale dans chaque bouchée.",
        ingredients: "Chocolat au lait (65%), mangue séchée (20%), sucre, beurre de cacao, lait en poudre",
        nutritional: "Calories: 548 kcal/100g | Protéines: 7.8g | Glucides: 38.2g | Lipides: 41.5g",
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=400&fit=crop"
    },
    framboises: {
        name: "Chocolat Framboises",
        price: 8.75,
        description: "Chocolat blanc délicat parsemé de framboises lyophilisées. La douceur crémeuse rencontre l'acidité rafraîchissante.",
        ingredients: "Chocolat blanc (70%), framboises lyophilisées (18%), sucre, beurre de cacao, lait en poudre",
        nutritional: "Calories: 556 kcal/100g | Protéines: 6.9g | Glucides: 41.3g | Lipides: 43.2g",
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&h=400&fit=crop"
    },
    orange: {
        name: "Chocolat Orange",
        price: 8.25,
        description: "Chocolat noir intense agrémenté de zestes d'orange confite. Un classique revisité avec des agrumes de Provence.",
        ingredients: "Chocolat noir (75%), zestes d'orange confite (12%), sucre, beurre de cacao, huile d'orange",
        nutritional: "Calories: 528 kcal/100g | Protéines: 8.8g | Glucides: 33.1g | Lipides: 41.8g",
        image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=400&fit=crop"
    }
};

// Authentication Functions
function initializeGoogleAuth() {
    // Initialize Google Sign-In
    window.google?.accounts?.id?.initialize({
        client_id: 'your-google-client-id.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false
    });
}

function handleCredentialResponse(response) {
    try {
        // Decode JWT token (in production, verify on server)
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
        console.error('Error processing Google credential:', error);
        alert('Erreur lors de la connexion Google. Veuillez réessayer.');
    }
}

function demoLogin() {
    // Demo login for testing purposes
    currentUser = {
        id: 'demo-user',
        name: 'Utilisateur Démo',
        email: 'demo@chocolatfruitier.com',
        picture: null,
        loginMethod: 'demo'
    };
    
    authenticateUser();
}

function authenticateUser() {
    isAuthenticated = true;
    
    // Save user session
    localStorage.setItem('chocolat-fruitier-user', JSON.stringify(currentUser));
    localStorage.setItem('chocolat-fruitier-auth', 'true');
    
    // Hide auth overlay and show main content
    hideAuthOverlay();
    
    // Update user welcome message
    updateUserInterface();
    
    // Play success sound
    playSound('success');
    
    // Show welcome notification
    showWelcomeNotification();
}

function hideAuthOverlay() {
    const authOverlay = document.getElementById('authOverlay');
    const mainContent = document.getElementById('mainContent');
    
    authOverlay.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        authOverlay.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.style.animation = 'fadeIn 0.5s ease-out';
    }, 500);
}

function updateUserInterface() {
    const userWelcome = document.getElementById('userWelcome');
    const userInfoBar = document.getElementById('userInfoBar');
    
    if (currentUser) {
        userWelcome.textContent = `Bonjour, ${currentUser.name} !`;
        userInfoBar.style.display = 'flex';
    }
}

function showWelcomeNotification() {
    // Create and show welcome notification
    const notification = document.createElement('div');
    notification.className = 'welcome-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>Bienvenue ${currentUser.name} !</h4>
            <p>Profitez de votre expérience personnalisée chez Chocolat Fruitier.</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function logout() {
    const confirmation = confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    
    if (confirmation) {
        // Clear user data
        currentUser = null;
        isAuthenticated = false;
        
        // Clear storage
        localStorage.removeItem('chocolat-fruitier-user');
        localStorage.removeItem('chocolat-fruitier-auth');
        
        // Clear cart (optional)
        cart = [];
        localStorage.removeItem('chocolat-fruitier-cart');
        
        // Sign out from Google
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
        
        // Reload page to show auth overlay
        window.location.reload();
    }
}

function checkAuthenticationStatus() {
    // Check if user is already authenticated
    const savedUser = localStorage.getItem('chocolat-fruitier-user');
    const authStatus = localStorage.getItem('chocolat-fruitier-auth');
    
    if (authStatus === 'true' && savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            
            // Hide auth overlay immediately
            const authOverlay = document.getElementById('authOverlay');
            const mainContent = document.getElementById('mainContent');
            
            authOverlay.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Update UI
            setTimeout(() => {
                updateUserInterface();
            }, 100);
            
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            // Clear corrupted data
            localStorage.removeItem('chocolat-fruitier-user');
            localStorage.removeItem('chocolat-fruitier-auth');
        }
    }
}

// Protect interactive functions - require authentication
function requireAuth(callback) {
    if (!isAuthenticated) {
        alert('Veuillez vous connecter pour accéder à cette fonctionnalité.');
        return false;
    }
    return callback();
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    checkAuthenticationStatus();
    setupEventListeners();
    setupScrollAnimations();
    setupNavbarScroll();
    setupCarousel();
    loadCartFromStorage();
    addSoundEffects();
    initializeGoogleAuth();
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
    document.getElementById('cartBtn').addEventListener('click', openCart);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Newsletter form
    document.querySelector('.newsletter-form').addEventListener('submit', handleNewsletterSubmit);

    // Mobile hamburger animation
    document.getElementById('hamburger').addEventListener('click', function() {
        this.classList.toggle('active');
    });

    // Close modals when clicking outside
    window.addEventListener('click', handleOutsideClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    const sectionId = href.substring(1);
    scrollToSection(sectionId);
    
    // Close mobile menu if open
    document.querySelector('.nav-menu').classList.remove('active');
    document.getElementById('hamburger').classList.remove('active');
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('ingredients-grid') ||
                    entry.target.classList.contains('testimonials-grid')) {
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s forwards`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Add fade-in class to sections and observe them
    const sections = document.querySelectorAll('.products-section, .ingredients-section, .testimonials-section, .contact-section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe individual cards for staggered animations
    const cards = document.querySelectorAll('.product-card, .ingredient-card, .testimonial-card');
    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Carousel Functions
function setupCarousel() {
    updateCarouselView();
    
    // Auto-rotate carousel
    setInterval(function() {
        moveCarousel(1);
    }, 5000);
}

function moveCarousel(direction) {
    const carousel = document.getElementById('productCarousel');
    const cards = carousel.children;
    const maxIndex = cards.length - productsPerView;
    
    currentCarouselIndex += direction;
    
    if (currentCarouselIndex > maxIndex) {
        currentCarouselIndex = 0;
    } else if (currentCarouselIndex < 0) {
        currentCarouselIndex = maxIndex;
    }
    
    updateCarouselView();
}

function updateCarouselView() {
    const carousel = document.getElementById('productCarousel');
    const cardWidth = 320; // 300px + 20px gap
    const translateX = -currentCarouselIndex * cardWidth;
    
    carousel.style.transform = `translateX(${translateX}px)`;
}

// Shopping Cart Functions
function addToCart(id, name, price) {
    return requireAuth(() => {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        updateCartDisplay();
        saveCartToStorage();
        showAddToCartAnimation();
        playSound('add-to-cart');
        return true;
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCartToStorage();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `${totalPrice.toFixed(2)}€`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}€ x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart('${item.id}')" class="remove-btn">×</button>
                </div>
            </div>
        `).join('');
    }
}

function openCart() {
    return requireAuth(() => {
        document.getElementById('cartModal').classList.add('active');
        playSound('modal-open');
        return true;
    });
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const confirmation = confirm(`Confirmer votre commande de ${total.toFixed(2)}€ ?`);
    
    if (confirmation) {
        // Simulate checkout process
        showCheckoutAnimation();
        setTimeout(() => {
            alert('Merci pour votre commande ! Vous recevrez un email de confirmation.');
            cart = [];
            updateCartDisplay();
            saveCartToStorage();
            closeCart();
        }, 2000);
    }
}

// Custom Bar Builder
function addCustomBar() {
    return requireAuth(() => {
        const chocolateType = document.querySelector('input[name="chocolate"]:checked');
        const selectedFruits = document.querySelectorAll('input[name="fruits"]:checked');
        
        if (!chocolateType) {
            alert('Veuillez choisir un type de chocolat');
            return;
        }
        
        if (selectedFruits.length === 0) {
            alert('Veuillez sélectionner au moins un fruit');
            return;
        }
        
        const fruits = Array.from(selectedFruits).map(input => input.value);
        const customName = `Chocolat ${chocolateType.value} aux ${fruits.join(', ')}`;
        
        addToCart('custom', customName, 12.00);
        
        // Reset form
        document.querySelectorAll('.custom-builder input').forEach(input => {
            input.checked = false;
        });
        
        alert('Votre création personnalisée a été ajoutée au panier !');
        return true;
    });
}

// Product Modal
function openProductModal(productId) {
    const product = productData[productId];
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="product-price">${product.price.toFixed(2)}€</p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-details-section">
                    <h3>Ingrédients</h3>
                    <p>${product.ingredients}</p>
                </div>
                
                <div class="product-details-section">
                    <h3>Valeurs nutritionnelles</h3>
                    <p>${product.nutritional}</p>
                </div>
                
                <button class="add-to-cart-btn large" onclick="addToCart('${productId}', '${product.name}', ${product.price})">
                    Ajouter au panier - ${product.price.toFixed(2)}€
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    playSound('modal-open');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Newsletter
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate newsletter signup
    showNewsletterAnimation();
    setTimeout(() => {
        alert('Merci pour votre inscription ! Vous recevrez bientôt nos dernières nouvelles.');
        e.target.reset();
    }, 1500);
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('chocolat-fruitier-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('chocolat-fruitier-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Animation Functions
function showAddToCartAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'pulse 0.3s ease';
    }, 10);
}

function showCheckoutAnimation() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.textContent = 'Traitement en cours...';
    checkoutBtn.disabled = true;
    checkoutBtn.style.animation = 'pulse 0.5s infinite';
    
    setTimeout(() => {
        checkoutBtn.textContent = 'Commander';
        checkoutBtn.disabled = false;
        checkoutBtn.style.animation = 'none';
    }, 2000);
}

function showNewsletterAnimation() {
    const submitBtn = document.querySelector('.newsletter-form button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Inscription...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Sound Effects
function addSoundEffects() {
    // Create audio contexts for different sounds
    window.audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!window.audioContext) return;
    
    const frequency = {
        'add-to-cart': 800,
        'modal-open': 600,
        'success': 1000
    };
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency[type] || 600, window.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
    
    oscillator.start(window.audioContext.currentTime);
    oscillator.stop(window.audioContext.currentTime + 0.3);
}

// Utility Functions
function handleOutsideClick(e) {
    // Close cart modal
    const cartModal = document.getElementById('cartModal');
    if (e.target === cartModal) {
        closeCart();
    }
    
    // Close product modal
    const productModal = document.getElementById('productModal');
    if (e.target === productModal) {
        closeProductModal();
    }
    
    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.hamburger')) {
        toggleMobileMenu();
    }
}

function handleKeyboardNavigation(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        closeCart();
        closeProductModal();
    }
    
    // Carousel navigation with arrow keys
    if (e.key === 'ArrowLeft') {
        moveCarousel(-1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel(1);
    }
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-video');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Lazy Loading for Images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Handle scroll events here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Add custom CSS animations for cart items
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--warm-beige);
        animation: slideInUp 0.3s ease;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .cart-item-controls button {
        background: var(--soft-green);
        border: 1px solid var(--vintage-black);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .cart-item-controls button:hover {
        background: var(--muted-yellow);
        transform: scale(1.1);
    }
    
    .remove-btn {
        background: var(--dusty-rose) !important;
        color: white !important;
    }
    
    .product-detail {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .product-detail-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 15px;
    }
    
    .product-details-section {
        margin: 1.5rem 0;
    }
    
    .product-details-section h3 {
        color: var(--chocolate-brown);
        margin-bottom: 0.5rem;
    }
    
    .add-to-cart-btn.large {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
        .product-detail {
            grid-template-columns: 1fr;
            padding: 1rem;
        }
    }
`;

document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
    initializeWebsite();
}
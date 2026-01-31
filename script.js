// ProMarketplace Application - GitHub Pages Version
class MarketplaceApp {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('marketplace_user')) || null;
        this.cart = JSON.parse(localStorage.getItem('marketplace_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('marketplace_wishlist')) || [];
        this.products = [];
        this.recommendations = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.isDarkMode = true;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        this.loadProductsData();
        this.loadRecommendations();
        this.updateCartCount();
        this.updateWishlistCount();
        this.initAIAssistant();
        this.initTheme();
        this.updateStats();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 1500);
    }

    bindEvents() {
        // Search
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });
        
        document.getElementById('aiSearchBtn').addEventListener('click', () => {
            this.handleAISearch();
        });

        // Categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterByCategory(category);
            });
        });

        // User menu
        document.getElementById('userMenuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = document.getElementById('userMenu');
            menu.classList.toggle('show');
        });

        // Close menus when clicking outside
        document.addEventListener('click', () => {
            document.getElementById('userMenu').classList.remove('show');
            document.getElementById('cartPreview').classList.remove('show');
        });

        // Cart
        document.getElementById('cartBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('cartPreview').classList.toggle('show');
            this.updateCartPreview();
        });

        // Wishlist
        document.getElementById('wishlistBtn').addEventListener('click', () => {
            this.showWishlist();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Refresh recommendations
        document.getElementById('refreshRecommendations').addEventListener('click', () => {
            this.loadRecommendations();
        });

        // Trending filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTrending(e.target.dataset.filter);
            });
        });

        // Auth modals
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('loginModal');
        });

        document.getElementById('registerBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('registerModal');
        });

        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });

        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('registerModal');
            this.showModal('loginModal');
        });

        // Close modals
        document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Close cart preview
        document.querySelector('.close-cart').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('cartPreview').classList.remove('show');
        });
    }

    async loadProductsData() {
        try {
            // Load from local JSON or API
            const response = await fetch('data/products.json');
            this.products = await response.json();
            
            // Render trending products
            this.renderTrendingProducts();
            
            // Render categories
            this.renderCategories();
            
            // Update stats
            this.updateStats();
        } catch (error) {
            console.error('Error loading products:', error);
            // Use fallback data
            this.products = this.getFallbackProducts();
            this.renderTrendingProducts();
            this.renderCategories();
        }
    }

    getFallbackProducts() {
        return [
            {
                id: 1,
                name: "iPhone 15 Pro Max",
                price: 1299.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=200&fit=crop",
                rating: 4.8,
                reviews: 1284,
                stock: 50,
                description: "Latest Apple smartphone with A17 Pro chip",
                tags: ["apple", "smartphone", "premium"],
                aiScore: 0.95
            },
            {
                id: 2,
                name: "MacBook Pro M3",
                price: 2399.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop",
                rating: 4.9,
                reviews: 892,
                stock: 25,
                description: "Professional laptop with M3 chip",
                tags: ["apple", "laptop", "professional"],
                aiScore: 0.92
            },
            {
                id: 3,
                name: "Samsung Galaxy S24",
                price: 999.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=200&fit=crop",
                rating: 4.7,
                reviews: 1567,
                stock: 100,
                description: "Android flagship with AI features",
                tags: ["samsung", "android", "smartphone"],
                aiScore: 0.89
            },
            {
                id: 4,
                name: "Nike Air Max 270",
                price: 149.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
                rating: 4.6,
                reviews: 2345,
                stock: 200,
                description: "Comfortable running shoes",
                tags: ["nike", "shoes", "sports"],
                aiScore: 0.87
            },
            {
                id: 5,
                name: "Sony WH-1000XM5",
                price: 399.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
                rating: 4.8,
                reviews: 1789,
                stock: 75,
                description: "Noise cancelling headphones",
                tags: ["sony", "headphones", "audio"],
                aiScore: 0.91
            },
            {
                id: 6,
                name: "Dyson V15 Detect",
                price: 699.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
                rating: 4.7,
                reviews: 987,
                stock: 40,
                description: "Cordless vacuum cleaner",
                tags: ["dyson", "home", "cleaning"],
                aiScore: 0.85
            }
        ];
    }

    async loadRecommendations() {
        try {
            // Show loading state
            const grid = document.getElementById('recommendationsGrid');
            grid.innerHTML = '<div class="loading">Loading AI recommendations...</div>';
            
            // Simulate AI processing
            setTimeout(() => {
                this.recommendations = this.generateAIRecommendations();
                this.renderRecommendations();
            }, 1000);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            this.showNotification('Failed to load recommendations', 'error');
        }
    }

    generateAIRecommendations() {
        // AI recommendation algorithm (simulated)
        const userPreferences = this.getUserPreferences();
        
        return this.products
            .map(product => ({
                ...product,
                aiScore: this.calculateAIScore(product, userPreferences),
                isAIPick: Math.random() > 0.7 // Random AI picks
            }))
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, 6);
    }

    calculateAIScore(product, preferences) {
        let score = 0;
        
        // Category preference
        if (preferences.categories.includes(product.category)) {
            score += 0.3;
        }
        
        // Price range preference
        if (product.price >= preferences.priceRange.min && 
            product.price <= preferences.priceRange.max) {
            score += 0.2;
        }
        
        // Rating weight
        score += (product.rating / 5) * 0.2;
        
        // Popularity weight
        score += (Math.min(product.reviews / 2000, 1)) * 0.2;
        
        // Random factor (simulating AI learning)
        score += Math.random() * 0.1;
        
        return Math.min(score, 1);
    }

    getUserPreferences() {
        // Get user preferences from localStorage or use defaults
        const preferences = JSON.parse(localStorage.getItem('user_preferences')) || {
            categories: ['electronics', 'fashion'],
            priceRange: { min: 50, max: 2000 },
            brands: ['apple', 'samsung', 'nike']
        };
        
        return preferences;
    }

    renderRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        grid.innerHTML = '';
        
        this.recommendations.forEach(product => {
            const card = this.createProductCard(product, true);
            grid.appendChild(card);
        });
    }

    renderTrendingProducts() {
        const grid = document.getElementById('trendingGrid');
        grid.innerHTML = '';
        
        const trendingProducts = this.products
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8);
        
        trendingProducts.forEach(product => {
            const card = this.createProductCard(product, false);
            grid.appendChild(card);
        });
    }

    createProductCard(product, isRecommendation = false) {
        const card = document.createElement('div');
        card.className = `product-card ${isRecommendation ? 'recommendation-card' : ''}`;
        
        if (isRecommendation && product.isAIPick) {
            card.classList.add('ai-pick');
        }
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.stock < 10 ? '<span class="stock-badge">Low Stock</span>' : ''}
                ${product.tags.includes('new') ? '<span class="new-badge">NEW</span>' : ''}
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                
                <div class="product-rating">
                    ${this.generateStarRating(product.rating)}
                    <span class="review-count">(${product.reviews})</span>
                    ${isRecommendation ? `<span class="ai-score">${(product.aiScore * 100).toFixed(0)}% match</span>` : ''}
                </div>
                
                <div class="product-price-row">
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="stock-status ${product.stock > 50 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                        ${product.stock > 50 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="action-btn wishlist-btn" data-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="action-btn view-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToWishlist(product.id);
        });
        
        card.querySelector('.cart-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart(product.id);
        });
        
        card.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.viewProduct(product.id);
        });
        
        card.addEventListener('click', () => {
            this.showQuickView(product.id);
        });
        
        return card;
    }

    generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = '';
        
        const categories = [
            { name: 'Electronics', icon: 'fas fa-laptop', count: 1250, color: '#7c3aed' },
            { name: 'Fashion', icon: 'fas fa-tshirt', count: 890, color: '#ec4899' },
            { name: 'Home & Living', icon: 'fas fa-home', count: 745, color: '#10b981' },
            { name: 'Books', icon: 'fas fa-book', count: 1560, color: '#3b82f6' },
            { name: 'Sports', icon: 'fas fa-basketball-ball', count: 432, color: '#f59e0b' },
            { name: 'Beauty', icon: 'fas fa-spa', count: 678, color: '#ef4444' },
            { name: 'Toys', icon: 'fas fa-gamepad', count: 321, color: '#8b5cf6' },
            { name: 'Food', icon: 'fas fa-utensils', count: 543, color: '#06b6d4' }
        ];
        
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.style.setProperty('--category-color', category.color);
            
            card.innerHTML = `
                <i class="${category.icon}"></i>
                <h4>${category.name}</h4>
                <p>${category.count} products</p>
                <div class="category-overlay"></div>
            `;
            
            card.addEventListener('click', () => {
                this.filterByCategory(category.name.toLowerCase());
            });
            
            grid.appendChild(card);
        });
    }

    // Product Management
    addToCart(productId) {
        if (!this.currentUser) {
            this.showModal('loginModal');
            this.showNotification('Please login to add items to cart', 'warning');
            return;
        }
        
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('marketplace_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartPreview();
        
        this.showNotification(`Added ${product.name} to cart`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem('marketplace_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        this.updateCartPreview();
        
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    updateCartPreview() {
        const container = document.getElementById('cartItems');
        const totalElement = document.getElementById('cartTotal');
        
        if (this.cart.length === 0) {
            container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            totalElement.textContent = '$0.00';
            return;
        }
        
        let html = '';
        let total = 0;
        
        this.cart.forEach(item => {
            total += item.price * item.quantity;
            
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to cart items
        container.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.updateCartQuantity(id, -1);
            });
        });
        
        container.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.updateCartQuantity(id, 1);
            });
        });
        
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.removeFromCart(id);
            });
        });
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            localStorage.setItem('marketplace_cart', JSON.stringify(this.cart));
            this.updateCartCount();
            this.updateCartPreview();
        }
    }

    addToWishlist(productId) {
        if (!this.currentUser) {
            this.showModal('loginModal');
            this.showNotification('Please login to add to wishlist', 'warning');
            return;
        }
        
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        if (this.wishlist.some(item => item.id === productId)) {
            this.showNotification('Already in wishlist', 'info');
            return;
        }
        
        this.wishlist.push(product);
        localStorage.setItem('marketplace_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
        
        this.showNotification(`Added ${product.name} to wishlist`, 'success');
    }

    updateWishlistCount() {
        document.getElementById('wishlistCount').textContent = this.wishlist.length;
    }

    // Filtering & Search
    filterByCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Filter products
        let filteredProducts;
        if (category === 'all') {
            filteredProducts = this.products;
        } else {
            filteredProducts = this.products.filter(p => 
                p.category === category || 
                p.tags.includes(category)
            );
        }
        
        // Update UI
        this.renderFilteredProducts(filteredProducts);
    }

    filterTrending(filter) {
        let filteredProducts;
        
        switch(filter) {
            case 'new':
                filteredProducts = this.products
                    .filter(p => p.tags.includes('new'))
                    .sort(() => Math.random() - 0.5);
                break;
            case 'best':
                filteredProducts = this.products
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 8);
                break;
            case 'discount':
                filteredProducts = this.products
                    .filter(p => p.discount)
                    .sort((a, b) => b.discount - a.discount);
                break;
            default: // trending
                filteredProducts = this.products
                    .sort((a, b) => b.reviews - a.reviews)
                    .slice(0, 8);
        }
        
        this.renderFilteredProducts(filteredProducts);
    }

    renderFilteredProducts(products) {
        const grid = document.getElementById('trendingGrid');
        grid.innerHTML = '';
        
        products.forEach(product => {
            const card = this.createProductCard(product, false);
            grid.appendChild(card);
        });
    }

    handleSearchInput(query) {
        this.searchQuery = query.toLowerCase();
        
        if (this.searchQuery.length < 2) {
            document.getElementById('searchSuggestions').innerHTML = '';
            return;
        }
        
        const suggestions = this.products
            .filter(product => 
                product.name.toLowerCase().includes(this.searchQuery) ||
                product.description.toLowerCase().includes(this.searchQuery) ||
                product.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            )
            .slice(0, 5);
        
        this.showSearchSuggestions(suggestions);
    }

    showSearchSuggestions(suggestions) {
        const container = document.getElementById('searchSuggestions');
        
        if (suggestions.length === 0) {
            container.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }
        
        let html = '';
        suggestions.forEach(product => {
            html += `
                <div class="suggestion-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h5>${product.name}</h5>
                        <p>$${product.price.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add click events
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = parseInt(item.dataset.id);
                this.viewProduct(productId);
                container.innerHTML = '';
            });
        });
    }

    handleAISearch() {
        const query = document.getElementById('globalSearch').value;
        
        if (!query.trim()) {
            this.showNotification('Please enter a search query', 'warning');
            return;
        }
        
        // Simulate AI search processing
        this.showNotification('🤖 AI is searching for the best matches...', 'info');
        
        setTimeout(() => {
            const results = this.products
                .map(product => ({
                    ...product,
                    relevance: this.calculateRelevance(product, query)
                }))
                .filter(product => product.relevance > 0.3)
                .sort((a, b) => b.relevance - a.relevance);
            
            this.renderAIResults(results, query);
        }, 1500);
    }

    calculateRelevance(product, query) {
        const queryTerms = query.toLowerCase().split(' ');
        let score = 0;
        
        queryTerms.forEach(term => {
            if (product.name.toLowerCase().includes(term)) score += 0.4;
            if (product.description.toLowerCase().includes(term)) score += 0.3;
            if (product.tags.some(tag => tag.toLowerCase().includes(term))) score += 0.2;
            if (product.category.toLowerCase().includes(term)) score += 0.1;
        });
        
        return Math.min(score, 1);
    }

    renderAIResults(results, query) {
        // This would show results in a modal or dedicated results page
        if (results.length === 0) {
            this.showNotification(`No AI matches found for "${query}"`, 'info');
            return;
        }
        
        this.showNotification(`AI found ${results.length} matches for "${query}"`, 'success');
        
        // For now, just show in trending grid
        this.renderFilteredProducts(results);
    }

    // Product View
    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        // In a real app, navigate to product detail page
        // For now, show quick view
        this.showQuickView(productId);
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modalContent = document.querySelector('.product-modal .modal-content');
        modalContent.innerHTML = `
            <div class="quick-view">
                <div class="quick-view-images">
                    <img src="${product.image}" alt="${product.name}" class="main-image">
                    <div class="thumbnail-grid">
                        <img src="${product.image}" alt="Thumbnail 1">
                        <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w-150&h=100&fit=crop" alt="Thumbnail 2">
                        <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=150&h=100&fit=crop" alt="Thumbnail 3">
                    </div>
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="rating">
                        ${this.generateStarRating(product.rating)}
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    
                    <div class="description">
                        <h4>Description</h4>
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="specifications">
                        <h4>Specifications</h4>
                        <div class="spec-grid">
                            <div class="spec">
                                <span>Category:</span>
                                <span>${product.category}</span>
                            </div>
                            <div class="spec">
                                <span>Stock:</span>
                                <span class="${product.stock > 50 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-stock'}">
                                    ${product.stock} units
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-view-actions">
                        <button class="wishlist-btn-quick" data-id="${product.id}">
                            <i class="fas fa-heart"></i> Add to Wishlist
                        </button>
                        <button class="cart-btn-quick" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="buy-now-btn" data-id="${product.id}">
                            <i class="fas fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        modalContent.querySelector('.wishlist-btn-quick').addEventListener('click', () => {
            this.addToWishlist(product.id);
        });
        
        modalContent.querySelector('.cart-btn-quick').addEventListener('click', () => {
            this.addToCart(product.id);
        });
        
        modalContent.querySelector('.buy-now-btn').addEventListener('click', () => {
            this.buyNow(product.id);
        });
        
        this.showModal('quickViewModal');
    }

    // Authentication
    handleLogin() {
        const form = document.getElementById('loginForm');
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        
        // Simulate login
        if (email && password) {
            this.currentUser = {
                id: 1,
                email: email,
                name: email.split('@')[0],
                avatar: 'https://i.pravatar.cc/150?img=1'
            };
            
            localStorage.setItem('marketplace_user', JSON.stringify(this.currentUser));
            this.hideAllModals();
            this.showNotification('Login successful!', 'success');
            this.updateUserUI();
        } else {
            this.showNotification('Please fill all fields', 'error');
        }
    }

    handleRegister() {
        const form = document.getElementById('registerForm');
        const firstName = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;
        
        if (!firstName || !email || !password) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }
        
        // Simulate registration
        this.currentUser = {
            id: Date.now(),
            email: email,
            name: firstName,
            avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
        };
        
        localStorage.setItem('marketplace_user', JSON.stringify(this.currentUser));
        this.hideAllModals();
        this.showNotification('Registration successful!', 'success');
        this.updateUserUI();
    }

    updateUserUI() {
        if (this.currentUser) {
            const userBtn = document.querySelector('.user-btn span');
            userBtn.textContent = this.currentUser.name;
            
            // Update user menu
            const userMenu = document.getElementById('userMenu');
            userMenu.innerHTML = `
                <a href="dashboard.html" class="menu-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="fas fa-heart"></i>
                    <span>Wishlist</span>
                </a>
                <a href="#" class="menu-item">
                    <i class="fas fa-shopping-bag"></i>
                    <span>Orders</span>
                </a>
                <div class="menu-divider"></div>
                <a href="#" class="menu-item" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            `;
            
            // Add logout handler
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('marketplace_user');
        this.showNotification('Logged out successfully', 'info');
        
        // Reset user UI
        const userBtn = document.querySelector('.user-btn span');
        userBtn.textContent = 'Account';
        
        // Reset user menu
        const userMenu = document.getElementById('userMenu');
        userMenu.innerHTML = `
            <a href="#" class="menu-item" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i>
                <span>Login</span>
            </a>
            <a href="#" class="menu-item" id="registerBtn">
                <i class="fas fa-user-plus"></i>
                <span>Register</span>
            </a>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item">
                <i class="fas fa-question-circle"></i>
                <span>Help</span>
            </a>
        `;
    }

    // UI Utilities
    showModal(modalId) {
        document.getElementById('modalOverlay').classList.add('show');
        document.getElementById(modalId).classList.add('show');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    hideAllModals() {
        document.getElementById('modalOverlay').classList.remove('show');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    showNotification(message, type = 'info') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: this.getNotificationColor(type),
            className: `toast-${type}`,
            stopOnFocus: true
        }).showToast();
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    updateStats() {
        // Simulate live stats
        document.getElementById('usersCount').textContent = 
            (Math.floor(Math.random() * 5000) + 10000).toLocaleString() + '+';
        
        document.getElementById('productsCount').textContent = 
            (Math.floor(Math.random() * 2000) + 5000).toLocaleString() + '+';
        
        document.getElementById('ordersCount').textContent = 
            (Math.floor(Math.random() * 1000) + 2500).toLocaleString() + '+';
    }

    initTheme() {
        const theme = localStorage.getItem('theme') || 'dark';
        this.isDarkMode = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const theme = this.isDarkMode ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showNotification(`Switched to ${theme} mode`, 'info');
    }

    initAIAssistant() {
        const toggleBtn = document.getElementById('aiToggle');
        const closeBtn = document.getElementById('aiClose');
        const chatContainer = document.getElementById('aiChatContainer');
        const sendBtn = document.getElementById('aiSendBtn');
        const input = document.getElementById('aiChatInput');
        
        toggleBtn.addEventListener('click', () => {
            chatContainer.classList.toggle('show');
        });
        
        closeBtn.addEventListener('click', () => {
            chatContainer.classList.remove('show');
        });
        
        sendBtn.addEventListener('click', () => {
            this.handleAIChat(input.value);
            input.value = '';
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAIChat(input.value);
                input.value = '';
            }
        });
    }

    handleAIChat(message) {
        if (!message.trim()) return;
        
        const messagesContainer = document.getElementById('aiChatMessages');
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `<p>${message}</p>`;
        messagesContainer.appendChild(userMsg);
        
        // Generate AI response
        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            aiMsg.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-brain"></i>
                </div>
                <p>${aiResponse}</p>
            `;
            messagesContainer.appendChild(aiMsg);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }

    generateAIResponse(message) {
        const responses = [
            "I found some great options for you! Check out our electronics section for the latest gadgets.",
            "Based on your interests, I recommend looking at our premium fashion collection. There's a sale going on right now!",
            "I suggest checking the trending products section. Many users are loving our new arrivals this week.",
            "For that type of product, I'd recommend filtering by category and sorting by customer ratings.",
            "I can help you compare different products. What specific features are you looking for?",
            "Based on current trends, products with 4+ star ratings and good reviews are the most popular choices."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    startAIShopping() {
        if (!this.currentUser) {
            this.showModal('loginModal');
            return;
        }
        
        this.showNotification('🤖 Starting AI shopping assistant...', 'info');
        
        // Open AI chat
        document.getElementById('aiChatContainer').classList.add('show');
        
        // Add welcome message
        const messagesContainer = document.getElementById('aiChatMessages');
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message ai';
        welcomeMsg.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-brain"></i>
            </div>
            <p>Hello! I'm your AI shopping assistant. I can help you find products, compare prices, and make recommendations. What are you looking for today?</p>
        `;
        messagesContainer.appendChild(welcomeMsg);
    }

    buyNow(productId) {
        if (!this.currentUser) {
            this.showModal('loginModal');
            return;
        }
        
        this.addToCart(productId);
        this.hideAllModals();
        
        // In a real app, redirect to checkout
        this.showNotification('Redirecting to checkout...', 'info');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    }

    showWishlist() {
        if (!this.currentUser) {
            this.showModal('loginModal');
            return;
        }
        
        if (this.wishlist.length === 0) {
            this.showNotification('Your wishlist is empty', 'info');
            return;
        }
        
        // In a real app, show wishlist page/modal
        this.showNotification(`You have ${this.wishlist.length} items in your wishlist`, 'info');
    }
}

// Initialize app
const marketplace = new MarketplaceApp();

// Make available globally
window.marketplace = marketplace;

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

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

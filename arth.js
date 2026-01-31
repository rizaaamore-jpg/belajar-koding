// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('marketplace_cart')) || [];
        this.listeners = [];
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.save();
        this.notifyListeners();
        return this.items;
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.notifyListeners();
        return this.items;
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
            this.save();
            this.notifyListeners();
        }
        
        return this.items;
    }

    clear() {
        this.items = [];
        this.save();
        this.notifyListeners();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((total, item) => {
            const price = item.discount ? 
                item.price * (1 - item.discount / 100) : 
                item.price;
            return total + (price * item.quantity);
        }, 0);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const shipping = this.getShippingCost();
        const tax = this.getTax(subtotal);
        
        return subtotal + shipping + tax;
    }

    getShippingCost() {
        if (this.getSubtotal() > 100) {
            return 0; // Free shipping over $100
        }
        return 9.99; // Standard shipping
    }

    getTax(subtotal) {
        return subtotal * 0.08; // 8% tax
    }

    getItemsByCategory() {
        const categories = {};
        
        this.items.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });
        
        return categories;
    }

    getCartSummary() {
        return {
            items: this.items.length,
            totalItems: this.getTotalItems(),
            subtotal: this.getSubtotal(),
            shipping: this.getShippingCost(),
            tax: this.getTax(this.getSubtotal()),
            total: this.getTotal(),
            hasFreeShipping: this.getSubtotal() > 100
        };
    }

    save() {
        localStorage.setItem('marketplace_cart', JSON.stringify(this.items));
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
    }

    // Checkout functions
    async processCheckout(paymentMethod, shippingAddress) {
        // Simulate checkout process
        return new Promise((resolve) => {
            setTimeout(() => {
                const order = this.createOrder(paymentMethod, shippingAddress);
                this.clear();
                resolve(order);
            }, 1500);
        });
    }

    createOrder(paymentMethod, shippingAddress) {
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        return {
            id: orderId,
            items: this.items,
            summary: this.getCartSummary(),
            paymentMethod: paymentMethod,
            shippingAddress: shippingAddress,
            status: 'processing',
            date: new Date().toISOString(),
            estimatedDelivery: this.getEstimatedDelivery()
        };
    }

    getEstimatedDelivery() {
        const date = new Date();
        date.setDate(date.getDate() + 3); // 3 days from now
        return date.toISOString();
    }

    // Cart persistence helpers
    exportCart() {
        return JSON.stringify({
            items: this.items,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });
    }

    importCart(cartData) {
        try {
            const data = JSON.parse(cartData);
            this.items = data.items || [];
            this.save();
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error('Error importing cart:', error);
            return false;
        }
    }

    // Analytics
    getCartAnalytics() {
        const totalSpent = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const averageItemPrice = totalSpent / this.getTotalItems() || 0;
        const categories = this.getItemsByCategory();
        
        return {
            totalSpent,
            averageItemPrice,
            categoryDistribution: Object.keys(categories).map(category => ({
                category,
                items: categories[category].length,
                value: categories[category].reduce((sum, item) => sum + (item.price * item.quantity), 0)
            })),
            frequentItems: this.items
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 5)
                .map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                }))
        };
    }
}

// Initialize shopping cart
const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart;

// Cart UI Helper Functions
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = shoppingCart.getTotalItems();
    }
    
    if (cartItems && cartTotal) {
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (shoppingCart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-outline" onclick="window.location.href='index.html'">
                    Continue Shopping
                </button>
            </div>
        `;
        if (totalElement) totalElement.textContent = '$0.00';
        return;
    }
    
    let html = '';
    shoppingCart.items.forEach(item => {
        const price = item.discount ? 
            item.price * (1 - item.discount / 100) : 
            item.price;
        
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <div class="cart-item-price">
                        $${price.toFixed(2)} × ${item.quantity}
                        <span class="cart-item-total">$${(price * item.quantity).toFixed(2)}</span>
                    </div>
                    ${item.discount ? `<span class="discount-badge">${item.discount}% OFF</span>` : ''}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    if (totalElement) {
        totalElement.textContent = `$${shoppingCart.getTotal().toFixed(2)}`;
    }
}

// Global cart functions
function addToCart(productId) {
    const product = window.marketplace?.products?.find(p => p.id === productId);
    if (product) {
        shoppingCart.addItem(product, 1);
        showToast(`Added ${product.name} to cart`, 'success');
    }
}

function removeFromCart(productId) {
    shoppingCart.removeItem(productId);
    showToast('Item removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    shoppingCart.updateQuantity(productId, quantity);
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        shoppingCart.clear();
        showToast('Cart cleared', 'info');
    }
}

function showToast(message, type = 'info') {
    // Use existing notification system or create simple toast
    if (window.marketplace?.showNotification) {
        window.marketplace.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Listen to cart changes
shoppingCart.addListener(updateCartUI);

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', updateCartUI);

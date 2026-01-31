// Products Management Module
class ProductsManager {
    constructor() {
        this.products = [];
        this.categories = new Set();
        this.filters = {
            category: 'all',
            priceRange: { min: 0, max: 10000 },
            rating: 0,
            sortBy: 'featured'
        };
    }

    async loadProducts() {
        try {
            // Try to load from data/products.json
            const response = await fetch('data/products.json');
            this.products = await response.json();
        } catch (error) {
            console.log('Using fallback products data');
            this.products = this.getFallbackProducts();
        }
        
        this.extractCategories();
        return this.products;
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
                featured: true,
                discount: 0
            },
            // ... (add more products from previous example)
        ];
    }

    extractCategories() {
        this.categories.clear();
        this.products.forEach(product => {
            this.categories.add(product.category);
        });
    }

    getFilteredProducts() {
        let filtered = [...this.products];

        // Apply category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }

        // Apply price filter
        filtered = filtered.filter(p => 
            p.price >= this.filters.priceRange.min && 
            p.price <= this.filters.priceRange.max
        );

        // Apply rating filter
        if (this.filters.rating > 0) {
            filtered = filtered.filter(p => p.rating >= this.filters.rating);
        }

        // Apply sorting
        filtered = this.sortProducts(filtered, this.filters.sortBy);

        return filtered;
    }

    sortProducts(products, sortBy) {
        switch(sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...products].sort((a, b) => b.id - a.id);
            case 'popular':
                return [...products].sort((a, b) => b.reviews - a.reviews);
            default: // featured
                return [...products].filter(p => p.featured)
                          .concat([...products].filter(p => !p.featured));
        }
    }

    searchProducts(query) {
        if (!query.trim()) return this.products;

        const searchTerms = query.toLowerCase().split(' ');
        
        return this.products.filter(product => {
            const searchableText = `
                ${product.name} 
                ${product.description} 
                ${product.category}
                ${product.tags.join(' ')}
            `.toLowerCase();

            return searchTerms.every(term => searchableText.includes(term));
        });
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getProductsByCategory(category, limit = 10) {
        return this.products
            .filter(p => p.category === category)
            .slice(0, limit);
    }

    getFeaturedProducts(limit = 8) {
        return this.products
            .filter(p => p.featured)
            .slice(0, limit);
    }

    getDiscountedProducts(limit = 6) {
        return this.products
            .filter(p => p.discount > 0)
            .sort((a, b) => b.discount - a.discount)
            .slice(0, limit);
    }

    updateFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        return this.getFilteredProducts();
    }

    getStats() {
        return {
            totalProducts: this.products.length,
            categories: this.categories.size,
            averagePrice: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length,
            averageRating: this.products.reduce((sum, p) => sum + p.rating, 0) / this.products.length,
            totalStock: this.products.reduce((sum, p) => sum + p.stock, 0)
        };
    }
}

// Export for use in main script
window.ProductsManager = ProductsManager;

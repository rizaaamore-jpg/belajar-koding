// AI Recommendation Engine
class AIRecommender {
    constructor() {
        this.userPreferences = {
            categories: [],
            priceRange: { min: 0, max: 5000 },
            brands: [],
            viewedProducts: [],
            purchasedProducts: []
        };
        
        this.loadUserPreferences();
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('ai_preferences');
        if (saved) {
            this.userPreferences = JSON.parse(saved);
        }
    }

    saveUserPreferences() {
        localStorage.setItem('ai_preferences', JSON.stringify(this.userPreferences));
    }

    updatePreferences(interaction) {
        switch(interaction.type) {
            case 'view':
                this.userPreferences.viewedProducts.push(interaction.productId);
                break;
            case 'purchase':
                this.userPreferences.purchasedProducts.push(interaction.productId);
                break;
            case 'category_click':
                if (!this.userPreferences.categories.includes(interaction.category)) {
                    this.userPreferences.categories.push(interaction.category);
                }
                break;
        }
        
        // Keep only last 50 interactions
        if (this.userPreferences.viewedProducts.length > 50) {
            this.userPreferences.viewedProducts = this.userPreferences.viewedProducts.slice(-50);
        }
        
        this.saveUserPreferences();
    }

    generateRecommendations(products, count = 6) {
        if (products.length === 0) return [];
        
        // Score each product based on user preferences
        const scoredProducts = products.map(product => ({
            ...product,
            score: this.calculateProductScore(product)
        }));
        
        // Sort by score and return top N
        return scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, count)
            .map(p => ({
                ...p,
                reason: this.getRecommendationReason(p)
            }));
    }

    calculateProductScore(product) {
        let score = 0;
        
        // 1. Category preference (30%)
        if (this.userPreferences.categories.includes(product.category)) {
            score += 0.3;
        }
        
        // 2. Price range preference (20%)
        if (product.price >= this.userPreferences.priceRange.min &&
            product.price <= this.userPreferences.priceRange.max) {
            score += 0.2;
        }
        
        // 3. Viewed similar products (15%)
        const viewedSimilar = this.userPreferences.viewedProducts.filter(id => {
            const viewedProduct = window.marketplace?.products?.find(p => p.id === id);
            return viewedProduct && this.areProductsSimilar(viewedProduct, product);
        }).length;
        
        score += (viewedSimilar / 10) * 0.15;
        
        // 4. Purchased similar products (15%)
        const purchasedSimilar = this.userPreferences.purchasedProducts.filter(id => {
            const purchasedProduct = window.marketplace?.products?.find(p => p.id === id);
            return purchasedProduct && this.areProductsSimilar(purchasedProduct, product);
        }).length;
        
        score += (purchasedSimilar / 5) * 0.15;
        
        // 5. Product rating (10%)
        score += (product.rating / 5) * 0.1;
        
        // 6. Popularity (5%)
        score += (Math.min(product.reviews / 1000, 1)) * 0.05;
        
        // 7. Random factor for variety (5%)
        score += Math.random() * 0.05;
        
        return Math.min(score, 1);
    }

    areProductsSimilar(product1, product2) {
        // Check if products are similar based on various factors
        const sameCategory = product1.category === product2.category;
        const priceDifference = Math.abs(product1.price - product2.price) / product1.price;
        const sharedTags = product1.tags.filter(tag => product2.tags.includes(tag)).length;
        
        return sameCategory && priceDifference < 0.5 && sharedTags > 0;
    }

    getRecommendationReason(product) {
        const reasons = [];
        
        if (this.userPreferences.categories.includes(product.category)) {
            reasons.push(`Based on your interest in ${product.category}`);
        }
        
        if (product.rating >= 4.5) {
            reasons.push('Highly rated by customers');
        }
        
        if (product.discount > 0) {
            reasons.push(`Great deal: ${product.discount}% off`);
        }
        
        if (product.featured) {
            reasons.push('Featured product');
        }
        
        if (reasons.length === 0) {
            reasons.push('Popular choice among similar users');
        }
        
        return reasons.join(' • ');
    }

    async getAISearchResults(query, products) {
        // Simulate AI processing
        return new Promise(resolve => {
            setTimeout(() => {
                const results = products
                    .map(p => ({
                        ...p,
                        relevance: this.calculateSearchRelevance(p, query),
                        aiInsight: this.generateSearchInsight(p, query)
                    }))
                    .filter(p => p.relevance > 0.3)
                    .sort((a, b) => b.relevance - a.relevance);
                
                resolve(results);
            }, 800);
        });
    }

    calculateSearchRelevance(product, query) {
        const terms = query.toLowerCase().split(' ');
        let relevance = 0;
        
        terms.forEach(term => {
            if (product.name.toLowerCase().includes(term)) relevance += 0.4;
            if (product.description.toLowerCase().includes(term)) relevance += 0.3;
            if (product.category.toLowerCase().includes(term)) relevance += 0.2;
            if (product.tags.some(tag => tag.toLowerCase().includes(term))) relevance += 0.1;
        });
        
        // Boost based on user preferences
        if (this.userPreferences.categories.includes(product.category)) {
            relevance *= 1.2;
        }
        
        return Math.min(relevance, 1);
    }

    generateSearchInsight(product, query) {
        const insights = [
            `Matches your search for "${query}"`,
            `Highly relevant to "${query}" based on AI analysis`,
            `Customers searching for "${query}" also bought this`,
            `Top result for "${query}" in ${product.category}`
        ];
        
        return insights[Math.floor(Math.random() * insights.length)];
    }

    getPersonalizedCategories() {
        if (this.userPreferences.categories.length === 0) {
            return Array.from(new Set(window.marketplace?.products?.map(p => p.category) || []));
        }
        
        // Return user's preferred categories first, then others
        return [
            ...this.userPreferences.categories,
            ...Array.from(new Set(window.marketplace?.products?.map(p => p.category) || []))
                .filter(cat => !this.userPreferences.categories.includes(cat))
        ].slice(0, 6);
    }

    resetPreferences() {
        this.userPreferences = {
            categories: [],
            priceRange: { min: 0, max: 5000 },
            brands: [],
            viewedProducts: [],
            purchasedProducts: []
        };
        this.saveUserPreferences();
    }
}

// Initialize AI Recommender
const aiRecommender = new AIRecommender();
window.aiRecommender = aiRecommender;

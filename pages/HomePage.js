import { expect } from "@playwright/test";

exports.HomePage = class HomePage {
    constructor(page) {
        this.page = page

        this.featuredProductsTitle = page.getByRole('heading', { name: 'Featured Products' });
        this.firstProductAddToCartButton = page.locator('button:has-text("Add to Cart")').first();
        this.cartIcon = page.locator('a[href="/cart"]');
        this.cartCount = page.locator('#cart-count');
        this.newsletterInput = page.locator('input[type="email"]').last();
        this.newsletterSubmitButton = page.getByRole('button', { name: 'Subscribe' });
        this.successMessage = page.getByText('Thank you for subscribing');
    }

    async goto() {
        await this.page.goto('https://sofa-revamp.vercel.app/')
    } 

    async verifyFeaturedProductsTitle() {
        await expect(this.featuredProductsTitle).toBeVisible();
    }

    async addFirstProductToCart() {
        await this.firstProductAddToCartButton.click();
    }

    async goToCart() {
        await this.cartIcon.click()
    }

    async subscribeToNewsletter(email) {
        await this.newsletterInput.fill(email);
        await this.newsletterSubmitButton.click();
    }

    async verifySubscriptionSuccess() {
        await expect(this.successMessage).toBeVisible();
    }

    async getCartCount() {
        return await this.cartCount.textContent();
    }

    async isElementVisible(element) {
        return await element.isVisible();
    }
}

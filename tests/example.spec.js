// tests/sofa-web-app.spec.js
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

// Test 1: Basic Navigation & Content Load
test('Home page loads correctly and has featured collections', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Assert that the page title is correct
  await expect(page).toHaveTitle('SofaLux');

  // Assert that the "Featured Products" section is visible
  await expect(homePage.featuredProductsTitle).toBeVisible();
});

// Test 2: Add a product to the cart
test('User can add a product to the cart', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Get initial cart count
  let initialCount = '0';
  if (await homePage.isElementVisible(homePage.cartCount)) {
    initialCount = await homePage.cartCount.textContent();
  }

  // Add product to cart
  await homePage.addFirstProductToCart();

  // Check if cart count updated
  if (await homePage.isElementVisible(homePage.cartCount)) {
    await expect(homePage.cartCount).toHaveText((parseInt(initialCount) + 1).toString());
  }

  // Optional: Go to cart page
  await homePage.goToCart();
  await expect(page).toHaveURL(/.*cart/);
});

// Test 3: Newsletter sign-up with valid email
test('User can subscribe to newsletter with valid email', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Scroll to newsletter form
  await homePage.newsletterInput.scrollIntoViewIfNeeded();

  // Use a valid email
  await homePage.subscribeToNewsletter('test_valid@example.com');

  // Check for success message
  await expect(homePage.successMessage).toBeVisible({ timeout: 5000 });
});

// Test 4: Newsletter sign-up with invalid email
test('User cannot subscribe with invalid email', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.newsletterInput.scrollIntoViewIfNeeded();

  // Use invalid email
  await homePage.subscribeToNewsletter('invalid-email');

  // Check that success message is NOT visible
  await expect(homePage.successMessage).not.toBeVisible();
});

// Test 5: Test navigation to a category
test('User can navigate to living room category', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  // Click on Living Room category link
  await page.getByRole('link', { name: 'Living Room', exact: true }).click();
  
  // Verify we navigated to the correct page
  await expect(page).toHaveURL(/.*living-room/);
  await expect(page.getByRole('heading', { name: 'Living Room' })).toBeVisible();
});

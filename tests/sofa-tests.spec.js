import { expect, test } from "@playwright/test"

test('The homepage loads correctly', async ({page})=> {
    await page.goto('https://localhost:3001/')
    await expect(page).toHaveTitle(/Sofa.Lux/)
})


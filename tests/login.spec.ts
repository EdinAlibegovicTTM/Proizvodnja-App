import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Neuspješan login sa pogrešnim podacima', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'pogresan@email.com');
    await page.fill('input[name="password"]', 'pogresnaLozinka');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Neispravno korisničko ime ili lozinka')).toBeVisible();
  });

  test('Uspješan login sa ispravnim podacima', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin@admin.com');
    await page.fill('input[name="password"]', 'AsasE0111-');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
}); 
import { test, expect } from '@playwright/test';

const adminEmail = 'admin@admin.com';
const adminPassword = 'AsasE0111-';

const modules = [
  { path: '/dashboard/ponude', exportBtn: 'Export', printBtn: 'Print' },
  { path: '/dashboard/radni-nalozi', exportBtn: 'Export', printBtn: 'Print' },
  { path: '/dashboard/pilana', exportBtn: 'Export', printBtn: 'Print' },
  { path: '/dashboard/dorada', exportBtn: 'Export', printBtn: 'Print' },
  { path: '/dashboard/prijem-trupaca', exportBtn: 'Export', printBtn: 'Print' },
  { path: '/dashboard/blagajna', exportBtn: 'Export', printBtn: 'Print' },
  // Dodaj ostale module po potrebi
];

test.describe('App flow', () => {
  test('Login, navigacija kroz module, export/print dugmad, logout', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Debug: screenshot i HTML nakon logina
    await page.screenshot({ path: 'test-login-after.png', fullPage: true });
    const html = await page.content();
    console.log('HTML nakon logina:', html.slice(0, 1000));

    // Provjera da li je login forma nestala (nema više input[name="username"])
    await expect(page.locator('input[name="username"]')).toHaveCount(0, { timeout: 8000 });

    // Navigacija kroz module i provjera dugmadi
    for (const mod of modules) {
      await page.goto(mod.path);
      // Logovanje svih dugmadi na stranici
      const buttons = await page.locator('button').all();
      for (const btn of buttons) {
        const text = await btn.textContent();
        const role = await btn.getAttribute('role');
        console.log(`Dugme: '${text?.trim()}', role: '${role}' na stranici ${mod.path}`);
      }
      // Provjera export dugmeta
      if (mod.exportBtn) {
        const exportBtn = page.getByRole('button', { name: new RegExp(mod.exportBtn, 'i') });
        await expect(exportBtn).toBeVisible();
      }
      // Provjera print dugmeta
      if (mod.printBtn) {
        const printBtn = page.getByRole('button', { name: new RegExp(mod.printBtn, 'i') });
        await expect(printBtn).toBeVisible();
      }
    }

    // Logout
    // Pretpostavljam da postoji dugme za logout u headeru/dashboardu
    const logoutBtn = page.getByRole('button', { name: /odjava|logout/i });
    await logoutBtn.click();
    await expect(page).toHaveURL('/');
  });
}); 
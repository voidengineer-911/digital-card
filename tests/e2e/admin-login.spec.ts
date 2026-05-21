import { test, expect } from '@playwright/test';

test('login: redirects to /admin/login when unauthenticated', async ({ page }) => {
  await page.goto('/admin');
  expect(page.url()).toContain('/admin/login');
});

test('login: wrong password shows error', async ({ page }) => {
  await page.goto('/admin/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[name=password]', 'definitely-wrong');
  await page.click('button[type=submit]');
  // Server action response may take a moment — poll with a generous timeout
  await expect(page.getByText(/invalid password/i)).toBeVisible({ timeout: 20_000 });
});

test('login: correct password sets cookie and reaches /admin', async ({ page }) => {
  const pw = process.env.PLAYWRIGHT_ADMIN_PASSWORD;
  test.skip(!pw, 'set PLAYWRIGHT_ADMIN_PASSWORD to run this');
  await page.goto('/admin/login');
  await page.waitForLoadState('networkidle');
  await page.fill('input[name=password]', pw!);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/admin\b/, { timeout: 20_000 });
  // The admin page loads cards from Neon — wait for the heading directly
  await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible({ timeout: 30_000 });
});

import { test, expect } from '@playwright/test';

test('login: redirects to /admin/login when unauthenticated', async ({ page }) => {
  await page.goto('/admin');
  expect(page.url()).toContain('/admin/login');
});

test('login: wrong password shows error', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('input[name=password]', 'definitely-wrong');
  await page.click('button[type=submit]');
  await expect(page.getByText(/invalid password/i)).toBeVisible();
});

test('login: correct password sets cookie and reaches /admin', async ({ page }) => {
  const pw = process.env.PLAYWRIGHT_ADMIN_PASSWORD;
  test.skip(!pw, 'set PLAYWRIGHT_ADMIN_PASSWORD to run this');
  await page.goto('/admin/login');
  await page.fill('input[name=password]', pw!);
  await page.click('button[type=submit]');
  await expect(page).toHaveURL(/\/admin\b/);
  await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();
});

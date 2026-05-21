import { test, expect } from '@playwright/test';

test('Luxury card page renders Ahmad', async ({ page }) => {
  await page.goto('/ahmad');
  await expect(page.getByRole('heading', { name: 'Ahmad Sharaf' })).toBeVisible();
  await expect(page.getByText(/founder and ceo/i)).toBeVisible();
  await expect(page.getByText('FORCE AI', { exact: true }).first()).toBeVisible();
});

test('Force Brand card page renders Ahmad in Force Media role', async ({ page }) => {
  await page.goto('/ahmad-fm');
  await expect(page.getByRole('heading', { name: 'Ahmad Sharaf' })).toBeVisible();
  await expect(page.getByText(/ops manager/i)).toBeVisible();
  await expect(page.getByText('FORCE MEDIA', { exact: true }).first()).toBeVisible();
});

test('EN ↔ AR locale toggle flips html dir', async ({ page }) => {
  await page.goto('/ahmad');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: /switch to arabic/i }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { name: 'احمد شرف' })).toBeVisible();
});

test('Unknown slug 404s', async ({ page }) => {
  const res = await page.goto('/no-such-card');
  expect(res?.status()).toBe(404);
});

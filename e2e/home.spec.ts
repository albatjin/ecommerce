import { test, expect } from '@playwright/test';

test.describe('E2E Test: Application Home & Smoke Test', () => {
  test('홈페이지에 접속하여 타이틀 및 주요 요소를 확인한다', async ({ page }) => {
    await page.goto('/');

    // 페이지가 정상적으로 로딩되고 본문이 존재하는지 확인
    await expect(page).toHaveTitle(/Create Next App|ecommerce|CommerceHub/i);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});


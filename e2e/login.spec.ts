import { test, expect } from '@playwright/test';

test.describe('E2E: Authentication & Route Protection', () => {
  test('비로그인 사용자가 루트(/) 또는 /dashboard 접근 시 /login으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);

    await page.goto('/');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('로그인 화면의 타이틀, 인풋, 버튼 및 안내문구가 올바르게 표시된다', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('CommerceHub', { exact: true })).toBeVisible();
    await expect(page.getByText('Enterprise Ops v4.1')).toBeVisible();
    await expect(page.getByText('쇼핑몰 통합 관리자 센터')).toBeVisible();

    const emailInput = page.getByPlaceholder('admin@commercehub.co.kr');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByPlaceholder('••••••••••••');
    await expect(passwordInput).toBeVisible();

    const loginButton = page.getByRole('button', { name: /로그인/i });
    await expect(loginButton).toBeVisible();

    await expect(page.getByText('2차 인증 (OTP) 강제 적용')).toBeVisible();
    await expect(page.getByText('보안 관리 규정 안내')).toBeVisible();
  });

  test('잘못된 계정 정보로 로그인 시도 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('admin@commercehub.co.kr').fill('wrong@commercehub.co.kr');
    await page.getByPlaceholder('••••••••••••').fill('invalidpassword123');
    await page.getByRole('button', { name: /로그인/i }).click();

    // Auto-retry until the error message is displayed in the custom alert box
    const alertBox = page.getByTestId('login-error-alert');
    await expect(alertBox).toContainText(/이메일 또는 비밀번호가 올바르지 않습니다|서버에 연결할 수 없습니다/, {
      timeout: 15000,
    });
  });
});


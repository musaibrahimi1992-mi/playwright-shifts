import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, SHIFTS } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Shift dialog', () => {
  test('clicking shift opens popup', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.fruhSchicht.click();
    // small wait needed here
    await page.waitForTimeout(1000);
    await expect(page.getByTestId('open-btn')).toBeVisible();
  });

  test('open btn should show full dialog with save and delete', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.openShiftDialog();
    await expect(page.getByTestId('save-shift-btn')).toBeVisible();
    await expect(page.getByTestId('delete-shift-btn')).toBeVisible();
  });

  test('escape key closes the dialog', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.openShiftDialog();
    await shifts.closeDialog();
    await shifts.expectUrlContainsShifts();
  });
});
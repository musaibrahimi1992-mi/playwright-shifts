import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, EMPLOYEES, CATEGORIES } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Navigation', () => {
  test('should load shifts page via URL', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectUrlContainsShifts();
  });

  test('navigate to shifts via sidebar', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.navigateViaMenu();
    await shifts.expectUrlContainsShifts();
  });

  test('should show employee categories on page load', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.serviceberater);
    await shifts.expectVisible(CATEGORIES.werkstattmitarbeiter);
  });

  test('check that known employees are visible', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(EMPLOYEES.arturGjonaj);
    await shifts.expectVisible(EMPLOYEES.service);
  });
});
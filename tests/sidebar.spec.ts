import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Sidebar menu', () => {
  test('kapazitatsplanung menu item visible', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible('Kapazitätsplanung');
  });

  test('schichten link visible in sidebar', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.kapazitaetsplanungMenu.click();
    await expect(shifts.schichtenMenuItem).toBeVisible();
  });

  test('abwesenheiten should also be visible', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.kapazitaetsplanungMenu.click();
    await page.waitForTimeout(500);
    await expect(shifts.abwesenheitenMenuItem).toBeVisible();
    });

  test('produktivitatsfaktor visible in sidebar', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.kapazitaetsplanungMenu.click();
    await shifts.expectVisible('Produktivitätsfaktor');
});
  
});
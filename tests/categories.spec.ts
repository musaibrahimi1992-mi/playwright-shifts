import { test } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, CATEGORIES } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Category groups', () => {
  test('keine mitarbeiterkategorie group is shown', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.keineMitarbeiterkategorie);
  });

  test('serviceberater group visible', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.serviceberater);
  });

  test('werkstattmitarbeiter group visible', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.werkstattmitarbeiter);
  });
});
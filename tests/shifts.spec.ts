import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, SHIFTS } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Existing shifts', () => {
  test('fruh schicht should be visible on 2026-03-13', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible(SHIFTS.fruhSchicht);
  });

  test('shift should show correct time range', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible(SHIFTS.fruhSchichtTime);
  });

  test('service employee ereignisse count check', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible('2 Ereignisse');
  });
});
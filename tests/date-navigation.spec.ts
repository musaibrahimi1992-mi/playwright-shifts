import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('Date navigation', () => {
  test('next button should change the date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const before = await shifts.getCurrentDate();
    await shifts.goToNextDay();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });

  test('prev button should change the date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const before = await shifts.getCurrentDate();
    await shifts.goToPrevDay();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });

 
  test('next then prev should return to same date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const original = await shifts.getCurrentDate();
    await shifts.goToNextDay();
    await shifts.goToPrevDay();
    const returned = await shifts.getCurrentDate();
    expect(original).toEqual(returned);
  });

  test('heute button brings back to todays date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.goToNextDay();
    const before = await shifts.getCurrentDate();
    await shifts.clickHeute();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });
});
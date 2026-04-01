import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, EMPLOYEES, CATEGORIES, SHIFTS } from '../test-data/testData';

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

  test('should navigate to shifts via sidebar menu', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.navigateViaMenu();
    await shifts.expectUrlContainsShifts();
  });

  test('should show employee categories', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.serviceberater);
    await shifts.expectVisible(CATEGORIES.werkstattmitarbeiter);
  });

  test('should show known employees', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(EMPLOYEES.arturGjonaj);
    await shifts.expectVisible(EMPLOYEES.service);
  });
});

test.describe('Date navigation', () => {
  test('clicking next should change the date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const before = await shifts.getCurrentDate();
    await shifts.goToNextDay();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });

  test('clicking prev should change the date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const before = await shifts.getCurrentDate();
    await shifts.goToPrevDay();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });

  test('next then prev should return to original date', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.clickHeute();
    const original = await shifts.getCurrentDate();
    await shifts.goToNextDay();
    await shifts.goToPrevDay();
    const returned = await shifts.getCurrentDate();
    expect(original).toEqual(returned);
  });

  test('clicking Heute should return to today', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.goToNextDay();
    const before = await shifts.getCurrentDate();
    await shifts.clickHeute();
    const after = await shifts.getCurrentDate();
    expect(before).not.toEqual(after);
  });
});

test.describe('Existing shifts', () => {
  test('should show Früh-Schicht on 2026-03-13', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible(SHIFTS.fruhSchicht);
  });

  test('should show shift time range', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible(SHIFTS.fruhSchichtTime);
  });

  test('should show Service employee with events', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible('2 Ereignisse');
  });
});

test.describe('Shift dialog', () => {
  test('clicking a shift should open popup', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.fruhSchicht.click();
    await expect(page.getByTestId('open-btn')).toBeVisible();
  });

  test('open-btn should open full dialog', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.openShiftDialog();
    await expect(page.getByTestId('save-shift-btn')).toBeVisible();
    await expect(page.getByTestId('delete-shift-btn')).toBeVisible();
  });

  test('closing dialog should return to calendar', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.gotoDate(SHIFTS.date);
    await shifts.openShiftDialog();
    await shifts.closeDialog();
    await shifts.expectUrlContainsShifts();
  });
});

test.describe('Sidebar menu', () => {
  test('should show Kapazitätsplanung', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible('Kapazitätsplanung');
  });

  test('should show Schichten menu item', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.kapazitaetsplanungMenu.click();
    await expect(shifts.schichtenMenuItem).toBeVisible();
  });

  test('should show Abwesenheiten menu item', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.kapazitaetsplanungMenu.click();
    await expect(shifts.abwesenheitenMenuItem).toBeVisible();
  });
});

test.describe('Category groups', () => {
  test('should show Keine Mitarbeiterkategorie group', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.keineMitarbeiterkategorie);
  });

  test('should show Serviceberater group', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.serviceberater);
  });

  test('should show Werkstattmitarbeiter group', async ({ page }) => {
    const shifts = new ShiftsPage(page);
    await shifts.goto();
    await shifts.expectVisible(CATEGORIES.werkstattmitarbeiter);
  });
});

test.describe('End-to-End: Full user journey', () => {
  test('complete shifts workflow from login to dialog', async ({ page }) => {
    const shifts = new ShiftsPage(page);

    await shifts.navigateViaMenu();
    await shifts.expectUrlContainsShifts();

    await shifts.expectVisible(CATEGORIES.serviceberater);
    await shifts.expectVisible(CATEGORIES.werkstattmitarbeiter);
    await shifts.expectVisible(CATEGORIES.keineMitarbeiterkategorie);
    await shifts.expectVisible(EMPLOYEES.service);
    await shifts.expectVisible(EMPLOYEES.arturGjonaj);

    await shifts.clickHeute();
    const today = await shifts.getCurrentDate();
    await shifts.goToNextDay();
    const nextDay = await shifts.getCurrentDate();
    expect(today).not.toEqual(nextDay);
    await shifts.goToPrevDay();
    const backToToday = await shifts.getCurrentDate();
    expect(today).toEqual(backToToday);

    await shifts.gotoDate(SHIFTS.date);
    await shifts.expectVisible(SHIFTS.fruhSchicht);
    await shifts.expectVisible(SHIFTS.fruhSchichtTime);

    await shifts.fruhSchicht.click();
    await expect(page.getByTestId('open-btn')).toBeVisible();

    await shifts.openShiftDialog();
    await expect(page.getByTestId('save-shift-btn')).toBeVisible();
    await expect(page.getByTestId('delete-shift-btn')).toBeVisible();

    await shifts.closeDialog();
    await shifts.expectUrlContainsShifts();
  });
});
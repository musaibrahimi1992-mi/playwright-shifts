import { test, expect } from '@playwright/test';
import { ShiftsPage } from '../pages/ShiftsPage';
import { LoginPage } from '../pages/LoginPage';
import { CREDENTIALS, EMPLOYEES, CATEGORIES, SHIFTS } from '../test-data/testData';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(CREDENTIALS.username, CREDENTIALS.password);
});

test.describe('End-to-End: Full user journey', () => {
  // full flow test - covers the main user journey end to end
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
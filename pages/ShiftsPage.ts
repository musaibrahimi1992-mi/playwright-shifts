import { Page, Locator, expect } from '@playwright/test';

export class ShiftsPage {
  readonly page: Page;
  readonly heuteButton: Locator;
  readonly nextDateButton: Locator;
  readonly prevDateButton: Locator;
  readonly kapazitaetsplanungMenu: Locator;
  readonly schichtenMenuItem: Locator;
  readonly abwesenheitenMenuItem: Locator;
  readonly shiftOpenButton: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly fruhSchicht: Locator;
  readonly keineMitarbeiterkategorie: Locator;
  readonly serviceberater: Locator;
  readonly werkstattmitarbeiter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heuteButton = page.getByRole('button', { name: 'Heute' });
    this.nextDateButton = page.locator('button:nth-child(6)');
    this.prevDateButton = page.locator('button:nth-child(4)');
    this.kapazitaetsplanungMenu = page.getByRole('button', { name: 'Kapazitätsplanung' });
    this.schichtenMenuItem = page.getByTestId('NavItems.shift');
    this.abwesenheitenMenuItem = page.getByTestId('NavItems.absence');
    this.shiftOpenButton = page.getByTestId('open-btn');
    this.saveButton = page.getByTestId('save-shift-btn');
    this.deleteButton = page.getByTestId('delete-shift-btn');
    this.fruhSchicht = page.getByText('07:00-15:00 Früh-Schicht').first();
    this.keineMitarbeiterkategorie = page.getByRole('gridcell', { name: '▼ Keine Mitarbeiterkategorie' });
    this.serviceberater = page.getByRole('gridcell', { name: '▼ Serviceberater (2)' });
    this.werkstattmitarbeiter = page.getByRole('gridcell', { name: '▼ Werkstattmitarbeiter (1)' });
  }

  async goto() {
    await this.page.goto('https://werkstattplanung.net/demo/api/kic/da/index.html#/organisation/shifts');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoDate(date: string) {
    await this.page.goto(`https://werkstattplanung.net/demo/api/kic/da/index.html#/organisation/shifts?date=${date}`);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateViaMenu() {
    await this.kapazitaetsplanungMenu.click();
    await this.schichtenMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickHeute() {
    await this.heuteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToNextDay() {
    await this.nextDateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPrevDay() {
    await this.prevDateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentDate() {
    return await this.page.locator('div.title.pointer').innerText();
  }

  async openShiftDialog() {
  const shift = this.page.locator('text=07:00-15:00 Früh-Schicht').first();
  await shift.scrollIntoViewIfNeeded();
  await shift.click({ force: true });
  await this.page.waitForTimeout(2000);
  
  const openBtn = this.page.getByTestId('open-btn');
  
  if (await openBtn.isVisible()) {
    await openBtn.click();
  } else {
    await shift.click({ force: true });
    await this.page.waitForTimeout(2000);
    await openBtn.click();
  }


}
  

  async closeDialog() {
    await this.page.keyboard.press('Escape');
  }

  async expectVisible(text: string) {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  async expectUrlContainsShifts() {
    await expect(this.page).toHaveURL(/shifts/);
  }
}
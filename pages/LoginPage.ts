import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('LoginView.username-text-field');
    this.passwordInput = page.getByTestId('PasswordTextField.password-text-field');
    this.loginButton = page.getByTestId('LoginView.login-button');
  }

  async goto() {
    await this.page.goto('https://werkstattplanung.net/demo/api/kic/da/index.html');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
}
}
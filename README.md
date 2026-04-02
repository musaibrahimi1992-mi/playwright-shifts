# Playwright Tests — Schichten Module

Tests written in Playwright + TypeScript for the Kapazitätsplanung → Schichten section of the werkstattplanung.net application.

## Getting started

Make sure you have Node.js installed, then run:
```bash
npm install
npx playwright install chromium
```

Add your credentials in `test-data/testData.ts` before running.

## Running the tests
```bash
npx playwright test --headed
```

To run a specific file:
```bash
npx playwright test tests/e2e.spec.ts --headed
```

To see the HTML report after a run:
```bash
npx playwright show-report
```

## Project structure
```
pages/          page object classes
tests/          test files
test-data/      credentials and test constants
```

## Test files

- **navigation.spec.ts** — checks that the page loads and employees are visible
- **date-navigation.spec.ts** — tests the date buttons (next, prev, heute)
- **shifts.spec.ts** — verifies existing shifts are displayed correctly
- **shift-dialog.spec.ts** — opens a shift and checks the dialog
- **sidebar.spec.ts** — checks sidebar menu items
- **categories.spec.ts** — verifies employee category groups
- **e2e.spec.ts** — full user journey from login to closing the dialog

## Notes

Tests are read-only — nothing gets created or deleted during the run.
Tested on Chrome only for now.
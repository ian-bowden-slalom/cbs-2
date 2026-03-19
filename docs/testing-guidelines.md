# Testing Guidelines for TODO Application

This document defines testing standards for unit, integration, and end-to-end testing across the project.

## 1. Unit tests
- Use Jest to test individual functions and React components in isolation.
- Naming convention: `*.test.js` or `*.test.ts`.
- Backend unit tests should be placed in `packages/backend/__tests__/`.
- Frontend unit tests should be placed in `packages/frontend/src/__tests__/`.
- Name test files to match what they are testing (e.g., `app.test.js` for testing `app.js`).

## 2. Integration tests
- Use Jest + Supertest to test backend API endpoints with real HTTP requests.
- Integration tests should be placed in `packages/backend/__tests__/integration/`.
- Integration tests must exist and cover real CRUD and sorting behavior.
- Naming convention: `*.test.js` or `*.test.ts`.
- Name integration test files intelligently based on what they test (e.g., `todos-api.test.js` for TODO API endpoints).

## 3. End-to-end (E2E) tests
- Use Playwright (required framework) to test complete UI workflows through browser automation.
- E2E tests should be placed in `tests/e2e/`.
- Naming convention: `*.spec.js` or `*.spec.ts`.
- Name E2E files based on the user journey they test (e.g., `todo-workflow.spec.js`).
- Playwright tests must use one browser only.
- Playwright tests must use the Page Object Model (POM) pattern for maintainability.
- Limit E2E tests to 5-8 critical user journeys, focusing on happy paths and key edge cases.

## 4. Port configuration
- Always use environment variables with sensible defaults for port configuration.
- Backend: `const PORT = process.env.PORT || 3030;`.
- Frontend: React default port is `3000`, but can be overridden with `PORT` environment variable.
- This allows CI/CD workflows to dynamically detect ports.

## 5. Test practices
- All tests must be isolated and independent; each test should set up its own data and not rely on other tests.
- Setup and teardown hooks are required so tests succeed on multiple runs.
- All new features should include appropriate tests.
- Tests should be maintainable and follow best practices.

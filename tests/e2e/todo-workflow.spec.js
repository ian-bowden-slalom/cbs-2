const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pageobjects/todo.page');

// We use one browser type by default in Playwright config
test.describe('E2E Todo workflow', () => {
  test('can create and sort tasks', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.goto();

    const startCount = await todoPage.countTasks();

    await todoPage.addTask('E2E Task 1', '2025-11-01');
    await todoPage.addTask('E2E Task 2', '2025-10-01');

    await todoPage.expectTaskPresent('E2E Task 1');
    await todoPage.expectTaskPresent('E2E Task 2');

    await todoPage.enableSort();

    const tasks = await todoPage.listItems.allTextContents();
    expect(tasks[0]).toContain('E2E Task 2');
    expect(tasks[1]).toContain('E2E Task 1');

    const endCount = await todoPage.countTasks();
    expect(endCount).toBeGreaterThanOrEqual(startCount + 2);
  });
});

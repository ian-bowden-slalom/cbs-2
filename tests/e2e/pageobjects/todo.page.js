const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTaskInput = page.locator('input[placeholder="Enter item name"]');
    this.newDueDateInput = page.locator('input[aria-label="Due date"]');
    this.addButton = page.locator('button', { hasText: 'Add Item' });
    this.sortButton = page.locator('button', { hasText: 'Sort by due date' });
    this.listItems = page.locator('ul > li');
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
  }

  async addTask(name, dueDate) {
    await this.newTaskInput.fill(name);
    if (dueDate) {
      await this.newDueDateInput.fill(dueDate);
    }
    await this.addButton.click();
  }

  async expectTaskPresent(name) {
    await expect(this.page.locator('text=' + name)).toBeVisible();
  }

  async enableSort() {
    await this.sortButton.click();
  }

  async countTasks() {
    return await this.listItems.count();
  }
}

module.exports = { TodoPage };

# Coding Guidelines for TODO Application

This file summarizes the project's coding style and quality principles to keep the codebase consistent and maintainable.

## 1. Standardized formatting
- Use a standardized code formatter across the project (e.g., Prettier for JavaScript/TypeScript).
- Enforce consistent whitespace, line length, indentation, and trailing commas.
- Prioritize readability and consistency in all files.

## 2. Import order
- Organize imports at the top of each file.
- Order imports by category:
  1. Third-party library imports (e.g., `react`, `express`)
  2. Empty line separator
  3. Local imports (relative paths from project files)
- Keep import statements grouped and easy to scan.

## 3. DRY principles
- Follow "Don't Repeat Yourself" (DRY) across the codebase.
- Refactor duplicated logic into reusable functions or components.
- Share common utilities through centralized helper modules.
- Keep code clean, simple, and maintainable.

## 4. Quality practices
- Write meaningful code comments where necessary.
- Use descriptive names for variables, functions, and components.
- Apply lint rules to prevent bugs and enforce consistency.
- Add tests for new features and behavior changes.

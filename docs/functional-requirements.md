# Functional Requirements for TODO Application

This document defines the next set of functional requirements for the TODO application.

## 1. Add a due date to tasks
- Users can specify a due date when creating a task.
- Users can view the due date for each task in the task list.
- The due date should be stored with the task data.

## 2. Edit tasks
- Users can edit the text of an existing task.
- Users can edit the due date of an existing task.
- Changes are persisted so the edited task state is retained after reload.

## 3. Order tasks by due date
- Tasks should be able to be sorted in ascending order by due date (soonest first).
- If tasks have no due dates, they can be grouped with undated tasks at the end or beginning (consistent behavior should be documented and implemented).
- The ordering should update in the UI when due dates are added or edited.

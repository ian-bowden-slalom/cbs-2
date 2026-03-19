import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
let items = [
  { id: 1, name: 'Test Item 1', due_date: null, created_at: '2023-01-01T00:00:00.000Z' },
  { id: 2, name: 'Test Item 2', due_date: null, created_at: '2023-01-02T00:00:00.000Z' },
];

const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    const sort = req.url.searchParams.get('sort');
    let result = [...items];

    if (sort === 'due_date') {
      result.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return a.due_date.localeCompare(b.due_date);
      });
    }

    return res(ctx.status(200), ctx.json(result));
  }),

  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name, dueDate } = req.body;

    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }

    const newItem = {
      id: items.length + 1,
      name,
      due_date: dueDate || null,
      created_at: new Date().toISOString(),
    };

    items = [...items, newItem];
    return res(ctx.status(201), ctx.json(newItem));
  }),

  // PUT /api/items/:id handler
  rest.put('/api/items/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const { name, dueDate } = req.body;

    const existing = items.find((item) => item.id === id);
    if (!existing) {
      return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    }

    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }

    const updated = { ...existing, name, due_date: dueDate || null };
    items = items.map((item) => (item.id === id ? updated : item));

    return res(ctx.status(200), ctx.json(updated));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  items = [
    { id: 1, name: 'Test Item 1', due_date: null, created_at: '2023-01-01T00:00:00.000Z' },
    { id: 2, name: 'Test Item 2', due_date: null, created_at: '2023-01-02T00:00:00.000Z' },
  ];
});
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('loads and displays items', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Initially shows loading state
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText(/Test Item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Item 2/i)).toBeInTheDocument();
    });
  });

  test('adds a new item with due date', async () => {
    const user = userEvent.setup();
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
    
    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter item name');
    const dateInput = screen.getByLabelText('Due date');

    await user.type(input, 'New Test Item');
    await user.type(dateInput, '2025-10-10');

    const submitButton = screen.getByText('Add Item');
    await user.click(submitButton);
    
    // Check that the new item appears with due date text
    await waitFor(() => {
      expect(screen.getByText('New Test Item (due 2025-10-10)')).toBeInTheDocument();
    });
  });

  test('edits an existing item', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Test Item 1/i)).toBeInTheDocument();
    });

    const editButton = screen.getAllByText('Edit')[0];
    await user.click(editButton);

    const editInput = screen.getByLabelText('Edit item name');
    const editDate = screen.getByLabelText('Edit due date');

    await user.clear(editInput);
    await user.type(editInput, 'Test Item 1 Updated');
    await user.type(editDate, '2025-10-10');

    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1 Updated (due 2025-10-10)')).toBeInTheDocument();
    });
  });

  test('sorts items by due date when requested', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Test Item 1/i)).toBeInTheDocument();
    });

    // Edit one item to have a due date far away so we can verify sort order
    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);
    await user.clear(screen.getByLabelText('Edit item name'));
    await user.type(screen.getByLabelText('Edit item name'), 'Test Item 1');
    await user.type(screen.getByLabelText('Edit due date'), '2025-12-31');
    await user.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Test Item 1 (due 2025-12-31)')).toBeInTheDocument();
    });

    // Sort by due date
    await user.click(screen.getByText('Sort by due date'));

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      // due date item should appear first if due date is earliest among all by query order
      expect(listItems[0]).toHaveTextContent('Test Item 1 (due 2025-12-31)');
    });
  });

  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    
    await act(async () => {
      render(<App />);
    });
    
    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
    });
  });
});
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [sortByDueDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = sortByDueDate ? '?sort=due_date' : '';
      const response = await fetch(`/api/items${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem.trim(), dueDate: newDueDate || null }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const result = await response.json();
      setData([...data, result]);
      setNewItem('');
      setNewDueDate('');
      setError(null);
    } catch (err) {
      setError('Error adding item: ' + err.message);
      console.error('Error adding item:', err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(data.filter(item => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Error deleting item: ' + err.message);
      console.error('Error deleting item:', err);
    }
  };

  const toggleSortByDueDate = () => {
    setSortByDueDate((prev) => !prev);
  };

  const startEdit = (item) => {
    setEditingItem({ ...item });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const saveEdit = async () => {
    if (!editingItem || !editingItem.name.trim()) {
      setError('Item name is required for edit');
      return;
    }

    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingItem.name.trim(), dueDate: editingItem.due_date || null }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const result = await response.json();
      setData(data.map((item) => (item.id === result.id ? result : item)));
      setEditingItem(null);
      setError(null);
    } catch (err) {
      setError('Error updating item: ' + err.message);
      console.error('Error updating item:', err);
    }
  };

  const updateEditingItem = (field, value) => {
    setEditingItem((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do App</h1>
        <p>Keep track of your tasks</p>
      </header>

      <main>
        <section className="add-item-section">
          <h2>Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter item name"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              aria-label="Due date"
            />
            <button type="submit">Add Item</button>
          </form>
        </section>

        <section className="items-section">
          <div className="sort-controls">
            <button type="button" onClick={toggleSortByDueDate}>
              {sortByDueDate ? 'Show original order' : 'Sort by due date'}
            </button>
          </div>
          <h2>Items from Database</h2>
          {loading && <p>Loading data...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <ul>
              {data.length > 0 ? (
                data.map((item) => {
                  const isEditing = editingItem && editingItem.id === item.id;

                  return (
                    <li key={item.id}>
                      {isEditing ? (
                        <div className="edit-row">
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => updateEditingItem('name', e.target.value)}
                            aria-label="Edit item name"
                          />
                          <input
                            type="date"
                            value={editingItem.due_date || ''}
                            onChange={(e) => updateEditingItem('due_date', e.target.value)}
                            aria-label="Edit due date"
                          />
                          <button type="button" onClick={saveEdit}>
                            Save
                          </button>
                          <button type="button" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>
                            {item.name}
                            {item.due_date ? ` (due ${item.due_date})` : ' (no due date)'}
                          </span>
                          <div className="item-actions">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="delete-btn"
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })
              ) : (
                <p>No items found. Add some!</p>
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Integration: TODO API', () => {
  it('creates, updates, and retrieves items sorted by due date', async () => {
    const createResponse = await request(app)
      .post('/api/items')
      .send({ name: 'Integration Item', dueDate: '2025-09-01' })
      .set('Accept', 'application/json');

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.name).toBe('Integration Item');
    expect(createResponse.body.due_date).toBe('2025-09-01');

    const itemId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/items/${itemId}`)
      .send({ name: 'Integration Item Updated', dueDate: '2025-08-01' })
      .set('Accept', 'application/json');

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Integration Item Updated');
    expect(updateResponse.body.due_date).toBe('2025-08-01');

    const getResponse = await request(app).get('/api/items?sort=due_date');
    expect(getResponse.status).toBe(200);
    expect(Array.isArray(getResponse.body)).toBe(true);

    const found = getResponse.body.find((item) => item.id === itemId);
    expect(found).toBeDefined();
    expect(found.name).toBe('Integration Item Updated');
    expect(found.due_date).toBe('2025-08-01');
  });
});

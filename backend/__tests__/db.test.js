const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI); // Test-DB!
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/health', () => {
    it('responds with status 200', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
    });
});

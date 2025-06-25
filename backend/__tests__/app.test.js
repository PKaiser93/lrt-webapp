const request = require('supertest');
const app = require('../server'); // oder wie immer du dein Express-App-Export nennst

describe('GET /healths', () => {
    it('responds with status 200', async () => {
        const res = await request(app).get('/healths');
        expect(res.statusCode).toBe(200);
    });
});

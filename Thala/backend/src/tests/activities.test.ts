import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

async function loginToken() {
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'demo@thala.app', password: 'Demo@1234' });
  return res.body.data.accessToken as string;
}

describe('Activities', () => {
  it('saves a running session with a GPS route and updates daily activity', async () => {
    const token = await loginToken();
    const res = await request(app)
      .post('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'running',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: 1800,
        distanceKm: 5,
        calories: 340,
        steps: 6200,
        route: [
          { latitude: 12.97, longitude: 77.59, timestamp: Date.now() },
          { latitude: 12.98, longitude: 77.6, timestamp: Date.now() + 1000 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.data.avgPaceMinPerKm).toBeGreaterThan(0);

    const list = await request(app).get('/api/v1/activities?type=running').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);
  });

  it('returns a weekly summary with totals and averages', async () => {
    const token = await loginToken();
    const res = await request(app).get('/api/v1/activities/summary/weekly').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totals).toBeDefined();
    expect(res.body.data.averages).toBeDefined();
  });
});

describe('Nutrition & AI Coach', () => {
  it('generates a diet plan from profile data', async () => {
    const token = await loginToken();
    const res = await request(app).get('/api/v1/nutrition/diet-plan').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.dailyCalories).toBeGreaterThan(0);
  });

  it('returns AI coach recommendations', async () => {
    const token = await loginToken();
    const res = await request(app).get('/api/v1/nutrition/ai-coach').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

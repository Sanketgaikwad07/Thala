import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

async function loginToken() {
  const res = await request(app).post('/api/v1/auth/login').send({ email: 'demo@thala.app', password: 'Demo@1234' });
  return res.body.data.accessToken as string;
}

describe('Users', () => {
  it('rejects unauthenticated profile access', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('returns the profile with computed BMI', async () => {
    const token = await loginToken();
    const res = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.bmi.bmi).toBeGreaterThan(0);
  });

  it('updates profile fields', async () => {
    const token = await loginToken();
    const res = await request(app).patch('/api/v1/users/me').set('Authorization', `Bearer ${token}`).send({ weightKg: 70 });
    expect(res.status).toBe(200);
    expect(res.body.data.weightKg).toBe(70);
  });
});

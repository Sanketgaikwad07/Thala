import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

async function loginToken(email: string, password: string) {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res.body.data.accessToken as string;
}

describe('Admin', () => {
  it('blocks a regular user from the admin dashboard', async () => {
    const token = await loginToken('demo@thala.app', 'Demo@1234');
    const res = await request(app).get('/api/v1/admin/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin to view the dashboard', async () => {
    const token = await loginToken('admin@thala.app', 'Admin@1234');
    const res = await request(app).get('/api/v1/admin/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.totalUsers).toBeGreaterThan(0);
  });

  it('lets an admin list users', async () => {
    const token = await loginToken('admin@thala.app', 'Admin@1234');
    const res = await request(app).get('/api/v1/admin/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Auth', () => {
  it('logs in with seeded demo credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'demo@thala.app', password: 'Demo@1234' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe('demo@thala.app');
  });

  it('rejects an invalid password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'demo@thala.app', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('registers a new user and returns tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: `test-${Date.now()}@thala.app`, password: 'Passw0rd!' });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('user');
  });

  it('rejects registration with an existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Dup', email: 'demo@thala.app', password: 'Passw0rd!' });
    expect(res.status).toBe(409);
  });

  it('completes the OTP login flow', async () => {
    const destination = `otpuser-${Date.now()}@thala.app`;
    const requestRes = await request(app).post('/api/v1/auth/otp/request').send({ destination, purpose: 'login' });
    expect(requestRes.status).toBe(200);

    const verifyRes = await request(app).post('/api/v1/auth/otp/verify').send({ destination, code: '123456', purpose: 'login' });
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.data.accessToken).toBeDefined();
  });

  it('refreshes an access token', async () => {
    const login = await request(app).post('/api/v1/auth/login').send({ email: 'demo@thala.app', password: 'Demo@1234' });
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: login.body.data.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});

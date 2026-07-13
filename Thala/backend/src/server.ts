import { createApp } from './app';
import { env } from './config/env';
import { seedDatabase } from './data/seed';

async function bootstrap() {
  await seedDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Thala API listening on http://localhost:${env.port}`);
    // eslint-disable-next-line no-console
    console.log(`Swagger docs: http://localhost:${env.port}/docs`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});

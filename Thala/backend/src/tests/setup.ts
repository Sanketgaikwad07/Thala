import { seedDatabase } from '../data/seed';

beforeAll(async () => {
  await seedDatabase();
});

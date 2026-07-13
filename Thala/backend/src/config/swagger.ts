import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Thala Sports & Fitness Tracking API',
      version: '1.0.0',
      description:
        'REST API powering the Thala Sports & Fitness Tracking mobile app: authentication, profiles, activity tracking, workouts, sports, nutrition, analytics, achievements, challenges, community and admin operations.',
    },
    servers: [{ url: env.apiBaseUrl, description: 'Current environment' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.routes.js'],
});

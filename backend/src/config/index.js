import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  database: {
    url: process.env.DATABASE_URL || './lifeboard.db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars',
  },
  ai: {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
  },
};

export default config;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import { router } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { sanitize } from './middleware/sanitize.js';
import { requestId } from './middleware/requestId.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors(config.cors));

// Request ID tracking
app.use(requestId);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input sanitization
app.use(sanitize);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', code: 'RATE_LIMIT', message: 'Too many requests' },
  })
);

// Routes
app.use(config.apiPrefix, router);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export { app };

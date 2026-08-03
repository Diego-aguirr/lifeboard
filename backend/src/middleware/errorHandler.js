import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';
  const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';

  // Log error with request ID
  logger.error(`[${req.id || 'no-id'}] ${err.message}`, {
    statusCode,
    code,
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });

  // Don't leak internal errors in production
  const response = {
    status: 'error',
    code,
    message,
    requestId: req.id,
  };

  // Only include stack in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler
 */
export const notFound = (req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    requestId: req.id,
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

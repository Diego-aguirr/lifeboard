import config from '../config/index.js';

function formatMessage(level, msg, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${msg}${metaStr}`;
}

export const logger = {
  info: (msg, meta) => console.log(formatMessage('info', msg, meta)),
  warn: (msg, meta) => console.warn(formatMessage('warn', msg, meta)),
  error: (msg, meta) => console.error(formatMessage('error', msg, meta)),
  debug: (msg, meta) => {
    if (config.nodeEnv === 'development') {
      console.log(formatMessage('debug', msg, meta));
    }
  },
};

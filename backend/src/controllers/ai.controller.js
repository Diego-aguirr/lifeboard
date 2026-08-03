import { aiService, AiError } from '../services/ai.service.js';
import { logger } from '../utils/logger.js';

export const aiController = {
  chat: async (req, res, next) => {
    try {
      const { message, history } = req.body;
      const response = await aiService.chat(message, history);
      res.json({ status: 'ok', data: { response } });
    } catch (err) {
      if (err instanceof AiError) {
        return res.status(400).json({
          status: 'error',
          code: err.code,
          message: err.message,
        });
      }
      logger.error('AI chat controller error:', err);
      next(err);
    }
  },

  generateBoard: async (req, res, next) => {
    try {
      const { message, history } = req.body;
      const board = await aiService.generateBoard(message, history);
      res.json({ status: 'ok', data: board });
    } catch (err) {
      if (err instanceof AiError) {
        return res.status(400).json({
          status: 'error',
          code: err.code,
          message: err.message,
        });
      }
      logger.error('AI generateBoard controller error:', err);
      next(err);
    }
  },
};

import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { validate } from '../middleware/validate.js';
import { chatSchema } from '../validators/chat.schema.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/chat', aiLimiter, validate(chatSchema), aiController.chat);
router.post('/generate-board', aiLimiter, validate(chatSchema), aiController.generateBoard);

export { router as aiRoutes };

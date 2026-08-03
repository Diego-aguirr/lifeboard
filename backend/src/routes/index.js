import { Router } from 'express';
import { boardRoutes } from './board.routes.js';
import { aiRoutes } from './ai.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/boards', boardRoutes);
router.use('/ai', aiRoutes);

export { router };

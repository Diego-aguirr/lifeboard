import { Router } from 'express';
import { BoardController } from '../controllers/board.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const controller = new BoardController();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getById));
router.post('/', asyncHandler(controller.create));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.delete));

export { router as boardRoutes };

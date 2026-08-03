import { BoardRepository } from '../repositories/board.repository.js';
import { NotFoundError } from '../utils/AppError.js';

export class BoardService {
  constructor() {
    this.repository = new BoardRepository();
  }

  getAll() {
    return this.repository.findAll();
  }

  getById(id) {
    const board = this.repository.findById(id);
    if (!board) {
      throw new NotFoundError('Board');
    }
    return board;
  }

  create(data) {
    return this.repository.create(data);
  }

  update(id, data) {
    const board = this.repository.findById(id);
    if (!board) {
      throw new NotFoundError('Board');
    }
    return this.repository.update(id, data);
  }

  delete(id) {
    const board = this.repository.findById(id);
    if (!board) {
      throw new NotFoundError('Board');
    }
    this.repository.delete(id);
  }
}

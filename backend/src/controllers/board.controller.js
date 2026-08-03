import { BoardService } from '../services/board.service.js';

export class BoardController {
  constructor() {
    this.service = new BoardService();
  }

  getAll = async (req, res) => {
    const boards = this.service.getAll();
    res.json({ status: 'ok', data: boards });
  };

  getById = async (req, res) => {
    const board = this.service.getById(req.params.id);
    res.json({ status: 'ok', data: board });
  };

  create = async (req, res) => {
    const board = this.service.create(req.body);
    res.status(201).json({ status: 'ok', data: board });
  };

  update = async (req, res) => {
    const board = this.service.update(req.params.id, req.body);
    res.json({ status: 'ok', data: board });
  };

  delete = async (req, res) => {
    this.service.delete(req.params.id);
    res.status(204).send();
  };
}

import { db } from '../config/database.js';
import { randomUUID } from 'crypto';

export class BoardRepository {
  findAll() {
    const boards = db.prepare('SELECT * FROM boards ORDER BY created_at DESC').all();
    return boards.map(b => ({ ...b, data: JSON.parse(b.data) }));
  }

  findById(id) {
    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
    return board ? { ...board, data: JSON.parse(board.data) } : null;
  }

  create(data) {
    const id = randomUUID();
    const now = new Date().toISOString();
    const boardData = { ...data, id, createdAt: now, updatedAt: now };
    db.prepare('INSERT INTO boards (id, data) VALUES (?, ?)').run(id, JSON.stringify(boardData));
    return boardData;
  }

  update(id, data) {
    const existing = db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
    if (!existing) return null;

    const parsed = JSON.parse(existing.data);
    const updated = { ...parsed, ...data, id, updatedAt: new Date().toISOString() };
    db.prepare('UPDATE boards SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(JSON.stringify(updated), id);
    return updated;
  }

  delete(id) {
    const result = db.prepare('DELETE FROM boards WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

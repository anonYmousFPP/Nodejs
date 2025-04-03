const db = require('../config/db');

class Item {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM items ORDER BY id');
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ name, description }) {
    const { rows } = await db.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return rows[0];
  }

  static async update(id, { name, description }) {
    const { rows } = await db.query(
      'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = Item;
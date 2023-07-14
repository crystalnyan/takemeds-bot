import { DB } from "../deps.ts";

export const db = new DB("db.sqlite3");

export function create_meds_table() {
    db.execute(`
  CREATE TABLE IF NOT EXISTS meds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    chat_id INTEGER
  )
`);
}

export function add_med_row(name: string, chat_id: number) {
    db.query(
        `INSERT INTO meds (name, chat_id) VALUES (?, ?)`, [name, chat_id]);
}

export function get_meds_rows(chat_id: number) {
    return db.query(`SELECT * FROM meds WHERE chat_id = ?`, [chat_id]);
}

export function delete_med_row(name: string, chat_id: number) {
    db.query(`
    DELETE FROM meds 
    WHERE name=(?)
    AND chat_id=(?)
    `, [name, chat_id]);
}
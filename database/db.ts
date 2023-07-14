import { DB } from "../deps.ts";

export const db = new DB("db.sqlite3");

export function create_meds_table() {
    db.execute(`
  CREATE TABLE IF NOT EXISTS meds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    chat_id INTEGER,
    cron TEXT
  )
`);
}

export function add_med_row(name: string, chat_id: number, cron: string) {
    db.query(
        `INSERT INTO meds (name, chat_id, cron) VALUES (?, ?, ?)`, [name, chat_id, cron]);
}

export function get_meds_rows(chat_id: number) {
    return db.query(`SELECT * FROM meds WHERE chat_id = ?`, [chat_id]);
}

export function get_all_meds_rows() {
    return db.query(`SELECT * FROM meds`);
}

export function delete_med_row(id: number) {
    db.query(`
    DELETE FROM meds 
    WHERE id = ?`, [id]);
}
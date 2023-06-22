import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Meds } from "../types/meds.ts";

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

export function add_med(name: string, chat_id: number) {
    db.execute(
        `INSERT INTO meds (name, chat_id) VALUES (?, ?)` + name + chat_id);
}

export function get_meds() {
    let rows = db.query(`SELECT * FROM meds`);
}
import {delete_med_row, get_meds_rows, add_med_row} from "../database/db.ts";

export type Meds = {
    id: number;
    name: string;
    chat_id: number;
    cron: string;
}

export function add_med(name: string, chat_id: number, cron: string) {
    add_med_row(name, chat_id, cron);
}

export function view_meds(chat_id: number) {
    let meds_list_msg = "";
    const rows = get_meds(chat_id);

    let count = 1;
    for (const med of rows) {
        meds_list_msg = meds_list_msg.concat(count + ". " + to_string(med) + "\n");
        count += 1;
    }

    return meds_list_msg;
}

export function delete_med(at: number, chat_id: number) {
    const rows = get_meds(chat_id);

    if (at > rows.length) return;

    const med = rows[at - 1];

    delete_med_row(med.id);
}

function get_meds(chat_id: number): Meds[] {
    const rows = get_meds_rows(chat_id);

    const meds: Meds[] = [];
    for (const [id, name, chat_id, cron] of rows) {
        meds.push(<Meds>{id, name, chat_id, cron});
    }

    return meds;
}

function to_string(med: Meds) {
    return med.name + " " + med.cron;
}
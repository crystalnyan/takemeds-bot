import { get_meds_rows } from "../database/db.ts";

export type Meds = {
    id: number;
    name: string;
    chat_id: number;
}

export function view_meds(chat_id: number) {
    let meds_list_msg = "";
    const rows = get_meds(chat_id);
    for (const med of rows) {
        meds_list_msg = meds_list_msg.concat(to_string(med) + "\n");
    }

    return meds_list_msg;
}

function get_meds(chat_id: number): Meds[] {
    const rows = get_meds_rows(chat_id);

    const meds: Meds[] = [];
    for (const [id, name, chat_id] of rows) {
        meds.push(<Meds>{id, name, chat_id});
    }

    return meds;
}

function to_string(med: Meds) {
    return med.name;
}
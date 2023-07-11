import { get_meds_rows } from "../database/db.ts";

export type Meds = {
    id: number;
    name: string;
    chat_id: number;
}

export function get_meds(chat_id: number): Meds[] {
    const rows = get_meds_rows(chat_id);

    let meds: Meds[] = [];
    for (const [id, name, chat_id] of rows) {
        meds.push(<Meds>{id, name, chat_id});
    }

    return meds;
}

export function to_string(med: Meds) {
    return med.name;
}
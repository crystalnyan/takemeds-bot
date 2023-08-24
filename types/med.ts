import {delete_med_row, get_meds_rows, add_med_row} from "../database/db.ts";
import {remove_cron} from "../cron.ts";

export type Med = {
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

    const med = rows[at - 1];

    delete_med_row(med.id);
    remove_cron(med.name + med.cron + med.chat_id);
}

export function get_meds(chat_id: number): Med[] {
    const rows = get_meds_rows(chat_id);

    const meds: Med[] = [];
    for (const [id, name, chat_id, cron] of rows) {
        meds.push(<Med>{id, name, chat_id, cron});
    }

    return meds;
}

function to_string(med: Med) {
    return med.name + " " + cron_to_string(med.cron);
}

// TODO: modify to fit add callback when periodic cron is implemented
function cron_to_string(cron: string) {
    const [minutes, hour, days, months, weekdays] = cron.split(" ");

    return hour + ":" + minutes + " " + get_weekdays_from_cron(weekdays)
}

function get_weekdays_from_cron(weekdays_cron: string) {
    if (weekdays_cron == "*") return ""

    let result = "";
    const weekdays = weekdays_cron.split(",");

    for (const day of weekdays) {
        if (day == "") break;
        const index = +day;
        if (result.length > 0) {
            result += ", " + Weekdays[index]
        } else {
            result += Weekdays[index]
        }
    }

    return result
}

enum Weekdays {
    "mon" = 1,
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun"
}
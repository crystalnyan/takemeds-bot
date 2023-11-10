//import {delete_med_row} from "../database/db.ts";
//import {remove_cron} from "../cron.ts";
import {prisma} from "../init.ts";

export async function add_med(name: string, chat_id: number, cron: string) {
    return await prisma.med.create({
        data: {
            name: name,
            cron: cron,
            chat_id: chat_id,
        },
    })
}

export async function view_meds(chat_id: number) {
    return await prisma.med.findMany({
        where: {
            chat_id: chat_id,
        },
    });
}

export function delete_med(at: number, chat_id: number) {
    /*const rows = get_meds(chat_id);

    const med = rows[at - 1];

    delete_med_row(med.id);
    remove_cron(med.name + med.cron + med.chat_id);*/
}

export function cron_to_string(cron: string) {
    const [minutes, hour, _days, _months, weekdays] = cron.split(" ");

    return hour + ":" + minutes + " " + get_weekdays_from_cron(weekdays)
}

function get_weekdays_from_cron(weekdays_cron: string) {
    if (weekdays_cron == "*") return "gpt-generated"

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
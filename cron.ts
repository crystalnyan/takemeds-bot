import {Cron} from "./deps.ts";
import {get_all_meds_rows} from "./database/db.ts";
import {bot} from "./bot.ts";
import {Meds} from "./types/meds.ts";

export function load_crons() {
    new Cron(
        "* * * * *",
        {maxRuns: 1},
        () => {
            schedule_all();
        });
}

export function schedule(chat_id: number, name: string, cron: string) {
    try {
        new Cron(
            cron,
            {name: name + cron + chat_id},
            () => {
                bot.api.sendMessage(chat_id,`You should take ${name} now!`);
            });
    } catch (err) { return; }
}

export function remove_cron(name: string) {
    const job = Cron.scheduledJobs.find(j => j.name === name);
    if ( job !== undefined ) job.stop();
}

function schedule_all() {
        const rows = get_all_meds_rows();

        for (const [_id, name, chat_id, cron] of rows) {
            const med = <Meds>{name, chat_id, cron};
            schedule(med.chat_id, med.name, med.cron);
        }
}
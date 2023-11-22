import {Cron, z} from "../deps.ts";
import {bot, prisma} from "./init.ts";
import {Med} from "./zod/schemas.ts";

export function load_crons() {
    new Cron(
        "* * * * *",
        {maxRuns: 1},
        () => {
          schedule_all().then();
        });
}

export function schedule(med_id: number, chat_id: number, name: string, cron: string) {
    try {
        new Cron(
            cron,
            {name: name + cron + chat_id + med_id},
            () => {
                const message = "\*" + "Reminder❗*" + `\n\nYou should take ${name} now`;
                bot.api.sendMessage(chat_id, message, {
                    parse_mode: "MarkdownV2"
                });
            });
    } catch (_err) {
      const message = "Error in scheduling: " + name;
        bot.api.sendMessage(chat_id,message);
        throw new Error(message);
    }
}

export function remove_cron(name: string) {
    const job = Cron.scheduledJobs.find(j => j.name === name);
    if ( job !== undefined ) job.stop();
}

async function schedule_all() {
        const result = await prisma.med.findMany();
        const meds = z.array(Med).safeParse(result);
        if (!meds.success){
          console.log('CRONS COULD NOT BE LOADED');
          return;
        }

        for (const med of meds.data) {
          try {
            schedule(med.id, med.chat_id, med.name, med.cron);
          } catch (_err) { continue; }
        }
}
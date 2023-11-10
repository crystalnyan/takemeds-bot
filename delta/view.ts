import { z } from "../deps.ts";
import { bot } from "../init.ts";
import { main_menu, meds_menu } from "../keyboards.ts";
import { Med } from "../schemas.ts";
import { get_meds } from "../types/med.ts";
import { cron_to_string } from "../utils.ts";

export function view_callbacks() {
    bot.hears("View your meds", async (ctx) => {
        await ctx.reply("Your meds:");

        const result = await get_meds(ctx.chat.id);
        const meds = z.array(Med).safeParse(result);
        if (!meds.success){
            await ctx.reply('Error in viewing meds!', {
                reply_markup: main_menu
            });
            return;
        }

        if (meds.data.length == 0) return ctx.reply("You don't have any meds added!", {
            reply_markup: main_menu
        });

        let count = 1;
        let list = '';

        for (const med of meds.data) {
            const cron = cron_to_string(med.cron);
            list += `${count}. ${med.name} ${cron}\n`;
            count++;
        }

        return await ctx.reply(list, {
            reply_markup: meds_menu
        });
    })

    bot.hears("Continue", async (ctx) =>{
        await ctx.reply("Anything else?", {
            reply_markup: main_menu
        })
    })
}
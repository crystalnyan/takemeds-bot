import { bot } from "../init.ts";
import { main_menu, meds_menu } from "../keyboards.ts";
import {view_meds} from "../types/med.ts";

export function view_callbacks() {
    bot.hears("View your meds", async (ctx) => {
        await ctx.reply("Your meds:");

        const meds = view_meds(ctx.chat.id);

        if (meds.length == 0) return ctx.reply("You don't have any meds added!", {
            reply_markup: main_menu
        });

        return await ctx.reply(meds, {
            reply_markup: meds_menu
        });
    })

    bot.hears("Continue", async (ctx) =>{
        await ctx.reply("Anything else?", {
            reply_markup: main_menu
        })
    })
}
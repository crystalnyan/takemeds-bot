import { bot } from "../bot.ts";
import {view_meds} from "../types/med.ts";
import {keyboard} from "./start.ts";

export function view_callbacks() {
    bot.hears("View your meds", async (ctx) => {
        await ctx.reply("Your meds:");

        const meds = view_meds(ctx.chat.id);

        if (meds.length == 0) return ctx.reply("You don't have any meds added!");
        return await ctx.reply(meds, {
            reply_markup: keyboard
        });
    })
}
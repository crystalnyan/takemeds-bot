import { bot } from "../bot.ts";
import { Keyboard } from "../deps.ts";
import {view_meds} from "../types/med.ts";
import {keyboard} from "./start.ts";

const meds_kb = new Keyboard()
    .text("Delete a med").row()
    .text("Continue")
    .oneTime()
    .resized();

export function view_callbacks() {
    bot.hears("View your meds", async (ctx) => {
        await ctx.reply("Your meds:");

        const meds = view_meds(ctx.chat.id);

        if (meds.length == 0) return ctx.reply("You don't have any meds added!", {
            reply_markup: keyboard
        });

        return await ctx.reply(meds, {
            reply_markup: meds_kb
        });
    })

    bot.hears("Continue", async (ctx) =>{
        await ctx.reply("Anything else?", {
            reply_markup: keyboard
        })
    })
}
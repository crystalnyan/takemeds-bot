import { Composer } from "../../deps.ts";
import { main_menu } from "../keyboards.ts";

const composer = new Composer();

export const message =
    "Welcome, everynyan~ \nI'm a bot that reminds you to take your meds.";

composer.command("start", async (ctx) => {
    await ctx.reply(message, {
        reply_markup: main_menu
    });
});

export default composer;
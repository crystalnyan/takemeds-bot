import { Composer} from "../deps.ts";
import {delete_med} from "../types/meds.ts";

const composer = new Composer();

composer.command("delete", async (ctx) => {
    const at = +ctx.match;

    if (!at) return ctx.reply("Please specify a number in your list of meds!");

    delete_med(at, ctx.chat.id);

    return await ctx.reply("Removed!");
});

export default composer;
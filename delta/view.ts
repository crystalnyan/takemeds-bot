import {Composer} from "../deps.ts";
import {view_meds} from "../types/meds.ts";

const composer = new Composer();

composer.command("view", async (ctx) => {
    await ctx.reply("Your meds:");

    const meds = view_meds(ctx.chat.id);

    if (meds.length == 0) return ctx.reply("You don't have any meds added!");
    return await ctx.reply(meds);
});

export default composer;
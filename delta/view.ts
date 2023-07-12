import {Composer} from "../deps.ts";
import {get_meds, to_string} from "../types/meds.ts";

const composer = new Composer();

composer.command("view", async (ctx) => {
    await ctx.reply("Your meds:");

    let meds = "";
    const rows = get_meds(ctx.chat.id);
    for (const med of rows) {
        meds = meds.concat(to_string(med) + "\n");
    }

    if (meds.length == 0) return ctx.reply("You don't have any meds added!");
    return ctx.reply(meds);
});

export default composer;
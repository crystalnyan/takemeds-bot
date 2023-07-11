import {Composer} from "../deps.ts";
import {MyContext} from "../context.ts";
import {get_meds, to_string} from "../types/meds.ts";

const composer = new Composer<MyContext>();

composer.command("view", async (ctx) => {
    await ctx.reply("Your meds:");

    let meds: string = "";
    let rows = get_meds(ctx.chat.id);
    for (let med of rows) {
        meds = meds.concat(to_string(med) + "\n");
    }

    if (meds.length == 0) return ctx.reply("You don't have any meds added!");
    return ctx.reply(meds);
});

export default composer;
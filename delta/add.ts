import { Composer} from "../deps.ts";
import { add_med } from "../database/db.ts";

const composer = new Composer();

composer.command("add", (ctx) => {
    const name = ctx.match;

    if (!name) return ctx.reply("Please specify a name!");

    add_med(name, ctx.chat.id);

    return ctx.reply("Added!");
});

export default composer;
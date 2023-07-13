import { Composer} from "../deps.ts";
import { add_med } from "../database/db.ts";
import {schedule} from "../cron.ts";

const composer = new Composer();

composer.command("add", (ctx) => {
    const input = ctx.match.split(" ");

    const name = input[0];
    if (!name) return ctx.reply("Please specify a name!");

    const hour = input[1];
    const minute = input[2];
    const day = input[3];
    const weekday = input[4];

    if (!hour || !minute || !day || !weekday) {
        return ctx.reply("Please specify schedule properly! Run /help for more info.");
    }

    const cron = `${minute} ${hour} ${day} * ${weekday}`;

    add_med(name, ctx.chat.id);
    schedule(ctx, name, cron);

    return ctx.reply("Added!");
});

export default composer;
import { Composer} from "../deps.ts";
import { add_med } from "../types/meds.ts";
import {schedule} from "../cron.ts";

const composer = new Composer();

composer.command("add", async (ctx) => {
    const inputs = extract_inputs(ctx.match);

    if (!inputs.name) return ctx.reply("Please specify a name!");

    if (!inputs.hour || !inputs.minute || !inputs.day || !inputs.weekday) {
        return ctx.reply("Please specify schedule properly! Run /help for more info.");
    }

    const cron = `${inputs.minute} ${inputs.hour} ${inputs.day} * ${inputs.weekday}`;

    add_med(inputs.name, ctx.chat.id, cron);
    schedule(ctx.chat.id, inputs.name, cron);

    return ctx.reply("Added!");
});

function extract_inputs(input: string) {
    const inputs = input.split(" ");

    const name = inputs[0];
    const hour = inputs[1];
    const minute = inputs[2];
    const day = inputs[3];
    const weekday = inputs[4];

    return {name, hour, minute, day, weekday};
}

export default composer;
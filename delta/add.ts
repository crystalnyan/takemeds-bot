import {Composer, InlineKeyboard, createConversation} from "../deps.ts";
import { add_med } from "../types/meds.ts";
import {schedule} from "../cron.ts";
import { MyContext, MyConversation, bot } from "../bot.ts";

const composer = new Composer();

async function add(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Type the name for new medication:");
    const name = await conversation.form.text();

    const time_keyboard = new InlineKeyboard()
    .text("Hour 0-23").row()
    .text("➖", "hour_down").text("0").text("➕", "hour_up").row()
    .text("Minutes 0-59").row()
    .text("➖", "minute_down").text("0").text("➕", "minute_down").row()
    .text("Select", "select_time");

    await ctx.reply("Choose time for reminders:", {
        reply_markup: time_keyboard
    });

    /*

    //TODO: it should be`${inputs.minute} ${inputs.hour} ${inputs.day} * ${inputs.weekday}`
    const cron = `${time.minute} ${time.hour} * * *`;

    if (ctx.chat == undefined) {
        console.log("wth... chat is undefined");
        return;
    }

    add_med(name, ctx.chat.id, cron);
    schedule(ctx.chat.id, name, cron);

    return await ctx.reply("Added!");*/
}

export function add_med_convo() {
    // @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
    bot.use(createConversation(add));

    bot.hears("Add a medication 💊", async (ctx) => {
        await ctx.conversation.enter("add");
    })
}

export function add_callbacks() {
    bot.callbackQuery("hour_up", async (ctx) => {
        const hour = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[1][1].text;

        if (hour == undefined) return;

        const new_hour = (+hour + 1).toString();

        if (ctx.callbackQuery.message == undefined) return;
        if (ctx.callbackQuery.message.reply_markup == undefined) return;

        console.log(ctx.callbackQuery.message.reply_markup)

         ctx.callbackQuery.message.reply_markup.inline_keyboard[1][1].text = new_hour;

        await ctx.editMessageReplyMarkup({
            reply_markup: ctx.callbackQuery.message.reply_markup
        })
    })

    bot.callbackQuery("select_time", async (ctx) => {
        const hour = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[1][1].text;
        const minutes = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[3][1].text;
        //await ctx.reply("Selected hour: " + hour + " minutes: " + minutes );

        const days = new InlineKeyboard()
            .text("Weekdays", "weekdays").row()
            .text("Month days", "month_days").row();

        await ctx.reply("Choose to remind on specific weekdays or days of a month?", {
            reply_markup: days
        })
    })
}

export default composer

/*
composer.command("add", async (ctx) => {
    const inputs = extract_inputs(ctx.match);

    if (!inputs.name) return ctx.reply("Please specify a name!");

    if (!inputs.hour || !inputs.minute || !inputs.day || !inputs.weekday) {
        return ctx.reply("Please specify schedule properly!\nRun /help for more info.");
    }

    const cron = `${inputs.minute} ${inputs.hour} ${inputs.day} * ${inputs.weekday}`;

    add_med(inputs.name, ctx.chat.id, cron);
    schedule(ctx.chat.id, inputs.name, cron);

    return await ctx.reply("Added!");
});

function extract_inputs(input: string) {
    const inputs = input.split(" ");

    const name = inputs[0];
    const hour = inputs[1];
    const minute = inputs[2];
    const day = inputs[3];
    const weekday = inputs[4];

    return {name, hour, minute, day, weekday};
}*/

import {Composer, InlineKeyboard, createConversation} from "../deps.ts";
import { add_med } from "../types/meds.ts";
import {schedule} from "../cron.ts";
import { MyContext, MyConversation, bot } from "../bot.ts";

const composer = new Composer();

let selected_hour, selected_minutes;

async function add(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Type the name for new medication:");
    const name = await conversation.form.text();

    const time_keyboard = new InlineKeyboard()
    .text("Hour 0-23").row()
    .text("➖", "hour_down").text("12").text("➕", "hour_up").row()
    .text("Minutes 0-59").row()
    .text("➖", "minute_down").text("0").text("➕", "minute_up").row()
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
        await change_time(ctx, [TimeChangeArgs.Hour, TimeChangeArgs.Up]);
    })

    bot.callbackQuery("hour_down", async (ctx) => {
        await change_time(ctx, [TimeChangeArgs.Hour, TimeChangeArgs.Down]);
    })

    bot.callbackQuery("minute_up", async (ctx) => {
        await change_time(ctx, [TimeChangeArgs.Minutes, TimeChangeArgs.Up]);
    })

    bot.callbackQuery("minute_down", async (ctx) => {
        await change_time(ctx, [TimeChangeArgs.Minutes, TimeChangeArgs.Down]);
    })

    bot.callbackQuery("select_time", async (ctx) => {
        selected_hour = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[1][1].text;
        selected_minutes = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[3][1].text;
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

enum TimeChangeArgs {
    Up = "UP",
    Down = "DOWN",
    Hour = "HOUR",
    Minutes = "MINUTES"
}

async function change_time( ctx: MyContext, args: [TimeChangeArgs, TimeChangeArgs]) {
    let current_value, new_value;
    const [value, operation] = args;
    switch (value) {
        case "HOUR":
            current_value = ctx.callbackQuery?.message?.reply_markup?.inline_keyboard[1][1].text;
            if (current_value == undefined) return;

            switch (operation){
                case "UP":
                    if (current_value == "23") {
                        new_value = "0";
                    } else {
                        new_value = (+current_value + 1).toString();
                    }
                    break;
                case "DOWN":
                    if (current_value == "0") {
                        new_value = "23";
                    } else {
                        new_value = (+current_value - 1).toString();
                    }
                    break;
            }

            console.log("CURRENT:" + current_value + " NEW: " + new_value);
            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[1][1].text = new_value;
            break;

        case "MINUTES":
            current_value = ctx.callbackQuery?.message?.reply_markup?.inline_keyboard[3][1].text;
            if (current_value == undefined) return;

            switch (operation){
                case "UP":
                    if (current_value == "55") {
                        new_value = "0";
                    } else {
                        new_value = (+current_value + 5).toString();
                    }
                    break;
                case "DOWN":
                    if (current_value == "0") {
                        new_value = "55"
                    } else {
                        new_value = (+current_value - 5).toString();
                    }
                    break;
            }

            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[3][1].text = new_value;
            break;
    }

    if (isOkContext(ctx)) {
        try {
            await ctx.editMessageReplyMarkup({
                // @ts-ignore working, Deno complains
                reply_markup: ctx.callbackQuery.message.reply_markup})
        } catch (err) {}
    }
}

function isOkContext(ctx: MyContext) {
    return ctx.callbackQuery != undefined &&
        ctx.callbackQuery.message != undefined &&
        ctx.callbackQuery.message.reply_markup != undefined
}

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

import {Composer, InlineKeyboard, createConversation} from "../deps.ts";
import { add_med } from "../types/meds.ts";
import {schedule} from "../cron.ts";
import { MyContext, MyConversation, bot } from "../bot.ts";

const composer = new Composer();

let selected_hour, selected_minutes;
let med_name: string;
let weekdays = [0,0,0,0,0,0,0];

async function add(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Type the name for new medication:");
    med_name = await conversation.form.text();

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
        await ctx.reply("Selected hour: " + selected_hour + " minutes: " + selected_minutes );

        const days = new InlineKeyboard()
            .text("Weekdays", "weekdays").row()
            .text("Month days", "month_days").row();

        await ctx.reply("Choose to remind on specific weekdays or days of a month?", {
            reply_markup: days
        })
    })

    bot.callbackQuery("weekdays", async (ctx) => {
        const weekdays = new InlineKeyboard()
            .text("Monday", "mon").row()
            .text("Tuesday", "tue").row()
            .text("Wednesday", "wed").row()
            .text("Thursday", "thu").row()
            .text("Friday", "fri").row()
            .text("Saturday", "sat").row()
            .text("Sunday", "sun").row()
            .text("Select", "select_weekdays");

        await ctx.reply("Choose weekdays:", {
            reply_markup: weekdays
        })
    })

    bot.callbackQuery("mon", async (ctx) => {
        await change_weekdays(ctx, 1);
    })
}

export default composer

enum TimeChangeArgs {
    Up = "UP",
    Down = "DOWN",
    Hour = "HOUR",
    Minutes = "MINUTES"
}

async function change_weekdays(ctx: MyContext, index: number) {
    if (weekdays[index] == 0 ) {
            weekdays[index] =1;
            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[0][index - 1].text = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[0][0].text + "✅";
            try {
                await ctx.editMessageReplyMarkup({
                    // @ts-ignore working, Deno complains
                    reply_markup: ctx.callbackQuery.message.reply_markup})
            } catch (err) {}
    } else {
        weekdays[index] = 0;
        // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[0][index - 1].text = ctx.callbackQuery.message?.reply_markup?.inline_keyboard[0][0].text.replace("✅", "");
            try {
                await ctx.editMessageReplyMarkup({
                    // @ts-ignore working, Deno complains
                    reply_markup: ctx.callbackQuery.message.reply_markup})
            } catch (err) {}
    }
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

    try {
        await ctx.editMessageReplyMarkup({
            // @ts-ignore working, Deno complains
            reply_markup: ctx.callbackQuery.message.reply_markup})
    } catch (err) {}
}
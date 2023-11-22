import { createConversation } from "../../deps.ts";
import {add_med, delete_med} from "../types/med.ts";
import {schedule} from "../cron.ts";
import { MyContext, MyConversation, bot } from "../init.ts";
import { main_menu, time_choice, reminder_type_choice, weekdays_choice } from "../keyboards.ts";
import {generate_gpt_cron} from "../gpt.ts";
import { Cron, Med } from "../zod/schemas.ts";

let selected_hour: string|undefined, selected_minutes: string |undefined;
let med_name: string;
let weekdays = [0,0,0,0,0,0,0,0];

async function add(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Type the name for new medication:");
    med_name = await conversation.form.text();

    await ctx.reply("Choose type of reminders:" +
        "\n\nSpecified reminder: " +
        "\nSpecify weekdays and exact time when reminder will be sent to you" +
        "\n\nAI-generated reminder: " +
        "\nText the preferred schedule and AI (artificial intelligence) will try to infer it", {
        reply_markup: reminder_type_choice
    });
}

async function gpt(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Text me a schedule that AI will try to infer for your reminder: " +
        "\n\nYour text must include time and days" +
        "\n\nExamples: \n- every two days at 12:45" +
        "\n- every two hours on monday and saturday" +
        "\n- every 1,3 day of month at 21:15");

    const text = await conversation.form.text();
    const cron = await generate_gpt_cron(text);

    if (!Cron.safeParse(cron).success) {
        await ctx.reply("Generated cron is invalid! Please try again later or set a reminder manually", {
            reply_markup: main_menu
        });
        return;
    }

    if (ctx.chat == undefined) return;
    if (!cron) return;

    const result = await add_med(med_name, ctx.chat.id, cron);
    if (!Med.safeParse(result).success) {
        await ctx.reply('Something went wrong! Could not add a new med', {
            reply_markup: main_menu
        });
    }

    try {
        await schedule(result.id, ctx.chat.id, med_name, cron);
    } catch (_err) {
        await ctx.reply("Could not schedule a new med!", {
            reply_markup: main_menu
        });
        await delete_med(result.id);
        return;
    }
    await ctx.reply("Added!", {
        reply_markup: main_menu
    });
}

export function add_med_convo() {
    // @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
    bot.use(createConversation(add));
    // @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
    bot.use(createConversation(gpt));

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
        await ctx.reply("Selected time " + selected_hour + ":" + selected_minutes );

        weekdays = [0,0,0,0,0,0,0,0];
        await ctx.reply("Choose weekdays:", {
            reply_markup: weekdays_choice
        })
    })

    bot.callbackQuery("weekdays", async (ctx) => {
        await ctx.reply("Choose time for reminders:", {
            reply_markup: time_choice
        });
    })

    bot.callbackQuery("select_weekdays", async (ctx) => {
        if (!weekdays.includes(1)) {
            await ctx.reply("You should choose at least one day!", {
                reply_markup: weekdays_choice
            })
            return;
        }

        let selected_weekdays = "";
        let index = 0;
        for (const el of weekdays) {
            if (el == 1) {
                selected_weekdays += index + ",";
            }
            index++;
        }

        const cron = `${selected_minutes} ${selected_hour} * * ${selected_weekdays}`;

        if (ctx.chat == undefined) return;

        const result = await add_med(med_name, ctx.chat.id, cron);
        console.log(result);
        console.log(Med.safeParse(result));
        if (!Med.safeParse(result).success) {
            await ctx.reply('Something went wrong! Could not add a new med', {
                reply_markup: main_menu
            });
            return;
        }

        try {
            schedule(result.id, ctx.chat.id, med_name, cron);
        } catch (_err) {
            await ctx.reply("Could not schedule a new med!", {
                reply_markup: main_menu
            });
            await delete_med(result.id);
            return;
        }
        await ctx.reply("Added!", {
            reply_markup: main_menu
        });
    })

    bot.callbackQuery("gpt", async (ctx) =>{
        await ctx.conversation.enter("gpt");
    })

    bot.callbackQuery("mon", async (ctx) => {
        await change_weekdays(ctx, 1);
    })
    bot.callbackQuery("tue", async (ctx) => {
        await change_weekdays(ctx, 2);
    })
    bot.callbackQuery("wed", async (ctx) => {
        await change_weekdays(ctx, 3);
    })
    bot.callbackQuery("thu", async (ctx) => {
        await change_weekdays(ctx, 4);
    })
    bot.callbackQuery("fri", async (ctx) => {
        await change_weekdays(ctx, 5);
    })
    bot.callbackQuery("sat", async (ctx) => {
        await change_weekdays(ctx, 6);
    })
    bot.callbackQuery("sun", async (ctx) => {
        await change_weekdays(ctx, 7);
    })
}

enum TimeChangeArgs {
    Up = "UP",
    Down = "DOWN",
    Hour = "HOUR",
    Minutes = "MINUTES"
}

async function change_weekdays(ctx: MyContext, index: number) {
    if (weekdays[index] == 0 ) {
            weekdays[index] = 1;
            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[index - 1][0].text =
                // @ts-ignore working, Deno complains
                ctx.callbackQuery.message?.reply_markup?.inline_keyboard[index - 1][0].text + "✅";
            try {
                await ctx.editMessageReplyMarkup({
                    // @ts-ignore working, Deno complains
                    reply_markup: ctx.callbackQuery.message.reply_markup})
            } catch (err) {
                console.log(err);
                await ctx.reply('Something went wrong while changing weekdays!')
            }
    } else {
        weekdays[index] = 0;
        // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[index - 1][0].text =
                // @ts-ignore working, Deno complains
                ctx.callbackQuery.message?.reply_markup?.inline_keyboard[index - 1][0].text.replace("✅", "");
            try {
                await ctx.editMessageReplyMarkup({
                    // @ts-ignore working, Deno complains
                    reply_markup: ctx.callbackQuery.message.reply_markup})
            } catch (err) {
                console.log(err);
                await ctx.reply('Something went wrong while changing weekdays!')
            }
    }
}

async function change_time( ctx: MyContext, args: [TimeChangeArgs, TimeChangeArgs]) {
    let current_value, new_value = "";
    const [value, operation] = args;
    switch (value) {
        case "HOUR":
            current_value = ctx.callbackQuery?.message?.reply_markup?.inline_keyboard[1][1].text;
            if (current_value == undefined) return;

            switch (operation){
                case "UP":
                    if (current_value == "23") {
                        new_value = "00";
                    } else {
                        new_value = (+current_value + 1).toString();
                    }
                    break;
                case "DOWN":
                    if (current_value == "00") {
                        new_value = "23";
                    } else {
                        new_value = (+current_value - 1).toString();
                    }
                    break;
            }

            if (new_value?.length == 1) new_value = "0" + new_value;
            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[1][1].text = new_value;
            break;

        case "MINUTES":
            current_value = ctx.callbackQuery?.message?.reply_markup?.inline_keyboard[3][1].text;
            if (current_value == undefined) return;

            switch (operation){
                case "UP":
                    if (current_value == "55") {
                        new_value = "00";
                    } else {
                        new_value = (+current_value + 5).toString();
                    }
                    break;
                case "DOWN":
                    if (current_value == "00") {
                        new_value = "55"
                    } else {
                        new_value = (+current_value - 5).toString();
                    }
                    break;
            }

            if (new_value?.length == 1) new_value = "0" + new_value;
            // @ts-ignore working, Deno complains
            ctx.callbackQuery.message.reply_markup.inline_keyboard[3][1].text = new_value;
            break;
    }

    try {
        await ctx.editMessageReplyMarkup({
            // @ts-ignore working, Deno complains
            reply_markup: ctx.callbackQuery.message.reply_markup})
    } catch (_err) {;}
}
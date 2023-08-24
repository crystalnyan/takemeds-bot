import {delete_med, get_meds} from "../types/med.ts";
import {MyContext, MyConversation, bot} from "../bot.ts";
import {keyboard} from "./start.ts";
import {createConversation} from "../deps.ts";

async function delete_convo(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Please type the index of the med to delete:");
    let med_index = await conversation.form.number(async () =>
        await ctx.reply("This isn't even a number...\nTry again:"));

    // @ts-ignore,
    const rows = get_meds(ctx.chat.id);

    while (!isValidIndex(med_index, rows.length)) {
        await ctx.reply(`We don't have such an index...` +
            `\nPlease, choose between 1 and ${rows.length}`);

        med_index = await conversation.form.number(async () =>
        await ctx.reply("This isn't even a number...\nTry again:"));
    }

    // @ts-ignore,
    delete_med(med_index, ctx.chat.id);
    await ctx.reply("Deleted!", {
        reply_markup: keyboard
    })
}

function isValidIndex(index: number, last: number) {
    return index < last && index >= 1;
}

export function delete_med_convo() {
    // @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
    bot.use(createConversation(delete_convo));

    bot.hears("Delete a med", async (ctx) => {
        await ctx.conversation.enter("delete_convo");
    })
}
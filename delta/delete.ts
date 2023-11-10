import {delete_med, get_meds} from "../types/med.ts";
import {MyContext, MyConversation, bot} from "../init.ts";
import {createConversation, z} from "../deps.ts";
import { main_menu } from "../keyboards.ts";
import { remove_cron } from "../cron.ts";
import {Med} from "../schemas.ts";

async function delete_convo(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Please type the index of the med to delete:");
    let med_index = await conversation.form.number(async () =>
        await ctx.reply("This isn't even a number...\nTry again:"));

    // @ts-ignore,
    const rows = await get_meds(ctx.chat.id);

    while (!isValidIndex(med_index, rows.length)) {
        await ctx.reply(`We don't have such an index...` +
            `\nPlease, choose between 1 and ${rows.length}`);

        med_index = await conversation.form.number(async () =>
        await ctx.reply("This isn't even a number...\nTry again:"));
    }

    if (!ctx.chat) return;

    const all_meds = await get_meds(ctx.chat.id);
    const meds = z.array(Med).safeParse(all_meds);
    if (!meds.success){
        await ctx.reply('Error in getting meds!', {
            reply_markup: main_menu
        });
        return;
    }
    const med = meds.data[med_index-1];

    try{
        await delete_med(med.id);
    } catch (err) {
        console.log(err);
        await ctx.reply("Could no delete a med", {
            reply_markup: main_menu
        });
        return;
    }

    remove_cron(med.name + med.cron + med.chat_id);

    await ctx.reply("Deleted!", {
        reply_markup: main_menu
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
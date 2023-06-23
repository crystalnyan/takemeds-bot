import { Composer } from "https://deno.land/x/grammy@v1.16.2/composer.ts";
import { MyContext, MyConversation } from "../context.ts";
import { add_med } from "../database/db.ts";
import {createConversation} from "https://deno.land/x/grammy_conversations@v1.1.2/conversation.ts";

const composer = new Composer<MyContext>();

composer.use(createConversation(add_med_conversation));

composer.command("add", async (ctx) => {
    await ctx.conversation.enter("add_med_conversation");
});

export async function add_med_conversation(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Tell a name:");
    const {message} = await conversation.wait();

    if (ctx.chat !== undefined && message !== undefined && message.text !== undefined) {
        add_med(message.text, ctx.chat.id);
        return ctx.reply("Added!");
    }

    return;
}

export default composer;
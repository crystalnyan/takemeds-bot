import {Bot, Context, session} from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
import {add_med, create_meds_table} from "./database/db.ts";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "https://deno.land/x/grammy_conversations@v1.1.2/mod.ts";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

async function add_med_conversation(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Tell a name:");
    const {message} = await conversation.wait();

    if (ctx.chat !== undefined && message !== undefined && message.text !== undefined) {
        add_med(message.text, ctx.chat.id);
        return ctx.reply("Added!");
    }

    return;
}

const env = await load();
const token = env["BOT_TOKEN"];

const bot = new Bot<MyContext>(token);
bot.use(session({initial() {return{};}}));
bot.use(conversations());
bot.use(createConversation(add_med_conversation));

create_meds_table();

await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    {command: "add", description: "Add a new med"},
    {command: "view", description: "View all my meds"},
    {command: "delete", description: "Delete a med"}
]);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Available commands:\n/start\n/help"));
bot.command("add", async (ctx) => {
    await ctx.conversation.enter("add_med_conversation");
});
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
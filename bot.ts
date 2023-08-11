import {Bot, Context, createConversation, load, session} from "./deps.ts";
import { create_meds_table } from "./database/db.ts";
import delta from "./delta/mod.ts";
import {load_crons} from "./cron.ts";
import {type Conversation,
  type ConversationFlavor,
  conversations} from "./deps.ts";

const env = await load();
const token = env["BOT_TOKEN"];

type MyContext = Context & ConversationFlavor;
// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));
// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
bot.use(conversations());

// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
delta(bot);

create_meds_table();
load_crons();

await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "add", description: "Add a new med" },
    { command: "view", description: "View all my meds" },
    { command: "delete", description: "Delete a med" }
]);

async function add(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Type the name for new medication:");
    const name = await conversation.form.text();
    await ctx.reply(name);
}

// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
bot.use(createConversation(add));

bot.hears("Add a medication 💊",  async (ctx) => {
    await ctx.conversation.enter("add");
})

await bot.start();
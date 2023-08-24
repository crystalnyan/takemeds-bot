import {Bot, Context, load, session} from "./deps.ts";
import { create_meds_table } from "./database/db.ts";
import delta from "./delta/mod.ts";
import {load_crons} from "./cron.ts";
import {type Conversation,
  type ConversationFlavor,
  conversations} from "./deps.ts";

const env = await load();
const token = env["BOT_TOKEN"];

export type MyContext = Context & ConversationFlavor;
// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
export type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));
// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
bot.use(conversations());

// @ts-ignore working, taken from https://grammy.dev/plugins/conversations, still Deno complains
delta(bot);

create_meds_table();
load_crons();

await bot.start();
// @ts-nocheck errors given by conversations initialized
// exactly like in the docs at https://grammy.dev/plugins/conversations

import { load_crons } from "./cron.ts";
import { create_meds_table } from "./database/db.ts";
import { Bot, Context, Conversation, ConversationFlavor, conversations, load, session } from "./deps.ts";
import delta from "./delta/mod.ts";

const env = await load();
export const token = env["BOT_TOKEN"];
export const api_key = env["API_KEY"];

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(token);

export function init() {
    bot.use(session({ initial: () => ({}) }));
    bot.use(conversations());

    delta(bot);
    create_meds_table();
    load_crons();
}

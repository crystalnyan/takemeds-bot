// @ts-nocheck errors given by conversations initialized
// exactly like in the docs at https://grammy.dev/plugins/conversations

import { load_crons } from "./cron.ts";
import {Bot, Context, Conversation, ConversationFlavor, conversations, load, OpenAI, session} from "./deps.ts";
import delta from "./delta/mod.ts";
import {PrismaClient} from "./deps.ts";

const env = await load();
export const token = env["BOT_TOKEN"];
export const api_key = env["API_KEY"];

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(token);
export const openAI = new OpenAI(api_key);

export const prisma = new PrismaClient();

export function init() {
    bot.use(session({ initial: () => ({}) }));
    bot.use(conversations());

    delta(bot);
    load_crons();
}

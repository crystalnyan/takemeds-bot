import {Bot, Context, load, session} from "./deps.ts";
import { create_meds_table } from "./database/db.ts";
import delta from "./delta/mod.ts";
import {load_crons} from "./cron.ts";
import {type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation} from "./deps.ts";

const env = await load();
const token = env["BOT_TOKEN"];

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

export const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

await delta(bot);

create_meds_table();
load_crons();

await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "add", description: "Add a new med" },
    { command: "view", description: "View all my meds" },
    { command: "delete", description: "Delete a med" }
]);

bot.start();
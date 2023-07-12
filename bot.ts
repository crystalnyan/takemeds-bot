import { Bot, load, } from "./deps.ts";
import { create_meds_table } from "./database/db.ts";
import delta from "./delta/mod.ts";

const env = await load();
const token = env["BOT_TOKEN"];

const bot = new Bot(token);
await delta(bot);

create_meds_table();

await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "add", description: "Add a new med" },
    { command: "view", description: "View all my meds" },
    { command: "delete", description: "Delete a med" }
]);

bot.start();
import {Bot} from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { load } from "https://deno.land/std@0.192.0/dotenv/mod.ts";
import { create_meds_table } from "./database/db.ts";
import {MyContext} from "./context.ts";
import delta from "./delta/mod.ts";

const env = await load();
const token = env["BOT_TOKEN"];

const bot = new Bot<MyContext>(token);
//await context(bot);
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
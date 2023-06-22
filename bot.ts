import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import {add_med, create_meds_table} from "./database/db.ts";

const env = await load();
const token = env["BOT_TOKEN"];

const bot = new Bot(token);
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
bot.command("add", (ctx) => {
    ctx.reply("Tell a name:");
});
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
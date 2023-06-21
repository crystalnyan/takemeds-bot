import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";

const env = await load();
const token = env["BOT_TOKEN"];

const bot = new Bot(token);

await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
]);


bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Available commands:\n/start\n/help"));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
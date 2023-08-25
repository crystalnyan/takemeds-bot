import { bot } from "../init.ts";
import { main_menu } from "../keyboards.ts";

export const help =
    "Use /start to restart the bot if any problem occurred.\n\n" +
    "You can add, view, and delete your med reminders.\n\n" +
    "To remind you about taking a med the bot will send you a message,\n" +
    "so, please, unmute it for best experience.\n\n" +
    "You can file an issue on GitHub repo:\n" +
    "https://github.com/crystalnyan/takemeds-bot";

export function help_callbacks() {
    bot.hears("Help", async (ctx) => {
        await ctx.reply(help, {
            reply_markup: main_menu
        });
    })
}
import { Composer } from "../deps.ts";

const composer = new Composer();

export const message =
    "Use these commands to:" +
    "\n\n/add - Add a new med" +
    "\n/view - View all my meds" +
    "\n/delete - Delete a med" +
    "\n\nHow to pass schedule information" +
    "\nwhen you are adding a new med:" +
    "\n/add <name> <hour> <minute> <day> <weekday>" +
    "\n\nExample:" +
    "\n/add Aspirin 12 30 * 1" +
    "\n\nThis will schedule Aspirin to be taken" +
    "\nat 12:30 every Monday." +
    "\n\nNote:\n\"*\" means every. However, days may later" +
    "\nbe restricted by specified weekdays" +
    "\n\"*/3\" means each third minute/hour/day/month";

composer.command("help", async (ctx) => {
    return await ctx.reply(message);
});

export default composer;
import { Composer } from "../deps.ts";
import { MyContext } from "../context.ts";

const composer = new Composer<MyContext>();

export const message =
    "Use these commands to:" +
    "\n/add - Add a new med" +
    "\n/view - View all my meds" +
    "\n/delete - Delete a med";

composer.command("help", (ctx) => {
    ctx.reply(message);
});

export default composer;
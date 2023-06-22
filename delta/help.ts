import { Composer } from "https://deno.land/x/grammy@v1.16.2/composer.ts";
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
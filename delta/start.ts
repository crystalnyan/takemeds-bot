import { Composer } from "https://deno.land/x/grammy@v1.16.2/composer.ts";
import { MyContext } from "../context.ts";

const composer = new Composer<MyContext>();

export const message =
    "Welcome, everynyan~ \nI'm a bot that reminds you to take your meds.";

composer.command("start", (ctx) => {
    ctx.reply(message);
});

export default composer;
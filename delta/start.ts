import { Composer } from "../deps.ts";
import { MyContext } from "../context.ts";

const composer = new Composer<MyContext>();

export const message =
    "Welcome, everynyan~ \nI'm a bot that reminds you to take your meds.";

composer.command("start", (ctx) => {
    ctx.reply(message);
});

export default composer;
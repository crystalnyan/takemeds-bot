import { Composer } from "../deps.ts";

const composer = new Composer();

export const message =
    "Welcome, everynyan~ \nI'm a bot that reminds you to take your meds.";

composer.command("start", (ctx) => {
    ctx.reply(message);
});

export default composer;
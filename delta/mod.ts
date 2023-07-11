import { Bot } from "../deps.ts";
import { MyContext } from "../context.ts";
import start from "./start.ts";
import help from "./help.ts";
import add from "./add.ts";
import view from "./view.ts";

export default async (bot: Bot<MyContext>)=> {
    await bot
        .use(start)
        .use(help)
        .use(add)
        .use(view);
}
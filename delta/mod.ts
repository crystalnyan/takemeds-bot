import { Bot } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import { MyContext } from "../context.ts";
import start from "./start.ts";
import help from "./help.ts";
import add from "./add.ts";

export default async (bot: Bot<MyContext>)=> {
    await bot
        .use(start)
        .use(help)
        .use(add);
}
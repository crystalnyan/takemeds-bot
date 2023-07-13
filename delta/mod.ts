import { Bot } from "../deps.ts";
import start from "./start.ts";
import help from "./help.ts";
import add from "./add.ts";
import view from "./view.ts";
import delete_med from "./delete.ts";

export default async (bot: Bot)=> {
    await bot
        .use(start)
        .use(help)
        .use(add)
        .use(view)
        .use(delete_med);
}
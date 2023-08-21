import { Bot } from "../deps.ts";
import start from "./start.ts";
import help from "./help.ts";
import add, {add_callbacks, add_med_convo} from "./add.ts";
import view from "./view.ts";
import delete_med from "./delete.ts";

export default (bot: Bot)=> {
    bot
        .use(start)
        .use(help)
        .use(add)
        .use(view)
        .use(delete_med);

    add_med_convo();
    add_callbacks();
}
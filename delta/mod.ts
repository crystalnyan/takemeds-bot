import { Bot } from "../deps.ts";
import start from "./start.ts";
import add, {add_callbacks, add_med_convo} from "./add.ts";
import {view_callbacks} from "./view.ts";
import delete_med from "./delete.ts";
import {help_callbacks} from "./help.ts";

export default (bot: Bot)=> {
    bot
        .use(start)
        .use(add)
        .use(delete_med);

    add_med_convo();
    add_callbacks();
    view_callbacks();
    help_callbacks()
}
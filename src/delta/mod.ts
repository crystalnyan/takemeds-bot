import { Bot } from "../../deps.ts";
import start from "./start.ts";
import {add_callbacks, add_med_convo} from "./add.ts";
import {view_callbacks} from "./view.ts";
import {help_callbacks} from "./help.ts";
import {delete_med_convo} from "./delete.ts";

export default (bot: Bot)=> {
    bot
        .use(start);

    add_med_convo();
    add_callbacks();
    view_callbacks();
    help_callbacks()
    delete_med_convo();
}
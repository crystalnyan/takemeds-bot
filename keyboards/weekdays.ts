import {InlineKeyboard} from "../deps.ts";

export const weekdays = new InlineKeyboard()
    .row()
    .text("Monday", "monday")
    .text("Tuesday")
    .text("Wednesday")
    .text("Thursday")
    .row()
    .text("Friday")
    .text("Saturday")
    .text("Sunday");
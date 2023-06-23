import {InlineKeyboard} from "https://deno.land/x/grammy@v1.16.2/convenience/keyboard.ts";

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
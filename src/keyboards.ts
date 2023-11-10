import { Keyboard } from "https://deno.land/x/grammy@v1.17.2/mod.ts";
import { InlineKeyboard } from "../deps.ts";

export const main_menu = new Keyboard()
    .text("Add a medication 💊").row()
    .text("View your meds").row()
    .text("Help")
    .resized()
    .oneTime();

export const meds_menu = new Keyboard()
    .text("Delete a med").row()
    .text("Continue")
    .oneTime()
    .resized();

export const reminder_type_choice = new InlineKeyboard()
    .text("Specified reminder", "weekdays").row()
    .text("GPT-generated reminder", "gpt").row();

export const weekdays_choice = new InlineKeyboard()
    .text("Monday", "mon").row()
    .text("Tuesday", "tue").row()
    .text("Wednesday", "wed").row()
    .text("Thursday", "thu").row()
    .text("Friday", "fri").row()
    .text("Saturday", "sat").row()
    .text("Sunday", "sun").row()
    .text("Select", "select_weekdays");

export const time_choice = new InlineKeyboard()
    .text("Hour 0-23").row()
    .text("➖", "hour_down").text("12").text("➕", "hour_up").row()
    .text("Minutes 0-59").row()
    .text("➖", "minute_down").text("00").text("➕", "minute_up").row()
    .text("Select", "select_time");
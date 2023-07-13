import {Context, Cron} from "./deps.ts";

export function schedule(ctx: Context, name: string, cron: string) {
    new Cron(
        cron,
        () => {
            ctx.reply(`You should take ${name} now!`);
        } );
}
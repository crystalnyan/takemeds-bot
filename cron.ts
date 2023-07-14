import {Context, Cron} from "./deps.ts";

export function schedule(ctx: Context, name: string, cron: string) {
    new Cron(
        cron,
        () => {
            ctx.reply(`You should take ${name} now!`);
        } );
}

export async function write_cron_to_file(name: string, cron: string) {
    await Deno.writeTextFile("./cron.txt", `${name}|${cron}`, { append: true });
}
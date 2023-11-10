import {z} from "../../deps.ts";

export const Med = z.object({
  id: z.number().int().positive(),
  chat_id: z.number().int().positive(),
  name: z.string(),
  cron: z.string()
});
export const TMed = z.infer<typeof Med>;

const cron = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/g;
export const Cron = z.string().regex(cron, 'invalid cron!');
export const TCron = z.infer<typeof Cron>;

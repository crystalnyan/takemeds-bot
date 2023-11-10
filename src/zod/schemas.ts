import {z} from "../../deps.ts";

export const Med = z.object({
  id: z.number().int().positive(),
  chat_id: z.number().int().positive(),
  name: z.string(),
  cron: z.string()
});
export const TMed = z.infer<typeof Med>;
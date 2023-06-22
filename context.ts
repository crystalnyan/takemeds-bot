import { Bot, Context, session } from "https://deno.land/x/grammy@v1.16.2/mod.ts";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "https://deno.land/x/grammy_conversations@v1.1.2/mod.ts";
import add_med_conversation from "./delta/add.ts";

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

/*
export default async (bot: Bot<MyContext>)=> {
    await bot
        .use(session({initial() {return{};}}))
        .use(conversations())
        .use(createConversation(add_med_conversation));
};*/

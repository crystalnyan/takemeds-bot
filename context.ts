import {
    Bot, Context, session,
    type Conversation,
    type ConversationFlavor,
    conversations
} from "./deps.ts";

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export default async (bot: Bot<MyContext>)=> {
    await bot
        .use(session({initial() {return{};}}))
        .use(conversations())
};

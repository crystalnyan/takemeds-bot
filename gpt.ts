import { openAI } from "./init.ts";

export async function generate_gpt_cron(text: string) {
    const content = `send me a text cron that means ${text}. wrap the cron itself in ""`;

    const reply = await openAI.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            "role": "user",
            "content": content,
        }]
    })

    const reply_text = reply.choices[0].message.content;

    if (!reply_text) {
        console.log("no cron in gpt reply");
        return;
    }
    if(!get_cron(reply_text)) {
        console.log("no cron could be extracted from reply");
        return;
    }

    return get_cron(reply_text)?.[1];
}

function get_cron(gpt_reply: string) {
    const re = /"([^"]+)"/g;
    return re.exec(gpt_reply);
}
use teloxide::{prelude::*, utils::command::BotCommands};

#[tokio::main]
async fn main() {

    let bot = Bot::from_env();

    Command::repl(bot, answer).await;
}

#[derive(BotCommands, Clone)]
#[command(rename_rule = "lowercase", description = "These commands are supported:")]
enum Command {
    #[command(description = "start")]
    Start,
    #[command(description = "add a new meds reminder")]
    AddMeds,
    #[command(description = "view your meds reminders")]
    ViewMeds,
    #[command(description = "list available commands")]
    Help
}

async fn answer(bot: Bot, msg: Message, cmd: Command) -> ResponseResult<()> {
    match cmd {
        _ => bot.send_message(msg.chat.id, Command::descriptions().to_string()).await?
    };

    Ok(())
}
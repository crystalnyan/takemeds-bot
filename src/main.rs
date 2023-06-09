mod meds;
mod db;

use sqlx::{Pool, Sqlite, SqlitePool};
use sqlx::sqlite::SqliteConnectOptions;
use teloxide::{prelude::*, utils::command::BotCommands};

#[tokio::main]
async fn main() {
    let options = SqliteConnectOptions::new()
        .filename("db.sqlite3")
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(options).await.unwrap();

    db::create_meds_table(&pool).await;

    let bot = Bot::from_env();

    Command::repl(bot, move |bot, msg, cmd| answer(bot, msg, cmd, pool.clone())).await;
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

async fn answer(bot: Bot, msg: Message, cmd: Command, pool: Pool<Sqlite>) -> ResponseResult<()> {
    match cmd {
        Command::AddMeds => {
            bot.send_message(msg.chat.id, "What meds do you want to add?").await?;

            let meds = meds::Meds::new(1, "test".to_string());
            meds::Meds::add_to_db(&meds, pool).await;

            bot.send_message(msg.chat.id, "Meds added successfully!").await?
        },
        _ => bot.send_message(msg.chat.id, Command::descriptions().to_string()).await?

    };

    Ok(())
}
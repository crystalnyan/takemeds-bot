mod meds;
mod db;

use sqlx::sqlite::SqliteConnectOptions;
use sqlx::{Pool, Sqlite, SqlitePool};
use teloxide::{prelude::*, utils::command::BotCommands};

#[derive(Clone, Default)]
enum State {
    #[default]
    None
}

#[derive(BotCommands, Clone)]
#[command(rename_rule = "lowercase", description = "These commands are supported:")]
enum Command {
    #[command(description = "start")]
    Start,
    #[command(description = "add a new meds reminder")]
    AddMeds(String),
    #[command(description = "view your meds reminders")]
    ViewMeds,
    #[command(description = "list available commands")]
    Help
}

#[tokio::main]
async fn main() {
    let options = SqliteConnectOptions::new()
        .filename("db.sqlite3")
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(options).await.unwrap();

    db::create_meds_table(&pool).await;

    let command_handler = Update::filter_message()
        .filter_command::<Command>()
        .endpoint(answer);

    let handler = dptree::entry()
        .branch(command_handler);

    let bot = Bot::from_env();

    Dispatcher::builder(bot, handler)
        .dependencies(dptree::deps![pool])
        .enable_ctrlc_handler()
        .build()
        .dispatch()
        .await;
}

async fn answer(bot: Bot, msg: Message, cmd: Command, pool: Pool<Sqlite>) -> ResponseResult<()> {
    match cmd {
        Command::AddMeds(name) => {
            //bot.send_message(msg.chat.id, "What meds do you want to add?").await?;

            meds::Meds::add_to_db((msg.chat.id).0, name, pool).await;

            bot.send_message(msg.chat.id, "Meds added successfully!").await?
        },
        Command::ViewMeds => {
            let meds = meds::Meds::view_all((msg.chat.id).0, pool).await;

            let mut meds_list = String::new();

            for med in meds {
                meds_list.push_str(&format!("{}\n", med.name));
            }

            bot.send_message(msg.chat.id, meds_list).await?;
            bot.send_message(msg.chat.id, Command::descriptions().to_string()).await?
        },
        _ => bot.send_message(msg.chat.id, Command::descriptions().to_string()).await?

    };

    Ok(())
}
use sqlx::{Pool, Sqlite};

pub struct Meds {
    id: i32,
    chat_id: i64,
    name: String,
}

impl Meds {
    pub async fn add_to_db (chat_id: i64, name: String, pool: Pool<Sqlite>) {
        sqlx::query(
            r#"
        INSERT INTO meds (chat_id, name)
        VALUES (?, ?)
        "#)
            .bind(chat_id)
            .bind(name)
            .execute(&pool)
            .await
            .unwrap();
    }
}
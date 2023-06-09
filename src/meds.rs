use sqlx::{Pool, Row, Sqlite};

pub struct Meds {
    id: i32,
    chat_id: i64,
    pub name: String,
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

    pub async fn view_all (chat_id: i64, pool: Pool<Sqlite>) -> Vec<Meds> {
        sqlx::query(
            r#"
        SELECT * FROM meds
        WHERE chat_id = ?
        "#)
            .bind(chat_id)
            .fetch_all(&pool)
            .await
            .unwrap()
            .iter()
            .map(|row| Meds {
                id: row.try_get("id").unwrap(),
                chat_id: row.try_get("chat_id").unwrap(),
                name: row.try_get("name").unwrap()
            })
            .collect()
    }
}
use sqlx::{Pool, Sqlite};

pub async fn create_meds_table(pool: &Pool<Sqlite>) {
    sqlx::query(
        r#"
    CREATE TABLE IF NOT EXISTS meds (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    )
    "#)
        .execute(pool)
        .await
        .unwrap();
}
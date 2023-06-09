use sqlx::{Pool, Sqlite};

pub struct Meds {
    id: i32,
    name: String
}

impl Meds {
    pub fn new(id: i32, name: String) -> Self {
        Self {
            id,
            name
        }
    }

    pub fn id(&self) -> i32 {
        self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub async fn add_to_db (meds: &Meds, pool: Pool<Sqlite>) {
        sqlx::query(
            r#"
        INSERT INTO meds (id, name)
        VALUES (?, ?)
        "#)
            .bind(meds.id())
            .bind(meds.name())
            .execute(&pool)
            .await
            .unwrap();
    }
}
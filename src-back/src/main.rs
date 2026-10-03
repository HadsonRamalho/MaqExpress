use diesel_async::{
    AsyncPgConnection,
    pooled_connection::{AsyncDieselConnectionManager, ManagerConfig, deadpool::Pool},
};
use tracing::{error, info};

use crate::{server::establish_connection, shared::utils::get_database_url_from_env};

pub mod domain;
pub mod schema;
pub mod server;
pub mod shared;
pub mod tests;

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    tracing_subscriber::fmt::init();

    let db_url = get_database_url_from_env().ok();

    let mut config = ManagerConfig::default();
    config.custom_setup = Box::new(establish_connection);

    if db_url.is_none() {
        error!("DB_URL não está definida no env");
        return;
    }

    let mgr =
        AsyncDieselConnectionManager::<AsyncPgConnection>::new_with_config(db_url.unwrap(), config);
    let pool = Pool::builder(mgr).max_size(10).build().unwrap();

    let app = crate::server::new_init_routes(pool).await;
    let port = 3099;
    let route = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&route).await.unwrap();
    info!("Servidor rodando na porta {}", port);
    info!("Documentação disponível na rota http://{}/docs", route);
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<std::net::SocketAddr>(),
    )
    .await
    .unwrap();
}

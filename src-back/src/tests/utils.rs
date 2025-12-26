use diesel_async::{
    AsyncPgConnection,
    pooled_connection::{AsyncDieselConnectionManager, ManagerConfig, deadpool::Pool},
};
use hyper::StatusCode;
use reqwest::Response;
use serde_json::Value;
use tokio::net::TcpListener;
use tokio::spawn;
use tracing::error;

use crate::{
    controllers::utils::get_test_database_url_from_env,
    routes::{DbPool, establish_connection},
};

#[derive(Clone)]
pub struct TestApp {
    pub address: String,
    pool: DbPool,
}

pub async fn spawn_app() -> TestApp {
    let _ = tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .try_init();

    let db_url = get_test_database_url_from_env().ok();

    let mut config = ManagerConfig::default();
    config.custom_setup = Box::new(establish_connection);

    if db_url.is_none() {
        error!("DB_URL não está definida no env");
    }

    let mgr =
        AsyncDieselConnectionManager::<AsyncPgConnection>::new_with_config(db_url.unwrap(), config);
    let pool = Pool::builder(mgr).max_size(10).build().unwrap();

    let app = crate::routes::new_init_routes(pool.clone()).await;

    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();

    let local_addr = listener.local_addr().unwrap();
    let port = local_addr.port();
    let address = format!("http://127.0.0.1:{}", port);

    spawn(async move {
        axum::serve(
            tokio::net::TcpListener::from(listener),
            app.into_make_service_with_connect_info::<std::net::SocketAddr>(),
        )
        .await
        .unwrap();
    });

    TestApp { address, pool }
}

pub async fn obter_erro_body(response: Response) -> String {
    let erro_body = response.text().await.unwrap_or_default();
    erro_body
}

pub async fn verificar_status_esperado(
    esperado: StatusCode,
    recebido: StatusCode,
    response: Response,
) -> bool {
    if esperado != recebido {
        let erro_body = response.text().await.unwrap_or_default();

        panic!(
            "Esperado status [{}], recebido [{}].\nCorpo do erro: {}",
            esperado, recebido, erro_body
        );
    }
    true
}

pub async fn verificar_status_esperado_retornando_json(
    esperado: StatusCode,
    response: Response,
) -> Value {
    let recebido = response.status();

    if esperado != recebido {
        let erro_body = response.text().await.unwrap_or_default();

        panic!(
            "Esperado status [{}], recebido [{}].\nCorpo do erro: {}",
            esperado, recebido, erro_body
        );
    }

    response
        .json::<Value>()
        .await
        .expect("Falha ao deserializar JSON de sucesso")
}

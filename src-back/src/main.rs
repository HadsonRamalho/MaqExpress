pub mod controllers;
pub mod models;
pub mod routes;
pub mod schema;

#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = crate::routes::init_routes().await;
<<<<<<< HEAD
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3099").await.unwrap();
=======
    let port = 3099;
    let route = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&route).await.unwrap();
    info!("Servidor rodando na porta {}", port);
    info!("Documentação disponível na rota http://{}/docs", route);
>>>>>>> 4005f6e (feat: atualizando tipagem e validações de usuário)
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<std::net::SocketAddr>(),
    )
    .await
    .unwrap();
}

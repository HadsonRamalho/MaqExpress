pub mod e2e;
pub mod usuarios;
pub mod utils;

#[tokio::test]
async fn test_health_check() {
    let app = utils::spawn_app().await;

    let client = reqwest::Client::new();

    let response = client
        .get(format!("{}/api/common", app.address))
        .send()
        .await
        .expect("Falha na requisição");

    assert!(response.status().is_success());
}

use std::time::Instant;

use hyper::StatusCode;
use tracing::info;
use uuid::Uuid;

use crate::{controllers::utils::gerar_cpf_valido, tests::utils::verificar_status_esperado};

#[tokio::test]
pub async fn cadastrar_usuario() {
    let app = crate::tests::utils::spawn_app().await;
    let client = reqwest::Client::new();

    let email_teste = format!("teste_reqwest_{}@maqexpress.com", Uuid::new_v4());
    let senha_teste = "senha_super_secreta";
    let cpf_teste = gerar_cpf_valido();

    let instant = Instant::now();
    let response_cadastro = client
        .post(format!("{}/api/usuario/cadastrar", app.address))
        .json(&serde_json::json!({
            "nome": "  Hadson Teste  ",
            "email": email_teste,
            "cpf": cpf_teste,
            "senha": senha_teste,
            "tipo_login": "sistema"
        }))
        .send()
        .await
        .expect("Falha na requisição de cadastro");

    let status = response_cadastro.status();

    assert!(verificar_status_esperado(StatusCode::CREATED, status, response_cadastro).await);

    let elapsed = format!(
        "Teste de Cadastro de Usuário finalizado em {}ms ({}s)",
        instant.elapsed().as_millis(),
        instant.elapsed().as_secs_f64()
    );
    info!(elapsed);
}

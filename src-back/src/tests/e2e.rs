use std::time::Instant;

use hyper::StatusCode;
use tracing::info;
use uuid::{Uuid, uuid};

use crate::{
    controllers::utils::gerar_cpf_valido,
    tests::utils::{verificar_status_esperado, verificar_status_esperado_retornando_json},
};

#[tokio::test]
async fn test_ciclo_vida_usuario_completo() {
    info!("Iniciando teste E2E");
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

    let response_login = client
        .post(format!("{}/api/usuario/login", app.address))
        .json(&serde_json::json!({
            "email": email_teste,
            "senha": senha_teste
        }))
        .send()
        .await
        .expect("Falha na requisição de login");

    let body_login = crate::tests::utils::verificar_status_esperado_retornando_json(
        reqwest::StatusCode::OK,
        response_login,
    )
    .await;

    let token = body_login
        .get("token")
        .and_then(|t| t.as_str())
        .expect("Token não encontrado na resposta de login");

    println!("Token obtido com sucesso: {}", token);

    let novo_nome = "Hadson Atualizado Reqwest";

    let response_update = client
        .patch(format!("{}/api/usuario/atualizar", app.address))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "nome": novo_nome,
            "email": email_teste,
            "cpf": cpf_teste
        }))
        .send()
        .await
        .expect("Falha na requisição de atualização");

    assert!(
        verificar_status_esperado(StatusCode::OK, response_update.status(), response_update).await
    );

    let response_cadastro_endereco = client
        .post(format!("{}/api/endereco/cadastrar", app.address))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "logradouro": "Rua X",
            "bairro": "Bairro Y",
            "uf": "sp",
            "cidade": "Cidade Z",
            "numero": "123",
            "cep": "39600-000"
        }))
        .send()
        .await
        .expect("Falha na requisição de cadastro de endereço");

    assert!(
        verificar_status_esperado(
            StatusCode::CREATED,
            response_cadastro_endereco.status(),
            response_cadastro_endereco
        )
        .await
    );

    let elapsed = format!(
        "Teste E2E finalizado em {}ms ({}s)",
        instant.elapsed().as_millis(),
        instant.elapsed().as_secs_f64()
    );
    info!(elapsed);
}

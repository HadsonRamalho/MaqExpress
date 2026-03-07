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
    std::fs::create_dir_all("storage/contratos").ok();

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

    assert!(
        verificar_status_esperado(
            StatusCode::CREATED,
            status,
            response_cadastro,
            "cadastro_usuario"
        )
        .await
    );

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

    let response_perfil_privado = client
        .get(format!("{}/api/usuario/meu_perfil", app.address))
        .bearer_auth(token)
        .send()
        .await
        .expect("Falha na requisição de leitura do perfil privado");

    let body_perfil_privado = crate::tests::utils::verificar_status_esperado_retornando_json(
        reqwest::StatusCode::OK,
        response_perfil_privado,
    )
    .await;

    let id_publico = body_perfil_privado
        .get("id_publico")
        .and_then(|t| t.as_i64())
        .expect("id_publico não encontrado na resposta do perfil privado.");

    let response_perfil_publico = client
        .get(format!(
            "{}/api/usuario/perfil/?id={}",
            app.address, id_publico
        ))
        .bearer_auth(token)
        .send()
        .await
        .expect("Falha na requisição de leitura do perfil público");

    assert!(
        verificar_status_esperado(
            StatusCode::OK,
            response_perfil_publico.status(),
            response_perfil_publico,
            "perfil_publico"
        )
        .await
    );

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
        verificar_status_esperado(
            StatusCode::OK,
            response_update.status(),
            response_update,
            "atualizar_perfil"
        )
        .await
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
            response_cadastro_endereco,
            "cadastro_endereco"
        )
        .await
    );

    let response_cad_empresa = client
        .post(format!("{}/api/empresa/cadastrar", app.address))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "nome": "Empresa Teste E2E",
            "cnpj": "11.385.485/0001-03"
        }))
        .send()
        .await
        .expect("Erro requisição empresa");

    assert!(
        verificar_status_esperado(
            StatusCode::CREATED,
            response_cad_empresa.status(),
            response_cad_empresa,
            "cad_empresa"
        )
        .await
    );

    let empresas = client
        .get(format!("{}/api/empresa/listar", app.address))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro listar empresa")
        .json::<serde_json::Value>()
        .await
        .expect("Erro parse empresas");

    let id_empresa = empresas[0]["id"].as_str().unwrap();

    let response_cad_maquina = client
        .post(format!("{}/api/maquina/cadastrar", app.address))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "nome": "Máquina Teste 01",
            "descricao": "Desc",
            "numero_serie": "SN123",
            "id_empresa": id_empresa
        }))
        .send()
        .await
        .expect("Erro requisição máquina");

    assert!(
        verificar_status_esperado(
            StatusCode::CREATED,
            response_cad_maquina.status(),
            response_cad_maquina,
            "cad_maquina"
        )
        .await
    );

    let maquinas = client
        .get(format!("{}/api/maquina/listar", app.address))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro listar máquinas")
        .json::<serde_json::Value>()
        .await
        .expect("Erro parse máquinas");

    let id_maquina = maquinas[0]["id"].as_str().unwrap();

    let response_del_maquina = client
        .delete(format!(
            "{}/api/maquina/remover/{}",
            app.address, id_maquina
        ))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro delete máquina");

    assert_eq!(response_del_maquina.status(), StatusCode::NO_CONTENT);

    let response_del_empresa = client
        .delete(format!(
            "{}/api/empresa/remover/{}",
            app.address, id_empresa
        ))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro delete empresa");

    assert_eq!(response_del_empresa.status(), StatusCode::NO_CONTENT);

    let data_inicio = chrono::Utc::now().naive_utc();
    let data_fim = data_inicio + chrono::Duration::days(30);

    let response_solicitacao = client
        .post(format!("{}/api/solicitacao/criar", app.address))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "id_maquina": id_maquina,
            "data_inicio": data_inicio,
            "data_fim": data_fim
        }))
        .send()
        .await
        .expect("Erro ao criar solicitacao");

    assert!(
        verificar_status_esperado(
            StatusCode::CREATED,
            response_solicitacao.status(),
            response_solicitacao,
            "criar_solicitacao"
        )
        .await
    );

    let solicitacoes = client
        .get(format!("{}/api/solicitacao/listar", app.address))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro listar solicitacoes")
        .json::<serde_json::Value>()
        .await
        .unwrap();

    let id_solicitacao = solicitacoes[0]["id"].as_str().unwrap();

    let response_aprovacao = client
        .patch(format!(
            "{}/api/solicitacao/responder/{}",
            app.address, id_solicitacao
        ))
        .bearer_auth(token)
        .json(&serde_json::json!({
            "status": "Aprovada"
        }))
        .send()
        .await
        .expect("Erro ao aprovar");

    assert!(
        verificar_status_esperado(
            StatusCode::OK,
            response_aprovacao.status(),
            response_aprovacao,
            "aprovar_solicitacao"
        )
        .await
    );

    let contratos = client
        .get(format!("{}/api/solicitacao/contratos", app.address))
        .bearer_auth(token)
        .send()
        .await
        .expect("Erro ao listar contratos")
        .json::<serde_json::Value>()
        .await
        .unwrap();

    assert!(!contratos.as_array().unwrap().is_empty());
    assert_eq!(contratos[0]["id_solicitacao"], id_solicitacao);

    let path = format!("../../storage/contratos/contrato_{}.pdf", id_solicitacao);
    //  assert!(std::path::Path::new(&path).exists());

    let elapsed = format!(
        "Teste E2E finalizado em {}ms ({}s)",
        instant.elapsed().as_millis(),
        instant.elapsed().as_secs_f64()
    );
    info!(elapsed);
}

use axum::{
    Json,
    extract::{Path, State},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use uuid::Uuid;

use crate::{
    controllers::{jwt::extract_claims_from_header, utils::get_conn, validadores::JsonValidado},
    models::{
        self,
        solicitacoes::{
            AtualizarStatusSolicitacaoDto, Contrato, CriarSolicitacaoDto, SolicitacaoContrato,
            buscar_dados_contrato,
        },
    },
};

#[utoipa::path(
    post,
    path = "/solicitacao/criar",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 201),
        (status = 400),
        (status = 500, body = String)
    ),
)]
pub async fn api_criar_solicitacao(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<CriarSolicitacaoDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;

    let solicitacao = SolicitacaoContrato::novo(input, id_usuario);
    let conn = &mut get_conn(&pool).await?;

    match models::solicitacoes::criar_solicitacao(conn, &solicitacao).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    delete,
    path = "/solicitacao/remover/{id_solicitacao}",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 200),
        (status = 500, body = String)
    ),
    params(
        ("id_solicitacao" = String, Path)
    )
)]
pub async fn api_remover_solicitacao(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_solicitacao): Path<Uuid>,
    headers: HeaderMap,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;
    let id_usuario = extract_claims_from_header(State(pool), &headers)
        .await?
        .1
        .id;

    match models::solicitacoes::deletar_solicitacao(conn, &id_solicitacao, &id_usuario).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    patch,
    path = "/solicitacao/responder/{id_solicitacao}",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 200),
        (status = 500, body = String)
    ),
    params(
        ("id_solicitacao" = String, Path)
    ),
    request_body = AtualizarStatusSolicitacaoDto
)]
#[axum::debug_handler]
pub async fn api_responder_solicitacao(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_solicitacao): Path<Uuid>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<AtualizarStatusSolicitacaoDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let _ = extract_claims_from_header(State(pool), &headers).await?;

    let solicitacao =
        match models::solicitacoes::buscar_solicitacao_por_id(conn, &id_solicitacao).await {
            Ok(s) => s,
            Err(e) => return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
        };

    if let Err(e) =
        models::solicitacoes::atualizar_status_solicitacao(conn, &id_solicitacao, &input.status)
            .await
    {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e)));
    }

    if input.status == "Aprovada" {
        if let Err(e) = gerar_e_salvar_contrato_pdf(conn, &solicitacao).await {
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e)));
        }

        if let Err(e) =
            models::maquinas::atualizar_status_ativo_maquina(conn, &solicitacao.id_maquina, false)
                .await
        {
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e)));
        }
    }

    Ok(StatusCode::OK)
}

#[utoipa::path(
    get,
    path = "/solicitacao/listar",
    security(("bearer_auth" = [])),
    responses((status = 200))
)]
pub async fn api_listar_minhas_solicitacoes(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
) -> Result<(StatusCode, Json<Vec<SolicitacaoContrato>>), (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match models::solicitacoes::buscar_todas_solicitacoes_usuario(conn, &id_usuario).await {
        Ok(lista) => Ok((StatusCode::OK, Json(lista))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    get,
    path = "/solicitacao/contratos",
    security(("bearer_auth" = [])),
    responses((status = 200))
)]
pub async fn api_listar_meus_contratos(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
) -> Result<(StatusCode, Json<Vec<Contrato>>), (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match models::solicitacoes::buscar_meus_contratos(conn, &id_usuario).await {
        Ok(lista) => Ok((StatusCode::OK, Json(lista))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

use printpdf::*;
use std::fs;
use std::io::Cursor;

fn wrap_text(text: &str, max_chars: usize) -> Vec<String> {
    let mut lines = Vec::new();
    for paragraph in text.split('\n') {
        let mut current_line = String::new();
        for word in paragraph.split_whitespace() {
            if current_line.len() + word.len() + 1 > max_chars {
                lines.push(current_line.clone());
                current_line = word.to_string();
            } else {
                if !current_line.is_empty() {
                    current_line.push(' ');
                }
                current_line.push_str(word);
            }
        }
        lines.push(current_line);
    }
    lines
}

pub async fn gerar_e_salvar_contrato_pdf(
    conn: &mut AsyncPgConnection,
    solicitacao: &SolicitacaoContrato,
) -> Result<(), String> {
    let start = tokio::time::Instant::now();
    let d = buscar_dados_contrato(conn, &solicitacao.id).await?;
    let id_s = solicitacao.id;

    let file_path = tokio::task::spawn_blocking(move || {
        let template_path = "assets/templates/contrato_locacao.txt";
        let mut t =
            fs::read_to_string(template_path).map_err(|_| "Template não encontrado".to_string())?;

        let mapping = [
            ("{{nome_locador}}", d.locador.nome.clone()),
            ("{{doc_tipo_locador}}", "CNPJ".to_string()),
            ("{{doc_locador}}", d.locador.cnpj.clone()),
            ("{{rua_locador}}", d.endereco_locador.logradouro.clone()),
            ("{{cidade_locador}}", d.endereco_locador.cidade.clone()),
            ("{{uf_locador}}", d.endereco_locador.uf.clone()),
            ("{{num_locador}}", d.endereco_locador.numero.clone()),
            (
                "{{comp_locador}}",
                d.endereco_locador.complemento.unwrap_or_default(),
            ),
            ("{{nome_locatario}}", d.locatario.nome.clone()),
            ("{{doc_tipo_locatario}}", "CPF".to_string()),
            ("{{doc_locatario}}", d.locatario.cpf.clone()),
            ("{{rua_locatario}}", d.endereco_locatario.logradouro.clone()),
            ("{{cidade_locatario}}", d.endereco_locatario.cidade.clone()),
            ("{{uf_locatario}}", d.endereco_locatario.uf.clone()),
            ("{{num_locatario}}", d.endereco_locatario.numero.clone()),
            (
                "{{comp_locatario}}",
                d.endereco_locatario.complemento.unwrap_or_default(),
            ),
            ("{{maquina_nome}}", d.maquina.nome.clone()),
            ("{{maquina_serie}}", d.maquina.numero_serie.clone()),
            ("{{maquina_desc}}", d.maquina.descricao.clone()),
            ("{{rua_retirada}}", d.endereco_locador.logradouro.clone()),
            ("{{num_retirada}}", d.endereco_locador.numero.clone()),
            ("{{bairro_retirada}}", d.endereco_locador.bairro.clone()),
            ("{{cidade_retirada}}", d.endereco_locador.cidade.clone()),
            ("{{uf_retirada}}", d.endereco_locador.uf.clone()),
            (
                "{{data_inicio}}",
                d.solicitacao.data_inicio.format("%d/%m/%Y").to_string(),
            ),
            (
                "{{data_fim}}",
                d.solicitacao.data_fim.format("%d/%m/%Y").to_string(),
            ),
            (
                "{{data_hoje}}",
                chrono::Utc::now().format("%d/%m/%Y").to_string(),
            ),
            ("{{valor_total}}", "A definir em anexo".to_string()),
            ("{{banco_nome}}", "Banco do Brasil".to_string()),
            ("{{banco_ag}}", "1234-X".to_string()),
            ("{{banco_cc}}", "56789-0".to_string()),
        ];

        for (key, val) in mapping {
            t = t.replace(key, &val);
        }

        let (doc, page1, layer1) = PdfDocument::new("Contrato", Mm(210.0), Mm(297.0), "Camada 1");
        let font_reg = doc
            .add_external_font(Cursor::new(include_bytes!(
                "../../assets/fonts/Roboto-Regular.ttf"
            )))
            .unwrap();
        let font_bold = doc
            .add_external_font(Cursor::new(include_bytes!(
                "../../assets/fonts/Roboto-Bold.ttf"
            )))
            .unwrap();

        let mut current_layer = doc.get_page(page1).get_layer(layer1);
        let mut current_y = 280.0;
        let margin_x = 20.0;

        for line in t.lines() {
            let wrapped = crate::controllers::solicitacoes::wrap_text(line, 80);
            for w_line in wrapped {
                if current_y < 20.0 {
                    let (np, nl) = doc.add_page(Mm(210.0), Mm(297.0), "Nova Pagina");
                    current_layer = doc.get_page(np).get_layer(nl);
                    current_y = 280.0;
                }
                let font = if line.starts_with("CLÁUSULA") || line.starts_with("CONTRATO") {
                    &font_bold
                } else {
                    &font_reg
                };
                let size = if line.starts_with("CONTRATO") {
                    14.0
                } else {
                    10.0
                };
                current_layer.use_text(w_line, size, Mm(margin_x), Mm(current_y), font);
                current_y -= 5.0;
            }
            current_y -= 2.0;
        }

        let dir = "storage/contratos";
        fs::create_dir_all(dir).ok();
        let path = format!("{}/contrato_{}.pdf", dir, id_s);
        let file = std::fs::File::create(&path).map_err(|e| e.to_string())?;
        doc.save(&mut std::io::BufWriter::new(file))
            .map_err(|e| e.to_string())?;

        Ok::<String, String>(path)
    })
    .await
    .map_err(|e| e.to_string())??;

    let duration = start.elapsed().as_millis() as i64;

    let novo_contrato = Contrato {
        id: Uuid::new_v4(),
        id_solicitacao: solicitacao.id,
        caminho_arquivo: file_path,
        data_geracao: chrono::Utc::now().naive_utc(),
        tempo_geracao_ms: duration,
    };

    use crate::schema::contratos::dsl::*;
    diesel::insert_into(contratos)
        .values(&novo_contrato)
        .execute(conn)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

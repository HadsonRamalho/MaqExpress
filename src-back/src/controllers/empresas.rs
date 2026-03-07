use axum::{
    Json,
    extract::{Path, State},
};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use uuid::Uuid;

use crate::{
    controllers::{jwt::extract_claims_from_header, utils::get_conn, validadores::JsonValidado},
    models::{
        self,
        empresas::{AtualizarEmpresa, AtualizarEmpresaDto, CadastrarEmpresa, Empresa},
    },
};

#[utoipa::path(
    post,
    path = "/empresa/cadastrar",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 201, description = "Empresa cadastrada com sucesso"),
        (status = 400, description = "Dados inválidos"),
        (status = 500, description = "Erro interno no servidor", body = String)
    ),
    request_body = CadastrarEmpresa
)]
pub async fn api_register_empresa(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<CadastrarEmpresa>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;

    let empresa = Empresa::novo(input, id_usuario);
    let conn = &mut get_conn(&pool).await?;

    match models::empresas::cadastrar_empresa(conn, &empresa).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    patch,
    path = "/empresa/atualizar/{id_empresa}",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 200, description = "Dados da empresa atualizados com sucesso"),
        (status = 500, description = "Empresa não encontrada ou erro interno", body = String)
    ),
    params(
        ("id_empresa" = Uuid, Path, description = "UUID da Empresa")
    ),
    request_body = AtualizarEmpresaDto
)]
pub async fn api_update_empresa_data(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_empresa): Path<Uuid>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<AtualizarEmpresaDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let id_usuario = extract_claims_from_header(State(pool), &headers)
        .await?
        .1
        .id;

    let empresa_atualizada = AtualizarEmpresa::new(id_empresa, id_usuario, input);

    match models::empresas::atualizar_empresa(conn, &empresa_atualizada).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

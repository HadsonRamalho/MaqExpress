use axum::{
    Json,
    extract::{Path, State},
};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use uuid::Uuid;

use crate::domain::empresas::model::{
    AtualizarEmpresa, AtualizarEmpresaDto, CadastrarEmpresa, Empresa,
};
use crate::shared::jwt::extract_claims_from_header;
use crate::shared::utils::get_conn;
use crate::shared::validadores::JsonValidado;

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

    match crate::domain::empresas::model::cadastrar_empresa(conn, &empresa).await {
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
        ("id_empresa" = String, Path, description = "UUID da Empresa")
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

    match crate::domain::empresas::model::atualizar_empresa(conn, &empresa_atualizada).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    get,
    path = "/empresa/listar",
    security(("bearer_auth" = [])),
    responses(
        (status = 200, description = "Lista de empresas do usuário"),
        (status = 500, description = "Erro interno", body = String)
    )
)]
pub async fn api_list_empresas(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
) -> Result<(StatusCode, Json<Vec<Empresa>>), (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match crate::domain::empresas::model::buscar_empresas_usuario(conn, &id_usuario).await {
        Ok(lista) => Ok((StatusCode::OK, Json(lista))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    get,
    path = "/empresa/detalhes/{id_empresa}",
    security(("bearer_auth" = [])),
    responses(
        (status = 200, description = "Detalhes da empresa"),
        (status = 404, description = "Empresa não encontrada")
    ),
    params(("id_empresa" = String, Path, description = "UUID da Empresa"))
)]
pub async fn api_get_empresa_details(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_empresa): Path<Uuid>,
    headers: HeaderMap,
) -> Result<(StatusCode, Json<Empresa>), (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    let empresa = crate::domain::empresas::model::buscar_empresa_por_id(conn, &id_empresa)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(e)))?;

    if empresa.id_usuario != id_usuario {
        return Err((StatusCode::FORBIDDEN, Json("Acesso negado".to_string())));
    }

    Ok((StatusCode::OK, Json(empresa)))
}

#[utoipa::path(
    delete,
    path = "/empresa/remover/{id_empresa}",
    security(("bearer_auth" = [])),
    responses(
        (status = 204, description = "Empresa removida com sucesso"),
        (status = 500, description = "Erro ao remover")
    ),
    params(("id_empresa" = String, Path, description = "UUID da Empresa"))
)]
pub async fn api_delete_empresa(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_empresa): Path<Uuid>,
    headers: HeaderMap,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match crate::domain::empresas::model::deletar_empresa(conn, &id_empresa, &id_usuario).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

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
        maquinas::{AtualizarMaquina, AtualizarMaquinaDto, CadastrarMaquina, Maquina},
    },
};

#[utoipa::path(
    post,
    path = "/maquina/cadastrar",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 201, description = "Máquina cadastrada com sucesso"),
        (status = 400, description = "Dados inválidos"),
        (status = 500, description = "Erro interno no servidor", body = String)
    ),
    request_body = CadastrarMaquina
)]
pub async fn api_register_maquina(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<CadastrarMaquina>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;

    let maquina = Maquina::novo(input, id_usuario);
    let conn = &mut get_conn(&pool).await?;

    match models::maquinas::cadastrar_maquina(conn, &maquina).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    patch,
    path = "/maquina/atualizar/{id_maquina}",
    security(
        ("bearer_auth" = [])
    ),
    responses(
        (status = 200, description = "Dados da máquina atualizados com sucesso"),
        (status = 500, description = "Máquina não encontrada ou erro interno", body = String)
    ),
    params(
        ("id_maquina" = Uuid, Path, description = "UUID da Máquina")
    ),
    request_body = AtualizarMaquinaDto
)]
pub async fn api_update_maquina_data(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_maquina): Path<Uuid>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<AtualizarMaquinaDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let id_usuario = extract_claims_from_header(State(pool), &headers)
        .await?
        .1
        .id;

    let maquina_atualizada = AtualizarMaquina::new(id_maquina, id_usuario, input);

    match models::maquinas::atualizar_maquina(conn, &maquina_atualizada).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

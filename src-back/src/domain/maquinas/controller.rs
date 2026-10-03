use axum::{
    Json,
    extract::{Path, State},
};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use uuid::Uuid;

use crate::domain::maquinas::model::{
    AtualizarMaquina, AtualizarMaquinaDto, CadastrarMaquina, Maquina,
};
use crate::shared::jwt::extract_claims_from_header;
use crate::shared::utils::get_conn;
use crate::shared::validadores::JsonValidado;

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

    match crate::domain::maquinas::model::cadastrar_maquina(conn, &maquina).await {
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
        ("id_maquina" = String, Path, description = "UUID da Máquina")
    ),
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

    match crate::domain::maquinas::model::atualizar_maquina(conn, &maquina_atualizada).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    get,
    path = "/maquina/listar",
    security(("bearer_auth" = [])),
    responses(
        (status = 200, description = "Lista de máquinas do usuário"),
    )
)]
pub async fn api_list_maquinas(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
) -> Result<(StatusCode, Json<Vec<Maquina>>), (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match crate::domain::maquinas::model::buscar_maquinas_usuario(conn, &id_usuario).await {
        Ok(lista) => Ok((StatusCode::OK, Json(lista))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(
    delete,
    path = "/maquina/remover/{id_maquina}",
    security(("bearer_auth" = [])),
    params(("id_maquina" = String, Path)),
    responses((status = 204, description = "Removido"))
)]
pub async fn api_delete_maquina(
    State(pool): State<Pool<AsyncPgConnection>>,
    Path(id_maquina): Path<Uuid>,
    headers: HeaderMap,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id_usuario = extract_claims_from_header(State(pool.clone()), &headers)
        .await?
        .1
        .id;
    let conn = &mut get_conn(&pool).await?;

    match crate::domain::maquinas::model::deletar_maquina(conn, &id_maquina, &id_usuario).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

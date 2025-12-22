use axum::{Json, extract::State};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use pwhash::bcrypt::verify;

use crate::{
    controllers::{
        jwt::{JsonValidado, extract_claims_from_header, generate_jwt},
        utils::get_conn,
    },
    models::{
        self,
        error::ApiError,
        usuarios::{AtualizarUsuario, CadastrarUsuario, InfoLoginUsuario, LoginUsuario, Usuario},
    },
};
#[utoipa::path(post, path = "/usuario/cadastrar", responses((status = CREATED, body = CadastrarUsuario)))]
pub async fn api_register_user(
    State(pool): State<Pool<AsyncPgConnection>>,
    JsonValidado(input): JsonValidado<CadastrarUsuario>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let user = Usuario::from(input);

    let conn = &mut get_conn(&pool).await?;

    match models::usuarios::cadastrar_usuario(conn, &user).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

#[utoipa::path(post, path = "/user/login", responses((status = OK, body = LoginUsuario)))]
#[axum::debug_handler]
pub async fn api_login_user(
    State(pool): State<Pool<AsyncPgConnection>>,
    JsonValidado(input): JsonValidado<LoginUsuario>,
) -> Result<(StatusCode, Json<String>), (StatusCode, Json<String>)> {
    let user_input = input;

    let conn = &mut get_conn(&pool).await?;

    let user = match models::usuarios::buscar_usuario_por_email(conn, &user_input.email).await {
        Ok(user) => user,
        Err(_) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::EmailNotFound.to_string()),
            ));
        }
    };

    if !user.ativo || user.data_delecao.is_some() {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiError::NotActiveUser.to_string()),
        ));
    }

    let token = generate_jwt(InfoLoginUsuario::from(user.clone()))?;

    if verify(user_input.senha, &user.senha) {
        return Ok((StatusCode::OK, Json(token)));
    }

    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(ApiError::InvalidPassword.to_string()),
    ))
}

pub async fn api_update_user_data(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<AtualizarUsuario>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let id = extract_claims_from_header(&headers).await?.1.id;

    let conn = &mut get_conn(&pool).await?;

    match models::usuarios::buscar_usuario_por_id(conn, &id).await {
        Err(_) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::UserNotFound.to_string()),
            ));
        }
        _ => {}
    };

    let update_data = input;

    match models::usuarios::atualizar_usuario(conn, &id, &update_data).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))),
    }
}

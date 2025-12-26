use axum::{Json, extract::State};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use pwhash::bcrypt::verify;

use crate::{
    controllers::{
        jwt::{extract_claims_from_header, generate_jwt},
        utils::get_conn,
        validadores::JsonValidado,
    },
    models::{
        self,
        error::ApiError,
        usuarios::{
            AtualizarUsuario, AtualizarUsuarioDto, CadastrarUsuario, InfoLoginUsuario,
            LoginUsuario, RetornoLogin, Usuario,
        },
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

#[utoipa::path(post, path = "/usuario/login", responses((status = OK, body = LoginUsuario)))]
#[axum::debug_handler]
pub async fn api_login_user(
    State(pool): State<Pool<AsyncPgConnection>>,
    JsonValidado(input): JsonValidado<LoginUsuario>,
) -> Result<(StatusCode, Json<RetornoLogin>), (StatusCode, Json<String>)> {
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

    if verify(user_input.senha.to_string(), &user.senha) {
        return Ok((
            StatusCode::OK,
            Json(RetornoLogin {
                token,
                nome: user.nome,
            }),
        ));
    }

    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(ApiError::InvalidPassword.to_string()),
    ))
}

#[utoipa::path(patch, path = "/usuario/atualizar", responses((status = OK, body = AtualizarUsuarioDto)))]
pub async fn api_update_user_data(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<AtualizarUsuarioDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let id = extract_claims_from_header(State(pool), &headers)
        .await?
        .1
        .id;

    match models::usuarios::buscar_usuario_por_id(conn, &id).await {
        Err(_) => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::UserNotFound.to_string()),
            ));
        }
        _ => {}
    };

    let usuario = AtualizarUsuario::new(id, input);

    match models::usuarios::atualizar_usuario(conn, &usuario).await {
        Ok(_) => Ok(StatusCode::OK),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string()))),
    }
}

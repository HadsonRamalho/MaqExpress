use crate::domain::usuarios::model::InfoLoginUsuario;
use crate::shared::claims::Claims;
use crate::shared::error::ApiError;
use crate::shared::utils::get_conn;
use axum::extract::State;
use axum::{Json, body::Body, extract::Request, middleware::Next, response::Response};
use diesel_async::AsyncPgConnection;
use diesel_async::pooled_connection::deadpool::Pool;
use dotenvy::dotenv;
use hyper::{HeaderMap, StatusCode};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode};
use std::env;
use tracing::error;

pub async fn jwt_auth(
    State(pool): State<Pool<AsyncPgConnection>>,
    req: Request<Body>,
    next: Next,
) -> Result<Response, (StatusCode, Json<String>)> {
    let _ = extract_claims_from_header(State(pool), req.headers()).await?;
    Ok(next.run(req).await)
}

pub async fn extract_claims_from_header(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: &HeaderMap,
) -> Result<(String, Claims), (StatusCode, Json<String>)> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|value| value.to_str().ok());

    let token = match auth_header {
        Some(header) if header.starts_with("Bearer ") => {
            Some(header.trim_start_matches("Bearer ").trim())
        }
        _ => None,
    };

    let token = match token {
        Some(t) => t,
        None => {
            error!("Token não está presente no header");
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(ApiError::InvalidAuthorizationToken.to_string()),
            ));
        }
    };

    let secret = get_jwt_secret_from_env()?;

    let decoded = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    );

    let claims = match decoded {
        Ok(data) => (token.to_string(), data.claims),
        Err(e) => {
            error!("Falha ao obter as claims do token: {}", e);
            return Err((
                StatusCode::UNAUTHORIZED,
                Json(ApiError::InvalidAuthorizationToken.to_string()),
            ));
        }
    };

    let conn = &mut get_conn(&pool).await?;

    let _ = validate_claims(conn, &claims.1).await?;

    Ok(claims)
}

pub async fn validate_claims(
    conn: &mut AsyncPgConnection,
    claims: &Claims,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let mut errors = vec![];

    if claims.id.to_string().trim().is_empty() {
        errors.push("Invalid ID".to_string())
    }
    if claims.id_publico.to_string().is_empty() {
        errors.push("Invalid Public ID".to_string())
    }
    if claims.email.is_empty() {
        errors.push("Invalid E-mail".to_string())
    }
    if claims.exp == 0 {
        errors.push("Invalid expiration date".to_string())
    }

    let now = chrono::Utc::now().timestamp() as usize;
    if claims.exp < now {
        errors.push("Expired token".to_string())
    }

    if errors.is_empty() {
        return Ok(StatusCode::OK);
    }

    match crate::domain::usuarios::model::buscar_usuario_por_id(conn, &claims.id).await {
        Err(e) => {
            errors.push(format!("Usuário não encontrado: {}", e));
        }
        _ => {}
    }

    error!("Múltiplas falhas ao decodificar claims");
    Err((
        StatusCode::UNAUTHORIZED,
        Json(ApiError::MultipleAuthorizationErrors(errors).to_string()),
    ))
}

pub fn get_jwt_secret_from_env() -> Result<String, (StatusCode, Json<String>)> {
    dotenv().ok();

    match env::var("JWT_SECRET") {
        Ok(secret) => Ok(secret),
        Err(error) => {
            error!("Erro ao obter JWT_SECRET do env");
            return Err((
                StatusCode::SERVICE_UNAVAILABLE,
                Json(ApiError::DatabaseConnection(error.to_string()).to_string()),
            ));
        }
    }
}

pub fn generate_jwt(input: InfoLoginUsuario) -> Result<String, (StatusCode, Json<String>)> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(1))
        .expect("Invalid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        id: input.id,
        email: input.email.to_string(),
        exp: expiration,
        id_publico: input.id_publico,
        tipo_usuario: input.tipo_usuario,
    };

    let secret = get_jwt_secret_from_env()?;

    match jsonwebtoken::encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    ) {
        Ok(token) => Ok(token),
        Err(e) => {
            error!("Erro ao codificar o token JWT");

            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::CreateToken(e.to_string()).to_string()),
            ))
        }
    }
}

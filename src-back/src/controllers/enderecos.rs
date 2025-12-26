use axum::{Json, extract::State};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use hyper::{HeaderMap, StatusCode};
use uuid::Uuid;

use crate::{
    controllers::{jwt::extract_claims_from_header, utils::get_conn, validadores::JsonValidado},
    models::{
        self,
        enderecos::{CadastrarEnderecoDto, Endereco},
    },
};

#[utoipa::path(post, path = "/enderecos/cadastrar", responses((status = CREATED, body = CadastrarEnderecoDto)))]
#[axum::debug_handler]
pub async fn api_cadastrar_endereco(
    State(pool): State<Pool<AsyncPgConnection>>,
    headers: HeaderMap,
    JsonValidado(input): JsonValidado<CadastrarEnderecoDto>,
) -> Result<StatusCode, (StatusCode, Json<String>)> {
    let conn = &mut get_conn(&pool).await?;

    let id = extract_claims_from_header(State(pool), &headers)
        .await?
        .1
        .id;

    let endereco = input;
    let endereco = Endereco {
        id: Uuid::new_v4(),
        id_usuario: id,
        cep: endereco.cep.into(),
        uf: endereco.uf.into(),
        logradouro: endereco.logradouro.into(),
        bairro: endereco.bairro.into(),
        cidade: endereco.cidade.into(),
        numero: endereco.numero.into(),
        complemento: endereco.complemento.map(|t| t.into()),
        data_cadastro: chrono::Utc::now().naive_utc(),
    };

    match models::enderecos::cadastrar_endereco(conn, endereco).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, Json(e))),
    }
}

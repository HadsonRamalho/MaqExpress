use axum::routing::post;
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use utoipa_axum::router::OpenApiRouter;

use crate::controllers::enderecos::api_cadastrar_endereco;

pub async fn rotas_endereco() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    let routes = OpenApiRouter::new().route("/cadastrar", post(api_cadastrar_endereco));

    routes
}

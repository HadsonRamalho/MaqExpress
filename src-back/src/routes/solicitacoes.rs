use crate::controllers::solicitacoes::*;
use axum::routing::{delete, get, patch, post};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use utoipa_axum::router::OpenApiRouter;

pub async fn rotas_solicitacao() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    OpenApiRouter::new()
        .route("/criar", post(api_criar_solicitacao))
        .route("/listar", get(api_listar_minhas_solicitacoes))
        .route("/contratos", get(api_listar_meus_contratos))
        .route("/remover/{id_solicitacao}", delete(api_remover_solicitacao))
        .route(
            "/responder/{id_solicitacao}",
            patch(api_responder_solicitacao),
        )
}

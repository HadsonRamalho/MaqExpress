use axum::routing::get;
use utoipa_axum::router::OpenApiRouter;
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use crate::controllers::relatorios::api_performance_report;

pub fn rotas_relatorio() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    OpenApiRouter::new()
        .route("/performance", get(api_performance_report))
}

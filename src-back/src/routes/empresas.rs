use axum::routing::{delete, get, patch, post};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use utoipa_axum::router::OpenApiRouter;

use crate::controllers::empresas::{
    api_delete_empresa, api_get_empresa_details, api_list_empresas, api_register_empresa,
    api_update_empresa_data,
};

pub async fn rotas_empresa() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    OpenApiRouter::new()
        .route("/cadastrar", post(api_register_empresa))
        .route("/listar", get(api_list_empresas))
        .route("/detalhes/{id_empresa}", get(api_get_empresa_details))
        .route("/atualizar/{id_empresa}", patch(api_update_empresa_data))
        .route("/remover/{id_empresa}", delete(api_delete_empresa))
}

use axum::routing::{delete, get, patch, post};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use utoipa_axum::router::OpenApiRouter;

use crate::domain::maquinas::controller::{
    api_delete_maquina, api_list_maquinas, api_register_maquina, api_update_maquina_data,
};

pub async fn rotas_maquina() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    OpenApiRouter::new()
        .route("/cadastrar", post(api_register_maquina))
        .route("/listar", get(api_list_maquinas))
        .route("/atualizar{/id_maquina}", patch(api_update_maquina_data))
        .route("/remover/{id_maquina}", delete(api_delete_maquina))
}

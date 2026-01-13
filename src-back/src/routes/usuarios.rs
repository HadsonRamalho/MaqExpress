use axum::routing::{get, patch, post};
use diesel_async::{AsyncPgConnection, pooled_connection::deadpool::Pool};
use utoipa_axum::router::OpenApiRouter;

use crate::controllers::usuarios::{
    api_buscar_perfil_privado_usuario, api_buscar_perfil_publico_usuario, api_login_user,
    api_register_user, api_update_user_data,
};

pub async fn rotas_usuario() -> OpenApiRouter<Pool<AsyncPgConnection>> {
    let routes = OpenApiRouter::new()
        .route("/cadastrar", post(api_register_user))
        .route("/login", post(api_login_user))
        .route("/atualizar", patch(api_update_user_data))
        .route("/meu_perfil", get(api_buscar_perfil_privado_usuario))
        .route("/perfil/", get(api_buscar_perfil_publico_usuario));
    //.route("/meus_equipamentos", todo!());

    routes
}

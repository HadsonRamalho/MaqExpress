use utoipa::{
    OpenApi,
    openapi::{self, Contact},
};

use crate::models::usuarios::{CadastrarUsuario, LoginUsuario};

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::controllers::usuarios::api_register_user,
        crate::controllers::usuarios::api_login_user,
        crate::controllers::usuarios::api_update_user_data,
        crate::controllers::enderecos::api_cadastrar_endereco
    ),
    components(schemas(CadastrarUsuario, LoginUsuario))
)]
pub struct ApiDoc;

pub fn get_api_docs() -> openapi::OpenApi {
    let mut docs = ApiDoc::openapi();
    let mut contact = Contact::new();
    contact.email = Some("hadsonramalho@gmail.com".to_string());
    contact.name = Some("Hadson Ramalho".to_string());
    contact.url = Some("https://github.com/HadsonRamalho".to_string());
    docs.info.contact = Some(contact);
    docs.info.license = None;
    docs.info.title = "MaqExpress API".to_string();
    docs.info.version = "2.0.0".to_string();
    docs.info.extensions = None;
    docs.info.terms_of_service = None;
    docs.external_docs = None;

    docs
}

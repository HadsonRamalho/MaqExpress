use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug, Serialize)]
pub enum ApiError {
    #[error("Erro processando a requisição: {0}")]
    Request(String),

    #[error("Erro ao tentar conectar ao banco de dados: {0}")]
    DatabaseConnection(String),

    #[error("Token de autorização inválido")]
    InvalidAuthorizationToken,

    #[error("Múltiplos erros ao validar o token de autorização: {0:?}")]
    MultipleAuthorizationErrors(Vec<String>),

    #[error("Ocorreu um erro no banco de dados: {0}")]
    Database(String),

    #[error("Falha ao criar o token de autenticação: {0}")]
    CreateToken(String),

    #[error("Campos inválidos na requisição")]
    InvalidData,

    #[error("E-mail inválido fornecido")]
    InvalidEmail,

    #[error("Usuário não encontrado pelo e-mail")]
    EmailNotFound,

    #[error("Usuário não está ativo")]
    NotActiveUser,

    #[error("Senha inválida")]
    InvalidPassword,

    #[error("URL do frontend não está presente")]
    FrontendUrl,

    #[error("Usuário não encontrado")]
    UserNotFound,
}

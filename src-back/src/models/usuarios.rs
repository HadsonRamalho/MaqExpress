use crate::{
    controllers::{
        jwt::Sanitize,
        utils::{format_document, password_hash, random_public_id},
    },
    models::error::ApiError,
    schema::usuarios,
};
use chrono::NaiveDateTime;
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable},
    result::{DatabaseErrorKind, Error},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use tracing::error;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;
use validator::ValidateEmail;

#[derive(DbEnum, Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::TipoUsuario"]
pub enum TipoUsuario {
    Admin,
    Usuario,
}

#[derive(Queryable, Insertable, AsChangeset, Serialize, Deserialize, Debug, Clone)]
#[diesel(table_name = usuarios)]
pub struct Usuario {
    pub id: Uuid,
    pub id_publico: i32,
    pub nome: String,
    pub email: String,
    pub cpf: String,
    pub senha: String,
    pub tipo_login: String,
    pub tipo_usuario: TipoUsuario,
    pub ativo: bool,
    pub data_cadastro: NaiveDateTime,
    pub data_atualizacao: NaiveDateTime,
    pub data_delecao: Option<NaiveDateTime>,
}

pub struct InfoLoginUsuario {
    pub id: Uuid,
    pub id_publico: i32,
    pub email: String,
    pub tipo_usuario: TipoUsuario,
}

impl From<Usuario> for InfoLoginUsuario {
    fn from(input: Usuario) -> Self {
        Self {
            id: input.id,
            id_publico: input.id_publico,
            email: input.email,
            tipo_usuario: input.tipo_usuario,
        }
    }
}

#[derive(Serialize, Deserialize, ToSchema, Validate)]
pub struct CadastrarUsuario {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: String,
    #[validate(email(message = "E-mail inválido"))]
    pub email: String,
    #[validate(length(min = 11, max = 14))]
    pub cpf: String,
    #[validate(length(min = 6, message = "Senha muito curta"))]
    pub senha: String,
    pub tipo_login: String,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct AtualizarUsuario {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: String,
    #[validate(email(message = "E-mail inválido"))]
    pub email: String,
    #[validate(length(min = 11, max = 14))]
    pub cpf: String,
}

impl Sanitize for AtualizarUsuario {
    fn sanitize(&mut self) {
        self.email = self.email.trim().to_lowercase();
        self.nome = self.nome.trim().to_string();
        self.cpf = format_document(&self.cpf).unwrap_or(self.cpf.clone());
    }
}

impl CadastrarUsuario {
    pub fn validar_campos(self: &Self) -> bool {
        if self.cpf.trim().is_empty()
            || self.nome.trim().is_empty()
            || self.email.trim().is_empty()
            || self.senha.trim().is_empty()
            || self.tipo_login.trim().is_empty()
            || !self.email.validate_email()
        {
            error!("Ao menos um campo está vazio ao validar o cadastro do usuário.");
            return false;
        }
        true
    }

    pub fn tratar_campos(self: &mut Self) -> Result<(), String> {
        self.email = self.email.trim().to_string();
        self.nome = self.nome.trim().to_string();
        self.senha = password_hash(self.senha.trim());
        self.tipo_login = self.tipo_login.trim().to_string();
        self.cpf = match format_document(&self.cpf) {
            Ok(cpf) => cpf,
            Err(e) => return Err(e),
        };

        Ok(())
    }
}

impl From<CadastrarUsuario> for Usuario {
    fn from(input: CadastrarUsuario) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_publico: random_public_id(),
            nome: input.nome,
            email: input.email,
            cpf: input.cpf,
            senha: input.senha,
            tipo_login: input.tipo_login,
            tipo_usuario: TipoUsuario::Usuario,
            ativo: true,
            data_cadastro: chrono::Utc::now().naive_utc(),
            data_atualizacao: chrono::Utc::now().naive_utc(),
            data_delecao: None,
        }
    }
}

#[derive(Serialize, Deserialize, ToSchema, Validate)]
pub struct LoginUsuario {
    #[validate(email(message = "E-mail inválido"))]
    pub email: String,
    pub senha: String,
}

impl LoginUsuario {
    pub fn validar_campos(self: &Self) -> Result<(), String> {
        if self.email.trim().is_empty() || self.senha.trim().is_empty() {
            return Err(ApiError::InvalidData.to_string());
        }
        if !self.email.validate_email() {
            return Err(ApiError::InvalidEmail.to_string());
        }
        Ok(())
    }

    pub fn tratar_campos(self: &mut Self) {
        self.email = self.email.trim().to_string();
        self.senha = self.senha.trim().to_string();
    }
}

impl Sanitize for LoginUsuario {
    fn sanitize(&mut self) {
        self.email = self.email.trim().to_lowercase();
        self.senha = self.senha.trim().to_string();
    }
}

pub async fn cadastrar_usuario(
    conn: &mut AsyncPgConnection,
    usuario: &Usuario,
) -> Result<(), String> {
    use crate::schema::usuarios::dsl::*;

    match diesel::insert_into(usuarios)
        .values(usuario)
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(Error::DatabaseError(DatabaseErrorKind::UniqueViolation, info)) => {
            if let Some(constraint_name) = info.constraint_name() {
                if constraint_name == "usuarios_email_unique" {
                    return Err("Este e-mail já está cadastrado.".to_string());
                }
            }
            Err("Erro de duplicidade no banco de dados".to_string())
        }
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_usuario_por_email(
    conn: &mut AsyncPgConnection,
    param: &str,
) -> Result<Usuario, String> {
    use crate::schema::usuarios::dsl::*;

    match usuarios.filter(email.eq(param)).get_result(conn).await {
        Ok(usuario) => Ok(usuario),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_usuario_por_cpf(
    conn: &mut AsyncPgConnection,
    param: &str,
) -> Result<Usuario, String> {
    use crate::schema::usuarios::dsl::*;

    match usuarios.filter(cpf.eq(param)).get_result(conn).await {
        Ok(usuario) => Ok(usuario),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_usuario_por_id(
    conn: &mut AsyncPgConnection,
    param: &Uuid,
) -> Result<Usuario, String> {
    use crate::schema::usuarios::dsl::*;

    match usuarios.filter(id.eq(param)).get_result(conn).await {
        Ok(usuario) => Ok(usuario),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn buscar_usuario_por_id_publico(
    conn: &mut AsyncPgConnection,
    param: i32,
) -> Result<Usuario, String> {
    use crate::schema::usuarios::dsl::*;

    match usuarios.filter(id_publico.eq(param)).get_result(conn).await {
        Ok(usuario) => Ok(usuario),
        Err(e) => Err(e.to_string()),
    }
}

pub async fn atualizar_usuario(
    conn: &mut AsyncPgConnection,
    id_param: &Uuid,
    data: &AtualizarUsuario,
) -> Result<(), ApiError> {
    use crate::schema::usuarios::dsl::*;

    match diesel::update(usuarios)
        .filter(id.eq(id_param))
        .set((
            nome.eq(&data.nome),
            email.eq(&data.email),
            cpf.eq(&data.cpf),
        ))
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(ApiError::Database(e.to_string())),
    }
}

use crate::controllers::utils::validar_cpf;
use crate::controllers::validadores::{Sanitize, Texto};
use crate::{
    controllers::utils::{password_hash, random_public_id},
    schema::usuarios,
};
use chrono::NaiveDateTime;
use diesel::{
    ExpressionMethods, QueryDsl,
    prelude::{AsChangeset, Insertable, Queryable, QueryableByName},
    result::{DatabaseErrorKind, Error},
};
use diesel_async::{AsyncPgConnection, RunQueryDsl};
use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

#[derive(DbEnum, Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
#[ExistingTypePath = "crate::schema::sql_types::TipoUsuario"]
pub enum TipoUsuario {
    Admin,
    Usuario,
}

#[derive(
    Queryable, Insertable, AsChangeset, Serialize, Deserialize, Debug, Clone, QueryableByName,
)]
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
    pub nome: Texto,
    #[validate(email(message = "E-mail inválido"))]
    pub email: Texto,
    #[validate(length(min = 11, max = 14), custom(function = "validar_cpf"))]
    pub cpf: Texto,
    #[validate(length(min = 6, message = "Senha muito curta"))]
    pub senha: String,
    pub tipo_login: String,
}

impl Sanitize for CadastrarUsuario {
    fn sanitize(&mut self) {
        self.email = Texto(self.email.trim().to_lowercase());
    }
}

#[derive(Serialize, Deserialize, Validate, ToSchema)]
pub struct AtualizarUsuarioDto {
    #[validate(length(min = 1, message = "O nome não pode ser vazio"))]
    pub nome: Texto,
    #[validate(email(message = "E-mail inválido"))]
    pub email: Texto,
    #[validate(length(min = 11, max = 14), custom(function = "validar_cpf"))]
    pub cpf: Texto,
}

impl Sanitize for AtualizarUsuarioDto {
    fn sanitize(&mut self) {
        self.email = Texto(self.email.trim().to_lowercase());
    }
}

pub struct AtualizarUsuario {
    pub id_usuario: Uuid,
    pub nome: String,
    pub email: String,
    pub cpf: String,
}

impl AtualizarUsuario {
    pub fn new(id_usuario: Uuid, dados: AtualizarUsuarioDto) -> Self {
        Self {
            id_usuario,
            nome: dados.nome.into(),
            email: dados.email.into(),
            cpf: dados.cpf.into(),
        }
    }
}

impl From<CadastrarUsuario> for Usuario {
    fn from(input: CadastrarUsuario) -> Self {
        Self {
            id: Uuid::new_v4(),
            id_publico: random_public_id(),
            nome: input.nome.into(),
            email: input.email.into(),
            cpf: input.cpf.into(),
            senha: password_hash(&input.senha),
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
    pub email: Texto,
    pub senha: Texto,
}

impl Sanitize for LoginUsuario {
    fn sanitize(&mut self) {
        self.email = Texto(self.email.trim().to_lowercase());
        self.senha = Texto(self.senha.trim().to_string());
    }
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct RetornoLogin {
    pub token: String,
    pub nome: String,
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
    usuario: &AtualizarUsuario,
) -> Result<(), String> {
    use crate::schema::usuarios::dsl::*;

    let usuario_com_email: Usuario = match usuarios
        .filter(email.eq(&usuario.email))
        .get_result(conn)
        .await
    {
        Ok(usuario) => usuario,
        Err(e) => return Err(e.to_string()),
    };

    if usuario_com_email.id != usuario.id_usuario.to_owned() {
        return Err("Esse e-mail já pertence a outro usuário".to_string());
    }

    let usuario_com_cpf: Usuario =
        match usuarios.filter(cpf.eq(&usuario.cpf)).get_result(conn).await {
            Ok(usuario) => usuario,
            Err(e) => return Err(e.to_string()),
        };

    if usuario_com_cpf.id != usuario.id_usuario.to_owned() {
        return Err("Esse CPF já pertence a outro usuário".to_string());
    }

    match diesel::update(usuarios)
        .filter(id.eq(usuario.id_usuario))
        .set((
            nome.eq(&usuario.nome),
            cpf.eq(&usuario.cpf),
            email.eq(&usuario.email),
            data_atualizacao.eq(chrono::Utc::now().naive_utc()),
        ))
        .execute(conn)
        .await
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
